import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    await dbConnect();

    const formData = await request.formData();
    const role = formData.get("role") || "user";


    // REQUIRED FIELDS
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const mobile = formData.get("mobile");
    const transactionId = formData.get("transactionId");
    const acceptTerms = formData.get("acceptTerms");

    if (!name || !email || !password || !mobile) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }
    // Required ONLY for user
    if (role === "user") {
      if (!transactionId || acceptTerms !== "true") {
        return NextResponse.json(
          { message: "Transaction ID and Accept Terms are required for users" },
          { status: 400 }
        );
      }
    }
    const referralCodeRaw = formData.get("referralCode");
    const referralCode =
      referralCodeRaw && referralCodeRaw.trim() !== ""
        ? referralCodeRaw.trim()
        : undefined;

    if (referralCode && !/^\d{8}$/.test(referralCode)) {
      return NextResponse.json(
        { message: "Referral code must be 8 digits" },
        { status: 400 }
      );
    }

    // OPTIONAL FIELD VALIDATION
    const adharNumberRaw = formData.get("adharNumber");
    const adharNumber =
      adharNumberRaw && adharNumberRaw.trim() !== ""
        ? adharNumberRaw.trim()
        : undefined;
    if (adharNumber && !/^\d{12}$/.test(adharNumber)) {
      return NextResponse.json(
        { message: "Aadhaar number must be 12 digits" },
        { status: 400 }
      );
    }
    if (adharNumber) {
      const adharExists = await User.findOne({ adharNumber });
      if (adharExists) {
        return NextResponse.json(
          { message: "Aadhaar already registered" },
          { status: 400 }
        );
      }
    }
    // UNIQUE CHECKS
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    if (referralCode) {
      const exists = await User.findOne({ referralCode });
      if (exists) {
        return NextResponse.json(
          { message: "Referral code already used" },
          { status: 400 }
        );
      }
    }


    // FILE UPLOAD (OPTIONAL)
    let paymentReceipt = undefined;
    const file = formData.get("paymentReceipt");

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "receipts" }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      paymentReceipt = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    // PASSWORD HASH
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
      transactionId: role === "user" ? transactionId : undefined,
      acceptTerms: role === "user" ? acceptTerms === "true" : undefined,
      referralCode,

      // OPTIONAL FIELDS
      adharNumber, // <--- added here
      fatherorhusbandname: formData.get("fatherorhusbandname"),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      occupation: formData.get("occupation"),
      governmentDepartment: formData.get("governmentDepartment"),
      officeNameAddress: formData.get("officeNameAddress"),
      state: formData.get("state"),
      district: formData.get("district"),
      permanentAddress: formData.get("permanentAddress"),
      nomineeName: formData.get("nomineeName"),
      nomineeRelation: formData.get("nomineeRelation"),
      nomineeMobile: formData.get("nomineeMobile"),

      paymentReceipt,
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
