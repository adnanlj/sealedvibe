import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createSessionCookie } from '@/lib/session';
import { sendEmail, generateWelcomeEmail } from '@/lib/email';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const origin = new URL(req.url).origin;

    if (error || !code) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error || 'Google authorization was cancelled.')}`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${origin}/login?error=Google+OAuth+credentials+are+missing`);
    }

    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Failed to exchange authorization code.');
    }

    // Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const profile = await userRes.json();
    if (!profile.email) {
      throw new Error('Google profile did not provide an email address.');
    }

    await dbConnect();
    const normalizedEmail = profile.email.toLowerCase().trim();

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name: profile.name || profile.given_name || 'Creator',
        email: normalizedEmail,
        googleId: profile.id,
        avatar: profile.picture,
        tokens: 0, // Starts with 0 tokens - purchase packs starting at ₹19
        role: 'user',
      });

      // Dispatch luxury welcome email for new Google user asynchronously
      const welcome = generateWelcomeEmail(user.name);
      sendEmail({
        to: user.email,
        subject: welcome.subject,
        html: welcome.html,
      }).catch((err) => console.warn('Welcome email dispatch failed:', err));
    } else {
      let shouldSave = false;
      if (!user.googleId) {
        user.googleId = profile.id;
        shouldSave = true;
      }
      if (!user.avatar && profile.picture) {
        user.avatar = profile.picture;
        shouldSave = true;
      }
      if (shouldSave) await user.save();
    }

    // Create session cookie
    await createSessionCookie(user._id.toString(), user.name, user.email);

    return NextResponse.redirect(`${origin}/`);
  } catch (err: any) {
    console.error('Google OAuth Callback Error:', err);
    const origin = new URL(req.url).origin;
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || 'Google authentication failed.')}`);
  }
}
