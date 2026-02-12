export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/* =======================
    AUTH HELPER
======================= */
function getAuth(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
}

/* =======================
    VIEW USER (ADMIN + FOUNDER)
======================= */
export async function GET(req, { params }) {
    try {
        await dbConnect();

        const auth = getAuth(req);
        if (!auth || !["admin", "founder"].includes(auth.role)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

/* =======================
    EDIT / CORRECTION
   (ADMIN + FOUNDER)
======================= */
export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const auth = getAuth(req);
    if (!auth || !["admin", "founder"].includes(auth.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const allowedFields = [
      "name",
      "email",
      "password",
      "mobile",
      "nomineeName",
      "nomineeRelation",
      "nomineeMobile",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const { id } =await params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


/* =======================
 DELETE USER
   (FOUNDER ONLY)
======================= */
export async function DELETE(req, { params }) {
    try {
        await dbConnect();

        const auth = getAuth(req);
        if (!auth || auth.role !== "founder") {
            return NextResponse.json(
                { message: "Only founder can delete users" },
                { status: 403 }
            );
        }
        const { id } = await params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (err) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
