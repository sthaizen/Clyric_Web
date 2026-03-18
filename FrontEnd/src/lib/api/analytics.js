const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function trackProblemEvent(payload) {
  // payload: { userId, problemSlug, actionType, language, verdict, runtimeMs, memoryKb, timeSpentSeconds, mode }
  try {
    const response = await fetch(`${API_URL}/problem-analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.warn("Failed to track problem event:", response.status);
    }
    return await response.json();
  } catch (error) {
    // Silently fail - tracking should never block the user
    console.error("Analytics tracking error:", error);
    return { success: false };
  }
}

export async function getDashboardStats(userId, year) {
  if (!userId) return null;
  try {
    const url = year 
      ? `${API_URL}/problem-analytics/dashboard/${userId}?year=${year}`
      : `${API_URL}/problem-analytics/dashboard/${userId}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("Dashboard stats API returned:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}

export async function getProblemStats(userId, problemSlug) {
  if (!userId || !problemSlug) return null;
  try {
    const response = await fetch(`${API_URL}/problem-analytics/problem/${userId}/${problemSlug}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch problem stats:", error);
    return null;
  }
}
