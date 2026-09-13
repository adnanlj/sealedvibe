import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import PricingConfig from '@/models/PricingConfig';

export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Please log in to purchase tokens.', needAuth: true }, { status: 401 });
    }

    const { packId } = await req.json();
    if (!packId) {
      return NextResponse.json({ error: 'Pack ID is required.' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'your_razorpay_key_id') {
      return NextResponse.json(
        {
          error: 'Razorpay keys are not configured yet in .env.local. You can test in Razorpay test mode by setting RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
          notConfigured: true,
        },
        { status: 503 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Fetch live updated pack pricing directly from MongoDB
    let selectedPack: any = await PricingConfig.findOne({ packId }).lean();

    if (!selectedPack) {
      const defaultPacks = [
        { packId: 'single', name: 'Single Website', tokens: 1, priceInr: 149, priceUsd: 1.99 },
        { packId: 'starter', name: '✨ Starter Pack', tokens: 3, priceInr: 399, priceUsd: 4.99 },
        { packId: 'creator', name: '👑 Royal Creator', tokens: 10, priceInr: 999, priceUsd: 12.99 },
      ];
      selectedPack = defaultPacks.find((p) => p.packId === packId);
    }

    if (!selectedPack) {
      return NextResponse.json({ error: 'Invalid token pack selected.' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `rcpt_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6)}`;
    const amountInPaise = Math.round(selectedPack.priceInr * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        userId: user._id.toString(),
        userEmail: user.email,
        packId: selectedPack.packId,
        tokens: String(selectedPack.tokens),
      },
    });

    // Persist pending order in MongoDB
    await Order.create({
      userId: user._id,
      orderId: razorpayOrder.id,
      packId: selectedPack.packId,
      tokens: selectedPack.tokens,
      amount: selectedPack.priceInr,
      currency: 'INR',
      status: 'created',
      receipt,
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId,
      pack: {
        name: selectedPack.name,
        tokens: selectedPack.tokens,
        priceInr: selectedPack.priceInr,
      },
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create payment order.' }, { status: 500 });
  }
}
