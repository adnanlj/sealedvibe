import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
