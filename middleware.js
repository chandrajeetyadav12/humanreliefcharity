import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Ensure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Not admin + founder allowed
    if (!["admin", "founder"].includes(decoded.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware JWT verification error:", err.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Only protect admin routes
export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/founder/:path*"],
};
