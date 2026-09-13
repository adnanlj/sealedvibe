import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");
    const origin = new URL(req.url).origin;

    if (!orderId) {
      return NextResponse.redirect(`${origin}/dashboard?payment=error&message=Missing+order+ID`);
    }

    await connectDB();
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.redirect(`${origin}/dashboard?payment=error&message=Order+not+found`);
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || "TEST";

    if (appId && secretKey) {
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

      if (cfData.order_status === "PAID") {
        // Atomically update order status
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
          await User.findByIdAndUpdate(order.userId, { $inc: { tokens: order.tokens } });
        }

        return NextResponse.redirect(`${origin}/dashboard?payment=success&tokens=${order.tokens}`);
      }
    }

    return NextResponse.redirect(`${origin}/dashboard?payment=cancelled`);
  } catch (err: any) {
    console.error("Cashfree Callback Error:", err);
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/dashboard?payment=error`);
  }
}
