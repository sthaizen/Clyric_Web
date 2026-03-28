import { runUserCode } from "../services/codeExecutionService.js";
import { judgeSubmission } from "../services/judgeService.js";
import Submission from "../models/Submission.js";
import AdvancedProblem from "../models/AdvancedProblem.js";
import User from "../models/User.js";
import { getTierPermissions } from "../middleware/subscriptionMiddleware.js";

// Maximum sizes to prevent DoS attacks
const MAX_CODE_SIZE = 64 * 1024;   // 64KB
const MAX_STDIN_SIZE = 16 * 1024;  // 16KB

// All languages the judge supports
const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp", "java"];

/** Helper: get the start of today UTC for daily limit queries */
function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Helper: resolve user tier from a Clerk userId string */
async function getUserTier(clerkUserId) {
  if (!clerkUserId) return "free";
  try {
    const user = await User.findOne({ clerkId: clerkUserId }).select("subscriptionTier").lean();
    return user?.subscriptionTier || "free";
  } catch {
    return "free";
  }
}

/**
 * POST /api/code/run
 * 
 * Runs user code against custom or sample stdin.
 * Does NOT compare against expected output — just returns what the code prints.
 * 
 * Request body:
 *   { language: string, code: string, stdin?: string }
 * 
 * Response:
 *   { success, verdict, stdout, stderr, compileError, runtimeError, executionTime }
 */
export const runCode = async (req, res) => {
  try {
    const { language, code, stdin = "" } = req.body;

    // --- Input validation ---
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "language and code are required fields.",
      });
    }

    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    // --- Tier-based language gate ---
    const clerkUserId = req.auth?.()?.userId ?? req.auth?.userId ?? null;
    const userTier = await getUserTier(clerkUserId);
    const perms = getTierPermissions(userTier);
    if (!perms.languages.includes(language.toLowerCase())) {
      return res.status(403).json({
        success: false,
        code: "LANGUAGE_LOCKED",
        message: `${language} is not available on your current plan. Upgrade to unlock more languages.`,
      });
    }

    if (Buffer.byteLength(code, "utf8") > MAX_CODE_SIZE) {
      return res.status(400).json({
        success: false,
        error: "Code exceeds maximum allowed size of 64KB.",
      });
    }

    if (Buffer.byteLength(stdin, "utf8") > MAX_STDIN_SIZE) {
      return res.status(400).json({
        success: false,
        error: "stdin input exceeds maximum allowed size of 16KB.",
      });
    }

    // --- Run the code ---
    const result = await runUserCode(language.toLowerCase(), code, stdin);

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("[runCode] Internal error:", error);
    return res.status(500).json({
      success: false,
      verdict: "Internal Error",
      error: "An unexpected internal error occurred.",
    });
  }
};

/**
 * POST /api/code/submit
 * 
 * Submits user code against all hidden test cases for a problem.
 * Returns full verdict with per-test-case results.
 * 
 * Request body:
 *   { problemId: string, language: string, code: string }
 * 
 * Response:
 *   { success, verdict, testCasesPassed, totalTestCases, executionTime, results[] }
 */
export const submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    // --- Input validation ---
    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        error: "problemId, language, and code are required fields.",
      });
    }

    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`,
      });
    }

    // --- Tier-based checks (language + daily submission limit) ---
    const clerkUserId = req.auth?.()?.userId ?? req.auth?.userId ?? null;
    const userTier = await getUserTier(clerkUserId);
    const perms = getTierPermissions(userTier);

    // Language gate
    if (!perms.languages.includes(language.toLowerCase())) {
      return res.status(403).json({
        success: false,
        code: "LANGUAGE_LOCKED",
        message: `${language} is not available on your current plan. Upgrade to unlock more languages.`,
      });
    }

    // Daily submission limit
    if (clerkUserId && perms.maxSubmissionsPerDay !== Infinity) {
      const todayStart = startOfTodayUTC();
      const submissionsToday = await Submission.countDocuments({
        userId: clerkUserId,
        createdAt: { $gte: todayStart },
      });
      if (submissionsToday >= perms.maxSubmissionsPerDay) {
        return res.status(429).json({
          success: false,
          code: "DAILY_LIMIT_REACHED",
          message: `You have reached your daily submission limit of ${perms.maxSubmissionsPerDay}. Upgrade your plan for more submissions.`,
          limit: perms.maxSubmissionsPerDay,
          used: submissionsToday,
        });
      }
    }

    if (Buffer.byteLength(code, "utf8") > MAX_CODE_SIZE) {
      return res.status(400).json({
        success: false,
        error: "Code exceeds maximum allowed size of 64KB.",
      });
    }

    // --- Judge the submission ---
    const result = await judgeSubmission(
      problemId.toLowerCase(),
      language.toLowerCase(),
      code
    );

    // Save submission to database if user is authenticated via Clerk
    const userId = req.auth().userId;
    if (userId) {
      try {
        const problem = await AdvancedProblem.findOne({ slug: problemId.toLowerCase() });
        if (problem) {
          await Submission.create({
            userId,
            problemId: problem._id,
            problemSlug: problem.slug,
            code,
            language: language.toLowerCase(),
            verdict: result.verdict,
            testCasesPassed: result.testCasesPassed || 0,
            totalTestCases: result.totalTestCases || 0,
            runtimeMs: result.executionTime || 0,
          });
        }
      } catch (saveError) {
        console.error("[submitCode] Error saving submission:", saveError);
        // We don't fail the request if saving history fails
      }
    }

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("[submitCode] Internal error:", error);
    return res.status(500).json({
      success: false,
      verdict: "Internal Error",
      error: "An unexpected internal error occurred.",
    });
  }
};
