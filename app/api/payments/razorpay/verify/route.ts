import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Please log in to verify payment.', needAuth: true }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification details are incomplete.' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Server payment key secret missing.' }, { status: 500 });
    }

    // Verify cryptographic HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment signature verification failed. Untrusted request.' }, { status: 400 });
    }

    await connectDB();

    // Verify order exists and belongs to authenticated user
    const existingOrder = await Order.findOne({ orderId: razorpay_order_id });
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found in database.' }, { status: 404 });
    }

    if (existingOrder.userId.toString() !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized: Order belongs to another account.' }, { status: 403 });
    }

    // Atomically transition order status from 'created' to 'paid' to prevent double-crediting
    const order = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id, status: { $ne: 'paid' } },
      { $set: { status: 'paid', paymentId: razorpay_payment_id, signature: razorpay_signature } },
      { new: true }
    );

    if (!order) {
      // Order was already marked as paid in a previous request - return current tokens safely
      const user = await User.findById(existingOrder.userId);
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        tokens: user?.tokens ?? 0,
      });
    }

    // Atomically credit tokens to user's wallet
    const updatedUser = await User.findByIdAndUpdate(
      order.userId,
      { $inc: { tokens: order.tokens } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `🎉 Payment successful! Added +${order.tokens} token${order.tokens > 1 ? 's' : ''} to your account.`,
      tokens: updatedUser.tokens,
      tokensGranted: order.tokens,
      orderId: order.orderId,
      paymentId: order.paymentId,
    });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed.' }, { status: 500 });
  }
}
