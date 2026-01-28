import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
export async function PATCH(req) {
  try {
    await dbConnect();
    const auth = getAuth(req); // get admin from token
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
    const { avedanId } = await req.json();

    if (!avedanId ) {
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
    avedan.adminVerifiedBy = auth.userId;

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
