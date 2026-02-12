export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req) {
  try {
        const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Check role
    if (decoded.role !== "admin" && decoded.role !== "founder") {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }
    await dbConnect();

    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({ status: "active", role: "user" });
    const pendingUsers = await User.countDocuments({ status: "pending", role: "user" });
    const rejectedUsers = await User.countDocuments({ status: "rejected", role: "user" });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingUsers,
        rejectedUsers,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
