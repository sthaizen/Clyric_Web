import express from "express";
import { getUserQuests, claimQuestReward } from "../controllers/questController.js";

const router = express.Router();

// GET /api/quests/:userId
router.get("/:userId", getUserQuests);

// POST /api/quests/claim
router.post("/claim", claimQuestReward);

export default router;
