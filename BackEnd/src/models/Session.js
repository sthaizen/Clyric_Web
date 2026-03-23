import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    problem:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum: ["easy","medium","hard"],
        required:true
    },
    host:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status:{
        type: String,
        enum: ["active","completed"],
        default: "active"
    },
    //stream video call ID
    callId:{
        type: String,
        default: "",
    },
    // Session visibility: public (default) or private
    visibility:{
        type: String,
        enum: ["public", "private"],
        default: "public",
    },
    // Short room code for private sessions (e.g., "A3X-9K2")
    roomId:{
        type: String,
        unique: true,
        sparse: true,
    },
    // Hashed password for private sessions (optional)
    password:{
        type: String,
        default: null,
    },
},
    {timestamps: true}
)

const Session = mongoose.model("Session",sessionSchema)

export default Session