import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);

    // RSVP Spam Protection: max 10 submissions per 60 seconds per IP
    const rsvpRateLimit = await checkRateLimit({
      keyPrefix: 'rl_rsvp',
      identifier: clientIp,
      limit: 10,
      windowSeconds: 60,
    });

    if (!rsvpRateLimit.allowed) {
      return createRateLimitResponse(
        rsvpRateLimit.retryAfterSeconds,
        'Too many RSVP submissions. Please wait a moment before trying again.'
      );
    }

    const { slug, name, attendance, headcount, message, djSong } = await req.json();

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug and guest name are required." }, { status: 400 });
    }

    await dbConnect();

    const apology = await Apology.findOne({ slug });
    if (!apology) {
      return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    }

    const isBirthdayParty = apology.websiteType === "birthday_party" || apology.occasion === "birthday_party";

    let cleanMessage = message ? message.trim() : undefined;
    if (cleanMessage) {
      const words = cleanMessage.split(/\s+/).filter(Boolean);
      if (words.length > 100) {
        cleanMessage = words.slice(0, 100).join(" ");
      }
    }

    const newRsvp = {
      name: name.trim(),
      attendance: attendance === "declined" ? "declined" : "attending",
      headcount: Math.max(1, Number(headcount) || 1),
      djSong: djSong ? djSong.trim() : undefined,
      message: cleanMessage,
      submittedAt: new Date(),
    };

    let totalAttending = 0;

    if (isBirthdayParty) {
      if (!apology.birthdayPartyData) {
        apology.birthdayPartyData = {} as any;
      }
      if (!Array.isArray(apology.birthdayPartyData?.guestRsvps)) {
        if (apology.birthdayPartyData) apology.birthdayPartyData.guestRsvps = [];
      }
      apology.birthdayPartyData?.guestRsvps?.push(newRsvp);
      apology.markModified("birthdayPartyData");
      await apology.save();

      totalAttending = (apology.birthdayPartyData?.guestRsvps || [])
        .filter((r: any) => r.attendance === "attending")
        .reduce((sum: number, r: any) => sum + (r.headcount || 1), 0);
    } else {
      if (!apology.weddingData) {
        apology.weddingData = {};
      }
      if (!Array.isArray(apology.weddingData.guestRsvps)) {
        apology.weddingData.guestRsvps = [];
      }
      apology.weddingData.guestRsvps.push(newRsvp);
      apology.markModified("weddingData");
      await apology.save();

      totalAttending = (apology.weddingData.guestRsvps || [])
        .filter((r: any) => r.attendance === "attending")
        .reduce((sum: number, r: any) => sum + (r.headcount || 1), 0);
    }

    return NextResponse.json({
      success: true,
      message: "RSVP recorded with joy!",
      totalAttending,
      rsvp: newRsvp,
    });
  } catch (err: any) {
    console.error("Wedding RSVP Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to record RSVP." },
      { status: 500 }
    );
  }
}
