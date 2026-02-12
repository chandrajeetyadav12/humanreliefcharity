import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(auth.userId).select(
    "name role status"
  );

  return NextResponse.json({ user });
}
