/**
 * Code Execution Routes
 * 
 * Registers the two main endpoints for the online judge:
 *   POST /api/code/run    — Run code against custom/sample input
 *   POST /api/code/submit — Submit code against hidden test cases
 */

import { Router } from "express";
import { runCode, submitCode } from "../controllers/codeExecutionController.js";

const router = Router();

// POST /api/code/run
router.post("/run", runCode);

// POST /api/code/submit
router.post("/submit", submitCode);

export default router;
