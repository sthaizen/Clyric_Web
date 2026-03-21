import { useState, useEffect } from "react";
import { fetchDashboardData } from "../lib/api/dashboard";

const EMPTY_DATA = {
  overview: {
    totalAttempted: 0, totalSolved: 0, totalSubmissions: 0,
    totalAccepted: 0, acceptanceRate: 0, currentStreak: 0,
    longestStreak: 0, totalRuns: 0
  },
  difficulty: {
    easy: { solved: 0, attempted: 0, total: 0 },
    medium: { solved: 0, attempted: 0, total: 0 },
    hard: { solved: 0, attempted: 0, total: 0 }
  },
  topics: [],
  recentSubmissions: [],
  languages: [],
  errors: { wrongAnswer: 0, tle: 0, runtime: 0, compile: 0, other: 0 },
  contributionGraph: [],
  dailyContributions: [],
  growth: {
    notesCreated: 0, hintsUsed: 0, aiHelpUsed: 0,
    independentSolvePercent: 0, totalTimeSpentSeconds: 0,
    avgSolveTimeSeconds: 0, attemptTimeline: []
  }
};

export function useDashboard(userId, year, refreshKey = 0) {
  const [data, setData] = useState(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchDashboardData(userId, year);
        if (!cancelled) {
          setData(result || EMPTY_DATA);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        if (!cancelled) {
          setError(err);
          setData(EMPTY_DATA);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId, year, refreshKey]);

  return { data, isLoading, error };
}
