import express from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/noteController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/:problemId", getNotes);
router.post("/:problemId", createNote);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
