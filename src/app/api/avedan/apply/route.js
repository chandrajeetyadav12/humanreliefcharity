import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import User from "@/models/User";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";


async function uploadDoc(file, documentType, label) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExt = file.name.split(".").pop();
  const fileName = `${documentType}/${crypto.randomUUID()}.${fileExt}`;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: `avedan_documents/${fileName}`,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  const url = `https://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com/avedan_documents/${fileName}`;

  return {
    documentType,
    label,
    file: {
      key: `avedan_documents/${fileName}`,
      url,
    },
  };
}


export async function POST(req) {
    try {
        await dbConnect();

        // -----------------------------
        // AUTHENTICATION CHECK
        // -----------------------------
        const auth = getAuth(req);
        if (!auth || auth.role !== "user") {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = auth.userId;  // Get userId from JWT token

        const formData = await req.formData();

        const type = formData.get("type");
        const description = formData.get("description");
        //  NEW: REQUIRED AMOUNT
        // const requiredAmount = Number(formData.get("requiredAmount"));
        // console.log("REQ AMOUNT:", requiredAmount, typeof requiredAmount);

        // -----------------------------
        // BASIC VALIDATION
        // -----------------------------
        if (!type) {
            return NextResponse.json(
                { message: "type is required" },
                { status: 400 }
            );
        }

        // -----------------------------
        // USER CHECK
        // -----------------------------
        const user = await User.findById(userId);
        if (!user || user.status !== "active") {
            return NextResponse.json(
                { message: "Only active users can apply" },
                { status: 403 }
            );
        }

        // -----------------------------
        // PREVENT DUPLICATE PENDING
        // -----------------------------
        // const exists = await Avedan.findOne({
        //     applicant: userId,
        //     type,
        //     status: "pending",
        // });

        // if (exists) {
        //     return NextResponse.json(
        //         { message: "You already have a pending application" },
        //         { status: 400 }
        //     );
        // }


        // checks for already exists and not apply before three months
        //  Block pending
        const pendingExists = await Avedan.findOne({
            applicant: userId,
            type,
            status: "pending",
        });

        if (pendingExists) {
            return NextResponse.json(
                { message: "You already have a pending application" },
                { status: 400 }
            );
        }

        //  Block re-apply before 3 months
        // const lastAvedan = await Avedan.findOne({
        //     applicant: userId,
        //     type,
        // })
        //     .sort({ createdAt: -1 })
        //     .select("createdAt");

        // if (lastAvedan) {
        //     const threeMonthsLater = new Date(lastAvedan.createdAt);
        //     threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        //     if (new Date() < threeMonthsLater) {
        //         return NextResponse.json(
        //             {
        //                 message: `You can reapply after ${threeMonthsLater.toDateString()}`,
        //             },
        //             { status: 400 }
        //         );
        //     }
        // }


        // -----------------------------
        // DOCUMENT UPLOAD
        // -----------------------------
        const documents = [];

        if (type === "beti_vivah") {
            const aadhaarApplicant = formData.get("aadhaar_applicant");
            const aadhaarBride = formData.get("aadhaar_bride");
            const marriageCard = formData.get("marriage_card");

            if (!aadhaarApplicant || !aadhaarBride || !marriageCard) {
                return NextResponse.json(
                    { message: "All required documents must be uploaded" },
                    { status: 400 }
                );
            }

            documents.push(
                await uploadDoc(aadhaarApplicant, "aadhaar_applicant", "Applicant Aadhaar"),
                await uploadDoc(aadhaarBride, "aadhaar_bride", "Bride Aadhaar"),
                await uploadDoc(marriageCard, "marriage_card", "Marriage Card")
            );
        }

        if (type === "untimely_death") {
            const aadhaarApplicant = formData.get("aadhaar_applicant");
            const deathCertificate = formData.get("death_certificate");

            if (!aadhaarApplicant || !deathCertificate) {
                return NextResponse.json(
                    { message: "All required documents must be uploaded" },
                    { status: 400 }
                );
            }

            documents.push(
                await uploadDoc(aadhaarApplicant, "aadhaar_applicant", "Applicant Aadhaar"),
                await uploadDoc(deathCertificate, "death_certificate", "Death Certificate")
            );
        }

        // -----------------------------
        // BANK DETAILS
        // -----------------------------
        const upiQrFile = formData.get("upiQrFile"); // Key in Postman
        if (!upiQrFile) {
            return NextResponse.json(
                { message: "UPI QR is required" },
                { status: 400 }
            );
        }

        const uploadedQr = await uploadDoc(upiQrFile, "upi_qr", "Applicant UPI QR");
        const upiQrUrl = uploadedQr.file.url;
        const bankDetails = {
            accountHolderName: formData.get("accountHolderName"),
            bankName: formData.get("bankName"),
            accountNumber: formData.get("accountNumber"),
            ifsc: formData.get("ifsc"),
            upiQrUrl: upiQrUrl,
        };

        // -----------------------------
        // CREATE AVEDAN
        // -----------------------------
        const avedan = await Avedan.create({
            applicant: userId,
            type,
            description,
            collectedAmount: 0,
            isCompleted: false,
            documents,
            bankDetails,
            status: "pending",
        });

        return NextResponse.json(
            { message: "Avedan submitted successfully", avedan },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
