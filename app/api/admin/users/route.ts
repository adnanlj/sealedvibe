import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { isAdminEmail } from '@/lib/admin';

// GET: List all users
export async function GET() {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const admin = await User.findById(session.userId);
    if (!admin || (!isAdminEmail(admin.email) && admin.role !== 'admin')) {
      return NextResponse.json({ error: 'Access Denied: Admin Only.' }, { status: 403 });
    }

    const users = await User.find()
      .select('name email tokens role redeemedCodes createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST: Modify tokens for a user
export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const admin = await User.findById(session.userId);
    if (!admin || (!isAdminEmail(admin.email) && admin.role !== 'admin')) {
      return NextResponse.json({ error: 'Access Denied: Admin Only.' }, { status: 403 });
    }

    const { targetUserId, tokenChange, exactTokens } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target User ID is required.' }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (exactTokens !== undefined && exactTokens !== null) {
      targetUser.tokens = Math.max(0, Number(exactTokens));
    } else if (tokenChange !== undefined) {
      targetUser.tokens = Math.max(0, (targetUser.tokens ?? 1) + Number(tokenChange));
    }

    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: `Updated tokens for ${targetUser.email} to ${targetUser.tokens}`,
      user: {
        id: targetUser._id.toString(),
        email: targetUser.email,
        tokens: targetUser.tokens,
      },
    });
  } catch (error: any) {
    console.error('Admin users POST error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
