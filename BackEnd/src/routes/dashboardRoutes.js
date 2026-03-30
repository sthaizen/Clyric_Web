import express from "express";
import { getDashboardData, getRecommendedPeers, getNotifications } from "../controllers/dashboardController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/peers/recommended", protectRoute, getRecommendedPeers);
router.get("/notifications", getNotifications);
router.get("/:userId", getDashboardData);

export default router;
