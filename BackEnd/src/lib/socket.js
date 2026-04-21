import { Server } from "socket.io";
import { ENV } from "./env.js";
import Presence from "../models/Presence.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

// Map to track number of active connections per userId
const userConnections = new Map();

export let io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [ENV.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user-connected", async (userId) => {
      // If this socket was already registered with the same user, do nothing
      if (socket.userId === userId) return;

      socket.userId = userId;

      // Join personal notification room (used for unread badge push)
      try {
        const userDoc = await User.findOne({ clerkId: userId }).select("_id").lean();
        if (userDoc) {
          socket.userMongoId = userDoc._id.toString();
          socket.join(`user:${socket.userMongoId}`);
        }
      } catch (e) {
        console.error("Error resolving userMongoId for socket:", e);
      }

      // Increment connection count
      const currentCount = userConnections.get(userId) || 0;
      userConnections.set(userId, currentCount + 1);

      try {
        // Only update DB if this is the first connection
        if (currentCount === 0) {
          await Presence.findOneAndUpdate(
            { userId },
            { status: "online", lastSeen: new Date() },
            { upsert: true }
          );
          console.log(`User ${userId} is now online (Connections: 1)`);
        } else {
          console.log(`User ${userId} connection incremented (Connections: ${currentCount + 1})`);
        }
      } catch (error) {
        console.error("Error updating presence:", error);
      }
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("join-leaderboard", () => {
      socket.join("leaderboard");
    });

    socket.on("leave-leaderboard", () => {
      socket.leave("leaderboard");
    });

    socket.on("code-update", ({ roomId, code }) => {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit("sync-code", code);
    });

    socket.on("language-update", ({ roomId, language }) => {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit("sync-language", language);
    });

    // ─── WebRTC Signaling ─────────────────────────────────────────────────────
    // Pure relay: server never inspects payloads, just forwards to room peers.
    // roomId here is the session callId (already stored on Session model).

    socket.on("join-video-room", async (roomId) => {
      socket.join(roomId);


      const socketsInRoom = await io.in(roomId).allSockets();
      const peersAlreadyPresent = socketsInRoom.size - 1;


      socket.to(roomId).emit("webrtc-peer-joined", { socketId: socket.id });


      if (peersAlreadyPresent > 0) {
        socket.emit("webrtc-peers-present", { count: peersAlreadyPresent });
      }

      console.log(`[WebRTC] ${socket.id} joined video room: ${roomId} (${peersAlreadyPresent} peer(s) already present)`);
    });

    socket.on("webrtc-offer", ({ roomId, offer }) => {

      socket.to(roomId).emit("webrtc-offer", { offer, from: socket.id });
    });

    socket.on("webrtc-answer", ({ roomId, answer }) => {

      socket.to(roomId).emit("webrtc-answer", { answer, from: socket.id });
    });

    socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {

      socket.to(roomId).emit("webrtc-ice-candidate", { candidate, from: socket.id });
    });

    socket.on("webrtc-media-state", ({ roomId, type, isOff }) => {
      socket.to(roomId).emit("webrtc-media-state", { from: socket.id, type, isOff });
    });

    socket.on("webrtc-leave", (roomId) => {
      // Peer explicitly leaving the video call (not just socket disconnect).
      socket.to(roomId).emit("webrtc-peer-left", { socketId: socket.id });
      console.log(`[WebRTC] ${socket.id} left video room: ${roomId}`);
    });

    // ── Hint Delivery ─────────────────────────────────────────────────────────
    // Host sends a hint message; server relays it only to the other peer in the room.
    socket.on("send-hint", ({ roomId, hint }) => {
      if (!roomId || !hint) return;
      socket.to(roomId).emit("receive-hint", { hint });
      console.log(`[Hint] Hint sent in room ${roomId}: "${hint}"`);
    });

    // ── Timer Sync ────────────────────────────────────────────────────────────
    // Host broadcasts timer state changes to the room. Pure relay.
    socket.on("sync-timer", ({ roomId, timerState }) => {
      if (!roomId || !timerState) return;
      socket.to(roomId).emit("receive-timer-sync", timerState);
    });
    // ──────────────────────────────────────────────────────────────────────────

    // ── Chat / Messenger ──────────────────────────────────────────────────────
    // Join a private conversation room (verified against DB)
    socket.on("chat:join-room", async ({ conversationId }) => {
      if (!conversationId) return;
      try {
        // Verify socket owner is a participant of this conversation
        const conversation = await Conversation.findById(conversationId).lean();
        if (!conversation) return;

        const mongoId = socket.userMongoId;
        if (!mongoId) return;

        const isParticipant = conversation.participants
          .map((p) => p.toString())
          .includes(mongoId);

        if (!isParticipant) {
          console.warn(`[Chat] Unauthorized room join attempt by ${socket.userId} for conv ${conversationId}`);
          return;
        }

        socket.join(`chat:${conversationId}`);
        console.log(`[Chat] ${socket.userId} joined chat room: ${conversationId}`);
      } catch (err) {
        console.error("[Chat] chat:join-room error:", err);
      }
    });

    socket.on("chat:leave-room", ({ conversationId }) => {
      if (!conversationId) return;
      socket.leave(`chat:${conversationId}`);
      console.log(`[Chat] ${socket.userId} left chat room: ${conversationId}`);
    });

    socket.on("chat:typing-start", ({ conversationId }) => {
      if (!conversationId || !socket.userId) return;
      socket.to(`chat:${conversationId}`).emit("chat:typing-start", {
        conversationId,
        userId: socket.userId,
        mongoId: socket.userMongoId,
      });
    });

    socket.on("chat:typing-stop", ({ conversationId }) => {
      if (!conversationId || !socket.userId) return;
      socket.to(`chat:${conversationId}`).emit("chat:typing-stop", {
        conversationId,
        userId: socket.userId,
      });
    });
    // ─────────────────────────────────────────────────────────────────────────

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      const userId = socket.userId;

      if (userId) {
        const currentCount = userConnections.get(userId) || 0;
        const newCount = Math.max(0, currentCount - 1);

        if (newCount === 0) {
          userConnections.delete(userId);
          try {
            await Presence.findOneAndUpdate(
              { userId },
              { status: "offline", lastSeen: new Date() }
            );
            console.log(`User ${userId} is now offline (Last connection closed)`);
          } catch (error) {
            console.error("Error updating presence on disconnect:", error);
          }
        } else {
          userConnections.set(userId, newCount);
          console.log(`User ${userId} connection decremented (Connections: ${newCount})`);
        }
      }
    });
  });

  return io;
};

