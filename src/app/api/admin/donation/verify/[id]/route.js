// app/api/admin/donation/verify/[id]/route.js
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function PATCH(req, context) {
  await dbConnect();

  const auth = getAuth(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

//   const donationId =  params.id;
const { id: donationId } = await context.params;
  const { action, rejectionReason } = await req.json();

  const donation = await Donation.findById(donationId);
  if (!donation) {
    return NextResponse.json({ message: "Donation not found" }, { status: 404 });
  }

  if (donation.status !== "pending") {
    return NextResponse.json(
      { message: "Donation already processed" },
      { status: 400 }
    );
  }

  if (action === "approve") {
    donation.status = "admin_verified";
    donation.verifiedByAdmin = true
  }

  if (action === "reject") {
    donation.status = "rejected";
    donation.rejectionReason =
      rejectionReason || "Rejected by admin";
    donation.rejectedBy = auth.userId;
    donation.rejectedAt = new Date();
  }

  await donation.save();

  return NextResponse.json({
    success: true,
    message: `Donation ${action}d by admin`,
  });
}
