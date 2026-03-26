import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    initiatePayment,
    verifyEsewa,
    verifyKhalti,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @route   POST /api/payments/initiate
 * @desc    Initiate a new payment transaction (eSewa or Khalti)
 * @access  Private
 */
router.post("/initiate", protectRoute, initiatePayment);

/**
 * @route   GET /api/payments/verify/esewa
 * @desc    eSewa Success/Failure callback redirect
 * @access  Public (Called by eSewa)
 */
router.get("/verify/esewa", verifyEsewa);

/**
 * @route   POST /api/payments/verify/khalti
 * @desc    Khalti verification (called by frontend with pidx)
 * @access  Public/Private (Can be called with pidx)
 */
router.post("/verify/khalti", verifyKhalti);

export default router;
