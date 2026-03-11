import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * Creates an isolated temporary directory for a specific execution run.
 * Returns the absolute path to the directory and a function to clean it up.
 * 
 * @returns {Promise<{ tempDir: string, cleanup: () => Promise<void> }>}
 */
export const createTempDirectory = async () => {
  // Use crypto to generate a unique ID for isolation (avoids UUID dependency)
  const uniqueId = crypto.randomUUID();
  
  // Use root project path for temp dir to keep things close
  // Process.cwd() works here, but path.resolve gets the guaranteed root.
  const tempDir = path.join(process.cwd(), 'src', 'temp', uniqueId);

  // Ensure it exists
  await fs.mkdir(tempDir, { recursive: true });

  const cleanup = async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.error(`[cleanupHelper] Failed to delete temp dir ${tempDir}:`, err.message);
    }
  };

  return { tempDir, cleanup };
};

/**
 * Writes code and optional stdin to physical files in the temp directory.
 * 
 * @param {string} tempDir  - Directory to write to
 * @param {string} filename - e.g. "Main.java", "solution.cpp", "script.js"
 * @param {string} code     - The source code
 * @param {string} stdin    - Optional standard input text
 * @returns {Promise<{ sourcePath: string, inputPath: string | null }>} - Paths written
 */
export const writeFiles = async (tempDir, filename, code, stdin) => {
  const sourcePath = path.join(tempDir, filename);
  await fs.writeFile(sourcePath, code, 'utf8');

  let inputPath = null;
  if (stdin && stdin.trim() !== "") {
    inputPath = path.join(tempDir, 'input.txt');
    await fs.writeFile(inputPath, stdin, 'utf8');
  }

  return { sourcePath, inputPath };
};
