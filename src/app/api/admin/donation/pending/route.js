// app/api/admin/donation/pending/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import "@/models/Avedan";
import "@/models/User";
export async function GET(req) {
  await dbConnect();

  const auth = getAuth(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const donations = await Donation.find({ status: "pending" })
    .populate("donor", "name email")
    .populate({
      path: "avedan",
      select: "type requiredAmount collectedAmount status applicant",
      populate: {
        path: "applicant",
        select: "name email mobile",
      },
    })
    // .populate("avedan", "type")
    .sort({ createdAt: -1 });

  return NextResponse.json({ donations });
}
