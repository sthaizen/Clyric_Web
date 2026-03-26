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
  getRecentActivity,
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
router.get("/sessions/active", getActiveSessions);

// Quest management
router.get("/quests", getAdminQuests);
router.post("/quests", createAdminQuest);

export default router;
