import { v4 as uuidv4 } from "uuid";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import {
    PLANS,
    prepareEsewaForm,
    verifyEsewaStatus,
    initiateKhalti,
    verifyKhaltiLookup,
} from "../services/paymentService.js";
import { clerkClient } from "@clerk/express";
import { ENV } from "../lib/env.js";

/**
 * POST /api/payments/initiate
 * Body: { planId, gateway }
 */
export const initiatePayment = async (req, res) => {
    try {
        const { planId, gateway } = req.body;
        const user = req.user; // from protectRoute

        const plan = PLANS[planId];
        if (!plan) {
            return res.status(400).json({ success: false, message: "Invalid Plan ID" });
        }

        if (!["esewa", "khalti"].includes(gateway)) {
            return res.status(400).json({ success: false, message: "Invalid Gateway" });
        }

        // Check for existing active subscription to enforce single-plan policy
        const activeSub = await Subscription.findOne({
            userId: user._id,
            status: "active"
        });
        
        if (activeSub) {
            return res.status(400).json({
                success: false,
                message: "You already have an active subscription. Please cancel it first before purchasing a new plan."
            });
        }

        const transactionUuid = uuidv4();

        // 1. Create a pending transaction
        const transaction = await Transaction.create({
            userId: user._id,
            amount: plan.amount,
            gateway: gateway,
            status: "initiated",
            transactionUuid: transactionUuid,
            planId: planId,
            customerDetails: {
                name: user.name,
                email: user.email,
            },
        });

        // 2. Prepare gateway-specific initiation
        if (gateway === "esewa") {
            // eSewa v2 requires success_url and failure_url
            // Always prefer ENV.BACKEND_URL in production to avoid localhost leakage
            const forwardedProto = req.headers["x-forwarded-proto"]?.split(",")?.[0];
            const requestBaseUrl = `${forwardedProto || req.protocol}://${req.get("host")}`;
            const backendUrl = (ENV.NODE_ENV === "production" && ENV.BACKEND_URL) 
                ? ENV.BACKEND_URL 
                : (ENV.BACKEND_URL || requestBaseUrl);
                
            console.log(`[Payment] Initiating eSewa with Backend URL: ${backendUrl}`);

            const successUrl = `${backendUrl}/api/payments/verify/esewa`;
            const failureUrl = `${backendUrl}/api/payments/verify/esewa?reason=cancelled`;

            const formData = prepareEsewaForm(plan.amount, transactionUuid, successUrl, failureUrl);

            return res.status(200).json({
                success: true,
                gateway: "esewa",
                paymentUrl: ENV.ESEWA_PAYMENT_URL,
                formData: formData,
            });
        }

        if (gateway === "khalti") {
            const clientUrl = (ENV.NODE_ENV === "production" && ENV.CLIENT_URL)
                ? ENV.CLIENT_URL
                : (ENV.CLIENT_URL || "http://localhost:5173");
            const returnUrl = `${clientUrl}/dashboard?gateway=khalti&plan=${planId}`;
            console.log(`[Payment] Initiating Khalti with Return URL: ${returnUrl}`);
            
            const khaltiRes = await initiateKhalti(
                plan.amount,
                transactionUuid,
                plan.label,
                user.name,
                user.email,
                returnUrl
            );

            // Store pidx for verification
            transaction.pidx = khaltiRes.pidx;
            transaction.status = "pending";
            await transaction.save();

            return res.status(200).json({
                success: true,
                gateway: "khalti",
                paymentUrl: khaltiRes.payment_url,
            });
        }

    } catch (error) {
        console.error("Payment Initiation Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error during initiation" });
    }
};

/**
 * GET /api/payments/verify/esewa
 * Called by eSewa redirect: ?data=<base64_encoded_json>
 */
export const verifyEsewa = async (req, res) => {
    try {
        const { data, reason } = req.query;
        if (!data) {
            const failureReason = reason || "no_data_received";
            return res.redirect(`${ENV.CLIENT_URL}/dashboard?payment_status=error&gateway=esewa&reason=${failureReason}`);
        }

        // Decode Base64 data from eSewa v2
        const decodedString = Buffer.from(data, "base64").toString("utf-8");
        const decodedData = JSON.parse(decodedString);
        
        const { transaction_uuid, total_amount, status, ref_id, transaction_code } = decodedData;

        // 1. Find transaction in DB
        const transaction = await Transaction.findOne({ transactionUuid: transaction_uuid });
        if (!transaction) {
            return res.redirect(`${ENV.CLIENT_URL}/dashboard?payment_status=error&gateway=esewa&reason=transaction_not_found`);
        }

        // If already completed, just redirect
        if (transaction.status === "completed") {
            return res.redirect(`${ENV.CLIENT_URL}/dashboard?payment_status=success&gateway=esewa`);
        }

        console.log(`Verifying eSewa payment for UUID: ${transaction_uuid}, Status: ${status}`);
        
        // 2. Mandatory Server-Side Verification
        if (status === "COMPLETE") {
            try {
                const esewaRes = await verifyEsewaStatus(total_amount, transaction_uuid);
                console.log("eSewa Status Lookup Result:", esewaRes);
                
                if (esewaRes.status === "COMPLETE") {
                    const gatewayReferenceId =
                        esewaRes.ref_id ||
                        esewaRes.transaction_code ||
                        ref_id ||
                        transaction_code ||
                        null;

                    await activateUserSubscription(transaction, gatewayReferenceId, {
                        redirect: decodedData,
                        lookup: esewaRes,
                    });
                    console.log(`SUCCESS: Subscription activated for transaction ${transaction_uuid}`);
                    return res.redirect(`${ENV.CLIENT_URL}/dashboard?payment_status=success&gateway=esewa`);
                } else {
                    console.error(`eSewa Status verification REJECTED: Expected COMPLETE, got ${esewaRes.status}`);
                }
            } catch (err) {
                console.error("eSewa Verification Flow Error:", err);
            }
        }

        // If we fall through, it failed
        transaction.status = "failed";
        transaction.metadata = decodedData;
        await transaction.save();
        return res.redirect(`${ENV.CLIENT_URL}/dashboard?payment_status=error&gateway=esewa&reason=verification_failed`);

    } catch (error) {
        console.error("verifyEsewa error:", error);
        return res.redirect(`${ENV.CLIENT_URL}/dashboard?payment_status=error&gateway=esewa&reason=internal_server_error`);
    }
};

