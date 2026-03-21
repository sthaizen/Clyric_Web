/**
 * Judge Service
 * 
 * Handles the /submit endpoint logic.
 * 1. Loads the problem and its hidden test cases from the database.
 * 2. Runs the user code against every test case via `runInJudge`.
 * 3. Compares the actual output vs expected output.
 * 4. Aggregates the results into a final verdict.
 */

import AdvancedProblem from "../models/AdvancedProblem.js";
import { runInJudge } from "../judge/index.js";
import { compareOutputs } from "../judge/helpers/compareHelper.js";

/**
 * Judge a user's code submission against all hidden test cases.
 * 
 * @param {string} problemId - e.g. "two-sum"
 * @param {string} language  - e.g. "javascript"
 * @param {string} code      - User's source code
 * @returns {object}         - Verdict and per-test-case results
 */
export const judgeSubmission = async (problemId, language, code) => {
  // 1. Load problem
  const problem = await AdvancedProblem.findOne({ slug: problemId });
  if (!problem) {
    throw new Error(`Problem not found: ${problemId}`);
  }

  const testCases = problem.examples || [];
  if (testCases.length === 0) {
    return {
      verdict: "Internal Error",
      error: "This problem has no test cases configured.",
    };
  }

  const results = [];
  let finalVerdict = "Accepted";
  let maxExecutionTime = 0;
  let testCasesPassed = 0;

  // 2. Run against each test case sequentially
  // (In a real massive-scale system, this would be grouped or parallelized via a message queue)
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    // Execute
    const runResult = await runInJudge({
      language,
      code,
      stdin: testCase.input,
      timeLimit: problem.timeLimit,
      outputLimit: problem.outputLimit,
    });

    maxExecutionTime = Math.max(maxExecutionTime, runResult.executionTime || 0);

    // If it didn't even execute successfully, stop and return the error verdict
    if (runResult.verdict !== "Accepted") {
      finalVerdict = runResult.verdict;
      results.push({
        case: i + 1,
        status: runResult.verdict,
        time: runResult.executionTime,
        message: runResult.compileError || runResult.runtimeError,
      });
      break; // Stop on first failure
    }

    // 3. Compare output
    const isCorrect = compareOutputs(runResult.stdout, testCase.output);
    
    if (isCorrect) {
      testCasesPassed++;
      results.push({
        case: i + 1,
        status: "Accepted",
        time: runResult.executionTime,
      });
    } else {
      finalVerdict = "Wrong Answer";
      results.push({
        case: i + 1,
        status: "Wrong Answer",
        expected: testCase.output,
        actual: runResult.stdout,
        time: runResult.executionTime,
      });
      break; // Stop judging on first Wrong Answer
    }
  }

  // 4. Return summary
  return {
    verdict: finalVerdict,
    testCasesPassed,
    totalTestCases: testCases.length,
    executionTime: maxExecutionTime,
    results,
  };
};
