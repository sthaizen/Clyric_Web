import { runInProcessSandbox } from '../sandboxes/processSandbox.js';
import path from 'path';

/**
 * Python Runner
 * Uses `python` (or `python3` on Linux/Mac) to execute the code.
 */
export const runPython = async (sourcePath, inputPath, timeLimit, outputLimit) => {
  const cwd = path.dirname(sourcePath);

  const command = process.platform === 'win32' ? 'python' : 'python3';

  const result = await runInProcessSandbox(
    command, 
    [sourcePath], 
    cwd, 
    inputPath, 
    timeLimit
  );

  return result;
};
