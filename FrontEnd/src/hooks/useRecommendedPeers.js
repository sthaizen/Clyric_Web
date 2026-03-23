import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedPeers } from "../lib/api/dashboard";

export function useRecommendedPeers() {
  return useQuery({
    queryKey: ["recommendedPeers"],
    queryFn: fetchRecommendedPeers,
    refetchInterval: 15000, // Refresh every 15 seconds for snappier status
    staleTime: 10000,       // Consider data stale after 10 seconds
    retry: 2               // Retry twice on failure
  });
}

