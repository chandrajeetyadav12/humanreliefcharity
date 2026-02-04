// app/api/donation/create/route.js
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation";
import Avedan from "@/models/Avedan";
import User from "@/models/User";
// import cloudinary from "@/lib/cloudinary";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function POST(req) {
    await dbConnect();
    const auth = getAuth(req);
    if (!auth || auth.role !== "user") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.userId;
    const formData = await req.formData();


    // const userId = formData.get("userId");
    const avedanId = formData.get("avedanId");
    const amount = Number(formData.get("amount"));
    const paymentMode = formData.get("paymentMode");
    const transactionId = formData.get("transactionId");
    const receiptFile = formData.get("receipt");


    const user = await User.findById(userId);
    if (!user || user.status !== "active") {
        return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }


    const avedan = await Avedan.findById(avedanId).populate("applicant", "name");;
    if (!avedan || avedan.status !== "founder_approved") {
        return NextResponse.json({ message: "Invalid avedan" }, { status: 400 });
    }


    // let receipt;
    // if (receiptFile && receiptFile.size > 0) {
    //     const buffer = Buffer.from(await receiptFile.arrayBuffer());


    //     const uploaded = await new Promise((resolve, reject) => {
    //         cloudinary.uploader
    //             .upload_stream({ folder: "donation_receipts" }, (err, result) => {
    //                 if (err) reject(err);
    //                 resolve(result);
    //             })
    //             .end(buffer);
    //     });


    //     receipt = {
    //         public_id: uploaded.public_id,
    //         url: uploaded.secure_url,
    //     };
    // }
    let receipt;

if (receiptFile && receiptFile.size > 0) {
  const bytes = await receiptFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = receiptFile.name.split(".").pop();
  const key = `donation_receipts/${crypto.randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: receiptFile.type,
  });

  await s3.send(command);

  const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  receipt = {
    key,
    url,
  };
}



    const donation = await Donation.create({
        donor: userId,
        avedan: avedanId,
        amount,
        paymentMode,
        transactionId,
        receipt,
        status: "pending",
    });
    // Update collected amount
    // avedan.collectedAmount += amount;

     // Auto complete if goal reached
    // if (avedan.collectedAmount >= avedan.requiredAmount) {
    //     avedan.isCompleted = true;
    // }

    // await avedan.save();

    // return NextResponse.json({ message: "Donation submitted", donation });
    return NextResponse.json({
        success: true,
        message: "Donation submitted",
        donation: {
            _id: donation._id,
            amount: donation.amount,
            status: donation.status,
            paymentMode: donation.paymentMode,
            transactionId: donation.transactionId,
            avedan: {
                id: avedan._id,
                type: avedan.type,
                applicantName: avedan.applicant.name,
            },
        },
    });

}