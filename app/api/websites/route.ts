import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Apology from '@/models/Apology';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const websites = await Apology.find({ creatorId: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, websites });
  } catch (error: any) {
    console.error('Websites fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
