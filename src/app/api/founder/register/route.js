import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();

        //  Only ONE founder allowed
        const founderExists = await User.findOne({ role: "founder" });
        if (founderExists) {
            return NextResponse.json(
                { message: "Founder already registered" },
                { status: 403 }
            );
        }

        //  Must be multipart/form-data
        const formData = await request.formData();

        // REQUIRED FIELDS
        const name = formData.get("name");
        const email = formData.get("email");
        const mobile = formData.get("mobile");
        const password = formData.get("password");

        if (!name || !email || !mobile || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Email uniqueness
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // =========================
        // OPTIONAL IMAGE (SAFE MODE)
        // =========================
        // =========================
// =========================
// FOUNDER IMAGE (SAME AS USER - STABLE)
// =========================
let userImage = undefined;
const imageFile = formData.get("userImage");

if (imageFile && imageFile.size > 0) {
  try {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "founder_profiles" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    userImage = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  } catch (err) {
    console.error("Founder image upload skipped:", err.message);
  }
}





        // =========================
        // CREATE FOUNDER (ALWAYS)
        // =========================
        const founder = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: "founder",
            status: "active",
            userImage, // undefined if no image / failed upload
        });

        return NextResponse.json(
            { message: "Founder registered successfully", founder },
            { status: 201 }
        );
    } catch (error) {
        console.error("Founder register error:", error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
