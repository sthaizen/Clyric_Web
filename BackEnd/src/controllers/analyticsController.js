import ProblemAnalytics from "../models/ProblemAnalytics.js";
import AdvancedProblem from "../models/AdvancedProblem.js";

// POST /api/problem-analytics/track
export const trackEvent = async (req, res) => {
  try {
    const { 
      userId, problemSlug, actionType, language, 
      verdict, runtimeMs, memoryKb, timeSpentSeconds, 
      mode 
    } = req.body;
    
    if (!userId || !problemSlug || !actionType) {
      return res.status(400).json({ message: "Missing required tracking fields" });
    }

    const problem = await AdvancedProblem.findOne({ slug: problemSlug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Find or create analytics record for user & problem
    let analytics = await ProblemAnalytics.findOne({ userId, problemId: problem._id });
    
    if (!analytics) {
      analytics = new ProblemAnalytics({
        userId,
        problemId: problem._id,
        problemSlug: problem.slug,
        titleSnapshot: problem.title,
        difficultySnapshot: problem.difficulty,
        categoriesSnapshot: problem.categories,
        categoryDisplaySnapshot: problem.categoryDisplay
      });
    }

    // General updates
    analytics.lastAttemptAt = new Date();
    
    // Only update language tracking for code execution events
    if ((actionType === "run" || actionType === "submit") && language) {
      analytics.preferredLanguage = language;
      if (analytics.languageUsage[language] !== undefined) {
        analytics.languageUsage[language] += 1;
      }
    }

    // Add activity date if not practiced today
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

    // Only add to attempt history for run/submit events
    if (actionType === "run" || actionType === "submit") {
      const historyEntry = {
        attemptedAt: new Date(),
        language,
        mode: mode || "practice",
        actionType,
        verdict,
        runtimeMs,
        memoryKb,
        timeSpentSeconds
      };
      
      analytics.attemptHistory.push(historyEntry);
      if (analytics.attemptHistory.length > 100) {
        analytics.attemptHistory.shift();
      }
    }

    if (actionType === "run") {
      analytics.totalRuns += 1;
      analytics.totalAttempts += 1;
    } else if (actionType === "submit") {
      analytics.totalSubmissions += 1;
      analytics.totalAttempts += 1;
      
      if (verdict === "Accepted") {
        analytics.acceptedSubmissions += 1;
        if (!analytics.isSolved) {
          analytics.isSolved = true;
          analytics.firstSolvedAt = new Date();
          if (analytics.totalSubmissions === 1) {
             analytics.firstAttemptAccepted = true;
          }
        }
        analytics.lastSolvedAt = new Date();
        
        analytics.acceptedHistory.push({
           acceptedAt: new Date(),
           language,
           runtimeMs,
           memoryKb,
           timeSpentSeconds,
           mode: mode || "practice"
        });
      } else {
        if (verdict === "Wrong Answer") analytics.wrongAnswerCount += 1;
        else if (verdict === "Time Limit Exceeded") analytics.timeLimitExceededCount += 1;
        else if (verdict === "Runtime Error") analytics.runtimeErrorCount += 1;
        else if (verdict === "Compilation Error") analytics.compilationErrorCount += 1;
        else analytics.otherErrorCount += 1;
      }
    } else if (actionType === "hint") {
      analytics.hintsOpenedCount += 1;
    } else if (actionType === "ai_help") {
      analytics.aiHelpUsedCount += 1;
    } else if (actionType === "note_saved") {
      analytics.notesUpdatedCount += 1;
    } else if (actionType === "code_reset") {
      analytics.starterCodeResetCount += 1;
    }

    await analytics.save();
    
    res.json({ success: true, analyticsId: analytics._id });

  } catch (error) {
    console.error("Error tracking analytics:", error);
    res.status(500).json({ message: "Server error tracking analytics" });
  }
};

// GET /api/problem-analytics/dashboard/:userId
export const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stats = await ProblemAnalytics.aggregate([
      { $match: { userId: userId.toString() } },
      {
        $group: {
          _id: null,
          totalAttempted: { $sum: 1 },
          totalSolved: { $sum: { $cond: ["$isSolved", 1, 0] } },
          totalSubmissions: { $sum: "$totalSubmissions" },
          totalAccepted: { $sum: "$acceptedSubmissions" },
          totalRuns: { $sum: "$totalRuns" },
          
          easySolved: { $sum: { $cond: [{ $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Easy"] }] }, 1, 0] } },
          mediumSolved: { $sum: { $cond: [{ $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Medium"] }] }, 1, 0] } },
          hardSolved: { $sum: { $cond: [{ $and: ["$isSolved", { $eq: ["$difficultySnapshot", "Hard"] }] }, 1, 0] } },
          
          easyAttempted: { $sum: { $cond: [{ $eq: ["$difficultySnapshot", "Easy"] }, 1, 0] } },
          mediumAttempted: { $sum: { $cond: [{ $eq: ["$difficultySnapshot", "Medium"] }, 1, 0] } },
          hardAttempted: { $sum: { $cond: [{ $eq: ["$difficultySnapshot", "Hard"] }, 1, 0] } },

          jsUsage: { $sum: "$languageUsage.javascript" },
          pyUsage: { $sum: "$languageUsage.python" },
          javaUsage: { $sum: "$languageUsage.java" },
          cppUsage: { $sum: "$languageUsage.cpp" },

          wrongAnswerCount: { $sum: "$wrongAnswerCount" },
          timeLimitExceededCount: { $sum: "$timeLimitExceededCount" },
          runtimeErrorCount: { $sum: "$runtimeErrorCount" },
          compilationErrorCount: { $sum: "$compilationErrorCount" },
          otherErrorCount: { $sum: "$otherErrorCount" },
          
          currentStreak: { $max: "$streakSnapshot.currentStreak" },
          longestStreak: { $max: "$streakSnapshot.longestStreak" }
        }
      }
    ]);

    // Also get topics
    const topicsAggregation = await ProblemAnalytics.aggregate([
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

    // Format topics array
    const topics = topicsAggregation.map(t => ({
      name: t._id,
      solved: t.solved,
      total: t.total
    }));

    // Find recent activity from top 10 most recently sorted effort blocks
    // Note: To be perfectly complete we'd need to unwind attemptHistory over all docs, but 
    // a lightweight approximation is finding the most recently modified documents and taking their last attempts.
    const recentDocs = await ProblemAnalytics.find({ userId: userId.toString(), "attemptHistory.0": { $exists: true } })
      .sort({ "attemptHistory.attemptedAt": -1 })
      .select("problemSlug titleSnapshot attemptHistory difficultySnapshot")
      .lean();

    // Flatten and sort all recent history manually
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
            date: attempt.attemptedAt
          });
        }
      });
    });
    // Sort descending by date and slice to 10
    recentSubmissions.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentSubmissions = recentSubmissions.slice(0, 8);

    const agg = stats.length > 0 ? stats[0] : {
      totalAttempted: 0, totalSolved: 0, totalSubmissions: 0, totalAccepted: 0, totalRuns: 0,
      easySolved: 0, mediumSolved: 0, hardSolved: 0,
      easyAttempted: 0, mediumAttempted: 0, hardAttempted: 0,
      jsUsage: 0, pyUsage: 0, javaUsage: 0, cppUsage: 0,
      wrongAnswerCount: 0, timeLimitExceededCount: 0, runtimeErrorCount: 0, compilationErrorCount: 0, otherErrorCount: 0,
      currentStreak: 0, longestStreak: 0
    };

    const acceptanceRate = agg.totalSubmissions > 0 
      ? ((agg.totalAccepted / agg.totalSubmissions) * 100).toFixed(1) + "%" 
      : "0.0%";

    // Contribution Graph Aggregation
    const targetYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    const startDate = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${targetYear + 1}-01-01T00:00:00.000Z`);

    const contributionAggregation = await ProblemAnalytics.aggregate([
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
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$events" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyContributions = contributionAggregation.map(item => {
      let level = 0;
      if (item.count === 1) level = 1;
      else if (item.count === 2) level = 2;
      else if (item.count === 3) level = 3;
      else if (item.count === 4) level = 4;
      else if (item.count >= 5) level = 5;

      return {
        date: item._id,
        count: item.count,
        level: level
      };
    });

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
        easy: { solved: agg.easySolved, attempted: agg.easyAttempted },
        medium: { solved: agg.mediumSolved, attempted: agg.mediumAttempted },
        hard: { solved: agg.hardSolved, attempted: agg.hardAttempted }
      },
      languages: [
        { id: "javascript", name: "JavaScript", count: agg.jsUsage },
        { id: "python", name: "Python", count: agg.pyUsage },
        { id: "java", name: "Java", count: agg.javaUsage },
        { id: "cpp", name: "C++", count: agg.cppUsage }
      ].sort((a, b) => b.count - a.count), // Sorted by usage descending,
      errors: {
        wrongAnswer: agg.wrongAnswerCount,
        tle: agg.timeLimitExceededCount,
        runtime: agg.runtimeErrorCount,
        compile: agg.compilationErrorCount,
        other: agg.otherErrorCount
      },
      topics,
      recentSubmissions,
      contributionGraph: dailyContributions,
      dailyContributions: dailyContributions
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

export const getProblemStats = async (req, res) => {
  try {
    const { userId, problemSlug } = req.params;
    const analytics = await ProblemAnalytics.findOne({ userId, problemSlug });
    if (!analytics) return res.status(200).json(null);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
