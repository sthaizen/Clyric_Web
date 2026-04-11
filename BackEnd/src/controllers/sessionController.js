// Stream SDK removed — video is now handled by WebRTC via Socket.IO signaling
import Session from "../models/Session.js";
import ProblemAnalytics from "../models/ProblemAnalytics.js";
import AdvancedProblem from "../models/AdvancedProblem.js";
import { generateRoomId, hashPassword, verifyPassword } from "../lib/cryptoUtils.js";
import { getTierPermissions } from "../middleware/subscriptionMiddleware.js";

/** Helper: get start of today in UTC for daily limit checks */
function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

async function trackSessionJoin(userIdStr, problemSlug, isHost) {
  try {
    const problem = await AdvancedProblem.findOne({ slug: problemSlug });
    if (!problem) return;
    
    let analytics = await ProblemAnalytics.findOne({ userId: userIdStr, problemId: problem._id });
    if (!analytics) {
      analytics = new ProblemAnalytics({
        userId: userIdStr,
        problemId: problem._id,
        problemSlug: problem.slug,
        titleSnapshot: problem.title,
        difficultySnapshot: problem.difficulty,
        categoriesSnapshot: problem.categories,
        categoryDisplaySnapshot: problem.categoryDisplay
      });
    }
    
    if (!analytics.sessionJoinedDates) analytics.sessionJoinedDates = [];
    analytics.sessionJoinedDates.push(new Date());
    
    const today = new Date().toISOString().split('T')[0];
    const lastPracticedStr = analytics.lastPracticedAt ? analytics.lastPracticedAt.toISOString().split('T')[0] : null;
    if (today !== lastPracticedStr) {
      analytics.activityDates.push(new Date());
      analytics.lastPracticedAt = new Date();
      analytics.streakSnapshot.currentStreak += 1; 
      if (analytics.streakSnapshot.currentStreak > analytics.streakSnapshot.longestStreak) {
        analytics.streakSnapshot.longestStreak = analytics.streakSnapshot.currentStreak;
      }
    }
    
    if (isHost) {
      analytics.interviewSessionsHosted = (analytics.interviewSessionsHosted || 0) + 1;
    } else {
      analytics.interviewSessionsJoined = (analytics.interviewSessionsJoined || 0) + 1;
    }
    
    await analytics.save();
  } catch (error) {
    console.error("Failed to track session start/join in analytics:", error);
  }
}

export async function createSession(req, res) {
  try {
    const { problem, difficulty, visibility, password } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    const userTier = req.user.subscriptionTier || "free";
    const perms = getTierPermissions(userTier);

    // --- Tier check: free users cannot create sessions ---
    if (perms.maxInterviewsPerDay === 0) {
      return res.status(403).json({
        success: false,
        code: "UPGRADE_REQUIRED",
        message: "Mock interview sessions are not available on the Free plan. Upgrade to Code Rooms or higher.",
      });
    }

    // --- Daily session limit for code-rooms tier ---
    if (perms.maxInterviewsPerDay !== Infinity) {
      const todayStart = startOfTodayUTC();
      const sessionsToday = await Session.countDocuments({
        host: userId,
        createdAt: { $gte: todayStart },
      });
      if (sessionsToday >= perms.maxInterviewsPerDay) {
        return res.status(429).json({
          success: false,
          code: "DAILY_SESSION_LIMIT",
          message: "Daily session limit reached. Upgrade for unlimited sessions.",
          limit: perms.maxInterviewsPerDay,
          used: sessionsToday,
        });
      }
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const sessionData = {
      problem,
      difficulty,
      host: userId,
      callId,
      visibility: visibility || "public",
    };

    // Generate roomId for private sessions
    if (visibility === "private") {
      let roomId;
      let attempts = 0;
      do {
        roomId = generateRoomId();
        const existing = await Session.findOne({ roomId });
        if (!existing) break;
        attempts++;
      } while (attempts < 5);

      if (attempts >= 5) {
        return res.status(500).json({ message: "Failed to generate unique room code. Please try again." });
      }
      sessionData.roomId = roomId;

      // Hash password if provided
      if (password) {
        sessionData.password = hashPassword(password, roomId);
      }
    }

    const session = await Session.create(sessionData);

    // WebRTC: no external call object needs to be created.
    // Signaling is handled via Socket.IO; callId acts as the room identifier.

    // Track for graph
    trackSessionJoin(userId.toString(), problem, true);

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    // Only return public active sessions
    const sessions = await Session.find({ status: "active", visibility: "public" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active"){
      return res.status(400).json({message:"Cannot join a completed session"})
    }
    if (session.host.toString() === userId.toString()) {
    return res.status(400).json({ message: "Host cannot join their own session as participant" });
  }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    // WebRTC: participant joins signaling room via Socket.IO on the frontend.

    // Track for graph
    trackSessionJoin(userId.toString(), session.problem, false);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function joinSessionByCode(req, res) {
  try {
    const { roomId, password } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!roomId) {
      return res.status(400).json({ message: "Room code is required" });
    }

    const session = await Session.findOne({ roomId: roomId.toUpperCase(), status: "active" });

    if (!session) return res.status(404).json({ message: "No active session found with this code" });

    // Check password if the session has one
    if (session.password) {
      if (!password) {
        return res.status(403).json({ message: "Password is required for this session" });
      }
      if (!verifyPassword(password, session.roomId, session.password)) {
        return res.status(403).json({ message: "Incorrect password" });
      }
    }

    if (session.host.toString() === userId.toString()) {
      // Host is rejoining their own session
      return res.status(200).json({ session });
    }

    if (session.participant) {
      if (session.participant.toString() === userId.toString()) {
        // Participant is rejoining
        return res.status(200).json({ session });
      }
      return res.status(409).json({ message: "Session is full" });
    }

    session.participant = userId;
    await session.save();

    // WebRTC: participant joins signaling room via Socket.IO on the frontend.

    // Track for graph
    trackSessionJoin(userId.toString(), session.problem, false);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSessionByCode controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req,res){
     try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // WebRTC: peers are notified via Socket.IO (webrtc-peer-left / session polling).
    // No external resources to delete.

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}