import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function GET(req) {
    await dbConnect();

    const auth = getAuth(req);
    if (!auth || auth.role !== "founder") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const donations = await Donation.find({
        status: "admin_verified"       
    })
        .populate("donor", "name email")
        .populate("avedan", "type")
        .sort({ createdAt: -1 });
    console.log("FOUND DONATIONS:", donations.length);
    return NextResponse.json({ donations });
}
