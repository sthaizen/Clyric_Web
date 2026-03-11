import { spawn } from 'child_process';
import fs from 'fs';

/**
 * A hardened wrapper around child_process.spawn.
 * - Handles killing the process if it goes over the timeLimit (TLE)
 * - Captures stdout/stderr up to a maximum buffer size
 * - Removes problematic environment variables
 * 
 * Future Upgrade Note:
 * For a true production Online Judge, replace this spawn() call with
 * Docker (e.g. `docker run --rm -i ...`) or nsjail/firejail for kernel-level
 * isolation and memory limit enforcement.
 * 
 * @param {string} command - The base executable (e.g. 'node', 'python3', './a.out')
 * @param {string[]} args  - Arguments passed to the executable
 * @param {string} cwd     - The temp directory to run in
 * @param {string} stdinPath - Optional file path containing stdin
 * @param {number} timeLimit - Maximum allowed runtime in MS (e.g. 5000)
 * @param {number} outputLimit - Max bytes to read from stdout (e.g. 65536)
 * @returns {Promise<{ stdout: string, stderr: string, executionTime: number, isTLE: boolean }>}
 */
export const runInProcessSandbox = (command, args, cwd, stdinPath, timeLimit = 5000, outputLimit = 65536) => {
  return new Promise((resolve) => {
    let stdoutData = '';
    let stderrData = '';
    let isTLE = false;

    // Secure the environment by explicitly picking only safe, standard OS environment variables.
    // Drop application secrets like DB_URL or CLERK_SECRET_KEY.
    const safeEnv = { 
      PATH: process.env.PATH,
      // Linux standard environment variables
      HOME: process.env.HOME,
      USER: process.env.USER,
      LOGNAME: process.env.LOGNAME,
      LANG: process.env.LANG,
      // Windows standard environment variables required for smooth execution
      USERPROFILE: process.env.USERPROFILE,
      APPDATA: process.env.APPDATA,
      LOCALAPPDATA: process.env.LOCALAPPDATA,
      TEMP: process.env.TEMP,
      TMP: process.env.TMP,
      SystemRoot: process.env.SystemRoot,
      SystemDrive: process.env.SystemDrive,
      HOMEDRIVE: process.env.HOMEDRIVE,
      HOMEPATH: process.env.HOMEPATH
    };

    const startTime = performance.now();

    // Spawn the child process without shell interpolation
    const child = spawn(command, args, {
      cwd,
      env: safeEnv,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false // keep it tied to parent lifecycle
    });

    // Write input if provided
    if (stdinPath) {
      try {
        const inputBuffer = fs.readFileSync(stdinPath);
        child.stdin.write(inputBuffer);
      } catch (err) {
        stderrData += `Warning: Failed to read input file: ${err.message}\n`;
      }
    }
    child.stdin.end();

    // Set up the timeout killer
    const timer = setTimeout(() => {
      isTLE = true;
      child.kill('SIGKILL'); // Hard kill
    }, timeLimit);

    // Read stdout
    child.stdout.on('data', (data) => {
      if (stdoutData.length < outputLimit) {
        stdoutData += data.toString('utf8');
      } else {
        child.kill('SIGKILL'); // Killed for output limit exceeded
      }
    });

    // Read stderr
    child.stderr.on('data', (data) => {
      if (stderrData.length < outputLimit) {
        stderrData += data.toString('utf8');
      }
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const executionTime = Math.round(performance.now() - startTime);

      resolve({
        stdout: stdoutData,
        stderr: stderrData,

        // If it exited non-zero but wasn't TLE
        code,

        // If it caught a fatal signal
        signal,

        executionTime,
        isTLE,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        stdout: stdoutData,
        stderr: stderrData + `\nProcess error: ${err.message}`,
        code: 1,
        executionTime: 0,
        isTLE: false,
      });
    });
  });
};
