import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await dbConnect();

    const auth = getAuth(req);
    if (!auth || auth.role !== "founder") {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }

    const { avedanId } = await req.json();

    if (!avedanId) {
      return NextResponse.json(
        { message: "Avedan ID required" },
        { status: 400 }
      );
    }

    const avedan = await Avedan.findById(avedanId);

    if (!avedan || avedan.status !== "founder_approved") {
      return NextResponse.json(
        { message: "Only founder approved avedan can be closed" },
        { status: 400 }
      );
    }

    avedan.status = "closed";
    await avedan.save();

    return NextResponse.json(
      { message: "Avedan closed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}