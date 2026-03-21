const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchDashboardData(userId, year) {
  if (!userId) return null;
  try {
    const url = year
      ? `${API_URL}/dashboard/${userId}?year=${year}`
      : `${API_URL}/dashboard/${userId}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("Dashboard API returned:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return null;
  }
}
