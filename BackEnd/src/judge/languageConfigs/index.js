import { runJavaScript } from '../runners/javascriptRunner.js';
import { runPython } from '../runners/pythonRunner.js';
import { runCpp } from '../runners/cppRunner.js';
import { runJava } from '../runners/javaRunner.js';
import { runWasm } from '../runners/wasmRunner.js';

/**
 * Language Configuration Registry
 * 
 * Maps frontend language strings (e.g. 'python', 'javascript')
 * to the file extension, the compiled file type (if any), and the
 * specific runner function to use.
 */

export const LANGUAGE_CONFIGS = {
  javascript: {
    extension: 'js',
    filename: 'script.js',
    runner: runJavaScript,
    defaultTimeLimit: 5000,
  },
  python: {
    extension: 'py',
    filename: 'script.py',
    runner: runPython,
    defaultTimeLimit: 5000,
  },
  cpp: {
    extension: 'cpp',
    filename: 'main.cpp',
    runner: runCpp,
    defaultTimeLimit: 3000,
  },
  java: {
    extension: 'java',
    // Java requires the filename to match the public class.
    // We enforce "Main" for this system.
    filename: 'Main.java',
    runner: runJava,
    defaultTimeLimit: 8000, // JVM boot overhead
  },
  c: {
    extension: 'c',
    filename: 'main.c',
    runner: runWasm,
    defaultTimeLimit: 3000,
  }
};

/**
 * Validates if the language is supported
 */
export const isLanguageSupported = (language) => {
  return Object.prototype.hasOwnProperty.call(LANGUAGE_CONFIGS, language);
};

export const getLanguageConfig = (language) => {
  return LANGUAGE_CONFIGS[language];
};
