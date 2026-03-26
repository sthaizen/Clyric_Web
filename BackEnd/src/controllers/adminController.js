import User from "../models/User.js";
import Session from "../models/Session.js";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import AdvancedProblem from "../models/AdvancedProblem.js";
import QuestTemplate from "../models/QuestTemplate.js";
import UserQuestProgress from "../models/UserQuestProgress.js";
import UserLevelStats from "../models/UserLevelStats.js";

// ─── Helper ──────────────────────────────────────────────────────────────────

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOf7DaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────

export const getAdminStats = async (req, res) => {
  try {
    const todayStart = startOfDay();
    const weekStart = startOf7DaysAgo();

    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      activeSessionsCount,
      totalProblems,
      submissionsToday,
      acceptedToday,
      failedToday,
      totalQuestTemplates,
      completedQuestsToday,
      activeUsersToday, // DAU
      activeUsersThisWeek // WAU
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ createdAt: { $gte: weekStart } }),
      Session.countDocuments({ status: "active" }),
      AdvancedProblem.countDocuments(),
      Submission.countDocuments({ createdAt: { $gte: todayStart } }),
      Submission.countDocuments({ createdAt: { $gte: todayStart }, verdict: "Accepted" }),
      Submission.countDocuments({
        createdAt: { $gte: todayStart },
        verdict: { $ne: "Accepted" },
      }),
      QuestTemplate.countDocuments(),
      UserQuestProgress.countDocuments({
        isCompleted: true,
        updatedAt: { $gte: todayStart },
      }),
      Submission.distinct("userId", { createdAt: { $gte: todayStart } }),
      Submission.distinct("userId", { createdAt: { $gte: weekStart } })
    ]);

    // Daily signup trend (last 7 days)
    const signupTrend = await User.aggregate([
      { $match: { createdAt: { $gte: weekStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Submission trend (last 7 days)
    const submissionTrend = await Submission.aggregate([
      { $match: { createdAt: { $gte: weekStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Submissions by Language
    const languageTrend = await Submission.aggregate([
      { $group: { _id: "$language", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Problems by Difficulty
    const difficultyTrend = await AdvancedProblem.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } }
    ]);

    // Quests completion by Type
    const questCompletionTrend = await UserQuestProgress.aggregate([
      { $match: { isCompleted: true } },
      {
        $lookup: {
          from: "questtemplates", // Mongoose pluralizes QuestTemplate models to 'questtemplates' usually.
          localField: "questId",
          foreignField: "questId",
          as: "questInfo"
        }
      },
      { $unwind: "$questInfo" },
      { $group: { _id: "$questInfo.type", count: { $sum: 1 } } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        activeToday: activeUsersToday.length, // DAU
        activeThisWeek: activeUsersThisWeek.length // WAU
      },
      sessions: {
        active: activeSessionsCount,
      },
      problems: {
        total: totalProblems,
      },
      submissions: {
        today: submissionsToday,
        acceptedToday,
        failedToday,
        acceptanceRateToday:
          submissionsToday > 0
            ? Math.round((acceptedToday / submissionsToday) * 100)
            : 0,
      },
      quests: {
        totalTemplates: totalQuestTemplates,
        completedToday: completedQuestsToday,
      },
      trends: {
        signups: signupTrend,
        submissions: submissionTrend,
        languages: languageTrend,
        difficulties: difficultyTrend,
        questTypes: questCompletionTrend,
      },
    });
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── GET /api/admin/users ─────────────────────────────────────────────────────

export const getAdminUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "",
      status = "",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { clerkId: { $regex: search, $options: "i" } },
        { nickname: { $regex: search, $options: "i" } },
      ];
    }

    if (role) filter.role = role;
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select("-__v"),
      User.countDocuments(filter),
    ]);

    // Enrich each user with their level stats and latest activity
    const userIds = users.map((u) => u.clerkId);
    
    // Attempting to aggregate total Solved and submissions per user for richer UI
    const latestSubmissions = await Submission.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { 
          _id: "$userId", 
          totalSubmissions: { $sum: 1 }, 
          acceptedSubmissions: { $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] } },
          lastActive: { $max: "$createdAt" },
          languages: { $addToSet: "$language" }
        } 
      }
    ]);

    const subMap = {};
    latestSubmissions.forEach(s => { subMap[s._id] = s; });

    const levelStats = await UserLevelStats.find({ userId: { $in: userIds } });
    const levelMap = {};
    levelStats.forEach((s) => {
      levelMap[s.userId] = { level: s.currentLevel, exp: s.totalExp };
    });

    const enriched = users.map((u) => {
      const uStats = subMap[u.clerkId] || { totalSubmissions: 0, acceptedSubmissions: 0, lastActive: u.updatedAt, languages: [] };
      return {
        ...u.toObject(),
        levelStats: levelMap[u.clerkId] || { level: 1, exp: 0 },
        analytics: {
          totalSubmissions: uStats.totalSubmissions,
          acceptedCount: uStats.acceptedSubmissions,
          acceptanceRate: uStats.totalSubmissions > 0 ? Math.round((uStats.acceptedSubmissions / uStats.totalSubmissions) * 100) : 0,
          lastActive: uStats.lastActive,
          preferredLanguages: uStats.languages
        }
      };
    });

    res.json({
      users: enriched,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getAdminUsers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── PATCH /api/admin/users/:id ───────────────────────────────────────────────

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const allowedRoles = ["user", "admin"];
    const allowedStatuses = ["active", "suspended", "banned"];

    const updates = {};
    if (role && allowedRoles.includes(role)) updates.role = role;
    if (status && allowedStatuses.includes(status)) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      select: "-__v",
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error in updateAdminUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── GET /api/admin/problems ──────────────────────────────────────────────────

export const getAdminProblems = async (req, res) => {
  try {
    const { search = "", difficulty = "", page = 1, limit = 30 } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }
    if (difficulty) {
      const capitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      filter.difficulty = capitalized;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const [problems, total] = await Promise.all([
      AdvancedProblem.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select("slug title difficulty constraints createdAt"),
      AdvancedProblem.countDocuments(filter),
    ]);

    // Get submission stats per problem
    const problemIds = problems.map((p) => p.slug);
    const submissionStats = await Submission.aggregate([
      { $match: { problemSlug: { $in: problemIds } } },
      {
        $group: {
          _id: "$problemSlug",
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] },
          },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
    ]);

    const statsMap = {};
    submissionStats.forEach((s) => {
      statsMap[s._id] = {
        totalAttempts: s.total,
        acceptedCount: s.accepted,
        uniqueAttempts: s.uniqueUsers.length,
        acceptanceRate:
          s.total > 0 ? Math.round((s.accepted / s.total) * 100) : 0,
      };
    });

    const enriched = problems.map((p) => {
      const stat = statsMap[p.slug] || {
        totalAttempts: 0,
        acceptedCount: 0,
        uniqueAttempts: 0,
        acceptanceRate: 0,
      };
      return {
        ...p.toObject(),
        problemId: p.slug, // mapping slug to problemId for frontend
        difficulty: p.difficulty.toLowerCase(), // mapping "Easy" -> "easy"
        testCaseCount: p.constraints?.length || 0, // placeholder since AdvancedProblem doesn't have testCases array like Problem
        stats: stat,
        performance: {
          isHighFailure: stat.totalAttempts > 10 && stat.acceptanceRate < 25,
          isLowEngagement: stat.totalAttempts < 5,
        }
      };
    });

    res.json({
      problems: enriched,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getAdminProblems:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin/problems ──────────────────────────────────────────────────
export const createAdminProblem = async (req, res) => {
  try {
    const { slug, title, difficulty, description, categoryDisplay, categories } = req.body;
    if (!slug || !title || !difficulty || !description) {
      return res.status(400).json({ message: "Missing required problem fields" });
    }
    const existing = await AdvancedProblem.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Problem with this slug already exists" });
    }

    const newProblem = await AdvancedProblem.create({
      slug,
      title,
      difficulty,
      description,
      categoryDisplay,
      categories,
      ...req.body // spread the rest
    });

    res.status(201).json({ message: "Problem created", problem: newProblem });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── PUT /api/admin/problems/:slug ───────────────────────────────────────────
export const updateAdminProblem = async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    const updated = await AdvancedProblem.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ message: "Problem updated", problem: updated });
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── DELETE /api/admin/problems/:slug ────────────────────────────────────────
export const deleteAdminProblem = async (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = await AdvancedProblem.findOneAndDelete({ slug });
    
    if (!deleted) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ message: "Problem deleted" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── GET /api/admin/sessions/active ──────────────────────────────────────────

export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "active" })
      .sort({ createdAt: -1 })
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId")
      .limit(50);

    const enriched = sessions.map((s) => ({
      _id: s._id,
      problem: s.problem,
      difficulty: s.difficulty,
      visibility: s.visibility,
      callId: s.callId,
      roomId: s.roomId,
      host: s.host,
      participant: s.participant,
      startedAt: s.createdAt,
      durationMinutes: Math.floor(
        (Date.now() - new Date(s.createdAt).getTime()) / 60000
      ),
    }));

    res.json({ sessions: enriched, total: enriched.length });
  } catch (error) {
    console.error("Error in getActiveSessions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── GET /api/admin/quests ────────────────────────────────────────────────────

export const getAdminQuests = async (req, res) => {
  try {
    const { type = "" } = req.query;
    const filter = type ? { type } : {};

    const quests = await QuestTemplate.find(filter).sort({ createdAt: -1 });

    // Daily completions per quest
    const todayStart = startOfDay();
    const completionStats = await UserQuestProgress.aggregate([
      {
        $match: {
          isCompleted: true,
          questId: { $in: quests.map((q) => q.questId) },
          updatedAt: { $gte: todayStart },
        },
      },
      { $group: { _id: "$questId", completions: { $sum: 1 } } },
    ]);

    const completionMap = {};
    completionStats.forEach((c) => {
      completionMap[c._id] = c.completions;
    });

    const enriched = quests.map((q) => ({
      ...q.toObject(),
      completionsToday: completionMap[q.questId] || 0,
    }));

    res.json({ quests: enriched });
  } catch (error) {
    console.error("Error in getAdminQuests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── POST /api/admin/quests ───────────────────────────────────────────────────

export const createAdminQuest = async (req, res) => {
  try {
    const { questId, title, description, type, targetCriteria, rewardExp, isActive } =
      req.body;

    if (!questId || !title || !description || !type || !targetCriteria || !rewardExp) {
      return res.status(400).json({ message: "Missing required quest fields" });
    }

    const existing = await QuestTemplate.findOne({ questId });
    if (existing) {
      return res.status(409).json({ message: "Quest with this ID already exists" });
    }

    const quest = await QuestTemplate.create({
      questId,
      title,
      description,
      type,
      targetCriteria,
      rewardExp,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ message: "Quest created", quest });
  } catch (error) {
    console.error("Error in createAdminQuest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── GET /api/admin/recent-activity ──────────────────────────────────────────

export const getRecentActivity = async (req, res) => {
  try {
    const limit = 20;

    const [recentUsers, recentSubmissions, recentSessions] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select("name email createdAt"),
      Submission.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("userId problemSlug verdict language createdAt"),
      Session.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("host", "name")
        .select("problem difficulty status createdAt host"),
    ]);

    const activity = [
      ...recentUsers.map((u) => ({
        type: "signup",
        label: `New user: ${u.name}`,
        sub: u.email,
        time: u.createdAt,
      })),
      ...recentSubmissions.map((s) => ({
        type: "submission",
        label: `${s.verdict} — ${s.problemSlug}`,
        sub: `${s.language} • User ${s.userId.slice(0, 8)}...`,
        time: s.createdAt,
      })),
      ...recentSessions.map((s) => ({
        type: "session",
        label: `Session: ${s.problem}`,
        sub: `${s.difficulty} • ${s.status} • Host: ${s.host?.name || "Unknown"}`,
        time: s.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, limit);

    res.json({ activity });
  } catch (error) {
    console.error("Error in getRecentActivity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
