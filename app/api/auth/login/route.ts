import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createSessionCookie } from '@/lib/session';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // IP-level brute-force rate limit: max 5 login attempts per 60 seconds
    const ipRateLimit = await checkRateLimit({
      keyPrefix: 'rl_login_ip',
      identifier: clientIp,
      limit: 5,
      windowSeconds: 60,
    });

    if (!ipRateLimit.allowed) {
      return createRateLimitResponse(ipRateLimit.retryAfterSeconds, 'Too many login attempts. Please wait a moment before trying again.');
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail.length > 150 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid credentials format.' }, { status: 400 });
    }

    // Account-level brute-force rate limit: max 5 login attempts per 60 seconds per email
    const emailRateLimit = await checkRateLimit({
      keyPrefix: 'rl_login_email',
      identifier: normalizedEmail,
      limit: 5,
      windowSeconds: 60,
    });

    if (!emailRateLimit.allowed) {
      return createRateLimitResponse(emailRateLimit.retryAfterSeconds, 'Too many login attempts for this account. Please wait a moment before trying again.');
    }

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await createSessionCookie(user._id.toString(), user.name, user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
