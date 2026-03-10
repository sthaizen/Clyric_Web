import { runInProcessSandbox } from '../sandboxes/processSandbox.js';
import path from 'path';

/**
 * JavaScript Runner
 * Uses Node.js to execute the code.
 */
export const runJavaScript = async (sourcePath, inputPath, timeLimit, outputLimit) => {
  // Pass the script path directly to Node
  // Node natively supports execution without compilation
  const cwd = path.dirname(sourcePath);

  const result = await runInProcessSandbox(
    'node', 
    [sourcePath], 
    cwd, 
    inputPath, 
    timeLimit
  );

  return result;
};
