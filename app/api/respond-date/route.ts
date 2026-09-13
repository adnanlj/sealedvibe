import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";

export async function POST(req: Request) {
  try {
    const { slug, response } = await req.json();
    if (!slug || !response) {
      return NextResponse.json({ error: "Slug and response are required." }, { status: 400 });
    }

    if (response !== "accepted" && response !== "declined") {
      return NextResponse.json({ error: "Invalid response value." }, { status: 400 });
    }

    await dbConnect();
    const updated = await Apology.findOneAndUpdate(
      { slug },
      { "dateInvitation.response": response },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Apology not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, response: updated.dateInvitation?.response });
  } catch (err: any) {
    console.error("API Respond Date Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update date response." },
      { status: 500 }
    );
  }
}
