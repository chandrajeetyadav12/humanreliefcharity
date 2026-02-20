import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { uploadToS3 } from "@/lib/s3Upload";
import { rajasthanDistricts } from "@/constants/rajasthanDistricts";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    await dbConnect();

    const formData = await request.formData();
    const role = formData.get("role") || "user";

    const district = formData.get("district");

    // Force state
    const state = "Rajasthan";

    // Validate district
    if (!district || !rajasthanDistricts.includes(district)) {
      return NextResponse.json(
        { message: "Invalid district selected" },
        { status: 400 }
      );
    }

    // REQUIRED FIELDS
    const name = formData.get("name");
    // const email = formData.get("email");
    const password = formData.get("password");
    const mobile = formData.get("mobile");
    const transactionId = formData.get("transactionId");
    const acceptTerms = formData.get("acceptTerms");
    const block = formData.get("block");
    const adharNumber = formData.get("adharNumber");

    if (!name || !adharNumber || !password) {
      return NextResponse.json(
        { message: "Name, Password and Aadhaar are required" },
        { status: 400 }
      );
    }


    if (!/^\d{12}$/.test(adharNumber)) {
      return NextResponse.json(
        { message: "Aadhaar must be 12 digits" },
        { status: 400 }
      );
    }

    const adharExists = await User.findOne({ adharNumber });
    if (adharExists) {
      return NextResponse.json(
        { message: "Aadhaar already registered" },
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


    // UNIQUE CHECKS
    const emailRaw = formData.get("email");
    let email;

    if (emailRaw) {
      const trimmed = emailRaw.trim().toLowerCase();
      if (trimmed !== "" && trimmed !== "undefined" && trimmed !== "null") {
        email = trimmed;
      }
    }

    // Only check uniqueness if email is valid
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 }
        );
      }
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
    // USER PROFILE IMAGE (OPTIONAL)
    let userImage = undefined;
    const imageFile = formData.get("userImage");

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await uploadToS3(
        buffer,
        "user_profiles",
        imageFile.type
      );

      userImage = {
        key: uploadResult.key,
        url: uploadResult.url,
      };
    }

    // let userImage = undefined;
    // FILE UPLOAD (OPTIONAL)
    let paymentReceipt = undefined;
    const file = formData.get("paymentReceipt");

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await uploadToS3(
        buffer,
        "receipts",
        file.type
      );

      paymentReceipt = {
        key: uploadResult.key,
        url: uploadResult.url,
      };
    }


    // PASSWORD HASH
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      password: hashedPassword,
      mobile,
      role,
      block,
      transactionId: role === "user" ? transactionId : undefined,
      acceptTerms: role === "user" ? acceptTerms === "true" : undefined,
      referralCode,
      adharNumber,
      fatherorhusbandname: formData.get("fatherorhusbandname"),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      occupation: formData.get("occupation"),
      governmentDepartment: formData.get("governmentDepartment"),
      officeNameAddress: formData.get("officeNameAddress"),
      state,
      district,
      permanentAddress: formData.get("permanentAddress"),
      nomineeName: formData.get("nomineeName"),
      nomineeRelation: formData.get("nomineeRelation"),
      nomineeMobile: formData.get("nomineeMobile"),
      paymentReceipt,
      userImage
    };

    // Only add email if valid
    if (email) {
      userData.email = email;
    }

    const user = await User.create(userData);

    // const user = await User.create({
    //   name,

    //   password: hashedPassword,
    //   mobile,
    //   role,
    //   block: role === "user" ? block : undefined,
    //   transactionId: role === "user" ? transactionId : undefined,
    //   acceptTerms: role === "user" ? acceptTerms === "true" : undefined,
    //   referralCode,

    //   // OPTIONAL FIELDS
    //   adharNumber, // <--- added here
    //   fatherorhusbandname: formData.get("fatherorhusbandname"),
    //   dob: formData.get("dob"),
    //   gender: formData.get("gender"),
    //   occupation: formData.get("occupation"),
    //   governmentDepartment: formData.get("governmentDepartment"),
    //   officeNameAddress: formData.get("officeNameAddress"),
    //   state,
    //   district,
    //   permanentAddress: formData.get("permanentAddress"),
    //   nomineeName: formData.get("nomineeName"),
    //   nomineeRelation: formData.get("nomineeRelation"),
    //   nomineeMobile: formData.get("nomineeMobile"),

    //   paymentReceipt,
    //   userImage
    // });
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.adharNumber;
    return NextResponse.json(
      { message: "User registered successfully", user: userObj },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
