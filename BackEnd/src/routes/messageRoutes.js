import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getEligiblePeers,
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markRead,
} from "../controllers/messageController.js";

const router = express.Router();

// All routes are protected — user must be authenticated via Clerk
router.get("/eligible-peers", protectRoute, getEligiblePeers);

router.post("/conversations", protectRoute, getOrCreateConversation);
router.get("/conversations", protectRoute, getConversations);

router.get("/conversations/:id", protectRoute, getMessages);
router.post("/conversations/:id/send", protectRoute, sendMessage);
router.post("/conversations/:id/read", protectRoute, markRead);

export default router;