/**
 * POST /api/payments/verify/khalti
 * Body: { pidx }
 */
export const verifyKhalti = async (req, res) => {
    try {
        const { pidx } = req.body;
        if (!pidx) {
            return res.status(400).json({ success: false, message: "pidx is required" });
        }

        const transaction = await Transaction.findOne({ pidx: pidx });
        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        if (transaction.status === "completed") {
            return res.status(200).json({ success: true, message: "Already verified" });
        }

        // Backend Lookup Verification
        const khaltiRes = await verifyKhaltiLookup(pidx);
        
        if (khaltiRes.status === "Completed") {
            await activateUserSubscription(transaction, khaltiRes.transaction_id, khaltiRes);
            return res.status(200).json({ success: true, message: "Payment Verified Successfully" });
        }

        transaction.status = "failed";
        transaction.metadata = khaltiRes;
        await transaction.save();
        return res.status(400).json({ success: false, message: "Khalti verification failed" });

    } catch (error) {
        console.error("verifyKhalti error:", error);
        res.status(500).json({ success: false, message: "Internal server error during verification" });
    }
};

/**
 * Helper to update user tier and create subscription record.
 * ATOMIC implementation.
 */
async function activateUserSubscription(transaction, gatewayRefId, rawMetadata) {
    const session = await User.startSession();
    session.startTransaction();

    try {
        // 1. Update Transaction
        transaction.status = "completed";
        transaction.gatewayReferenceId = gatewayRefId;
        transaction.metadata = rawMetadata;
        await transaction.save({ session });

        // 2. Determine Expiry (60 days for first-time buyers, 30 otherwise)
        const previousSub = await Subscription.findOne({ 
            userId: transaction.userId, 
            status: { $in: ["active", "expired", "cancelled"] } 
        }).session(session);
        
        const isFirstTime = !previousSub;
        const durationDays = isFirstTime ? 60 : 30;

        const now = new Date();
        const expiry = new Date(now);
        expiry.setDate(expiry.getDate() + durationDays);

        // 3. Create Subscription
        await Subscription.create([{
            userId: transaction.userId,
            tier: transaction.planId,
            startDate: now,
            endDate: expiry,
            status: "active",
            transactionId: transaction._id,
        }], { session });

        // 4. Update User
        const user = await User.findById(transaction.userId).session(session);
        if (!user) throw new Error("User not found during subscription activation");

        user.subscriptionTier = transaction.planId;
        user.subscriptionExpiry = expiry;
        user.isPro = true;
        user.paymentHistory.push(transaction._id);
        await user.save({ session });

        // 5. Sync with Clerk Metadata
        try {
            await clerkClient.users.updateUserMetadata(user.clerkId, {
                publicMetadata: {
                    subscriptionTier: transaction.planId,
                    subscriptionExpiry: expiry.toISOString(),
                    isPro: true
                }
            });
            console.log(`Clerk Metadata Synced for user: ${user.clerkId} (Duration: ${durationDays} days)`);
        } catch (clerkErr) {
            console.error("Clerk Metadata Sync Error (Non-Fatal):", clerkErr);
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

/**
 * POST /api/payments/cancel
 * Cancels the active subscription and reverts to free tier.
 */
export const cancelSubscription = async (req, res) => {
    const session = await User.startSession();
    session.startTransaction();

    try {
        const user = req.user; // from protectRoute

        // 1. Update User Record
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $set: {
                subscriptionTier: "free",
                subscriptionExpiry: null,
                isPro: false
            }
        }, { session, new: true });

        // 2. Mark active subscription as cancelled
        await Subscription.updateMany(
            { userId: user._id, status: "active" },
            { $set: { status: "cancelled", endDate: new Date() } },
            { session }
        );

        // 3. Sync with Clerk
        try {
            await clerkClient.users.updateUserMetadata(user.clerkId, {
                publicMetadata: {
                    subscriptionTier: "free",
                    subscriptionExpiry: null,
                    isPro: false
                }
            });
        } catch (clerkErr) {
            console.error("Clerk Metadata Sync Error (Cancellation):", clerkErr);
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, message: "Subscription cancelled" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Cancellation error:", error);
        res.status(500).json({ success: false, message: "Internal server error during cancellation" });
    }
};

/**
 * GET /api/payments/check-first-time
 * Provides frontend with a Boolean to show the 60-day bonus info.
 */
export const checkFirstTimeBuyer = async (req, res) => {
    try {
        const userId = req.user._id;
        const previousSub = await Subscription.findOne({ 
            userId, 
            status: { $in: ["active", "expired", "cancelled"] } 
        });
        
        return res.status(200).json({ 
            success: true, 
            isFirstTime: !previousSub 
        });
    } catch (error) {
        console.error("Error in checkFirstTimeBuyer:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
