import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const auth = getAuth(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } =await params;

    const avedan = await Avedan.findById(id)
      .populate("applicant", "name email mobile adharNumber")
      .populate("adminVerifiedBy", "name email")
      .populate("founderApprovedBy", "name email");

    if (!avedan) {
      return NextResponse.json(
        { message: "Avedan not found" },
        { status: 404 }
      );
    }

    /* ---------------- ROLE RULES ---------------- */

    // User can view ONLY their own avedan
    if (auth.role === "user") {
      if (avedan.applicant._id.toString() !== auth.userId) {
        return NextResponse.json(
          { message: "Access denied" },
          { status: 403 }
        );
      }
    }

    // Founder can view ONLY admin-verified avedan
    if (auth.role === "founder") {
      if (!["admin_verified", "founder_approved"].includes(avedan.status)) {
        return NextResponse.json(
          { message: "Avedan not ready for founder review" },
          { status: 403 }
        );
      }
    }

    // Admin → no restriction

    return NextResponse.json({ avedan }, { status: 200 });
  } catch (error) {

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
