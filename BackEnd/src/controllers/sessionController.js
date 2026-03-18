import { chatClient, streamClient } from "../lib/streamTemp.js";
import Session from "../models/Session.js";
import ProblemAnalytics from "../models/ProblemAnalytics.js";
import AdvancedProblem from "../models/AdvancedProblem.js";

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
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

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
    const sessions = await Session.find({ status: "active" })
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

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    // Track for graph
    trackSessionJoin(userId.toString(), session.problem, false);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
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

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}