import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Apology from "@/models/Apology";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    await dbConnect();
    const updated = await Apology.findOneAndUpdate(
      { slug },
      { status: "accepted" },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Apology not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: updated.status });
  } catch (err: any) {
    console.error("API Accept Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update apology status." },
      { status: 500 }
    );
  }
}
