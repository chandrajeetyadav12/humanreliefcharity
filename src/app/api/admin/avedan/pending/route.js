// app/api/avedan/pending/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    //  Get logged-in user from token cookie
    const auth = getAuth(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Only admin can access
    if (auth.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    //  Get all pending Avedan from multiple users
    const avedans = await Avedan.find({ status: "pending" })
      .populate("applicant", "name email mobile") // show basic user info
      .sort({ createdAt: -1 });

    return NextResponse.json({ avedans }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
