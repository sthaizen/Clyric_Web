import mongoose from "mongoose";

const presenceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline"
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Presence = mongoose.model("Presence", presenceSchema);

export default Presence;
