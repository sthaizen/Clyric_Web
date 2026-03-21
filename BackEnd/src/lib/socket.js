import { Server } from "socket.io";
import { ENV } from "./env.js";
import Presence from "../models/Presence.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [ENV.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user-connected", async (userId) => {
      socket.userId = userId;
      try {
        await Presence.findOneAndUpdate(
          { userId },
          { status: "online", lastSeen: new Date() },
          { upsert: true }
        );
        console.log(`User ${userId} is now online`);
      } catch (error) {
        console.error("Error updating presence:", error);
      }
    });

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("code-update", ({ roomId, code }) => {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit("sync-code", code);
    });

    socket.on("language-update", ({ roomId, language }) => {
        // Broadcast to everyone else in the room
        socket.to(roomId).emit("sync-language", language);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      if (socket.userId) {
        try {
          await Presence.findOneAndUpdate(
            { userId: socket.userId },
            { status: "offline", lastSeen: new Date() }
          );
          console.log(`User ${socket.userId} is now offline`);
        } catch (error) {
          console.error("Error updating presence on disconnect:", error);
        }
      }
    });
  });

  return io;
};
