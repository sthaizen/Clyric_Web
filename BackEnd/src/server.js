import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { serve } from "inngest/express";
import { fileURLToPath } from "url";
import { clerkMiddleware } from "@clerk/express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import codeExecutionRoutes from "./routes/codeExecutionRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import questRoutes from "./routes/questRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import docsRoutes from "./routes/docsRoutes.js";
import { checkExpiredSubscriptions } from "./services/subscriptionService.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false, // Often requires config for Clerk/React; disabled for general use initially
}));
app.use(compression());

if (ENV.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Request parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({ origin: [ENV.CLIENT_URL, "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000"], credentials: true }));

// Required to read httpOnly cookies (admin_token for admin auth, Clerk for user auth)
app.use(cookieParser());

app.use(clerkMiddleware()); // Keeps Clerk active for normal user routes — do NOT remove

// Rate limiting for APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.NODE_ENV === "production" ? 100 : 10000, // Significant increase for development
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use("/api", apiLimiter);

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/code", codeExecutionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/problem-analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/admin", adminRoutes);
// Admin auth routes (login, request, verify, forgot-password, etc.) — no Clerk dependency
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/docs", docsRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "success api is running" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err.stack);
  res.status(500).json({
    success: false,
    message: ENV.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

// serve frontend in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../FrontEnd/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../FrontEnd/dist/index.html"));
  });
}

import { createServer } from "http";
import { setupSocket } from "./lib/socket.js";

// start server
const startServer = async () => {
  try {
    await connectDB();
    const server = createServer(app);
    setupSocket(server);
    
    server.listen(ENV.PORT, () => {
      console.log("Server is running on port:", ENV.PORT);
      
      // Run subscription expiry check on start
      checkExpiredSubscriptions();
      
      // Periodically check for expired subscriptions (every 12 hours)
      setInterval(checkExpiredSubscriptions, 12 * 60 * 60 * 1000);
    });
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();