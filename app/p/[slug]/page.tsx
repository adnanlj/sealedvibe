import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";
import ApologyClient from "@/components/ApologyClient";
import { DEMO_PRESETS } from "@/lib/demoPresets";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  // Handle Demo Presets
  const demoPreset = Object.values(DEMO_PRESETS).find(p => p.data.slug === slug || p.id === slug.replace("demo-", ""));
  if (demoPreset) {
    return {
      title: demoPreset.title,
      description: demoPreset.desc,
    };
  }

  await dbConnect();
  const apology = await Apology.findOne({ slug }).select("recipientName occasion").lean();
  if (!apology) return { title: "A Special Experience" };
  const occasionName = apology.occasion?.toUpperCase() || "MESSAGE";
  return {
    title: `${occasionName} FOR ${apology.recipientName.toUpperCase()}`,
    description: `An interactive custom stardust experience created for ${apology.recipientName}.`,
  };
}

export default async function ApologyPage({ params }: PageProps) {
  const { slug } = await params;

  // Handle Demo Presets
  const demoPreset = Object.values(DEMO_PRESETS).find(p => p.data.slug === slug || p.id === slug.replace("demo-", ""));
  if (demoPreset) {
    return <ApologyClient data={demoPreset.data} />;
  }

  await dbConnect();
  // Fetch from database
  const apology = await Apology.findOne({ slug }).lean();

  if (!apology) {
    notFound();
  }

  const isLocked = !!(apology.passcode && apology.passcode.trim() !== "");

  if (isLocked) {
    const lockedData = {
      slug: apology.slug,
      creatorName: apology.creatorName,
      recipientName: apology.recipientName,
      occasion: apology.occasion || "apology",
      vibeTheme: apology.vibeTheme || "dreamy",
      isLocked: true,
      isPasswordProtected: true,
      favorites: {
        colorPalette: apology.favorites?.colorPalette || ["#a855f7", "#ec4899", "#3b82f6"],
      },
      aiGeneratedData: {
        headline: `${apology.creatorName} has sent you a secure experience`,
        themePreset: apology.aiGeneratedData?.themePreset || "cosmic_hearts",
      },
      backgroundType: apology.backgroundType || "particles",
      customBackgroundUrl: apology.customBackgroundUrl || "",
      youtubeUrl: (apology as any).youtubeUrl || "",
      songName: (apology as any).songName || "",
      fontStyle: apology.fontStyle || "classic",
    };
    return <ApologyClient data={lockedData as any} />;
  }

  // Serialize Document for Client-Side usage without audio properties
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
      headline: apology.aiGeneratedData?.headline || `${apology.creatorName}'s Special Universe`,
      apologyNarrative: apology.aiGeneratedData?.apologyNarrative || "A beautiful memory shared between us.",
      popCultureReferences: apology.aiGeneratedData?.popCultureReferences || [],
      themePreset: apology.aiGeneratedData?.themePreset || "cosmic_hearts",
      characterAttributes: (apology.aiGeneratedData?.characterAttributes?.knownFor)
        ? apology.aiGeneratedData.characterAttributes
        : {
            knownFor: "A warm and radiant presence in life.",
            acclaimedFor: "Their kindness, empathy, and quiet jokes.",
            rememberedFor: "Always bringing light to those around them.",
          },
      memoriesList: (apology.aiGeneratedData?.memoriesList && apology.aiGeneratedData.memoriesList.length > 0)
        ? apology.aiGeneratedData.memoriesList
        : (apology.favorites?.insideJokes && apology.favorites.insideJokes.length > 0)
        ? apology.favorites.insideJokes
        : ["A shared smile that brightened the day.", "Quiet support when it mattered most.", "An inside joke that still brings laughter."],
      credits: {
        writer: apology.aiGeneratedData?.credits?.writer || apology.creatorName,
        cast: apology.aiGeneratedData?.credits?.cast || [apology.creatorName, apology.recipientName],
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
    youtubeUrl: (apology as any).youtubeUrl || "",
    songName: (apology as any).songName || "",
    fontStyle: apology.fontStyle || "classic",
    websiteType: (apology as any).websiteType || (apology.occasion === "proposal" ? "proposal" : (apology.occasion === "engagement" ? "engagement" : (apology.occasion === "wedding" ? "wedding" : (apology.occasion === "birthday_party" ? "birthday_party" : "personal")))),
    weddingData: (apology as any).weddingData || undefined,
    birthdayPartyData: (apology as any).birthdayPartyData || undefined,
    proposalData: (apology as any).proposalData || undefined,
  };

  return <ApologyClient data={serializedData as any} />;
}
