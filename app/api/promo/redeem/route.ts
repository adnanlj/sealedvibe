import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PromoCode from '@/models/PromoCode';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Please log in to redeem promo codes.' }, { status: 401 });
    }

    // Rate limit promo attempts: max 5 per 60 seconds per user / IP
    const promoRateLimit = await checkRateLimit({
      keyPrefix: 'rl_promo',
      identifier: `${session.userId}:${clientIp}`,
      limit: 5,
      windowSeconds: 60,
    });

    if (!promoRateLimit.allowed) {
      return createRateLimitResponse(promoRateLimit.retryAfterSeconds, 'Too many promo redemption attempts. Please wait a moment before trying again.');
    }

    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Promo code is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    await connectDB();

    // 1. Find and validate promo code
    const promo = await PromoCode.findOne({ code: cleanCode, isActive: true });
    if (!promo) {
      return NextResponse.json({ error: 'Invalid or inactive promo code.' }, { status: 400 });
    }

    // Check expiration if set
    if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
      return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 });
    }

    // Check max usage limits
    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: 'This promo code has reached its maximum usage limit.' }, { status: 400 });
    }

    const tokensToAdd = promo.tokensGranted || 1;

    // 2. Atomically check and update user: only succeeds if cleanCode is NOT in redeemedCodes
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: session.userId,
        redeemedCodes: { $ne: cleanCode }
      },
      {
        $inc: { tokens: tokensToAdd },
        $push: { redeemedCodes: cleanCode }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'You have already redeemed this promo code or user not found.' }, { status: 400 });
    }

    // 3. Atomically update promo code usage count and audit log
    await PromoCode.findByIdAndUpdate(promo._id, {
      $inc: { usedCount: 1 },
      $push: {
        usedBy: {
          userId: updatedUser._id as any,
          email: updatedUser.email,
          redeemedAt: new Date(),
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `🎉 Success! Granted +${tokensToAdd} token${tokensToAdd > 1 ? 's' : ''} to your account.`,
      tokens: updatedUser.tokens,
      tokensGranted: tokensToAdd,
    });
  } catch (error: any) {
    console.error('Promo redeem error:', error);
    return NextResponse.json({ error: error.message || 'Failed to redeem promo code.' }, { status: 500 });
  }
}
