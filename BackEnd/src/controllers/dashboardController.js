import ProblemAnalytics from "../models/ProblemAnalytics.js";
import AdvancedProblem from "../models/AdvancedProblem.js";

// GET /api/dashboard/:userId?year=YYYY
export const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;
    const targetYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    // ─── 1. Main aggregation: overview, difficulty, languages, errors, growth ───
    const mainAgg = await ProblemAnalytics.aggregate([
      { $match: { userId: userId.toString() } },
      {
        $group: {
          _id: null,
          // Overview
          totalAttempted: { $sum: 1 },
          totalSolved: { $sum: { $cond: ["$isSolved", 1, 0] } },
          totalSubmissions: { $sum: "$totalSubmissions" },
          totalAccepted: { $sum: "$acceptedSubmissions" },
          totalRuns: { $sum: "$totalRuns" },
          currentStreak: { $max: "$streakSnapshot.currentStreak" },
          longestStreak: { $max: "$streakSnapshot.longestStreak" },

          // Difficulty breakdown
          easySolved: { $sum: { $cond: [{ $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Easy"] }] }, 1, 0] } },
          mediumSolved: { $sum: { $cond: [{ $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Medium"] }] }, 1, 0] } },
          hardSolved: { $sum: { $cond: [{ $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Hard"] }] }, 1, 0] } },
          easyAttempted: { $sum: { $cond: [{ $eq: ["$difficultySnapshot", "Easy"] }, 1, 0] } },
          mediumAttempted: { $sum: { $cond: [{ $eq: ["$difficultySnapshot", "Medium"] }, 1, 0] } },
          hardAttempted: { $sum: { $cond: [{ $eq: ["$difficultySnapshot", "Hard"] }, 1, 0] } },

          // Language usage
          jsUsage: { $sum: "$languageUsage.javascript" },
          pyUsage: { $sum: "$languageUsage.python" },
          javaUsage: { $sum: "$languageUsage.java" },
          cppUsage: { $sum: "$languageUsage.cpp" },

          // Error counts
          wrongAnswerCount: { $sum: "$wrongAnswerCount" },
          timeLimitExceededCount: { $sum: "$timeLimitExceededCount" },
          runtimeErrorCount: { $sum: "$runtimeErrorCount" },
          compilationErrorCount: { $sum: "$compilationErrorCount" },
          otherErrorCount: { $sum: "$otherErrorCount" },

          // Growth metrics
          notesCreated: { $sum: "$notesUpdatedCount" },
          hintsUsed: { $sum: "$hintsOpenedCount" },
          aiHelpUsed: { $sum: "$aiHelpUsedCount" },
          totalTimeSpentSeconds: { $sum: "$totalTimeSpentSeconds" },
        }
      }
    ]);

    const agg = mainAgg.length > 0 ? mainAgg[0] : {
      totalAttempted: 0, totalSolved: 0, totalSubmissions: 0, totalAccepted: 0,
      totalRuns: 0, currentStreak: 0, longestStreak: 0,
      easySolved: 0, mediumSolved: 0, hardSolved: 0,
      easyAttempted: 0, mediumAttempted: 0, hardAttempted: 0,
      jsUsage: 0, pyUsage: 0, javaUsage: 0, cppUsage: 0,
      wrongAnswerCount: 0, timeLimitExceededCount: 0, runtimeErrorCount: 0,
      compilationErrorCount: 0, otherErrorCount: 0,
      notesCreated: 0, hintsUsed: 0, aiHelpUsed: 0, totalTimeSpentSeconds: 0
    };

    // ─── 2. Total problems available per difficulty (from AdvancedProblem) ───
    const problemCountsAgg = await AdvancedProblem.aggregate([
      { $match: { status: "published", visible: true } },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalProblems = { Easy: 0, Medium: 0, Hard: 0 };
    problemCountsAgg.forEach(item => {
      if (totalProblems.hasOwnProperty(item._id)) {
        totalProblems[item._id] = item.count;
      }
    });

    // ─── 3. Topics aggregation ───
    const topicsAgg = await ProblemAnalytics.aggregate([
      { $match: { userId: userId.toString() } },
      { $unwind: "$categoriesSnapshot" },
      {
        $group: {
          _id: "$categoriesSnapshot",
          total: { $sum: 1 },
          solved: { $sum: { $cond: ["$isSolved", 1, 0] } }
        }
      },
      { $sort: { solved: -1, total: -1 } }
    ]);

    const topics = topicsAgg.map(t => ({
      name: t._id,
      solved: t.solved,
      total: t.total,
      percent: t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0
    }));

    // ─── 4. Recent submissions (flatten attemptHistory) ───
    const recentDocs = await ProblemAnalytics.find(
      { userId: userId.toString(), "attemptHistory.0": { $exists: true } }
    )
      .select("problemSlug titleSnapshot attemptHistory difficultySnapshot")
      .lean();

    let recentSubmissions = [];
    recentDocs.forEach(doc => {
      doc.attemptHistory.forEach(attempt => {
        if (attempt.actionType === "submit") {
          recentSubmissions.push({
            problemSlug: doc.problemSlug,
            title: doc.titleSnapshot,
            difficulty: doc.difficultySnapshot,
            verdict: attempt.verdict,
            language: attempt.language,
            runtimeMs: attempt.runtimeMs,
            memoryKb: attempt.memoryKb,
            date: attempt.attemptedAt
          });
        }
      });
    });
    recentSubmissions.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentSubmissions = recentSubmissions.slice(0, 8);

    // ─── 4.5 Recent Incidents (errors from both run/submit) ───
    let recentIncidents = [];
    recentDocs.forEach(doc => {
      doc.attemptHistory.forEach(attempt => {
        if (attempt.verdict !== "Accepted" && attempt.verdict !== "Executed") {
          recentIncidents.push({
            problemSlug: doc.problemSlug,
            title: doc.titleSnapshot,
            verdict: attempt.verdict,
            language: attempt.language,
            date: attempt.attemptedAt
          });
        }
      });
    });
    recentIncidents.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentIncidents = recentIncidents.slice(0, 5);

    // ─── 5. Contribution graph ───
    const startDate = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${targetYear + 1}-01-01T00:00:00.000Z`);

    const contributionAgg = await ProblemAnalytics.aggregate([
      { $match: { userId: userId.toString() } },
      {
        $project: {
          events: {
            $concatArrays: [
              { $ifNull: ["$activityDates", []] },
              { $ifNull: ["$sessionJoinedDates", []] }
            ]
          }
        }
      },
      { $unwind: "$events" },
      { $match: { events: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$events" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyContributions = contributionAgg.map(item => {
      let level = 0;
      if (item.count === 1) level = 1;
      else if (item.count === 2) level = 2;
      else if (item.count === 3) level = 3;
      else if (item.count === 4) level = 4;
      else if (item.count >= 5) level = 5;
      return { date: item._id, count: item.count, level };
    });

    // ─── 6. Growth trajectory: attempt timeline + avg solve time ───
    const growthDocs = await ProblemAnalytics.find(
      { userId: userId.toString(), "attemptHistory.0": { $exists: true } }
    )
      .select("attemptHistory acceptedHistory")
      .lean();

    // Flatten all attempts for the bar chart (time spent per attempt)
    let attemptTimeline = [];
    growthDocs.forEach(doc => {
      doc.attemptHistory.forEach(attempt => {
        if (attempt.timeSpentSeconds != null && attempt.timeSpentSeconds > 0) {
          attemptTimeline.push({
            date: attempt.attemptedAt,
            timeSpentSeconds: attempt.timeSpentSeconds,
            verdict: attempt.verdict,
            actionType: attempt.actionType
          });
        }
      });
    });
    attemptTimeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    // Keep last 100 attempts for the chart
    attemptTimeline = attemptTimeline.slice(-100);

    // Average solve time from accepted history
    let totalAcceptedTime = 0;
    let acceptedWithTimeCount = 0;
    growthDocs.forEach(doc => {
      if (doc.acceptedHistory) {
        doc.acceptedHistory.forEach(ah => {
          if (ah.timeSpentSeconds != null && ah.timeSpentSeconds > 0) {
            totalAcceptedTime += ah.timeSpentSeconds;
            acceptedWithTimeCount++;
          }
        });
      }
    });
    const avgSolveTimeSeconds = acceptedWithTimeCount > 0
      ? Math.round(totalAcceptedTime / acceptedWithTimeCount)
      : 0;

    // Independent solve ratio: solved without hints or AI
    const independentAgg = await ProblemAnalytics.aggregate([
      { $match: { userId: userId.toString(), isSolved: true } },
      {
        $group: {
          _id: null,
          totalSolvedProblems: { $sum: 1 },
          solvedWithoutHelp: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$hintsOpenedCount", 0] }, { $eq: ["$aiHelpUsedCount", 0] }] },
                1, 0
              ]
            }
          }
        }
      }
    ]);

    let independentSolvePercent = 0;
    if (independentAgg.length > 0 && independentAgg[0].totalSolvedProblems > 0) {
      independentSolvePercent = Math.round(
        (independentAgg[0].solvedWithoutHelp / independentAgg[0].totalSolvedProblems) * 100
      );
    }

    // ─── 7. Language data formatted for chart ───
    const totalLangUsage = agg.jsUsage + agg.pyUsage + agg.javaUsage + agg.cppUsage;
    const languages = [
      { name: "JavaScript", count: agg.jsUsage, percent: totalLangUsage > 0 ? Math.round((agg.jsUsage / totalLangUsage) * 100) : 0 },
      { name: "Python", count: agg.pyUsage, percent: totalLangUsage > 0 ? Math.round((agg.pyUsage / totalLangUsage) * 100) : 0 },
      { name: "Java", count: agg.javaUsage, percent: totalLangUsage > 0 ? Math.round((agg.javaUsage / totalLangUsage) * 100) : 0 },
      { name: "C++", count: agg.cppUsage, percent: totalLangUsage > 0 ? Math.round((agg.cppUsage / totalLangUsage) * 100) : 0 },
    ].filter(l => l.count > 0).sort((a, b) => b.count - a.count);

    // ─── 8. Acceptance rate ───
    const acceptanceRate = agg.totalSubmissions > 0
      ? parseFloat(((agg.totalAccepted / agg.totalSubmissions) * 100).toFixed(1))
      : 0;

    // ─── Build final response ───
    const result = {
      overview: {
        totalAttempted: agg.totalAttempted,
        totalSolved: agg.totalSolved,
        totalSubmissions: agg.totalSubmissions,
        totalAccepted: agg.totalAccepted,
        acceptanceRate,
        currentStreak: agg.currentStreak,
        longestStreak: agg.longestStreak,
        totalRuns: agg.totalRuns
      },
      difficulty: {
        easy: { solved: agg.easySolved, attempted: agg.easyAttempted, total: totalProblems.Easy },
        medium: { solved: agg.mediumSolved, attempted: agg.mediumAttempted, total: totalProblems.Medium },
        hard: { solved: agg.hardSolved, attempted: agg.hardAttempted, total: totalProblems.Hard }
      },
      topics,
      recentSubmissions,
      languages,
      errors: {
        wrongAnswer: agg.wrongAnswerCount,
        tle: agg.timeLimitExceededCount,
        runtime: agg.runtimeErrorCount,
        compile: agg.compilationErrorCount,
        other: agg.otherErrorCount
      },
      contributionGraph: dailyContributions,
      dailyContributions,
      growth: {
        notesCreated: agg.notesCreated,
        hintsUsed: agg.hintsUsed,
        aiHelpUsed: agg.aiHelpUsed,
        independentSolvePercent,
        totalTimeSpentSeconds: agg.totalTimeSpentSeconds,
        avgSolveTimeSeconds,
        attemptTimeline,
        totalSolved: agg.totalSolved
      },
      recentIncidents
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};
