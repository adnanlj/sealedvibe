import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Apology from '@/models/Apology';
import PromoCode from '@/models/PromoCode';
import { isAdminEmail } from '@/lib/admin';

export async function GET() {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user || (!isAdminEmail(user.email) && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Access Denied: Admin Privileges Required.' }, { status: 403 });
    }

    const [totalUsers, totalWebsites, promoCodes, recentUsers, recentWebsites] = await Promise.all([
      User.countDocuments(),
      Apology.countDocuments(),
      PromoCode.find().sort({ createdAt: -1 }).lean(),
      User.find().select('name email tokens role createdAt').sort({ createdAt: -1 }).limit(25).lean(),
      Apology.find().select('slug creatorName recipientName occasion websiteType createdAt openedAt weddingData.guestRsvps').sort({ createdAt: -1 }).limit(20).lean(),
    ]);

    // Calculate total RSVPs across wedding websites
    let totalRsvps = 0;
    recentWebsites.forEach((w: any) => {
      if (w.weddingData?.guestRsvps && Array.isArray(w.weddingData.guestRsvps)) {
        totalRsvps += w.weddingData.guestRsvps.length;
      }
    });

    const activePromoCodesCount = promoCodes.filter(p => p.isActive).length;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalWebsites,
        totalRsvps,
        activePromoCodes: activePromoCodesCount,
      },
      promoCodes,
      recentUsers,
      recentWebsites,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch admin stats.' }, { status: 500 });
  }
}
