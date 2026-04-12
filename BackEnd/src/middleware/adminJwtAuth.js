import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { ENV } from "../lib/env.js";

/**
 * adminJwtAuth.js
 *
 * Custom JWT middleware for ALL /api/admin/* protected routes.
 * Reads the admin_token httpOnly cookie — completely separate from Clerk.
 * Does NOT touch protectRoute.js or any normal user auth.
 *
 * Sets req.admin on success.
 */
export const adminJwtAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        message: "Admin authentication required. Please log in to the admin portal.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, ENV.ADMIN_JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Admin session expired. Please log in again.",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        message: "Invalid admin session. Please log in again.",
        code: "TOKEN_INVALID",
      });
    }

    // Re-fetch from DB on every request to catch status changes (suspension, etc.)
    const admin = await Admin.findById(decoded.adminId).select(
      "-passwordHash -emailVerifyToken -passwordResetToken"
    ).lean();

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not found. Please log in again.",
      });
    }

    if (admin.status !== "active") {
      // Clear the stale cookie
      res.clearCookie("admin_token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "strict",
      });
      return res.status(403).json({
        message: "Admin account is no longer active.",
        status: admin.status,
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in adminJwtAuth:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
