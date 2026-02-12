// app/api/avedan/available/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const auth = getAuth(req);

    // Only verified users can see donation Avedans
    if (!auth || auth.role !== "user") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const avedans = await Avedan.find({
      status: "founder_approved",
      // optional safety flag
    })
      .select(
        "title description requiredAmount collectedAmount bankDetails upiDetails createdAt"
      )
      .sort({ createdAt: -1 });

    return NextResponse.json({ avedans }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
