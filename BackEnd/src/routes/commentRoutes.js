import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
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
router.post("/:problemId", protectRoute, addComment);

// Delete a comment (auth required, only owner)
router.delete("/:commentId", protectRoute, deleteComment);

// Toggle like on a comment (auth required)
router.post("/:commentId/like", protectRoute, toggleLike);

export default router;
