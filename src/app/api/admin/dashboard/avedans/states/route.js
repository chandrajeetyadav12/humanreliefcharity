import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["admin", "founder"].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    await dbConnect();

    const [
      total,
      pending,
      adminVerified,
      founderApproved,
      rejected,
      betiVivah,
      untimelyDeath,
      completed,
      ongoing,
    ] = await Promise.all([
      Avedan.countDocuments(),
      Avedan.countDocuments({ status: "pending" }),
      Avedan.countDocuments({ status: "admin_verified" }),
      Avedan.countDocuments({ status: "founder_approved" }),
      Avedan.countDocuments({ status: "rejected" }),
      Avedan.countDocuments({ type: "beti_vivah" }),
      Avedan.countDocuments({ type: "untimely_death" }),
      Avedan.countDocuments({ isCompleted: true }),
      Avedan.countDocuments({ isCompleted: false }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        pending,
        adminVerified,
        founderApproved,
        rejected,
        betiVivah,
        untimelyDeath,
        completed,
        ongoing,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
