import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { callGroqWithFailover } from "@/lib/groqPool";
import { getClientIp, checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      occasion, // apology, birthday, appreciation
      creatorName,
      recipientName,
      relationshipType,
      obsessions,
      favoriteColors,
      personality,
      moment1,
      moment2,
      moment3,
      firstMemory,
      smallNotices,
      reason,
      unspokenTruth,
      vibeTheme, // dreamy, cinematic, minimal, playful
      surpriseType, // scratch, polaroid, heartbeat, combo
      surpriseText,
      polaroidCaption,
      polaroidImageQuery,
      complimentsEnabled,
      compliment1_title,
      compliment1_text,
      compliment2_title,
      compliment2_text,
      compliment3_title,
      compliment3_text,
      compliment4_title,
      compliment4_text,
      compliment5_title,
      compliment5_text,
      dateInvitationEnabled,
      dateType,
      dateName,
      dateDate,
      dateNickname,
      dateBanter,
      passcode,
      polaroidImageUrl,
      backgroundType,
      customBackgroundUrl,
      youtubeUrl,
      songName,
      fontStyle,
      websiteType,
      weddingData,
      birthdayPartyData,
      proposalData,
    } = body;

    // Validation
    const isWedding = websiteType === "wedding" || occasion === "wedding";
    const isEngagement = websiteType === "engagement" || occasion === "engagement";
    const isBirthdayParty = websiteType === "birthday_party" || occasion === "birthday_party";
    const isProposal = websiteType === "proposal" || occasion === "proposal";
    const isCeremony = isWedding || isEngagement || isBirthdayParty || isProposal;

    if (!isCeremony) {
      if (!creatorName || !recipientName || !reason || !favoriteColors || !surpriseType) {
        return NextResponse.json(
          { error: "Missing required fields." },
          { status: 400 }
        );
      }
    } else if (isProposal) {
      if (!creatorName || (!recipientName && !proposalData?.partnerName)) {
        return NextResponse.json(
          { error: "Missing partner name for romantic proposal." },
          { status: 400 }
        );
      }
    } else if (isBirthdayParty) {
      if (!creatorName && !birthdayPartyData?.birthdayPersonName && !recipientName) {
        return NextResponse.json(
          { error: "Missing birthday star name for party invitation." },
          { status: 400 }
        );
      }
    } else {
      if (!creatorName && !weddingData?.coupleNames && !recipientName) {
        return NextResponse.json(
          { error: "Missing couple names for invitation." },
          { status: 400 }
        );
      }
    }

    // Verify authentication and token balance BEFORE any AI processing
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Please log in to generate your website.", needAuth: true },
        { status: 401 }
      );
    }

    const clientIp = getClientIp(req);

    // Generation Rate Limit: max 5 website generations per 60 seconds per user / IP
    const genRateLimit = await checkRateLimit({
      keyPrefix: 'rl_generate',
      identifier: `${session.userId}:${clientIp}`,
      limit: 5,
      windowSeconds: 60,
    });

    if (!genRateLimit.allowed) {
      return createRateLimitResponse(
        genRateLimit.retryAfterSeconds,
        `Generation rate limit reached. Please wait ${genRateLimit.retryAfterSeconds} seconds before generating another website.`
      );
    }

    await dbConnect();

    // Atomically pre-deduct 1 token to guarantee race-condition & double-spend immunity
    const userDoc: any = await User.findOneAndUpdate(
      { _id: session.userId, tokens: { $gte: 1 } },
      { $inc: { tokens: -1 } },
      { new: true }
    );

    if (!userDoc) {
      return NextResponse.json(
        { error: "You have 0 tokens. Please redeem a promo code or purchase a token pack to generate your website.", noTokens: true },
        { status: 403 }
      );
    }

    const insideMoments = [moment1, moment2, moment3].filter(Boolean);

    // Dynamic prompt guidelines based on occasion
    let narrativeGuidelines = "";
    if (occasion === "birthday") {
      narrativeGuidelines = `
        Draft a celebratory, warm 3-act birthday narrative for ${recipientName}:
        - Act I (The Celebration): Open with a beautiful birthday greeting, highlighting the joy of celebrating their life and connection with ${creatorName}.
        - Act II (The Memories): Weave in their obsessions (${obsessions}), your first memory of them (${firstMemory}), and quietly noticed details (${smallNotices}) as fun metaphors.
        - Act III (The Wish): Include the unspoken truth (${unspokenTruth}) and a promise of future adventures, toast, and warm wishes.
      `;
    } else if (occasion === "appreciation") {
      narrativeGuidelines = `
        Draft a deeply warm 3-act appreciation narrative thanking ${recipientName}:
        - Act I (The Gratitude): Express how thankful you are for having them in your life, acknowledging the context (${reason}).
        - Act II (The Connection): Weave in their obsessions (${obsessions}), your first memory of them (${firstMemory}), and quietly noticed details (${smallNotices}) as metaphors of support.
        - Act III (The Promise): A heartfelt pledge to always be there, sharing the unspoken truth (${unspokenTruth}).
      `;
    } else if (occasion === "anniversary") {
      narrativeGuidelines = `
        Draft a deeply romantic and celebratory 3-act anniversary narrative celebrating ${creatorName} and ${recipientName}:
        - Act I (The Journey): Open with a beautiful anniversary greeting celebrating the time you've spent together and acknowledging the milestone of your commitment.
        - Act II (The Chronicle): Weave in their obsessions (${obsessions}), your first memory of them (${firstMemory}), and quietly noticed quirks (${smallNotices}) as metaphors of shared growth.
        - Act III (The Future): Look forward to the years ahead, sharing the unspoken truth (${unspokenTruth}) and a promise of lifelong support, love, and partnership.
      `;
    } else {
      // apology
      narrativeGuidelines = `
        Draft a sincere, heartfelt 3-act apology narrative:
        - Act I (The Reflection): Acknowledge the conflict (${reason}), take full responsibility, and express genuine regret.
        - Act II (The Metaphor): Weave in their obsessions (${obsessions}), your first memory of them (${firstMemory}), and quietly noticed details (${smallNotices}) as meaningful metaphors of connection.
        - Act III (The Reconciliation): Share the unspoken truth (${unspokenTruth}) and a warm message of growth, promise to do better, and reconnection.
      `;
    }

    // System Prompt for structured JSON creation
    const prompt = `
      You are SealedVibe, an expert digital experience designer and relationship writer.
      Your task is to craft a highly personalized, creative, and cinematic page payload.
      
      User Inputs:
      - Occasion: ${occasion || "apology"}
      - Creator: ${creatorName}
      - Recipient: ${recipientName}
      - Relationship: ${relationshipType}
      - Details/Context: ${reason}
      - Recipient's Personality: ${personality}
      - Recipient's Favorites: Colors: ${favoriteColors}, Obsessions: ${obsessions}
      - First Memory: ${firstMemory}
      - Quietly Noticed Quirks: ${smallNotices}
      - Three Inside Moments: ${insideMoments.join(", ")}
      - Unspoken Truth: ${unspokenTruth}
      - Vibe Theme: ${vibeTheme}
      - Ending Surprise Selection Vibe: "${polaroidImageQuery || "scenery, aesthetic"}"
      
      Narrative Guidelines:
      ${narrativeGuidelines}

      Polaroid Backdrop Image:
      Select a real, stunning, high-quality, professional photography background image from Unsplash CDN that perfectly matches the Selection Vibe: "${polaroidImageQuery || "scenery, aesthetic"}".
      - You MUST output a valid URL starting with "https://images.unsplash.com/photo-".
      - The photo should be vertical/portrait-oriented if possible, scenic, and aesthetic (e.g. sunset, coffee cup, starry sky, forest, waves).
      - Do not use generic placeholders. Use real Unsplash photo URLs that are guaranteed to exist.
      
      Let's also generate a date letter:
      - Date Letter Prompt: Write a customized, cute, and heartfelt paragraph / letter asking the recipient on a date.
        Use these details: Nickname: "${dateNickname || recipientName}", Date Type: "${dateType || "dinner"}", Date Name: "${dateName || "a special dinner"}", Date Date: "${dateDate || "this weekend"}", and details/banter: "${dateBanter || "I would love to spend some quality time together."}".
        Combine these elements into a beautiful, flowing, and emotional invitation paragraph, with cute emojis matching the date vibe.
      
      Ensure all text descriptions are properly formatted. Do not include markdown wraps in your output.
    `;

    const systemPrompt = `
      You are SealedVibe, an expert digital experience designer and relationship writer.
      Your task is to craft a highly personalized, creative, and cinematic page payload.
      You MUST respond ONLY with a raw JSON object matching the following structure:
      {
        "headline": "A short emotional title",
        "act1": "Act 1 greeting text",
        "act2": "Act 2 metaphor text",
        "act3": "Act 3 reconciliation text",
        "unsplashImageUrl": "A vertical/portrait Unsplash photo URL matching the prompt (starting with https://images.unsplash.com/photo-)",
        "unsplashBgUrl": "A gorgeous vertical/portrait aesthetic Unsplash photo URL matching their movies/series or obsession fanbase for the background (starting with https://images.unsplash.com/photo-)",
        "popCultureReferences": ["ref1", "ref2"],
        "colorPalette": ["HexColor1", "HexColor2", "HexColor3"],
        "themePreset": "cosmic_hearts" | "cherry_blossoms" | "cyber_glitch",
        "characterAttributes": {
          "knownFor": "Known for text",
          "acclaimedFor": "Acclaimed for text",
          "rememberedFor": "Remembered for text"
        },
        "memoriesList": ["memory1", "memory2", "memory3"],
        "dateLetterText": "A custom emotional date letter text with emojis"
      }
      
      Do not include any markdown fences, backticks, or extra text. Output ONLY the raw JSON.
    `;

    let aiData = body.customAiData;

    if (!aiData && isCeremony) {
      const fallbackCouple = weddingData?.coupleNames || (recipientName && !recipientName.toLowerCase().includes("family") && !recipientName.toLowerCase().includes("friend") ? recipientName : `${creatorName} & Partner`);
      const partyPerson = birthdayPartyData?.birthdayPersonName || recipientName || creatorName || "Birthday Star";
      const proposalPartner = proposalData?.partnerName || recipientName || "My Love";
      aiData = {
        headline: isProposal
          ? (proposalData?.headline || `For My Forever, ${proposalPartner} 🌹`)
          : (isBirthdayParty
            ? `VIP Birthday Party of ${partyPerson}`
            : (isEngagement ? `Engagement & Ring Ceremony of ${fallbackCouple}` : `The Royal Wedding of ${fallbackCouple}`)),
        themePreset: "cherry_blossoms",
        colorPalette: isProposal
          ? ["#f43f5e", "#fda4af", "#e11d48"]
          : (isBirthdayParty
            ? ["#ffd700", "#ec4899", "#8b5cf6"]
            : (isEngagement ? ["#2d5a3c", "#556b2f", "#d4a373"] : ["#f59e0b", "#10b981", "#fbbf24"])),
        characterAttributes: {
          knownFor: "A warm and shining presence.",
          acclaimedFor: "Radiant hospitality and love.",
          rememberedFor: "A celebration of a lifetime."
        },
        memoriesList: [],
        popCultureReferences: [],
        apologyNarrative: isProposal
          ? "From the moment our paths crossed, my entire world turned into something luminous and real."
          : (isBirthdayParty
            ? `You are cordially invited to celebrate ${partyPerson}'s birthday!`
            : (isEngagement 
              ? "Together with our families, we cordially invite you to celebrate our ring ceremony."
              : "Together with our families, we joyfully invite you to celebrate our wedding."))
      };
    } else if (!aiData) {
      // Request to Groq API with automatic multi-key rotation and rate-limit failover
      aiData = await callGroqWithFailover({
        systemPrompt,
        userPrompt: prompt,
        temperature: 0.7,
      });
    }

    // Format Ending Surprise Data based on type
    const sanitizeQuery = (q: string) => {
      const stopWords = new Set(["the", "in", "of", "a", "an", "with", "full", "for", "to", "at", "on", "and", "or", "by"]);
      return q
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, "")
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.has(word))
        .join(",");
    };

    let surpriseDataObj: any = {};
    if (surpriseType === "polaroid") {
      const query = sanitizeQuery(polaroidImageQuery || "aesthetic,scenery");
      let imageUrl = polaroidImageUrl || aiData.unsplashImageUrl || "";
      const isUnsplash = imageUrl.includes(".unsplash.com") || imageUrl.startsWith("https://images.unsplash.com");
      if (!isUnsplash) {
        imageUrl = `https://loremflickr.com/600/800/${encodeURIComponent(query || "aesthetic,scenery")}`;
      }
      surpriseDataObj = {
        message: (surpriseText || "I cherish our connection.").trim(),
        caption: (surpriseText || "A special memory captured.").trim(),
        imageUrl: imageUrl,
      };
    } else if (surpriseType === "combo") {
      const query = sanitizeQuery(polaroidImageQuery || "aesthetic,scenery");
      let imageUrl = polaroidImageUrl || aiData.unsplashImageUrl || "";
      const isUnsplash = imageUrl.includes(".unsplash.com") || imageUrl.startsWith("https://images.unsplash.com");
      if (!isUnsplash) {
        imageUrl = `https://loremflickr.com/600/800/${encodeURIComponent(query || "aesthetic,scenery")}`;
      }
      surpriseDataObj = {
        message: (surpriseText || "I cherish our connection.").trim(), // Scratch Message
        caption: (polaroidCaption || "A special memory captured.").trim(), // Polaroid Caption
        imageUrl: imageUrl, // Polaroid Image
      };
    } else {
      surpriseDataObj = {
        message: (surpriseText || "I cherish our connection.").trim(),
      };
    }

    // Connect to Database
    await dbConnect();

    // Create a unique friendly slug
    const cleanRecipientName = recipientName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    let slug = "";
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const suffix = Math.random().toString(36).substring(2, 6);
      slug = `${cleanRecipientName}-${suffix}`;
      const existing = await Apology.findOne({ slug });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      slug = `${cleanRecipientName}-${Date.now().toString().slice(-4)}`;
    }

    const combinedNarrative = (aiData.act1 || aiData.act2 || aiData.act3)
      ? `${aiData.act1 || ""}[BREAK]${aiData.act2 || ""}[BREAK]${aiData.act3 || ""}`
      : (aiData.apologyNarrative || "");

    // Server-side Unsplash query for Fanbase background if empty
    let resolvedBgUrl = customBackgroundUrl || "";
    if (backgroundType === "fanbase" && !resolvedBgUrl) {
      try {
        const searchQuery = obsessions || "aesthetic scenery";
        const unsplashRes = await fetch(
          `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            }
          }
        );
        if (unsplashRes.ok) {
          const unsplashData = await unsplashRes.json();
          const firstPhoto = unsplashData.results?.[0] || unsplashData.photos?.results?.[0];
          if (firstPhoto) {
            resolvedBgUrl = firstPhoto.urls?.regular || firstPhoto.urls?.small || "";
          }
        }
      } catch (e) {
        console.error("Failed to fetch fanbase backdrop server-side:", e);
      }
    }

    // Create and save database entry
    const apology = new Apology({
      creatorId: session?.userId || undefined,
      slug,
      creatorName: creatorName || (proposalData?.partnerName ? creatorName : (birthdayPartyData?.birthdayPersonName || (weddingData?.coupleNames ? weddingData.coupleNames.split("&")[0]?.trim() : "Host"))),
      recipientName: isProposal
        ? (proposalData?.partnerName || recipientName || "My Love")
        : (isBirthdayParty 
          ? (birthdayPartyData?.birthdayPersonName || recipientName || "Guests & Friends")
          : (isCeremony ? (weddingData?.coupleNames || recipientName || "Adnan & Sujan") : recipientName)),
      relationshipType: relationshipType || (isProposal ? "Partner" : (isCeremony ? "Family & Friends" : "Friend")),
      occasion: isProposal ? "proposal" : (isBirthdayParty ? "birthday_party" : (isEngagement ? "engagement" : (isWedding ? "wedding" : (occasion || "apology")))),
      websiteType: isProposal ? "proposal" : (isBirthdayParty ? "birthday_party" : (isEngagement ? "engagement" : (isWedding ? "wedding" : "personal"))),
      weddingData: isWedding || isEngagement ? weddingData : undefined,
      birthdayPartyData: isBirthdayParty ? birthdayPartyData : undefined,
      proposalData: isProposal ? proposalData : undefined,
      obsessions,
      personality,
      insideMoments,
      firstMemory,
      smallNotices,
      unspokenTruth,
      vibeTheme: vibeTheme || "dreamy",
      passcode: passcode ? passcode.trim() : "",
      endingSurprise: {
        surpriseType,
        surpriseData: surpriseDataObj,
      },
      complimentStars: {
        enabled: complimentsEnabled === true || complimentsEnabled === "true",
        list: (complimentsEnabled === true || complimentsEnabled === "true") ? [
          { title: (compliment1_title || "My Cousins Beach Infinity").trim(), text: (compliment1_text || "Like Conrad's infinity necklace, my love for you has no end.").trim() },
          { title: (compliment2_title || "The Cutest Laughter").trim(), text: (compliment2_text || "Even when things are chaotic, your laugh makes everything perfect.").trim() },
          { title: (compliment3_title || "Starry Constellation").trim(), text: (compliment3_text || "The stars are beautiful, but they can't match the sparkle in your eyes.").trim() },
          { title: (compliment4_title || "The Promise").trim(), text: (compliment4_text || "I promise to always protect you and stand by you, chahe jo bhi ho.").trim() },
          { title: (compliment5_title || "Sweetest Heart").trim(), text: (compliment5_text || "You are the star of my heart and the sweetness in my life.").trim() },
        ] : []
      },
      dateInvitation: {
        enabled: dateInvitationEnabled === true || dateInvitationEnabled === "true",
        dateType: dateType || "movie",
        dateName: dateName || "",
        dateDate: dateDate || "",
        nickname: dateNickname || "",
        letterText: aiData.dateLetterText || "",
        response: "pending",
      },
      favorites: {
        colorPalette: aiData.colorPalette || ["#a855f7", "#ec4899", "#3b82f6"],
        moviesAndSeries: [],
        insideJokes: insideMoments,
      },
      aiGeneratedData: {
        headline: aiData.headline || `A special page from ${creatorName}`,
        apologyNarrative: combinedNarrative,
        popCultureReferences: aiData.popCultureReferences || [],
        themePreset: aiData.themePreset || "cosmic_hearts",
        characterAttributes: aiData.characterAttributes || {
          knownFor: "A warm and shining presence.",
          acclaimedFor: "Their kindness and quiet jokes.",
          rememberedFor: "Always being there when it matters.",
        },
        memoriesList: aiData.memoriesList || insideMoments,
        credits: {
          writer: creatorName,
          cast: [creatorName, recipientName],
        },
      },
      backgroundType: backgroundType || "particles",
      customBackgroundUrl: resolvedBgUrl || aiData.unsplashBgUrl || "",
      youtubeUrl: youtubeUrl || "",
      songName: songName || "",
      fontStyle: fontStyle || "classic",
      status: "sent",
    });

    await apology.save();

    return NextResponse.json({
      success: true,
      slug,
      remainingTokens: userDoc.tokens,
    });
  } catch (err: any) {
    console.error("API Generate Route Error:", err);

    // Atomically refund deducted token if generation failed
    try {
      const session: any = await getSession();
      if (session?.userId) {
        await User.findByIdAndUpdate(session.userId, { $inc: { tokens: 1 } });
      }
    } catch (refundErr) {
      console.error("Token refund on failure error:", refundErr);
    }

    return NextResponse.json(
      { error: err.message || "Something went wrong while generating the apology." },
      { status: 500 }
    );
  }
}
