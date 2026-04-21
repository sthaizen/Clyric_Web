import mongoose from 'mongoose';
import { ENV } from '../src/lib/env.js';
import Conversation from '../src/models/Conversation.js';

async function findConversation() {
    try {
        await mongoose.connect(ENV.DB_URL);
        const participants = ["69be7605aea2ae5ddbb7c442", "69be8b0aaea2ae5ddbb7c444"];
        
        const conv = await Conversation.findOne({
            participants: { $all: participants }
        }).lean();
        
        if (conv) {
            console.log("FOUND_CONV_ID:", conv._id.toString());
        } else {
            console.log("NO_CONV_FOUND");
        }
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
findConversation();
