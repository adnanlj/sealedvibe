import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // IP-level rate limit: max 5 requests per 300 seconds (5 min)
    const ipRateLimit = await checkRateLimit({
      keyPrefix: 'rl_forgot_ip',
      identifier: clientIp,
      limit: 5,
      windowSeconds: 300,
    });

    if (!ipRateLimit.allowed) {
      return createRateLimitResponse(ipRateLimit.retryAfterSeconds, 'Too many password reset requests. Please wait a few minutes before trying again.');
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Account-level rate limit: max 3 requests per 300 seconds per email
    const emailRateLimit = await checkRateLimit({
      keyPrefix: 'rl_forgot_email',
      identifier: normalizedEmail,
      limit: 3,
      windowSeconds: 300,
    });

    if (!emailRateLimit.allowed) {
      return createRateLimitResponse(emailRateLimit.retryAfterSeconds, 'Too many password reset requests for this email. Please wait a few minutes before trying again.');
    }

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Return success even if not found to prevent user enumeration attacks
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    const origin = new URL(req.url).origin;
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    const emailContent = generatePasswordResetEmail(resetUrl, user.name);
    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
