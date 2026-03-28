import express from "express";
import { trackEvent, getDashboardStats, getProblemStats } from "../controllers/analyticsController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireTier } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

// Tracking is allowed for all tiers (used internally)
router.post("/track", trackEvent);

// Viewing analytics requires Interview Studio or higher
router.get("/dashboard/:userId", protectRoute, requireTier("interview-studio"), getDashboardStats);
router.get("/problem/:userId/:problemSlug", protectRoute, requireTier("interview-studio"), getProblemStats);

export default router;
