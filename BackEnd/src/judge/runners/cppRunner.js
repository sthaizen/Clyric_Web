import fs from 'fs';
import path from 'path';
import { runInProcessSandbox } from '../sandboxes/processSandbox.js';

/**
 * C++ Runner
 * 1. Compiles .cpp to an executable binary using `g++`
 * 2. If compile fails, returns compile error immediately
 * 3. Otherwise runs the binary with `processSandbox`
 */
export const runCpp = async (sourcePath, inputPath, timeLimit, outputLimit) => {
  const cwd = path.dirname(sourcePath);
  
  // Output executable name based on OS
  const ext = process.platform === 'win32' ? '.exe' : '';
  const outPath = path.join(cwd, `a${ext}`);

  // 1. Compile phase
  const compileResult = await runInProcessSandbox(
    'g++',
    ['-O2', sourcePath, '-o', outPath],
    cwd,
    null,
    10000 // 10s compile timeout max
  );

  // If compilation failed
  if (compileResult.code !== 0) {
    const errorMsg = compileResult.stderr || compileResult.stdout || "Unknown g++ compilation error";
    return {
      compileError: errorMsg.includes('ENOENT') 
        ? "C++ Compiler (g++) is not installed on the host system." 
        : errorMsg,
      executionTime: compileResult.executionTime,
    };
  }

  // Double check the executable actually exists
  if (!fs.existsSync(outPath)) {
    return {
      compileError: "Compiler produced no executable binary.",
      executionTime: 0,
    };
  }

  // 2. Execution Phase
  const command = outPath; // For windows just absolute path is fine

  const runResult = await runInProcessSandbox(
    command,
    [],
    cwd,
    inputPath,
    timeLimit,
    outputLimit
  );

  return runResult;
};
