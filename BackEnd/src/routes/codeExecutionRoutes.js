/**
 * Code Execution Routes
 * 
 * Registers the two main endpoints for the online judge:
 *   POST /api/code/run    — Run code against custom/sample input
 *   POST /api/code/submit — Submit code against hidden test cases
 * 
 * These are kept open (no auth middleware) so the code editor works
 * without login. To protect them later, add `protectRoute` middleware:
 *   import { protectRoute } from "../middleware/protectRoute.js";
 *   router.post("/run", protectRoute, runCode);
 */

import { Router } from "express";
import { runCode, submitCode } from "../controllers/codeExecutionController.js";

const router = Router();

// POST /api/code/run
// Body: { language, code, stdin }
router.post("/run", runCode);

// POST /api/code/submit
// Body: { problemId, language, code }
router.post("/submit", submitCode);

export default router;
