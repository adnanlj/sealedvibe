import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";
import { getClientIp, checkRateLimit, clearRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const { slug, passcode } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // 1. IP-level 4-digit PIN brute-force limiter: Max 5 attempts per 300s (5 min) per slug + IP
    const pinRateLimit = await checkRateLimit({
      keyPrefix: 'rl_pin_ip',
      identifier: `${cleanSlug}:${clientIp}`,
      limit: 5,
      windowSeconds: 300,
    });

    if (!pinRateLimit.allowed) {
      return createRateLimitResponse(
        pinRateLimit.retryAfterSeconds,
        `Too many incorrect attempts. For security, please wait ${pinRateLimit.retryAfterSeconds} seconds before trying again.`
      );
    }

    // 2. Global Distributed PIN Protection: Max 20 total attempts per 900s (15 min) across ALL IPs for this slug
    const globalSlugLimit = await checkRateLimit({
      keyPrefix: 'rl_pin_global',
      identifier: cleanSlug,
      limit: 20,
      windowSeconds: 900,
    });

    if (!globalSlugLimit.allowed) {
      return createRateLimitResponse(
        globalSlugLimit.retryAfterSeconds,
        `This private link has received too many failed unlock attempts. Please wait ${globalSlugLimit.retryAfterSeconds} seconds before trying again.`
      );
    }

    await dbConnect();
    const apology = await Apology.findOne({ slug: cleanSlug }).lean();

    if (!apology) {
      return NextResponse.json({ error: "Apology not found." }, { status: 404 });
    }

    // Verify passcode (case-insensitive check or direct match after trim)
    const expected = (apology.passcode || "").trim().toLowerCase();
    const actual = (passcode || "").trim().toLowerCase();

    if (expected !== actual) {
      return NextResponse.json({ error: "Incorrect passcode. Please try again." }, { status: 401 });
    }

    // Passcode verified successfully: Reset the IP-level failure counter
    await clearRateLimit('rl_pin_ip', `${cleanSlug}:${clientIp}`);

    // Serialize full dataset securely since authentication succeeded
    const serializedData = {
      slug: apology.slug,
      creatorName: apology.creatorName,
      recipientName: apology.recipientName,
      relationshipType: apology.relationshipType,
      occasion: apology.occasion || "apology",
      vibeTheme: apology.vibeTheme || "dreamy",
      endingSurprise: apology.endingSurprise || {
        surpriseType: "scratch",
        surpriseData: { message: "I cherish our connection." },
      },
      favorites: {
        colorPalette: apology.favorites?.colorPalette || ["#a855f7", "#ec4899", "#3b82f6"],
        moviesAndSeries: apology.favorites?.moviesAndSeries || [],
        insideJokes: apology.favorites?.insideJokes || [],
      },
      aiGeneratedData: {
        headline: apology.aiGeneratedData.headline,
        apologyNarrative: apology.aiGeneratedData.apologyNarrative,
        popCultureReferences: apology.aiGeneratedData.popCultureReferences || [],
        themePreset: apology.aiGeneratedData.themePreset || "cosmic_hearts",
        characterAttributes: apology.aiGeneratedData.characterAttributes?.knownFor
          ? apology.aiGeneratedData.characterAttributes
          : {
              knownFor: "A warm and radiant presence in life.",
              acclaimedFor: "Their kindness, empathy, and quiet jokes.",
              rememberedFor: "Always bringing light to those around them.",
            },
        memoriesList: apology.aiGeneratedData.memoriesList && apology.aiGeneratedData.memoriesList.length > 0
          ? apology.aiGeneratedData.memoriesList
          : apology.favorites?.insideJokes && apology.favorites.insideJokes.length > 0
          ? apology.favorites.insideJokes
          : ["A shared smile that brightened the day.", "Quiet support when it mattered most.", "An inside joke that still brings laughter."],
        credits: {
          writer: apology.aiGeneratedData.credits?.writer || apology.creatorName,
          cast: apology.aiGeneratedData.credits?.cast || [apology.creatorName, apology.recipientName],
        },
      },
      status: apology.status,
      complimentStars: apology.complimentStars
        ? {
            enabled: apology.complimentStars.enabled,
            list: apology.complimentStars.list.map((item: any) => ({
              title: item.title,
              text: item.text,
            })),
          }
        : { enabled: false, list: [] },
      dateInvitation: apology.dateInvitation
        ? {
            enabled: apology.dateInvitation.enabled,
            dateType: apology.dateInvitation.dateType,
            dateName: apology.dateInvitation.dateName,
            dateDate: apology.dateInvitation.dateDate,
            nickname: apology.dateInvitation.nickname,
            letterText: apology.dateInvitation.letterText,
            response: apology.dateInvitation.response || "pending",
          }
        : { enabled: false },
      backgroundType: apology.backgroundType || "particles",
      customBackgroundUrl: apology.customBackgroundUrl || "",
    };

    return NextResponse.json({ success: true, data: serializedData });
  } catch (err: any) {
    console.error("API Verify Passcode Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to verify passcode." },
      { status: 500 }
    );
  }
}
