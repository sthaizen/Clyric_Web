import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
        default: "",
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },  
    
    description: {
        type: String,
        default: "Hey there! I'm using Clyric.", 
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    status: {
        type: String,
        enum: ["active", "suspended", "banned"],
        default: "active",
    },

    // --- Subscription / Payment ---
    subscriptionTier: {
        type: String,
        enum: ["free", "practice-pack", "code-rooms", "interview-studio", "career-plus"],
        default: "free",
    },
    subscriptionExpiry: {
        type: Date,
        default: null,
    },
    isPro: {
        type: Boolean,
        default: false,
    },
    paymentHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        }
    ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;