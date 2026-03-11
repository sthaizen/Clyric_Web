import fs from 'fs';
import path from 'path';
import { runInProcessSandbox } from '../sandboxes/processSandbox.js';

/**
 * Java Runner
 * 1. Compiles main class with `javac`
 * 2. Runs main class with `java`
 */
export const runJava = async (sourcePath, inputPath, timeLimit, outputLimit) => {
  const cwd = path.dirname(sourcePath);
  const className = path.basename(sourcePath, '.java'); // usually "Main"

  // 1. Compile Phase
  const compileResult = await runInProcessSandbox(
    'javac',
    [sourcePath],
    cwd,
    null,
    10000 // 10s compile time l imit
  );

  if (compileResult.code !== 0) {
    const errorMsg = compileResult.stderr || compileResult.stdout || "Unknown javac compilation error";
    return {
      compileError: errorMsg.includes('ENOENT') 
        ? "Java Compiler (javac) is not installed on the host system." 
        : errorMsg,
      executionTime: compileResult.executionTime,
    };
  }

  // Double check class file exists
  const classFile = path.join(cwd, `${className}.class`);
  if (!fs.existsSync(classFile)) {
    return {
      compileError: "Compiler produced no .class file.",
      executionTime: 0,
    };
  }

  // 2. Execution phase
  // Note: For advanced OJ's, we add flags like -Xmx256m to limit memory
  const runResult = await runInProcessSandbox(
    'java',
    ['-Xmx128m', className],
    cwd,
    inputPath,
    timeLimit,
    outputLimit
  );

  return runResult;
};
