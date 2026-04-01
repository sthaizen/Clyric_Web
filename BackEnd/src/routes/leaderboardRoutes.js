import express from "express";
import { getLeaderboard, getMyRank } from "../controllers/leaderboardController.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Public — anyone can view the leaderboard
router.get("/", getLeaderboard);

// Protected — get the logged-in user's rank
router.get("/me", requireAuth(), getMyRank);

export default router;
