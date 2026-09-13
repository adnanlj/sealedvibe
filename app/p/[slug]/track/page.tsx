import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";
import TrackingClient from "@/components/TrackingClient";
import { DEMO_PRESETS } from "@/lib/demoPresets";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TrackPage({ params }: PageProps) {
  const { slug } = await params;

  // Handle Demo Presets if requested
  const demoPreset = Object.values(DEMO_PRESETS).find(
    (p) => p.data.slug === slug || p.id === slug.replace("demo-", "")
  );

  if (demoPreset) {
    const d = demoPreset.data;
    const serializedData = {
      slug: d.slug,
      creatorName: d.creatorName,
      recipientName: d.recipientName,
      occasion: d.occasion || "apology",
      status: d.status || "sent",
      openedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      headline: d.aiGeneratedData?.headline || d.title || "VIP Experience",
      websiteType: d.websiteType || (d.occasion === "birthday_party" ? "birthday_party" : (d.occasion === "wedding" ? "wedding" : "personal")),
      weddingData: d.weddingData || undefined,
      birthdayPartyData: d.birthdayPartyData || undefined,
      proposalData: d.proposalData || undefined,
      dateInvitation: d.dateInvitation || { enabled: false },
    };
    return <TrackingClient data={serializedData} />;
  }

  await dbConnect();
  const apology = await Apology.findOne({ slug }).lean();

  if (!apology) {
    notFound();
  }

  // Serialize Document for client safety
  const serializedData = {
    slug: apology.slug,
    creatorName: apology.creatorName,
    recipientName: apology.recipientName,
    occasion: apology.occasion || "apology",
    status: apology.status,
    openedAt: apology.openedAt ? new Date(apology.openedAt).toISOString() : null,
    createdAt: apology.createdAt ? new Date(apology.createdAt).toISOString() : new Date().toISOString(),
    headline: apology.aiGeneratedData?.headline || (apology.occasion === "wedding" ? "Royal Wedding Invitation" : (apology.occasion === "birthday_party" ? "VIP Birthday Party Invitation" : "Personal Keepsake")),
    websiteType: (apology as any).websiteType || (apology.occasion === "birthday_party" ? "birthday_party" : (apology.occasion === "wedding" ? "wedding" : (apology.occasion === "engagement" ? "engagement" : (apology.occasion === "proposal" ? "proposal" : "personal")))),
    weddingData: (apology as any).weddingData || undefined,
    birthdayPartyData: (apology as any).birthdayPartyData || undefined,
    proposalData: (apology as any).proposalData || undefined,
    dateInvitation: apology.dateInvitation ? {
      enabled: apology.dateInvitation.enabled,
      response: apology.dateInvitation.response || 'pending',
      dateType: apology.dateInvitation.dateType,
      dateName: apology.dateInvitation.dateName,
      dateDate: apology.dateInvitation.dateDate,
    } : { enabled: false },
  };

  return <TrackingClient data={serializedData} />;
}
