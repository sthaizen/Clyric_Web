import express from "express";
import { getProblems, getProblemBySlug, getTopicMetadata } from "../controllers/problemController.js";

const router = express.Router();

router.get("/meta/topics", getTopicMetadata);
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);

export default router;
