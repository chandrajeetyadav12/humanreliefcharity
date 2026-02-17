import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
  const auth = getAuth(req);
    if (!auth || auth.role !== "founder") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
    //  Check if admin already exists
    // const adminExists = await User.findOne({ role: "admin" });
    // if (adminExists) {
    //   return NextResponse.json(
    //     { message: "Admin already exists" },
    //     { status: 403 }
    //   );
    // }

    // Get body JSON
    const { name, email, password, mobile,adharNumber } = await req.json();

    // Validation
    if (!name || !email || !password || !mobile || !adharNumber) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      adharNumber,
      role: "admin",      // admin role set here
      status: "active",   // always active
    });

    return NextResponse.json(
      { message: "Admin registered successfully", admin },
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
