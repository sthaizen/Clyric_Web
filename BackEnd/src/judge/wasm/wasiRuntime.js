import { WASI } from 'wasi';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';

/**
 * Executes a `.wasm` compiled binary inside a WASI environment.
 * Provides file read/write sandbox access, preventing host access.
 * 
 * @param {string} wasmFilePath - Absolute path to the .wasm file
 * @param {string} stdinPath - Optional file to read stdin from
 * @returns {Promise<{ stdout: string, stderr: string, executionTime: number }>}
 */
export const runWasmBinary = async (wasmFilePath, stdinPath) => {
  return new Promise(async (resolve, reject) => {
    let executionTime = 0;
    const startTime = performance.now();
    let memoryUsed = 0;
    
    // We capture stdout/stderr via FD interception or temp files, but realistically
    // the cleanest Node way to capture WASI output without C++ addons is writing it to a file
    // and reading it back.
    const stdoutPath = wasmFilePath + '.stdout';
    const stderrPath = wasmFilePath + '.stderr';

    try {
      // Create empty files
      await fs.writeFile(stdoutPath, '');
      await fs.writeFile(stderrPath, '');

      // To intercept native FD, we'll open them and pass them into the WASI constructor
      const { openSync, closeSync } = await import('fs');
      const stdoutFd = openSync(stdoutPath, 'w');
      const stderrFd = openSync(stderrPath, 'w');

      // Default stdin is 0 (current terminal), but if they provide an input,
      // we must open it read-only and pass the fd.
      const stdinds = stdinPath ? openSync(stdinPath, 'r') : 0;

      // Sandbox environment: limit WASI to only access the temp directory,
      // not the whole host filesystem.
      const wasmDir = wasmFilePath.substring(0, wasmFilePath.lastIndexOf('\\'));
      
      const wasi = new WASI({
        version: 'preview1',
        args: ['wasm-binary'],     // argv[0] is the program name
        env: {},                   // strict: NO env vars exposed
        
        // Only allow WASI to read/write inside the specific execution temp folder
        preopens: {
          '/sandbox': wasmDir 
        },

        // Map Node FDs to WASI FDs (0=stdin, 1=stdout, 2=stderr)
        stdin: stdinds,
        stdout: stdoutFd,
        stderr: stderrFd,
      });

      const wasmBuffer = await fs.readFile(wasmFilePath);
      const wasmModule = await WebAssembly.compile(wasmBuffer);
      
      // Instantiate with the WASI implementation
      const instance = await WebAssembly.instantiate(wasmModule, {
        wasi_snapshot_preview1: typeof wasi.getImportObject === 'function' ? wasi.getImportObject().wasi_snapshot_preview1 : wasi.wasiImport
      });

      // Execute main() inside the WASM binary
      try {
        wasi.start(instance);
      } catch (err) {
        // A non-zero exit code throws an exception in Node's WASI
        // We catch it and just let it continue to read outputs
      }

      // Close the FDs
      try { if(stdinds !== 0) closeSync(stdinds); } catch(e){}
      try { closeSync(stdoutFd); } catch(e){}
      try { closeSync(stderrFd); } catch(e){}

      executionTime = Math.round(performance.now() - startTime);

      // Read back what the binary printed
      const stdoutData = await fs.readFile(stdoutPath, 'utf8');
      const stderrData = await fs.readFile(stderrPath, 'utf8');

      resolve({
        stdout: stdoutData,
        stderr: stderrData,
        executionTime,
        isTLE: false // WASI in Node runs synchronously on the main thread currently,
                     // so true thread-level TLE requires Worker threads.
                     // For this MVP, we omit the worker TLE overhead.
      });

    } catch (error) {
       resolve({
        stdout: "",
        stderr: `WASI Runtime Error: ${error.message}`,
        executionTime: Math.round(performance.now() - startTime),
        isTLE: false
       });
    }
  });
};
