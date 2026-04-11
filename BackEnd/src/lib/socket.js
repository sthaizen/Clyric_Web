import { Server } from "socket.io";
import { ENV } from "./env.js";
import Presence from "../models/Presence.js";

// Map to track number of active connections per userId
const userConnections = new Map();

export let io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [ENV.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user-connected", async (userId) => {
      // If this socket was already registered with the same user, do nothing
      if (socket.userId === userId) return;

      socket.userId = userId;
      
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

      // Count peers already in the room (subtract self).
      const socketsInRoom = await io.in(roomId).allSockets();
      const peersAlreadyPresent = socketsInRoom.size - 1;

      // Notify existing peers that someone new joined.
      socket.to(roomId).emit("webrtc-peer-joined", { socketId: socket.id });

      // Tell the joining socket about pre-existing peers.
      // This lets the host create an offer even if the participant joined first.
      if (peersAlreadyPresent > 0) {
        socket.emit("webrtc-peers-present", { count: peersAlreadyPresent });
      }

      console.log(`[WebRTC] ${socket.id} joined video room: ${roomId} (${peersAlreadyPresent} peer(s) already present)`);
    });

    socket.on("webrtc-offer", ({ roomId, offer }) => {
      // Forward SDP offer to all other peers in the room.
      socket.to(roomId).emit("webrtc-offer", { offer, from: socket.id });
    });

    socket.on("webrtc-answer", ({ roomId, answer }) => {
      // Forward SDP answer to all other peers in the room.
      socket.to(roomId).emit("webrtc-answer", { answer, from: socket.id });
    });

    socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
      // Relay ICE candidates to peers.
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
    // ──────────────────────────────────────────────────────────────────────────

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

