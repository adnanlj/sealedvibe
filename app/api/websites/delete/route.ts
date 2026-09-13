import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import Apology from '@/models/Apology';

export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await connectDB();
    const result = await Apology.findOneAndDelete({ slug, creatorId: session.userId });

    if (!result) {
      return NextResponse.json({ error: 'Website not found or not authorized to delete.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Website deleted successfully.' });
  } catch (error: any) {
    console.error('Website delete error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
