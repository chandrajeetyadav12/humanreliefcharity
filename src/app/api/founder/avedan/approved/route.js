import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const auth = getAuth(req);

    // Only founder allowed
    if (!auth || auth.role !== "founder") {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const avedans = await Avedan.find({
      status: "founder_approved",
    })
      .populate("applicant", "name email mobile")
      .sort({ createdAt: -1 });

    return NextResponse.json({ avedans }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}