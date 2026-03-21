import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedPeers } from "../lib/api/dashboard";

export function useRecommendedPeers() {
  return useQuery({
    queryKey: ["recommendedPeers"],
    queryFn: fetchRecommendedPeers,
    refetchInterval: 60000, // Refresh every 60 seconds
    staleTime: 30000,       // Consider data stale after 30 seconds
    retry: 2               // Retry twice on failure
  });
}
