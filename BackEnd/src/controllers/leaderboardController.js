import ProblemAnalytics from "../models/ProblemAnalytics.js";
import User from "../models/User.js";
import Presence from "../models/Presence.js";

// Scoring weights
const EASY_WEIGHT = 1;
const MEDIUM_WEIGHT = 3;
const HARD_WEIGHT = 5;

/**
 * Builds the full leaderboard via aggregation.
 * Returns an array of ranked users with stats.
 */
async function buildLeaderboard({ search = "", page = 1, limit = 50 }) {
  // Step 1: Aggregate ProblemAnalytics per user
  const userStats = await ProblemAnalytics.aggregate([
    {
      $group: {
        _id: "$userId",
        easySolved: {
          $sum: {
            $cond: [
              { $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Easy"] }] },
              1,
              0,
            ],
          },
        },
        mediumSolved: {
          $sum: {
            $cond: [
              {
                $and: [
                  "$isSolved",
                  { $eq: ["$difficultySnapshot", "Medium"] },
                ],
              },
              1,
              0,
            ],
          },
        },
        hardSolved: {
          $sum: {
            $cond: [
              { $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Hard"] }] },
              1,
              0,
            ],
          },
        },
        totalSolved: { $sum: { $cond: ["$isSolved", 1, 0] } },
        totalSubmissions: { $sum: "$totalSubmissions" },
        totalAccepted: { $sum: "$acceptedSubmissions" },
        totalTimeSpentSeconds: { $sum: "$totalTimeSpentSeconds" },
        currentStreak: { $max: "$streakSnapshot.currentStreak" },
        longestStreak: { $max: "$streakSnapshot.longestStreak" },
        lastSolvedAt: { $max: "$lastSolvedAt" },
        jsUsage: { $sum: "$languageUsage.javascript" },
        pyUsage: { $sum: "$languageUsage.python" },
        javaUsage: { $sum: "$languageUsage.java" },
        cppUsage: { $sum: "$languageUsage.cpp" },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$easySolved", EASY_WEIGHT] },
            { $multiply: ["$mediumSolved", MEDIUM_WEIGHT] },
            { $multiply: ["$hardSolved", HARD_WEIGHT] },
          ],
        },
        acceptanceRate: {
          $cond: [
            { $gt: ["$totalSubmissions", 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalAccepted", "$totalSubmissions"] },
                    100,
                  ],
                },
                1,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $sort: {
        score: -1,
        totalTimeSpentSeconds: 1,
        acceptanceRate: -1,
      },
    },
  ]);

  // Step 2: Fetch all users and presences in bulk
  const clerkIds = userStats.map((s) => s._id);
  const [users, presences] = await Promise.all([
    User.find({ clerkId: { $in: clerkIds } }).lean(),
    Presence.find({ userId: { $in: clerkIds } }).lean(),
  ]);

  const userMap = new Map();
  users.forEach((u) => userMap.set(u.clerkId, u));

  const presenceMap = new Map();
  presences.forEach((p) => presenceMap.set(p.userId, p.status));

  // Step 3: Merge stats + user profile + presence, filter out irrelevant entries
  let leaderboard = userStats
    .map((stat) => {
      const user = userMap.get(stat._id);
      const usages = [
        { lang: "javascript", count: stat.jsUsage || 0 },
        { lang: "python", count: stat.pyUsage || 0 },
        { lang: "java", count: stat.javaUsage || 0 },
        { lang: "cpp", count: stat.cppUsage || 0 },
      ];
      const topLanguages = usages
        .filter(u => u.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(u => u.lang);

      return {
        clerkId: stat._id,
        name: user?.nickname || user?.name || null,
        profileImage: user?.profileImage || "",
        isOnline: presenceMap.get(stat._id) === "online",
        score: stat.score,
        totalSolved: stat.totalSolved,
        easySolved: stat.easySolved,
        mediumSolved: stat.mediumSolved,
        hardSolved: stat.hardSolved,
        totalTimeSpentSeconds: stat.totalTimeSpentSeconds,
        acceptanceRate: stat.acceptanceRate,
        totalSubmissions: stat.totalSubmissions,
        totalAccepted: stat.totalAccepted,
        currentStreak: stat.currentStreak,
        longestStreak: stat.longestStreak,
        lastSolvedAt: stat.lastSolvedAt,
        topLanguages: topLanguages,
        _hasUser: !!user,
      };
    })
    // Only show users who: have a real account AND solved at least 1 problem
    .filter((entry) => entry._hasUser && entry.name && entry.totalSolved > 0)
    .map((entry, index) => {
      const { _hasUser, ...rest } = entry;
      return { ...rest, rank: index + 1 };
    });

  // Step 4: Search filter (by name)
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    leaderboard = leaderboard.filter(
      (entry) =>
        entry.name.toLowerCase().includes(searchLower) ||
        entry.clerkId.toLowerCase().includes(searchLower)
    );
    // Re-rank after filtering
    leaderboard = leaderboard.map((entry, i) => ({
      ...entry,
      rank: i + 1,
    }));
  }

  const totalUsers = leaderboard.length;
  const totalPages = Math.ceil(totalUsers / limit);
  const startIndex = (page - 1) * limit;
  const paginated = leaderboard.slice(startIndex, startIndex + limit);

  return {
    leaderboard: paginated,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * GET /api/leaderboard
 * Public — anyone can view
 */
export const getLeaderboard = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 50));
    const search = req.query.search || "";

    const result = await buildLeaderboard({ search, page, limit });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ success: false, message: "Server error fetching leaderboard" });
  }
};

/**
 * GET /api/leaderboard/me
 * Protected — returns logged-in user's rank + nearby users
 */
export const getMyRank = async (req, res) => {
  try {
    const clerkId = req.auth().userId;
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Build full leaderboard to find user's position
    const { leaderboard } = await buildLeaderboard({ page: 1, limit: 999999 });

    const userIndex = leaderboard.findIndex((entry) => entry.clerkId === clerkId);

    if (userIndex === -1) {
      return res.json({
        success: true,
        myRank: null,
        message: "You haven't solved any problems yet",
      });
    }

    const myEntry = leaderboard[userIndex];

    // Get surrounding users (±5 positions)
    const startIdx = Math.max(0, userIndex - 5);
    const endIdx = Math.min(leaderboard.length, userIndex + 6);
    const nearbyUsers = leaderboard.slice(startIdx, endIdx);

    res.json({
      success: true,
      myRank: myEntry,
      nearbyUsers,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    res.status(500).json({ success: false, message: "Server error fetching rank" });
  }
};
