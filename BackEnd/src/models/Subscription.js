import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tier: {
            type: String,
            enum: ["practice-pack", "code-rooms", "interview-studio", "career-plus"],
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true,
        },
    },
    { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
