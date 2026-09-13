import { NextResponse } from 'next/server';

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isConfigured = Boolean(keyId && keySecret && keyId !== 'your_razorpay_key_id');

  return NextResponse.json({
    success: true,
    configured: isConfigured,
    keyId: isConfigured ? keyId : null,
  });
}
