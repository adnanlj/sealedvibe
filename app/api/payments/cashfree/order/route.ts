import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import PricingConfig from "@/models/PricingConfig";
import User from "@/models/User";

const DEFAULT_PACKS: Record<string, { name: string; tokens: number; priceInr: number }> = {
  single: { name: "Single Website", tokens: 1, priceInr: 19 },
  starter: { name: "Starter Pack", tokens: 3, priceInr: 49 },
  creator: { name: "Royal Creator", tokens: 10, priceInr: 149 },
};

export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Please log in to purchase tokens." }, { status: 401 });
    }

    const { packId } = await req.json();
    if (!packId) {
      return NextResponse.json({ error: "Pack ID is required." }, { status: 400 });
    }

    await connectDB();

    // Fetch live pack configuration from database
    let pack = DEFAULT_PACKS[packId];
    const customPricing: any = await PricingConfig.findOne({ packId }).lean();
    if (customPricing) {
      pack = {
        name: customPricing.name,
        tokens: customPricing.tokens,
        priceInr: customPricing.priceInr,
      };
    }

    if (!pack) {
      return NextResponse.json({ error: "Invalid token pack selected." }, { status: 400 });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || "TEST";

    if (!appId || !secretKey) {
      return NextResponse.json(
        { error: "Cashfree credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const baseUrl = env === "PROD" 
      ? "https://api.cashfree.com/pg/orders" 
      : "https://sandbox.cashfree.com/pg/orders";

    const customOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://sealedvibe.vercel.app"}/api/payments/cashfree/callback?order_id={order_id}`;

    // Clean phone number (Cashfree requires a 10-digit number)
    const customerPhone = "9999999999";

    const cashfreePayload = {
      order_id: customOrderId,
      order_amount: pack.priceInr,
      order_currency: "INR",
      customer_details: {
        customer_id: session.userId.toString(),
        customer_name: user.name || "Customer",
        customer_email: user.email,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl,
        payment_methods: "upi,cc,dc,nb,app",
      },
      order_note: `Purchase of ${pack.tokens} token(s) on SealedVibe`,
    };

    const cfRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cashfreePayload),
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok || !cfData.payment_session_id) {
      console.error("Cashfree Order Creation Failed:", cfData);
      return NextResponse.json(
        { error: cfData.message || "Failed to create payment session with Cashfree." },
        { status: 500 }
      );
    }

    // Save order in MongoDB
    await Order.create({
      userId: user._id,
      orderId: customOrderId,
      paymentId: cfData.cf_order_id ? String(cfData.cf_order_id) : null,
      packId,
      tokens: pack.tokens,
      amount: pack.priceInr,
      currency: "INR",
      status: "created",
      receipt: `rcpt_cf_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: customOrderId,
      paymentSessionId: cfData.payment_session_id,
      amount: pack.priceInr,
      tokens: pack.tokens,
      environment: env,
    });
  } catch (err: any) {
    console.error("Cashfree Order Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
