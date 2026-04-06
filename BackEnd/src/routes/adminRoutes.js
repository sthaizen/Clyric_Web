import express from "express";
import { adminJwtAuth } from "../middleware/adminJwtAuth.js";
import { adminMasterOnly } from "../middleware/adminMasterOnly.js";
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUser,
  getAdminProblems,
  createAdminProblem,
  updateAdminProblem,
  deleteAdminProblem,
  getActiveSessions,
  getAdminQuests,
  createAdminQuest,
  updateAdminQuest,
  deleteAdminQuest,
  getRecentActivity,
  getAdminTransactions,
  getSubscriptionBreakdown,
  getNotifications,
  createNotification,
  deleteNotification,
  getSystemHealth,
} from "../controllers/adminController.js";
import {
  approveApplicant,
  rejectApplicant,
  suspendAdmin,
  reactivateAdmin,
  listAdminAccounts,
  deleteAdminAccount,
} from "../controllers/adminAuthController.js";

const router = express.Router();

// ─── All routes protected by custom admin JWT (no Clerk) ─────────────────────
router.use(adminJwtAuth);

// Dashboard overview stats
router.get("/stats", getAdminStats);

// Recent activity feed
router.get("/recent-activity", getRecentActivity);

// User management
router.get("/users", getAdminUsers);
router.patch("/users/:id", updateAdminUser);

// Problem management
router.get("/problems", getAdminProblems);
router.post("/problems", createAdminProblem);
router.put("/problems/:slug", updateAdminProblem);
router.delete("/problems/:slug", deleteAdminProblem);

// Session management
router.get("/sessions/active", getActiveSessions);

// Quest management
router.get("/quests", getAdminQuests);
router.post("/quests", createAdminQuest);
router.patch("/quests/:questId", updateAdminQuest);
router.delete("/quests/:questId", deleteAdminQuest);

// Financial management
router.get("/transactions", getAdminTransactions);
router.get("/subscriptions/breakdown", getSubscriptionBreakdown);

// Notifications
router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);
router.delete("/notifications/:id", deleteNotification);

// System health check
router.get("/health", getSystemHealth);

// ─── Admin account management (master admin only) ─────────────────────────────
// List all admin accounts / applicants (optionally filter by ?status=pending_approval)
router.get("/accounts", adminMasterOnly, listAdminAccounts);

// Applicant approval / rejection
router.patch("/applicants/:id/approve", adminMasterOnly, approveApplicant);
router.patch("/applicants/:id/reject", adminMasterOnly, rejectApplicant);

// Admin suspension / reactivation
router.patch("/admins/:id/suspend", adminMasterOnly, suspendAdmin);
router.patch("/admins/:id/reactivate", adminMasterOnly, reactivateAdmin);

// Remove an admin or application entirely
router.delete("/accounts/:id", adminMasterOnly, deleteAdminAccount);

export default router;
