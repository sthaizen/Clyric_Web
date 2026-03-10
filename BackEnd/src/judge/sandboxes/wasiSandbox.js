import { runWasmBinary } from '../wasm/wasiRuntime.js';

/**
 * WASI Sandbox
 * 
 * Wraps the WASI runtime logic to look identical to `processSandbox.js`
 * so the runner system can swap between them cleanly.
 * 
 * @param {string} wasmFile - The compiled .wasm file
 * @param {string} stdinPath - The input tests
 * @param {number} timeLimit - Time limit
 */
export const runInWasiSandbox = async (wasmFile, stdinPath, timeLimit) => {
  // We use our custom wrapper
  return await runWasmBinary(wasmFile, stdinPath);
};
