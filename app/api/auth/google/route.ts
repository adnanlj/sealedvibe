import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Google Sign-In is not configured. Please add GOOGLE_CLIENT_ID to .env.local or sign in with Email & Password below.')}`);
  }

  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}
