// app/api/donation/create/route.js
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import Avedan from "@/models/Avedan";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";


export async function POST(req) {
    await dbConnect();


    const formData = await req.formData();


    const userId = formData.get("userId");
    const avedanId = formData.get("avedanId");
    const amount = formData.get("amount");
    const paymentMode = formData.get("paymentMode");
    const transactionId = formData.get("transactionId");
    const receiptFile = formData.get("receipt");


    const user = await User.findById(userId);
    if (!user || user.status !== "active") {
        return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }


    const avedan = await Avedan.findById(avedanId);
    if (!avedan || avedan.status !== "founder_approved") {
        return NextResponse.json({ message: "Invalid avedan" }, { status: 400 });
    }


    let receipt;
    if (receiptFile && receiptFile.size > 0) {
        const buffer = Buffer.from(await receiptFile.arrayBuffer());


        const uploaded = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "donation_receipts" }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                })
                .end(buffer);
        });


        receipt = {
            public_id: uploaded.public_id,
            url: uploaded.secure_url,
        };
    }


    const donation = await Donation.create({
        donor: userId,
        avedan: avedanId,
        amount,
        paymentMode,
        transactionId,
        receipt,
    });


    return NextResponse.json({ message: "Donation submitted", donation });
}