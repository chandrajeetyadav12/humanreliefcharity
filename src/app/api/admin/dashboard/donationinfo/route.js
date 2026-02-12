export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import jwt from "jsonwebtoken";

export async function GET(req) {
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
    totalDonations,
    pendingDonations,
    rejectedDonations,
    donationAmount,
  ] = await Promise.all([
    Donation.countDocuments(),
    Donation.countDocuments({ status: "pending" }),
    Donation.countDocuments({ status: "rejected" }),

    Donation.aggregate([
      { $match: { status: "founder_approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),


  ]);

  return Response.json({
    donations: {
      total: totalDonations,
      pending: pendingDonations,
      rejected: rejectedDonations,
      amount: donationAmount[0]?.total || 0,
    },

  });
}
