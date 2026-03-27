import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getComments,
  addComment,
  deleteComment,
  toggleLike,
} from "../controllers/commentController.js";

const router = express.Router();

// Get all comments + replies for a problem
router.get("/:problemId", getComments);

// Add a comment or reply (auth required)
router.post("/:problemId", requireAuth(), addComment);

// Delete a comment (auth required, only owner)
router.delete("/:commentId", requireAuth(), deleteComment);

// Toggle like on a comment (auth required)
router.post("/:commentId/like", requireAuth(), toggleLike);

export default router;
