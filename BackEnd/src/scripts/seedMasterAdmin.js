/**
 * seedMasterAdmin.js
 *
 * Bootstrap script — creates the initial master admin account.
 *
 * ⚠️  SECURITY WARNING:
 *     The default bootstrap password is "admin123".
 *     mustChangePassword is set to TRUE — the master admin MUST change
 *     this password immediately on first login before using the dashboard.
 *     NEVER leave admin123 as the production password.
 *
 * Usage:
 *   node src/scripts/seedMasterAdmin.js
 *
 * Optional env override:
 *   MASTER_ADMIN_EMAIL=you@example.com node src/scripts/seedMasterAdmin.js
 *
 * Idempotent — running this twice does nothing on the second run.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ENV } from "../lib/env.js";
import Admin from "../models/Admin.js";

const MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL || "admin@clyric.com";
const BOOTSTRAP_PASSWORD = "admin123";
const BCRYPT_ROUNDS = 12;

const seed = async () => {
  try {
    console.log("\n🔗 Connecting to database...");
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected.\n");

    // Check if a master admin already exists
    const existing = await Admin.findOne({ isMasterAdmin: true });

    if (existing) {
      console.log(
        `ℹ️  Master admin already exists: ${existing.email} (status: ${existing.status})`
      );
      console.log(
        "   No changes made. Seed is idempotent — run it only once.\n"
      );
      await mongoose.disconnect();
      process.exit(0);
    }

    // Also check by email in case isMasterAdmin flag was lost
    const byEmail = await Admin.findOne({ email: MASTER_EMAIL.toLowerCase() });
    if (byEmail) {
      console.log(`ℹ️  Admin with email ${MASTER_EMAIL} already exists (ID: ${byEmail._id}).`);
      console.log("   Promoting to master admin...");
      byEmail.isMasterAdmin = true;
      byEmail.role = "master_admin";
      byEmail.status = "active";
      byEmail.mustChangePassword = true;
      await byEmail.save();
      console.log("✅ Done. Please log in and change the password immediately.\n");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`📧 Creating master admin with email: ${MASTER_EMAIL}`);
    const passwordHash = await bcrypt.hash(BOOTSTRAP_PASSWORD, BCRYPT_ROUNDS);

    const masterAdmin = await Admin.create({
      fullName: "Master Admin",
      email: MASTER_EMAIL.toLowerCase(),
      passwordHash,
      role: "master_admin",
      status: "active",
      isMasterAdmin: true,
      mustChangePassword: true,        // ← Forces password change on first login
      emailVerifiedAt: new Date(),     // ← Pre-verified (seed bypasses email step)
    });

    console.log("\n✅ Master admin seeded successfully!");
    console.log("─────────────────────────────────────────────");
    console.log(`   Email    : ${masterAdmin.email}`);
    console.log(`   Password : ${BOOTSTRAP_PASSWORD}  ⚠️  CHANGE THIS IMMEDIATELY`);
    console.log(`   Status   : ${masterAdmin.status}`);
    console.log(`   DB ID    : ${masterAdmin._id}`);
    console.log("─────────────────────────────────────────────");
    console.log("\n⚠️  ACTION REQUIRED:");
    console.log("   1. Go to /admin/login");
    console.log(`   2. Login with: ${MASTER_EMAIL} / ${BOOTSTRAP_PASSWORD}`);
    console.log("   3. You will be forced to set a new secure password before accessing the dashboard.");
    console.log("   4. Never use 'admin123' in production.\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
