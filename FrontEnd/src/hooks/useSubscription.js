import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";
import { showUpgradeToast } from "../lib/premiumToast";

/**
 * TIER_PERMISSIONS (client-side mirror of backend)
 * Used to gate UI features without extra API calls.
 */
const TIER_PERMISSIONS = {
  free: {
    languages: ["javascript"],
    maxSubmissionsPerDay: 3,
    maxInterviewsPerDay: 0,
    allowedDifficulties: ["easy"],
    canUseNotes: false,
    canUseVisualizer: false,
    canUseQuests: false,
    hasAnalytics: false,
    hasAI: false,
  },
  "code-rooms": {
    languages: ["javascript", "python", "java"],
    maxSubmissionsPerDay: 10,
    maxInterviewsPerDay: 5,
    allowedDifficulties: ["easy", "medium"],
    canUseNotes: true,
    canUseVisualizer: false,
    canUseQuests: true,
    hasAnalytics: false,
    hasAI: false,
  },
  "interview-studio": {
    languages: ["javascript", "python", "java"],
    maxSubmissionsPerDay: Infinity,
    maxInterviewsPerDay: Infinity,
    allowedDifficulties: ["easy", "medium", "hard"],
    canUseNotes: true,
    canUseVisualizer: true,
    canUseQuests: true,
    hasAnalytics: "basic",
    hasAI: false,
  },
  "career-plus": {
    languages: ["javascript", "python", "java", "cpp"],
    maxSubmissionsPerDay: Infinity,
    maxInterviewsPerDay: Infinity,
    allowedDifficulties: ["easy", "medium", "hard"],
    canUseNotes: true,
    canUseVisualizer: true,
    canUseQuests: true,
    hasAnalytics: "advanced",
    hasAI: true,
  },
};

const TIER_RANK = {
  free: 0,
  "code-rooms": 1,
  "interview-studio": 2,
  "career-plus": 3,
};

const TIER_LABELS = {
  free: "Practice Pack",
  "code-rooms": "Code Rooms",
  "interview-studio": "Interview Studio",
  "career-plus": "Career Plus",
};

export function useSubscription() {
  const { user, isLoaded } = useUser();

  const tier = useMemo(() => {
    if (!isLoaded || !user) return "free";
    // subscriptionTier is stored in publicMetadata by Clerk webhooks
    return user.publicMetadata?.subscriptionTier || "free";
  }, [user, isLoaded]);

  const permissions = useMemo(() => {
    return TIER_PERMISSIONS[tier] || TIER_PERMISSIONS["free"];
  }, [tier]);

  /**
   * Check if the current user's tier is at or above the required tier.
   */
  const meetsOrExceedsTier = (requiredTier) => {
    return (TIER_RANK[tier] ?? 0) >= (TIER_RANK[requiredTier] ?? 0);
  };

  /**
   * Check if a specific boolean feature is available to the current user.
   */
  const canAccess = (feature) => {
    return !!permissions[feature];
  };

  /**
   * Return only languages that are available to the current tier.
   */
  const getAllowedLanguages = () => {
    return permissions.languages || ["javascript"];
  };

  /**
   * Get the human-readable label for the current tier.
   */
  const tierLabel = TIER_LABELS[tier] || "Practice Pack";

  /**
   * Get the label of the minimum tier required for a feature.
   */
  const getRequiredTierLabel = (requiredTier) => TIER_LABELS[requiredTier] || requiredTier;

  return {
    tier,
    tierLabel,
    permissions,
    meetsOrExceedsTier,
    canAccess,
    getAllowedLanguages,
    getRequiredTierLabel,
    showUpgradeToast,
    isLoaded,
  };
}
;
