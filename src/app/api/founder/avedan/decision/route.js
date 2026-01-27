import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await dbConnect();

    const { avedanId, founderId, decision } = await req.json();

    if (!avedanId || !founderId || !["approved", "rejected"].includes(decision)) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const avedan = await Avedan.findById(avedanId);

    if (!avedan || avedan.status !== "admin_verified") {
      return NextResponse.json(
        { message: "Avedan not ready for founder decision" },
        { status: 400 }
      );
    }

    if (decision === "approved") {
      avedan.status = "founder_approved";
      avedan.founderApprovedBy = founderId;
    //   avedan.bankDetails.upiQrUrl = upiQrUrl;

      // UPI QR becomes visible ONLY now
    //   if (upiQrUrl) {
    //     avedan.bankDetails.upiQrUrl = upiQrUrl;
    //   }
    } else {
      avedan.status = "rejected";
    }

    await avedan.save();

    return NextResponse.json(
      { message: `Avedan ${decision}`, avedan },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
