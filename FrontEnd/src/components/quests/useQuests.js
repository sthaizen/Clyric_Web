import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function useUserQuests(userId) {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ["quests", userId],
    queryFn: async () => {
      if (!userId) return null;
      const token = await getToken();
      const res = await fetch(`${API_URL}/quests/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch quests");
      return res.json();
    },
    enabled: !!userId,
    // Refetch less frequently to save bandwidth unless explicitly invalidated
    staleTime: 5 * 60 * 1000, 
  });
}

export function useClaimQuest() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, userQuestId }) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/quests/claim`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, userQuestId }),
      });
      if (!res.ok) throw new Error("Failed to claim reward");
      return res.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate the quests query to force a fresh fetch
      queryClient.invalidateQueries({ queryKey: ["quests", variables.userId] });
    },
  });
}
