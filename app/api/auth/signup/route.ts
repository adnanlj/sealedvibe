import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createSessionCookie } from '@/lib/session';
import { getClientIp, checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';
import { sendEmail, generateWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // IP-level registration spam rate limit: max 10 registrations per hour per IP
    const signupRateLimit = await checkRateLimit({
      keyPrefix: 'rl_signup_ip',
      identifier: clientIp,
      limit: 10,
      windowSeconds: 3600,
    });

    if (!signupRateLimit.allowed) {
      return createRateLimitResponse(
        signupRateLimit.retryAfterSeconds,
        'Too many accounts created from this network. Please try again later.'
      );
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 150) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be between 6 and 128 characters.' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      tokens: 0, // Starts with 0 tokens - purchase packs starting at ₹19
      role: 'user',
    });

    await createSessionCookie(newUser._id.toString(), newUser.name, newUser.email);

    // Dispatch luxury welcome email asynchronously (non-blocking)
    const welcome = generateWelcomeEmail(newUser.name);
    sendEmail({
      to: newUser.email,
      subject: welcome.subject,
      html: welcome.html,
    }).catch((err) => console.warn('Welcome email dispatch failed:', err));

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        tokens: newUser.tokens,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
