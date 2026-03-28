import express from "express";
import { getUserQuests, claimQuestReward } from "../controllers/questController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireTier } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

// GET /api/quests/:userId - Requires Code Rooms and above
router.get("/:userId", protectRoute, requireTier("code-rooms"), getUserQuests);

// POST /api/quests/claim - Requires Code Rooms and above
router.post("/claim", protectRoute, requireTier("code-rooms"), claimQuestReward);

export default router;
