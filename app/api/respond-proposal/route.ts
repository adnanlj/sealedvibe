import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";

export async function POST(req: Request) {
  try {
    const { slug, response, partnerNote } = await req.json();
    if (!slug || !response) {
      return NextResponse.json({ error: "Slug and response are required." }, { status: 400 });
    }

    if (response !== "accepted" && response !== "declined") {
      return NextResponse.json({ error: "Invalid response value." }, { status: 400 });
    }

    await dbConnect();
    const updated = await Apology.findOneAndUpdate(
      { slug },
      { 
        status: response,
        "proposalData.responseStatus": response,
        "proposalData.responseDate": new Date(),
        ...(partnerNote ? { "proposalData.responsePartnerNote": partnerNote } : {})
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Proposal experience not found." }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      responseStatus: updated.proposalData?.responseStatus,
      responseDate: updated.proposalData?.responseDate
    });
  } catch (err: any) {
    console.error("API Respond Proposal Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update proposal response." },
      { status: 500 }
    );
  }
}
