import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function GET(req) {
    await dbConnect();

    const auth = getAuth(req);
    if (!auth || auth.role !== "user") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const donations = await Donation.find({ donor: auth.userId })
        // .populate("avedan", "type")
        .populate({
            path: "avedan",
            select: "type title description applicant",
            populate: {
                path: "applicant",
                select: "name email mobile address",
            },
        })
        .sort({ createdAt: -1 });

    return NextResponse.json({ donations });
}
