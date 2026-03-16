import { Server } from "socket.io";
import { ENV } from "./env.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [ENV.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

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

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
