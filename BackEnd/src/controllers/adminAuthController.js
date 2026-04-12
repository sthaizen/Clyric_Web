import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { ENV } from "../lib/env.js";
import {
  sendVerificationEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../lib/emailService.js";

const BCRYPT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 15;
const RESET_EXPIRY_HOURS = 1;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const JWT_EXPIRY = "8h";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateResetToken = () => crypto.randomBytes(32).toString("hex");

const issueAdminJWT = (admin) => {
  return jwt.sign(
    {
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      isMasterAdmin: admin.isMasterAdmin,
    },
    ENV.ADMIN_JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

const setAdminCookie = (res, token) => {
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 8 * 60 * 60 * 1000, // 8 hours in ms
  });
};

// ─── POST /api/admin-auth/request ────────────────────────────────────────────

/**
 * Submit an admin access application.
 * Creates a pending_email_verification Admin document and sends OTP.
 */
export const requestAdminAccess = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password are required." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      // Return a generic message to avoid account enumeration
      return res.status(409).json({
        message:
          "An application with this email already exists. Check your status or contact support.",
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const admin = await Admin.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      status: "pending_email_verification",
      emailVerifyToken: otp,
      emailVerifyExpiry: otpExpiry,
    });

    // 💡 DEV TIP: Print OTP to console in case email sending fails
    console.log(`\n🔑 [DEV MODE] Verification Code for ${admin.email}: ${otp}\n`);

    await sendVerificationEmail(admin.email, otp, admin.fullName);

    res.status(201).json({
      message:
        "Application submitted. Please check your email for the verification code.",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Error in requestAdminAccess:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/verify-email ───────────────────────────────────────

/**
 * Verify the 6-digit OTP sent to the applicant's email.
 * On success: status → pending_approval.
 */
export const verifyAdminEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid email or verification code." });
    }

    if (admin.status !== "pending_email_verification") {
      return res.status(400).json({
        message: `Cannot verify email at current status: ${admin.status}`,
      });
    }

    if (!admin.emailVerifyToken || admin.emailVerifyToken !== code) {
      return res
        .status(400)
        .json({ message: "Invalid verification code." });
    }

    if (!admin.emailVerifyExpiry || new Date() > admin.emailVerifyExpiry) {
      return res
        .status(400)
        .json({ message: "Verification code has expired. Please request a new one." });
    }

    // Mark verified and move to pending_approval
    admin.status = "pending_approval";
    admin.emailVerifiedAt = new Date();
    admin.emailVerifyToken = null;
    admin.emailVerifyExpiry = null;
    await admin.save();

    res.json({
      message:
        "Email verified successfully. Your application is now pending master admin approval.",
    });
  } catch (error) {
    console.error("Error in verifyAdminEmail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/resend-verification ─────────────────────────────────

/**
 * Resend the verification OTP to a pending_email_verification admin.
 */
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || admin.status !== "pending_email_verification") {
      // Generic message to avoid enumeration
      return res.json({
        message:
          "If a pending application exists for this email, a new code has been sent.",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    admin.emailVerifyToken = otp;
    admin.emailVerifyExpiry = otpExpiry;
    await admin.save();

    await sendVerificationEmail(admin.email, otp, admin.fullName);

    res.json({
      message:
        "If a pending application exists for this email, a new code has been sent.",
    });
  } catch (error) {
    console.error("Error in resendVerificationCode:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/login ──────────────────────────────────────────────

/**
 * Admin login — only active admins can log in.
 * Issues an admin_token httpOnly cookie on success.
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check lockout
    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const minutesLeft = Math.ceil(
        (admin.lockedUntil - new Date()) / 60000
      );
      return res.status(429).json({
        message: `Account temporarily locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      });
    }

    // Check status before password verification (avoids timing attacks on inactive accounts)
    if (admin.status !== "active") {
      const statusMessages = {
        pending_email_verification:
          "Please verify your email before logging in.",
        pending_approval:
          "Your application is pending master admin approval.",
        rejected:
          "Your admin access request was not approved. Contact support for details.",
        suspended:
          "Your admin account has been suspended. Contact the master admin.",
      };
      return res.status(403).json({
        message: statusMessages[admin.status] || "Access denied.",
        status: admin.status,
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatch) {
      // Increment failed attempts
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockedUntil = new Date(
          Date.now() + LOCKOUT_MINUTES * 60 * 1000
        );
        admin.loginAttempts = 0;
      }
      await admin.save();

      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Successful login — reset lockout state
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    admin.lastLoginAt = new Date();
    await admin.save();

    const token = issueAdminJWT(admin);
    setAdminCookie(res, token);

    res.json({
      message: "Login successful.",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        isMasterAdmin: admin.isMasterAdmin,
        mustChangePassword: admin.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/logout ─────────────────────────────────────────────

/**
 * Clear the admin_token cookie. Safe to call even if not logged in.
 */
export const logoutAdmin = async (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ message: "Logged out successfully." });
};

// ─── GET /api/admin-auth/me ───────────────────────────────────────────────────

/**
 * Returns the current logged-in admin's profile.
 * Protected by adminJwtAuth middleware (req.admin is set).
 */
export const getAdminMe = async (req, res) => {
  const admin = req.admin;
  res.json({
    id: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role,
    isMasterAdmin: admin.isMasterAdmin,
    mustChangePassword: admin.mustChangePassword,
    lastLoginAt: admin.lastLoginAt,
    status: admin.status,
  });
};

// ─── GET /api/admin-auth/status ──────────────────────────────────────────────

/**
 * Public endpoint — allows an applicant to check their application status
 * by providing their email. Returns status only (no sensitive data).
 */
export const getAdminStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "status fullName emailVerifiedAt rejectionReason createdAt"
    ).lean();

    if (!admin) {
      return res
        .status(404)
        .json({ message: "No application found for this email." });
    }

    res.json({
      status: admin.status,
      fullName: admin.fullName,
      emailVerifiedAt: admin.emailVerifiedAt,
      rejectionReason:
        admin.status === "rejected" ? admin.rejectionReason : undefined,
      appliedAt: admin.createdAt,
    });
  } catch (error) {
    console.error("Error in getAdminStatus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/forgot-password ────────────────────────────────────

/**
 * Send password reset email for active admins only.
 * Generic response to prevent account enumeration.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Always return generic response regardless of whether email exists
    const GENERIC_MSG =
      "If an active admin account exists for this email, a reset link has been sent.";

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
      status: "active",
    });

    if (!admin) {
      return res.json({ message: GENERIC_MSG });
    }

    // If there's already a non-expired reset token, don't spam
    if (admin.passwordResetExpiry && new Date() < admin.passwordResetExpiry) {
      return res.json({ message: GENERIC_MSG });
    }

    const token = generateResetToken();
    const expiry = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

    admin.passwordResetToken = token;
    admin.passwordResetExpiry = expiry;
    await admin.save();

    await sendPasswordResetEmail(admin.email, token, admin.fullName);

    res.json({ message: GENERIC_MSG });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/reset-password ─────────────────────────────────────

/**
 * Complete password reset using the token from the reset email.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });
    }

    const admin = await Admin.findOne({
      passwordResetToken: token,
      status: "active",
    });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    if (!admin.passwordResetExpiry || new Date() > admin.passwordResetExpiry) {
      return res
        .status(400)
        .json({ message: "Reset token has expired. Please request a new one." });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    admin.passwordResetToken = null;
    admin.passwordResetExpiry = null;
    admin.mustChangePassword = false;
    // Reset any lockout on password change
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    await admin.save();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin-auth/change-password ────────────────────────────────────

/**
 * Authenticated password change (used for mustChangePassword flow).
 * Protected by adminJwtAuth middleware.
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = req.admin;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters." });
    }

    // Re-fetch admin to get passwordHash which is excluded by the middleware
    const adminWithPassword = await Admin.findById(admin._id);
    if (!adminWithPassword) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const match = await bcrypt.compare(currentPassword, adminWithPassword.passwordHash);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different from the current password." });
    }

    adminWithPassword.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    adminWithPassword.mustChangePassword = false;
    adminWithPassword.loginAttempts = 0;
    adminWithPassword.lockedUntil = null;
    await adminWithPassword.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── PATCH /api/admin/applicants/:id/approve ─────────────────────────────────

/**
 * Master admin: approve a pending_approval applicant.
 */
export const approveApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const masterAdmin = req.admin;

    const applicant = await Admin.findById(id);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found." });
    }

    if (applicant.status !== "pending_approval") {
      return res.status(400).json({
        message: `Cannot approve admin with status: ${applicant.status}`,
      });
    }

    applicant.status = "active";
    applicant.approvedBy = masterAdmin._id;
    applicant.approvedAt = new Date();
    applicant.rejectionReason = "";
    await applicant.save();

    await sendApprovalEmail(applicant.email, applicant.fullName);

    res.json({
      message: `${applicant.fullName} has been approved and can now log in.`,
      admin: {
        id: applicant._id,
        fullName: applicant.fullName,
        email: applicant.email,
        status: applicant.status,
      },
    });
  } catch (error) {
    console.error("Error in approveApplicant:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── PATCH /api/admin/applicants/:id/reject ──────────────────────────────────

/**
 * Master admin: reject a pending_approval applicant with optional reason.
 */
export const rejectApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const applicant = await Admin.findById(id);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found." });
    }

    if (
      applicant.status !== "pending_approval" &&
      applicant.status !== "pending_email_verification"
    ) {
      return res.status(400).json({
        message: `Cannot reject admin with status: ${applicant.status}`,
      });
    }

    applicant.status = "rejected";
    applicant.rejectedAt = new Date();
    applicant.rejectionReason = reason || "";
    await applicant.save();

    await sendRejectionEmail(applicant.email, applicant.fullName, reason);

    res.json({
      message: `${applicant.fullName}'s application has been rejected.`,
    });
  } catch (error) {
    console.error("Error in rejectApplicant:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── PATCH /api/admin/admins/:id/suspend ─────────────────────────────────────

/**
 * Master admin: suspend an active admin.
 */
export const suspendAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const masterAdmin = req.admin;

    if (id === masterAdmin._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot suspend yourself." });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (admin.isMasterAdmin) {
      return res
        .status(403)
        .json({ message: "Cannot suspend another master admin." });
    }

    if (admin.status !== "active") {
      return res
        .status(400)
        .json({ message: `Admin is not active. Current status: ${admin.status}` });
    }

    admin.status = "suspended";
    await admin.save();

    res.json({ message: `${admin.fullName} has been suspended.` });
  } catch (error) {
    console.error("Error in suspendAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── PATCH /api/admin/admins/:id/reactivate ──────────────────────────────────

/**
 * Master admin: reactivate a suspended admin.
 */
export const reactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (admin.status !== "suspended") {
      return res
        .status(400)
        .json({ message: `Admin is not suspended. Current status: ${admin.status}` });
    }

    admin.status = "active";
    await admin.save();

    res.json({ message: `${admin.fullName} has been reactivated.` });
  } catch (error) {
    console.error("Error in reactivateAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── GET /api/admin/applicants ───────────────────────────────────────────────

/**
 * Master admin: list all applicants/admins with optional status filter.
 */
export const listAdminAccounts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const admins = await Admin.find(filter)
      .select("-passwordHash -emailVerifyToken -passwordResetToken")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ admins });
  } catch (error) {
    console.error("Error in listAdminAccounts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Master admin: permanently delete an admin account or application.
 */
export const deleteAdminAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const masterAdmin = req.admin;

    if (id === masterAdmin._id.toString()) {
      return res.status(400).json({ message: "Cannot delete yourself." });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Account not found." });
    }

    if (admin.isMasterAdmin) {
      return res.status(403).json({ message: "Cannot delete another master admin." });
    }

    await Admin.findByIdAndDelete(id);
    res.json({ message: `${admin.fullName}'s account has been permanently removed.` });
  } catch (error) {
    console.error("Error in deleteAdminAccount:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
