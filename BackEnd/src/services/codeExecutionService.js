/**
 * Code Execution Service
 * 
 * Handles the /run endpoint logic: compile (if needed) + execute
 * a single code run against user-provided stdin.
 * 
 * Does NOT compare output against expected — that is judgeService's job.
 * This is useful for "Test" button in the editor.
 */

import { runInJudge } from "../judge/index.js";

/**
 * Run user code with given stdin and return the output.
 * 
 * @param {string} language - e.g. "javascript", "python", "cpp", "java"
 * @param {string} code     - The user's source code
 * @param {string} stdin    - Input to pass to the program
 * @returns {object}        - Structured result object
 */
export const runUserCode = async (language, code, stdin) => {
  // Delegate entirely to the judge engine with a single test case
  const result = await runInJudge({ language, code, stdin });

  // For a plain "run", we don't call it "Accepted" — just "Executed"
  // unless there was an error
  const verdict =
    result.verdict === "Accepted" ? "Executed" : result.verdict;

  return {
    verdict,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    compileError: result.compileError || "",
    runtimeError: result.runtimeError || "",
    executionTime: result.executionTime || 0,
    memoryUsed: result.memoryUsed || null,
  };
};
