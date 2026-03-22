import { Router } from "express";
import { requireAuth } from "@clerk/express";
import Submission from "../models/Submission.js";

const router = Router();

// GET /api/submissions/:problemSlug
// Retrieves all accepted submissions for a given problem for the logged-in user
router.get("/:problemSlug", requireAuth(), async (req, res) => {
  try {
    const { problemSlug } = req.params;
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const submissions = await Submission.find({
      userId,
      problemSlug: problemSlug.toLowerCase(),
      verdict: "Accepted"
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error("[getSubmissions] Error fetching submissions:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
