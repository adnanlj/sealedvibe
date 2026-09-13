import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { isAdminEmail } from '@/lib/admin';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ loggedIn: false, user: null });
    }

    await connectDB();
    const user = await User.findById(session.userId).select('-password');

    if (!user) {
      return NextResponse.json({ loggedIn: false, user: null });
    }

    const isAdmin = isAdminEmail(user.email) || user.role === 'admin';

    // If user is designated admin via ENV, ensure role in DB is synced
    if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        tokens: typeof user.tokens === 'number' ? user.tokens : 0,
        role: user.role || 'user',
        isAdmin,
      },
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json({ loggedIn: false, user: null });
  }
}
