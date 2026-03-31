import express from "express";
import { adminRoute } from "../middleware/adminMiddleware.js";
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

const router = express.Router();

// All routes are protected by adminRoute middleware
router.use(adminRoute);

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

export default router;
