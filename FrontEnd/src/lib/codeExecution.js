/**
 * Code Execution API
 * 
 * Replaces piston.js. Communicates with our custom Express backend.
 */

// Your Express Backend URL 
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api") + "/code";

/**
 * Run user code against provided standard input (for testing)
 * 
 * @param {string} language - selected programming language
 * @param {string} code - source code
 * @param {string} stdin - optional standard input (e.g. from sample test cases)
 * @returns {Promise<{success:boolean, verdict:string, stdout:string, stderr:string, compileError:string, runtimeError:string, executionTime:number}>}
 */
export async function runCode(language, code, stdin = "", token = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/run`, {
      method: "POST",
      headers,
      body: JSON.stringify({ language, code, stdin }),
    });

    if (!response.ok) {
      return {
        success: false,
        verdict: "Server Error",
        error: `HTTP error status: ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      verdict: "Connection Error",
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

/**
 * Submit user code against hidden test cases
 * 
 * @param {string} problemId - unique problem ID (e.g. "two-sum")
 * @param {string} language - selected programming language
 * @param {string} code - source code
 * @returns {Promise<{success:boolean, verdict:string, testCasesPassed:number, totalTestCases:number, executionTime:number, results:Array}>}
 */
export async function submitCode(problemId, language, code, token = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify({ problemId, language, code }),
    });

    if (!response.ok) {
      return {
        success: false,
        verdict: "Server Error",
        error: `HTTP error status: ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      verdict: "Connection Error",
      error: `Failed to submit code: ${error.message}`,
    };
  }
}
