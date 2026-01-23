import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { identifier, password } = await req.json();
    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email/Aadhaar and password required" },
        { status: 400 }
      );
    }

    //  NEW: detect email or Aadhaar
    let user;
    if (/^\d{12}$/.test(identifier)) {
      // Aadhaar login
      user = await User.findOne({ adharNumber: identifier });
    } else {
      // Email login
      user = await User.findOne({ email: identifier });
    }
    //  BLOCK USER LOGIN IF NOT ACTIVE (ADMIN ALWAYS ALLOWED)
    if (user.role === "user" && user.status !== "active") {
      return NextResponse.json(
        { message: "Your account is not verified by admin yet" },
        { status: 403 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ user });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
