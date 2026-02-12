// app/api/avedan/available/[id]/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const auth = getAuth(req);
    if (!auth || auth.role !== "user") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const avedan = await Avedan.findOne({
      _id: id,
      status: "founder_approved",
      isCompleted: false,
    }).select(
      "title description requiredAmount collectedAmount bankDetails upiDetails"
    );

    if (!avedan) {
      return NextResponse.json(
        { message: "Avedan not available for donation" },
        { status: 404 }
      );
    }

    return NextResponse.json({ avedan }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
