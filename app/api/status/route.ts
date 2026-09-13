import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    await dbConnect();
    const apology = await Apology.findOne({ slug }).lean();

    if (!apology) {
      return NextResponse.json({ error: "Apology not found." }, { status: 404 });
    }

    return NextResponse.json({
      status: apology.status,
      openedAt: apology.openedAt || null,
      websiteType: (apology as any).websiteType || (apology.occasion === "birthday_party" ? "birthday_party" : (apology.occasion === "wedding" ? "wedding" : (apology.occasion === "engagement" ? "engagement" : (apology.occasion === "proposal" ? "proposal" : "personal")))),
      weddingData: (apology as any).weddingData || undefined,
      birthdayPartyData: (apology as any).birthdayPartyData || undefined,
      proposalData: (apology as any).proposalData || undefined,
      dateInvitation: apology.dateInvitation ? {
        enabled: apology.dateInvitation.enabled,
        response: apology.dateInvitation.response || 'pending',
        dateType: apology.dateInvitation.dateType,
        dateName: apology.dateInvitation.dateName,
      } : { enabled: false },
    });
  } catch (err: any) {
    console.error("API Status Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch status." },
      { status: 500 }
    );
  }
}
