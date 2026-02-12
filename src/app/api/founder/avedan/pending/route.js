// app/api/founder/avedan/pending/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const auth = getAuth(req);

    // Only founder can access
    if (!auth || auth.role !== "founder") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Get all Avedan verified by admin
    const avedans = await Avedan.find({ status: "admin_verified" })
      .populate("applicant", "name email mobile")
      .sort({ createdAt: -1 });

    return NextResponse.json({ avedans }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
