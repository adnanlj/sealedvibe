import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import PromoCode from '@/models/PromoCode';
import { isAdminEmail } from '@/lib/admin';

// Helper to verify admin
async function verifyAdmin() {
  const session: any = await getSession();
  if (!session || !session.userId) return null;

  await connectDB();
  const user = await User.findById(session.userId);
  if (!user || (!isAdminEmail(user.email) && user.role !== 'admin')) return null;
  return user;
}

// GET: List all promo codes
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Access Denied: Admin Only.' }, { status: 403 });
    }

    const promoCodes = await PromoCode.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, promoCodes });
  } catch (error: any) {
    console.error('Admin promo GET error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST: Create a new promo code
export async function POST(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Access Denied: Admin Only.' }, { status: 403 });
    }

    const { code, tokensGranted, maxUses, expiresAt } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Promo code string is required.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (cleanCode.length < 3) {
      return NextResponse.json({ error: 'Promo code must be at least 3 characters.' }, { status: 400 });
    }

    const existing = await PromoCode.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json({ error: `Promo code "${cleanCode}" already exists.` }, { status: 400 });
    }

    const newPromo = new PromoCode({
      code: cleanCode,
      tokensGranted: Math.max(1, Number(tokensGranted) || 1),
      maxUses: Math.max(0, Number(maxUses) || 0),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdBy: admin.email,
    });

    await newPromo.save();

    return NextResponse.json({
      success: true,
      message: `Promo code ${cleanCode} created successfully!`,
      promoCode: newPromo,
    });
  } catch (error: any) {
    console.error('Admin promo POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create promo code.' }, { status: 500 });
  }
}

// DELETE: Delete / deactivate a promo code
export async function DELETE(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Access Denied: Admin Only.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const codeId = searchParams.get('id');

    if (!codeId) {
      return NextResponse.json({ error: 'Promo Code ID is required.' }, { status: 400 });
    }

    await PromoCode.findByIdAndDelete(codeId);
    return NextResponse.json({ success: true, message: 'Promo code deleted successfully.' });
  } catch (error: any) {
    console.error('Admin promo DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete promo code.' }, { status: 500 });
  }
}
