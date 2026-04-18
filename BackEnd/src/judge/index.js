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
 * @param {string} params.language
 * @param {string} params.code    
 * @param {string} params.stdin    
 * @param {number} params.timeLimit
 * @param {number} params.outputLimit 
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


    const runResult = await config.runner(sourcePath, inputPath, actualTimeLimit, outputLimit);

    // 4. Standardize the output verdict
    let verdict = 'Accepted'; 

    if (runResult.compileError) {
      verdict = 'Compile Error';
    } else if (runResult.isTLE) {
      verdict = 'Time Limit Exceeded';
    } else if (runResult.code !== 0) {

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

function resultIsRuntimeError(verdict, runResult) {
  if (verdict !== 'Runtime Error') return "";
  if (runResult.stderr && runResult.stderr.trim().length > 0) return runResult.stderr;
  
  if (runResult.signal) {
     return `Process killed by signal: ${runResult.signal}`;
  }

  return `Process exited with code ${runResult.code}`;
}
