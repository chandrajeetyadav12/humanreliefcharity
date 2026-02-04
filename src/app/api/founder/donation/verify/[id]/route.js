import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import Avedan from "@/models/Avedan";
export async function PATCH(req, { params }) {
  await dbConnect();

  const auth = getAuth(req);
  if (!auth || auth.role !== "founder") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { action, reason } = await req.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { message: "Invalid action" },
      { status: 400 }
    );
  }

  const donation = await Donation.findById(id);
  if (!donation) {
    return NextResponse.json({ message: "Donation not found" }, { status: 404 });
  }

  if (donation.status !== "admin_verified") {
    return NextResponse.json(
      { message: "Donation not ready for founder action" },
      { status: 400 }
    );
  }


if (action === "approve") {
  donation.status = "founder_approved";
  donation.founderApprovedBy = auth.userId;

  // Atomic update – avoids validation on old documents
  const avedan = await Avedan.findByIdAndUpdate(
    donation.avedan,
    {
      $inc: { collectedAmount: donation.amount },
    },
    { new: true }
  );

  if (!avedan) {
    return NextResponse.json(
      { message: "Related Avedan not found" },
      { status: 404 }
    );
  }

  // Auto-complete if target reached
  if (avedan.collectedAmount >= avedan.requiredAmount) {
    await Avedan.findByIdAndUpdate(avedan._id, {
      isCompleted: true,
      status: "founder_approved",
      founderApprovedBy: auth.userId,
    });
  }
}

  if (action === "reject") {
    if (!reason) {
      return NextResponse.json(
        { message: "Rejection reason required" },
        { status: 400 }
      );
    }

    donation.status = "rejected";
    donation.rejectionReason = reason;
    donation.rejectedBy = auth.userId;
    donation.rejectedAt = new Date();
  }

  await donation.save();

  return NextResponse.json({
    success: true,
    message:
      action === "approve"
        ? "Donation approved"
        : "Donation rejected",
  });
}
