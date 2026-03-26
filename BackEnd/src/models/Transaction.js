import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "NPR",
        },
        gateway: {
            type: String,
            enum: ["esewa", "khalti"],
            required: true,
        },
        status: {
            type: String,
            enum: ["initiated", "pending", "completed", "failed"],
            default: "initiated",
        },
        transactionUuid: {
            type: String,
            unique: true,
            required: true,
        },
        gatewayReferenceId: {
            type: String,
            default: null,
        },
        pidx: {
            type: String, // Specifically for Khalti
            default: null,
        },
        planId: {
            type: String,
            required: true,
        },
        customerDetails: {
            name: String,
            email: String,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
