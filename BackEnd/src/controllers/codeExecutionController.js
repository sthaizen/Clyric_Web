

import { runUserCode } from "../services/codeExecutionService.js";
import { judgeSubmission } from "../services/judgeService.js";

// Maximum sizes to prevent DoS attacks
const MAX_CODE_SIZE = 64 * 1024;   // 64KB
const MAX_STDIN_SIZE = 16 * 1024;  // 16KB

// The languages our judge supports
const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp", "java", "c"];

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
