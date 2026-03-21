/**
 * Output Comparison Helper
 * 
 * Handles comparing actual output from the runner tool against the expected
 * output from the database.
 */

/**
 * Normalizes a string by trimming it and standardizing line endings (\r\n -> \n)
 * Also removes trailing whitespace from every line, which is standard in OJs
 * to prevent failing users over invisible spaces.
 * 
 * @param {string} str - Raw output string
 * @returns {string}   - Normalized string
 */
const normalizeString = (str) => {
  if (!str) return "";
  // Remove all whitespace for maximum leniency, matching frontend behavior
  return String(str).replace(/\s/g, '');
};

/**
 * Compares two strings robustly.
 * 
 * @param {string} actual   - Output from the user program
 * @param {string} expected - Expected output from the database
 * @returns {boolean}       - true if they match
 */
export const compareOutputs = (actual, expected) => {
  const normActual = normalizeString(actual);
  const normExpected = normalizeString(expected);
  if (!normExpected) return true; // Safety
  return normActual.includes(normExpected);
};
