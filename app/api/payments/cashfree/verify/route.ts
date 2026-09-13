import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ orderId, userId: session.userId });
    if (!order) {
      return NextResponse.json({ error: "Order record not found." }, { status: 404 });
    }

    // If already marked paid, return current user tokens
    if (order.status === "paid") {
      const user = await User.findById(session.userId);
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        tokens: user?.tokens || 0,
      });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || "TEST";

    if (!appId || !secretKey) {
      return NextResponse.json({ error: "Server Cashfree credentials missing." }, { status: 500 });
    }

    const baseUrl = env === "PROD"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cfRes = await fetch(baseUrl, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
      cache: "no-store",
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error("Cashfree Order Verification Error:", cfData);
      return NextResponse.json(
        { error: cfData.message || "Failed to fetch order status from Cashfree." },
        { status: 500 }
      );
    }

    // Check if Cashfree status is PAID
    if (cfData.order_status === "PAID") {
      // Atomically update order status to avoid double processing
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId, status: { $ne: "paid" } },
        {
          $set: {
            status: "paid",
            paymentId: cfData.cf_order_id ? String(cfData.cf_order_id) : order.paymentId,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (updatedOrder) {
        // Atomically increment user's token balance in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
          session.userId,
          { $inc: { tokens: order.tokens } },
          { new: true }
        );

        return NextResponse.json({
          success: true,
          status: "PAID",
          tokensAdded: order.tokens,
          newTokens: updatedUser?.tokens || 0,
        });
      }
    }

    return NextResponse.json({
      success: false,
      status: cfData.order_status || "PENDING",
      message: "Payment is pending or was not completed.",
    });
  } catch (err: any) {
    console.error("Cashfree Verify Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
