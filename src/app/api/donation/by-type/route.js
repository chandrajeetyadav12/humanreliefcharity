import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const type = url.searchParams.get("type");       // beti_vivah / untimely_death
    const district = url.searchParams.get("district"); // optional
    const block = url.searchParams.get("block");       // optional

    if (!type) return NextResponse.json({ message: "type is required" }, { status: 400 });

    const donations = await Donation.aggregate([
      // Join with Avedan
      {
        $lookup: {
          from: "avedans",
          localField: "avedan",
          foreignField: "_id",
          as: "avedanDetails",
        },
      },
      { $unwind: "$avedanDetails" },
      { $match: { "avedanDetails.type": type } },

      // Join with User (donor)
      {
        $lookup: {
          from: "users",
          localField: "donor",
          foreignField: "_id",
          as: "donorDetails",
        },
      },
      { $unwind: "$donorDetails" },

      // Filter by donor district/block
      {
        $match: {
          ...(district ? { "donorDetails.district": district } : {}),
          ...(block ? { "donorDetails.block": block } : {}),
        },
      },

      {
        $project: {
          donorName: "$donorDetails.name",
          donorDistrict: "$donorDetails.district",
          donorBlock: "$donorDetails.block",
          avedanTitle: "$avedanDetails.description",
          amount: 1,
          donatedAt: "$createdAt",
          updatedAt: 1,
          status: 1,
        },
      },
      { $sort: { donatedAt: -1 } },
    ]);

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
