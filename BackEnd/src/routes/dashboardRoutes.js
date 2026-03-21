import express from "express";
import { getDashboardData, getRecommendedPeers } from "../controllers/dashboardController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/peers/recommended", protectRoute, getRecommendedPeers);
router.get("/:userId", getDashboardData);

export default router;
