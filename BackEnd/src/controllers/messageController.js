import Session from "../models/Session.js";
import User from "../models/User.js";
import Presence from "../models/Presence.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { io } from "../lib/socket.js";

// ─── Helper: verify both users share at least one Session ────────────────────
async function shareSession(userIdA, userIdB) {
  // Developer bypass: allow chatting with anyone in development
  if (process.env.NODE_ENV !== "production") return true;

  const session = await Session.findOne({
    $or: [
      { host: userIdA, participant: userIdB },
      { host: userIdB, participant: userIdA },
    ],
  }).lean();
  return !!session;
}

// ─── Helper: get sorted participant pair (prevents duplicate conversations) ──
function sortedPair(a, b) {
  return [a, b].sort((x, y) => x.toString().localeCompare(y.toString()));
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/messages/eligible-peers
// Returns users who share at least one Session with the current user
// ─────────────────────────────────────────────────────────────────────────────
export const getEligiblePeers = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [{ host: userId }, { participant: userId }],
      status: "completed"
    }).sort({ createdAt: -1 });

    const peersMap = new Map();

    for (const session of sessions) {
      if (!session.host) continue; // safety check
      const isHost = session.host.toString() === userId.toString();
      const peerId = isHost ? session.participant : session.host;

      if (!peerId) continue;

      const peerIdStr = peerId.toString();
      if (!peersMap.has(peerIdStr)) {
        peersMap.set(peerIdStr, peerId);
      }
    }

    const peerIds = Array.from(peersMap.values());
    
    // 2. Fetch User profiles
    const users = await User.find({ _id: { $in: peerIds } });
    
    const clerkIds = users.filter(u => u.clerkId).map(u => u.clerkId);
    let presences = [];
    try {
      presences = await Presence.find({ userId: { $in: clerkIds } });
    } catch(e) {
      console.log("Presence error ignored");
    }
    
    const presenceMap = new Map();
    presences.forEach(p => presenceMap.set(p.userId, p.status));

    const result = users.map(user => {
      return {
        id: user._id,
        name: user.nickname || user.name || "Unknown",
        avatar: user.profileImage || "",
        isOnline: presenceMap.get(user.clerkId) === "online",
      };
    });

    res.status(200).json({ peers: result });
  } catch (error) {
    console.error("Error fetching eligible peers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/messages/conversations
// Body: { peerId }
// Finds or creates a conversation between current user and peer
// Enforces eligibility (shared session required)
// ─────────────────────────────────────────────────────────────────────────────
export const getOrCreateConversation = async (req, res) => {
  try {
    const myId = req.user._id;
    const { peerId } = req.body;

    if (!peerId) {
      return res.status(400).json({ message: "peerId is required" });
    }

    // Verify both users share a session
    const eligible = await shareSession(myId, peerId);
    if (!eligible) {
      return res.status(403).json({
        message: "You can only chat with users you have shared an interview session with.",
      });
    }

    const pair = sortedPair(myId.toString(), peerId.toString());

    // Find existing conversation (match both participants exactly)
    let conversation = await Conversation.findOne({
      participants: { $all: pair, $size: 2 },
    }).populate("participants", "name nickname profileImage clerkId");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: pair,
        unreadCounts: { [myId.toString()]: 0, [peerId.toString()]: 0 },
      });
      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name nickname profileImage clerkId"
      );
    }

    // Attach presence data
    const clerkIds = conversation.participants.map((p) => p.clerkId).filter(Boolean);
    const presences = await Presence.find({ userId: { $in: clerkIds } }).lean();
    const presenceMap = new Map(presences.map((p) => [p.userId, p.status]));

    const conversationObj = conversation.toObject();
    conversationObj.participants = conversationObj.participants.map((p) => ({
      ...p,
      isOnline: presenceMap.get(p.clerkId) === "online",
    }));

    res.status(200).json({ conversation: conversationObj });
  } catch (error) {
    console.error("getOrCreateConversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/messages/conversations
// Returns all conversations for the current user with last message + unread
// ─────────────────────────────────────────────────────────────────────────────
export const getConversations = async (req, res) => {
  try {
    const myId = req.user._id;

    const conversations = await Conversation.find({
      participants: myId,
    })
      .populate("participants", "name nickname profileImage clerkId")
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    // Attach presence + format unread
    const allClerkIds = conversations
      .flatMap((c) => c.participants.map((p) => p.clerkId))
      .filter(Boolean);

    const presences = await Presence.find({ userId: { $in: allClerkIds } }).lean();
    const presenceMap = new Map(presences.map((p) => [p.userId, p.status]));

    const result = conversations.map((conv) => {
      const myUnread = conv.unreadCounts
        ? (conv.unreadCounts[myId.toString()] || 0)
        : 0;

      return {
        ...conv,
        unreadCount: myUnread,
        participants: conv.participants.map((p) => ({
          ...p,
          isOnline: presenceMap.get(p.clerkId) === "online",
        })),
      };
    });

    res.status(200).json({ conversations: result });
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/messages/conversations/:id
// Returns paginated messages for a conversation (most recent first)
// Query params: page (default 1), limit (default 40)
// ─────────────────────────────────────────────────────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 40, 100);
    const skip = (page - 1) * limit;

    // Verify user is a participant
    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const isParticipant = conversation.participants
      .map((p) => p.toString())
      .includes(myId.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name nickname profileImage clerkId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Message.countDocuments({ conversation: conversationId });

    res.status(200).json({
      messages: messages.reverse(), // Return chronological order
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/messages/conversations/:id/send
// Body: { content }
// Creates a message, updates conversation, emits socket event
// ─────────────────────────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Verify participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const participantStrs = conversation.participants.map((p) => p.toString());
    if (!participantStrs.includes(myId.toString())) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: myId,
      content: content.trim(),
      readBy: [myId],
    });

    // Update conversation last message
    const updatedUnread = { ...(Object.fromEntries(conversation.unreadCounts || new Map())) };
    for (const pId of participantStrs) {
      if (pId !== myId.toString()) {
        updatedUnread[pId] = (updatedUnread[pId] || 0) + 1;
      }
    }
    // Reset sender's unread
    updatedUnread[myId.toString()] = 0;

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content.trim().slice(0, 100),
      lastMessageAt: new Date(),
      lastMessageSender: myId,
      unreadCounts: updatedUnread,
    });

    // Populate sender for socket payload
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name nickname profileImage clerkId")
      .lean();

    // Emit to conversation room
    if (io) {
      io.to(`chat:${conversationId}`).emit("chat:new-message", {
        conversationId,
        message: populatedMessage,
      });

      // Notify each participant's personal room so they can update unread badge
      for (const pId of participantStrs) {
        if (pId !== myId.toString()) {
          io.to(`user:${pId}`).emit("chat:conversation-updated", {
            conversationId,
            lastMessage: content.trim().slice(0, 100),
            lastMessageAt: new Date(),
            unreadIncrement: true,
          });
        }
      }
    }

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/messages/conversations/:id/read
// Marks all messages as read for the current user in this conversation
// ─────────────────────────────────────────────────────────────────────────────
export const markRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    if (!conversation.participants.map((p) => p.toString()).includes(myId.toString())) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Reset unread count for current user
    const updatedUnread = Object.fromEntries(conversation.unreadCounts || new Map());
    updatedUnread[myId.toString()] = 0;

    await Conversation.findByIdAndUpdate(conversationId, {
      unreadCounts: updatedUnread,
    });

    // Mark messages as read in DB
    await Message.updateMany(
      { conversation: conversationId, readBy: { $ne: myId } },
      { $addToSet: { readBy: myId } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("markRead error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
