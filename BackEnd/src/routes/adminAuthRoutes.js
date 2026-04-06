import express from "express";
import rateLimit from "express-rate-limit";
import { adminJwtAuth } from "../middleware/adminJwtAuth.js";
import {
  requestAdminAccess,
  verifyAdminEmail,
  resendVerificationCode,
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  getAdminStatus,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/adminAuthController.js";

const router = express.Router();

// ─── Rate Limiters ────────────────────────────────────────────────────────────

const requestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: "Too many admin access requests. Try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: "Too many login attempts. Please wait 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many verification attempts. Please wait." },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: "Too many password reset requests. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Public Routes (no admin auth required) ───────────────────────────────────

// Submit a new admin access application
router.post("/request", requestLimiter, requestAdminAccess);

// Verify email OTP
router.post("/verify-email", verifyLimiter, verifyAdminEmail);

// Resend verification code
router.post("/resend-verification", verifyLimiter, resendVerificationCode);

// Admin login
router.post("/login", loginLimiter, loginAdmin);

// Admin logout (safe to call even without session)
router.post("/logout", logoutAdmin);

// Check application status by email (for applicants)
router.get("/status", getAdminStatus);

// Forgot password
router.post("/forgot-password", forgotLimiter, forgotPassword);

// Reset password with token
router.post("/reset-password", resetPassword);

// ─── Protected Routes (admin must be logged in) ───────────────────────────────

// Get current admin profile
router.get("/me", adminJwtAuth, getAdminMe);

// Change password (used for mustChangePassword flow)
router.post("/change-password", adminJwtAuth, changePassword);

export default router;
