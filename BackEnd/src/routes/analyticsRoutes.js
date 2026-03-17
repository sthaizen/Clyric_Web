import express from "express";
import { trackEvent, getDashboardStats, getProblemStats } from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/track", trackEvent);
router.get("/dashboard/:userId", getDashboardStats);
router.get("/problem/:userId/:problemSlug", getProblemStats);

export default router;
