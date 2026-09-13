import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // Track Visit Rate Limit: max 30 calls per 60 seconds per IP
    const trackRateLimit = await checkRateLimit({
      keyPrefix: 'rl_track',
      identifier: clientIp,
      limit: 30,
      windowSeconds: 60,
    });

    if (!trackRateLimit.allowed) {
      return createRateLimitResponse(
        trackRateLimit.retryAfterSeconds,
        'Tracking limit reached.'
      );
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    await dbConnect();
    const apology = await Apology.findOne({ slug });

    if (!apology) {
      return NextResponse.json({ error: "Apology not found." }, { status: 404 });
    }

    // Only set openedAt on the first visit to preserve the original open timestamp
    if (!apology.openedAt) {
      apology.openedAt = new Date();
      await apology.save();
    }

    return NextResponse.json({ success: true, openedAt: apology.openedAt });
  } catch (err: any) {
    console.error("API Track Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to log visit tracking." },
      { status: 500 }
    );
  }
}
