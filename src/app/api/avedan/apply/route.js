import dbConnect from "@/lib/dbConnect";
import Avedan from "@/models/Avedan";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

async function uploadDoc(file, documentType, label) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "avedan_documents" }, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
            .end(buffer);
    });

    return {
        documentType,
        label,
        file: {
            public_id: result.public_id,
            url: result.secure_url,
        },
    };
}

export async function POST(req) {
    try {
        await dbConnect();

        const formData = await req.formData();

        const userId = formData.get("userId");
        const type = formData.get("type");
        const description = formData.get("description");
        //  NEW: REQUIRED AMOUNT
        const requiredAmount = Number(formData.get("requiredAmount"));
        // -----------------------------
        // BASIC VALIDATION
        // -----------------------------
        if (!userId || !type || !requiredAmount || requiredAmount <= 0) {
            return NextResponse.json(
                { message: "userId,requiredAmount and type  are required" },
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
        const exists = await Avedan.findOne({
            applicant: userId,
            type,
            status: "pending",
        });

        if (exists) {
            return NextResponse.json(
                { message: "You already have a pending application" },
                { status: 400 }
            );
        }

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
            requiredAmount,
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
        console.error("AVEDAN APPLY ERROR:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
