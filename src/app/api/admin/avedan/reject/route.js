import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function PATCH(req) {
  try {
    await dbConnect();
    const auth = getAuth(req);

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { avedanId, reason } = await req.json();

    if (!reason) {
      return NextResponse.json(
        { message: "Rejection reason required" },
        { status: 400 }
      );
    }

    const avedan = await Avedan.findById(avedanId);
    if (!avedan || avedan.status !== "pending") {
      return NextResponse.json({ message: "Invalid state" }, { status: 400 });
    }

    avedan.status = "rejected";
    avedan.rejection = {
      reason,
      rejectedBy: auth.userId,
      rejectedAt: new Date(),
    };

    await avedan.save();

    return NextResponse.json({ message: "Avedan rejected" });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
