import { useState, useEffect } from "react";
import { getDashboardStats } from "../lib/api/analytics";

const EMPTY_DATA = {
  overview: {
    totalAttempted: 0, totalSolved: 0, totalSubmissions: 0,
    totalAccepted: 0, acceptanceRate: "0.0%", currentStreak: 0,
    longestStreak: 0, totalRuns: 0
  },
  difficulty: {
    easy: { solved: 0, attempted: 0 },
    medium: { solved: 0, attempted: 0 },
    hard: { solved: 0, attempted: 0 }
  },
  languages: [],
  errors: { wrongAnswer: 0, tle: 0, runtime: 0, compile: 0, other: 0 },
  topics: [],
  recentSubmissions: []
};

export function useAnalytics(userId, year) {
  const [data, setData] = useState(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const result = await getDashboardStats(userId, year);
        if (!cancelled) {
          setData(result || EMPTY_DATA);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
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

    fetchData();

    return () => { cancelled = true; };
  }, [userId, year]);

  return { data, isLoading, error };
}
