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
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;