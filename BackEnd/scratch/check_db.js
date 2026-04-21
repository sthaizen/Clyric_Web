import mongoose from 'mongoose';
import { ENV } from '../src/lib/env.js';
import Submission from '../src/models/Submission.js';

async function checkSubmissions() {
    try {
        await mongoose.connect(ENV.DB_URL);
        console.log("Connected to DB");
        
        const count = await Submission.countDocuments();
        console.log(`Total submissions in DB: ${count}`);
        
        const all = await Submission.find().limit(10).lean();
        console.log("Latest 10 submissions:", JSON.stringify(all, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSubmissions();
