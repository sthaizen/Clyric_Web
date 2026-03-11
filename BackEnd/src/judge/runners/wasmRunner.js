import path from 'path';
import fs from 'fs';
import { runInProcessSandbox } from '../sandboxes/processSandbox.js';
import { runInWasiSandbox } from '../sandboxes/wasiSandbox.js';

/**
 * WebAssembly Runner
 * 1. Uses the system `emcc` to compile C/C++ code into `.wasm`
 * 2. Uses the native Node.js `WASI` module to execute the WebAssembly sandboxed
 * 
 * Note: If the host machine doesn't have `emcc` (Emscripten), this will fail 
 * gracefully and return a compiler error to the user stating the compiler is missing.
 */
export const runWasm = async (sourcePath, inputPath, timeLimit, outputLimit) => {
  const cwd = path.dirname(sourcePath);
  const outPath = path.join(cwd, 'program.wasm');

  // 1. Compilation Phase
  // We expect clang from wasi-sdk or emcc to be installed.
  // For simplicity, we assume emcc is on the path. 
  // It compiles to pure WASM, without the JS glue code.
  const compileResult = await runInProcessSandbox(
    'emcc',
    [
      sourcePath, 
      '-o', outPath, 
      '-O2', 
      '-s', 'STANDALONE_WASM', // emit just WASM, no HTML/JS
      '-s', 'EXPORTED_FUNCTIONS=["_main"]' // ensures main is available
    ],
    cwd,
    null,
    10000
  );

  // Fallback to standard clang if emcc failed due to missing command (code 1 or ENOENT-style stderr)
  // Just returning the error if the developer hasn't installed WASM tools yet is standard.
  if (compileResult.code !== 0) {
    const errorMsg = compileResult.stderr || compileResult.stdout || "Unknown emcc compilation error";
    return {
      compileError: errorMsg.includes('ENOENT') 
        ? "WASM Compiler (emcc) is not installed on the host system." 
        : `WASM Compile Error (ensure emcc is installed!):\n\n${errorMsg}`,
      executionTime: compileResult.executionTime,
    };
  }

  // Verify compilation success
  if (!fs.existsSync(outPath)) {
    return {
      compileError: "Compiler produced no .wasm file. Check your emcc installation.",
      executionTime: 0,
    };
  }

  // 2. Sandboxed Execution Phase via WASI
  const runResult = await runInWasiSandbox(outPath, inputPath, timeLimit);

  return runResult;
};
