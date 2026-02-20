import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
// import { uploadToS3 } from "@/lib/uploadToS3"; 
import { uploadToS3 } from "@/lib/s3Upload";

export async function POST(request) {
  try {
    await dbConnect();

    // Only ONE founder allowed
    const founderExists = await User.findOne({ role: "founder" });
    if (founderExists) {
      return NextResponse.json(
        { message: "Founder already registered" },
        { status: 403 }
      );
    }

    // Must be multipart/form-data
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
    // OPTIONAL IMAGE (AWS S3)
    // =========================
    let userImage = undefined;
    const imageFile = formData.get("userImage");

    if (imageFile && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = imageFile.type;

        const uploadResult = await uploadToS3(buffer, "founder_profiles", mimeType);

        userImage = {
          key: uploadResult.key,
          url: uploadResult.url,
        };
      } catch (err) {
        // Image upload failed, continue without image
      }
    }

    // =========================
    // CREATE FOUNDER
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
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
