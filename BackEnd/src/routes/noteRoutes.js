import express from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/noteController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireFeature } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

// Notes require Interview Studio or Career Plus
router.use(protectRoute);
router.use(requireFeature("canUseNotes"));

router.get("/:problemId", getNotes);
router.post("/:problemId", createNote);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
