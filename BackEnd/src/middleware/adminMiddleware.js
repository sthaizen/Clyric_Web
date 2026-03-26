import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

/**
 * adminRoute middleware stack:
 * 1. Clerk authentication (requireAuth)
 * 2. DB lookup to attach req.user
 * 3. Role check — 403 if not admin
 */
export const adminRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in adminRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
