import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { callGroqWithFailover } from "@/lib/groqPool";

export async function POST(req: Request) {
  try {
    const session: any = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Please log in to generate AI content.", needAuth: true },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user || (typeof user.tokens === 'number' ? user.tokens : 0) < 1) {
      return NextResponse.json(
        { error: "You have 0 tokens. Please redeem a promo code or purchase tokens to generate AI drafts.", noTokens: true },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      occasion,
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
      vibeTheme,
      polaroidImageQuery,
      dateInvitationEnabled,
      dateType,
      dateName,
      dateDate,
      dateNickname,
      dateBanter,
    } = body;

    if (!creatorName || !recipientName || !reason || !favoriteColors) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
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

    // Request to Groq API with automatic multi-key rotation and rate-limit failover
    const aiData = await callGroqWithFailover({
      systemPrompt,
      userPrompt: prompt,
      temperature: 0.7,
    });
    if (!aiData.apologyNarrative && (aiData.act1 || aiData.act2 || aiData.act3)) {
      aiData.apologyNarrative = [aiData.act1 || "", aiData.act2 || "", aiData.act3 || ""].join("[BREAK]");
    }

    return NextResponse.json({ success: true, aiData });
  } catch (err: any) {
    console.error("API Generate Draft Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate draft text." },
      { status: 500 }
    );
  }
}
