import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await dbConnect();

    const { avedanId, adminId } = await req.json();

    if (!avedanId || !adminId) {
      return NextResponse.json(
        { message: "Missing data" },
        { status: 400 }
      );
    }

    const avedan = await Avedan.findById(avedanId);

    if (!avedan || avedan.status !== "pending") {
      return NextResponse.json(
        { message: "Invalid Avedan state" },
        { status: 400 }
      );
    }

    avedan.status = "admin_verified";
    avedan.adminVerifiedBy = adminId;

    // mark documents verified
    avedan.documents = avedan.documents.map(doc => ({
      ...doc.toObject(),
      verified: true,
    }));

    await avedan.save();

    return NextResponse.json(
      { message: "Avedan verified by admin", avedan },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
