import mongoose from "mongoose";

/**
 * Admin model — completely isolated from the User/Clerk system.
 * Admins are NOT Clerk users. They authenticate via email+password
 * using a dedicated JWT stored in the admin_token httpOnly cookie.
 */
const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },

    // --- Role & Status ---
    role: {
      type: String,
      enum: ["master_admin", "admin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: [
        "pending_email_verification",
        "pending_approval",
        "active",
        "rejected",
        "suspended",
      ],
      default: "pending_email_verification",
    },
    isMasterAdmin: {
      type: Boolean,
      default: false,
    },

    // --- First login forced password change ---
    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    // --- Email verification ---
    emailVerifyToken: {
      type: String,
      default: null,
    },
    emailVerifyExpiry: {
      type: Date,
      default: null,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    // --- Approval / Rejection ---
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
    },

    // --- Password reset ---
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
    },

    // --- Security / Rate limiting ---
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for fast email lookups
adminSchema.index({ email: 1 });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
