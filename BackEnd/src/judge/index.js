import { getLanguageConfig, isLanguageSupported } from './languageConfigs/index.js';
import { createTempDirectory, writeFiles } from './helpers/fileHelper.js';

/**
 * Main Judge Execution Orchestrator
 * 
 * Takes a code submission, selects the appropriate runner based on language,
 * handles the filesystem sandbox setup/teardown, and executes the code.
 * 
 * Returns a standardized result object containing the execution verdict.
 * 
 * @param {object} params
 * @param {string} params.language - e.g. "javascript"
 * @param {string} params.code     - User's code
 * @param {string} params.stdin    - Optional input to feed to the program
 * @param {number} params.timeLimit- Optional custom time limit (ms)
 * @param {number} params.outputLimit - Optional output limit in bytes
 * @returns {Promise<object>}
 */
export const runInJudge = async ({ language, code, stdin = "", timeLimit = null, outputLimit = 65536 }) => {
  if (!isLanguageSupported(language)) {
    return {
      verdict: 'Internal Error',
      runtimeError: `Language '${language}' is not configured in the judge.`,
    };
  }

  const config = getLanguageConfig(language);
  const actualTimeLimit = timeLimit || config.defaultTimeLimit;

  // 1. Setup isolated filesystem
  const { tempDir, cleanup } = await createTempDirectory();

  try {
    // 2. Write code and input to disk
    const { sourcePath, inputPath } = await writeFiles(
      tempDir, 
      config.filename, 
      code, 
      stdin
    );

    // 3. Delegate to language-specific runner
    // (This handles compilation if necessary)
    const runResult = await config.runner(sourcePath, inputPath, actualTimeLimit, outputLimit);

    // 4. Standardize the output verdict
    let verdict = 'Accepted'; // Default if run completed normally

    if (runResult.compileError) {
      verdict = 'Compile Error';
    } else if (runResult.isTLE) {
      verdict = 'Time Limit Exceeded';
    } else if (runResult.code !== 0) {
      // Non-zero exit code usually means runtime exception
      verdict = 'Runtime Error';
    }

    return {
      verdict,
      stdout: runResult.stdout || "",
      stderr: runResult.stderr || "",
      compileError: runResult.compileError || "",
      runtimeError: resultIsRuntimeError(verdict, runResult),
      executionTime: runResult.executionTime || 0,
    };

  } catch (err) {
    console.error(`[runInJudge] Fatal execution error for ${language}:`, err);
    return {
      verdict: 'Internal Error',
      runtimeError: err.message,
    };
  } finally {
    // 5. Cleanup ALWAYS runs, even if execution throws
    await cleanup();
  }
};

/**
 * Format the runtime error clearly. If stderr exists, we use it.
 * If not, but it exited with 137 (SIGKILL) early, we note that it was killed.
 */
function resultIsRuntimeError(verdict, runResult) {
  if (verdict !== 'Runtime Error') return "";
  if (runResult.stderr && runResult.stderr.trim().length > 0) return runResult.stderr;
  
  if (runResult.signal) {
     return `Process killed by signal: ${runResult.signal}`;
  }

  return `Process exited with code ${runResult.code}`;
}
