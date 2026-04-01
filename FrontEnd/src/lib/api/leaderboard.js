const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchLeaderboard(page = 1, limit = 50, search = "") {
  try {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set("search", search);

    const response = await fetch(`${API_URL}/leaderboard?${params.toString()}`);
    if (!response.ok) {
      console.warn("Leaderboard API returned:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return null;
  }
}

export async function fetchMyRank(token) {
  try {
    const response = await fetch(`${API_URL}/leaderboard/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch user rank:", error);
    return null;
  }
}
