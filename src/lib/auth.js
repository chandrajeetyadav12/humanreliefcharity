import jwt from "jsonwebtoken";

export function getAuth(req) {
  try {
    // Read token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET environment variable is not set");
      throw new Error("Server configuration error");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      userId: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}
