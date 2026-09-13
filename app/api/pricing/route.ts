import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import PricingConfig from '@/models/PricingConfig';
import User from '@/models/User';
import { isAdminEmail } from '@/lib/admin';

const DEFAULT_PACKS = [
  {
    packId: 'single',
    name: 'Single Website',
    tokens: 1,
    priceInr: 19,
    originalPriceInr: 49,
    priceUsd: 0,
    tagline: '1 Full Lifetime Website',
    isPopular: false,
  },
  {
    packId: 'starter',
    name: '✨ Starter Pack',
    tokens: 3,
    priceInr: 49,
    originalPriceInr: 99,
    priceUsd: 0,
    tagline: 'Save 50% • ₹16.3 / site',
    isPopular: true,
  },
  {
    packId: 'creator',
    name: '👑 Royal Creator',
    tokens: 10,
    priceInr: 149,
    originalPriceInr: 299,
    priceUsd: 0,
    tagline: 'Best Value • ₹14.9 / site',
    isPopular: false,
  },
];

// GET: Return live pricing packs
export async function GET() {
  try {
    await connectDB();
    let packs = await PricingConfig.find().sort({ tokens: 1 }).lean();

    // If no packs in DB yet, initialize with defaults
    if (!packs || packs.length === 0) {
      await PricingConfig.insertMany(DEFAULT_PACKS);
      packs = await PricingConfig.find().sort({ tokens: 1 }).lean();
    }

    return NextResponse.json({ success: true, packs });
  } catch (error: any) {
    console.error('Pricing GET error:', error);
    return NextResponse.json({ success: true, packs: DEFAULT_PACKS });
  }
}

// POST: Admin updates pack prices
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

    const { packId, priceInr, originalPriceInr, priceUsd, tagline } = await req.json();

    if (!packId) {
      return NextResponse.json({ error: 'packId is required.' }, { status: 400 });
    }

    const updated = await PricingConfig.findOneAndUpdate(
      { packId },
      {
        $set: {
          priceInr: Number(priceInr),
          originalPriceInr: originalPriceInr !== undefined ? Number(originalPriceInr) : 0,
          priceUsd: priceUsd !== undefined ? Number(priceUsd) : 0,
          ...(tagline !== undefined ? { tagline } : {}),
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: `Updated pricing for pack "${packId}" to ₹${priceInr}${originalPriceInr ? ` (Original: ₹${originalPriceInr})` : ''}`,
      pack: updated,
    });
  } catch (error: any) {
    console.error('Pricing POST error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
