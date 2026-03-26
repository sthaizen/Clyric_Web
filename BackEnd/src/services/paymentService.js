import crypto from "crypto";
import axios from "axios";
import { ENV } from "../lib/env.js";

/**
 * Single source of truth for payment plans.
 */
export const PLANS = {
    "practice-pack": { label: "Practice Pack", amount: 200 },
    "code-rooms": { label: "Code Rooms", amount: 400 },
    "interview-studio": { label: "Interview Studio", amount: 600 },
    "career-plus": { label: "Career Plus", amount: 800 },
};

// ─────────────────────────────────────────────────────────────────────────────
// ESEWA V2 LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates HMAC-SHA256 signature for eSewa v2.
 * Field Order: total_amount,transaction_uuid,product_code
 */
export const generateEsewaSignature = (total_amount, transaction_uuid, product_code) => {
    const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = crypto
        .createHmac("sha256", ENV.ESEWA_SECRET_KEY)
        .update(signatureString)
        .digest("base64");
    return hash;
};

/**
 * Prepares the form data for eSewa v2 redirection.
 */
export const prepareEsewaForm = (amount, transactionUuid, successUrl, failureUrl) => {
    // Round to 2 decimal places to be safe with eSewa's parsing
    const roundedAmount = Number(amount).toFixed(2);
    
    const signature = generateEsewaSignature(
        roundedAmount,
        transactionUuid,
        ENV.ESEWA_MERCHANT_CODE
    );

    return {
        amount: roundedAmount,
        tax_amount: "0.00",
        total_amount: roundedAmount,
        transaction_uuid: transactionUuid,
        product_code: ENV.ESEWA_MERCHANT_CODE,
        product_service_charge: "0.00",
        product_delivery_charge: "0.00",
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature,
    };
};

/**
 * Verifies eSewa v2 transaction via Status API.
 */
export const verifyEsewaStatus = async (total_amount, transaction_uuid) => {
    try {
        const response = await axios.get(ENV.ESEWA_STATUS_URL, {
            params: {
                product_code: ENV.ESEWA_MERCHANT_CODE,
                total_amount: total_amount,
                transaction_uuid: transaction_uuid,
            },
        });
        return response.data; // Expected { status: 'COMPLETE', ... }
    } catch (error) {
        console.error("eSewa Status Verification Error:", error.response?.data || error.message);
        throw error;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// KHALTI V2 LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initiates Khalti v2 e-payment.
 */
export const initiateKhalti = async (amount, transactionUuid, planLabel, customerName, customerEmail, returnUrl) => {
    try {
        const payload = {
            return_url: returnUrl,
            website_url: ENV.CLIENT_URL,
            amount: Math.round(amount * 100), // Khalti uses Paisa (integer)
            purchase_order_id: transactionUuid,
            purchase_order_name: planLabel,
            customer_info: {
                name: customerName || "Clyric User",
                email: customerEmail || "",
            },
        };

        const response = await axios.post(ENV.KHALTI_INITIATE_URL, payload, {
            headers: {
                Authorization: `Key ${ENV.KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });

        return response.data; // Expected { pidx, payment_url, ... }
    } catch (error) {
        console.error("Khalti Initiation Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Verifies Khalti v2 transaction via Lookup API.
 */
export const verifyKhaltiLookup = async (pidx) => {
    try {
        const response = await axios.post(
            ENV.KHALTI_LOOKUP_URL,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${ENV.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data; // Expected { status: 'Completed', ... }
    } catch (error) {
        console.error("Khalti Lookup Verification Error:", error.response?.data || error.message);
        throw error;
    }
};
