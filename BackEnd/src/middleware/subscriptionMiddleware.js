/**
 * subscriptionMiddleware.js
 *
 * Central source of truth for all tier-based feature permissions.
 * Provides reusable middleware to gate routes by subscription tier.
 */

// ─── Tier Hierarchy (order matters) ────────────────────────────────────────
const TIER_RANK = {
  "free": 0,
  "code-rooms": 1,
  "interview-studio": 2,
  "career-plus": 3,
};

// ─── Per-Tier Feature Permissions ──────────────────────────────────────────
export const TIER_PERMISSIONS = {
  "free": {
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

/**
 * Get the resolved permissions for a given tier.
 * Falls back to "free" if tier is unknown.
 */
export function getTierPermissions(tier) {
  return TIER_PERMISSIONS[tier] || TIER_PERMISSIONS["free"];
}

/**
 * Check if tierA meets or exceeds tierB in the hierarchy.
 */
export function tierMeets(tierA, tierB) {
  return (TIER_RANK[tierA] ?? 0) >= (TIER_RANK[tierB] ?? 0);
}

/**
 * Middleware factory: require the user to have at least `requiredTier`.
 *
 * Usage:
 *   router.post("/create", protectRoute, requireTier("code-rooms"), handler)
 */
export function requireTier(requiredTier) {
  return (req, res, next) => {
    const userTier = req.user?.subscriptionTier || "free";
    if (!tierMeets(userTier, requiredTier)) {
      return res.status(403).json({
        success: false,
        code: "UPGRADE_REQUIRED",
        requiredTier,
        message: `Requires ${requiredTier} plan or higher.`,
      });
    }
    next();
  };
}

/**
 * Middleware factory: require a specific boolean feature to be enabled.
 *
 * Usage:
 *   router.use(protectRoute, requireFeature("canUseNotes"))
 */
export function requireFeature(feature) {
  return (req, res, next) => {
    const userTier = req.user?.subscriptionTier || "free";
    const perms = getTierPermissions(userTier);
    if (!perms[feature]) {
      return res.status(403).json({
        success: false,
        code: "FEATURE_LOCKED",
        feature,
        message: "Upgrade your plan to unlock this feature.",
      });
    }
    next();
  };
}
