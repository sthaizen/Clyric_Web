// One-time script to drop the stale ProblemAnalytics collection
// This fixes the CastError caused by userId being indexed as ObjectId
// when it should be String (for Clerk user IDs).
// Run: node dropAnalytics.js

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DB_URL;

async function run() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB");
    
    const collections = await mongoose.connection.db.listCollections({ name: "problemanalytics" }).toArray();
    
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection("problemanalytics");
      console.log("✅ Dropped 'problemanalytics' collection successfully.");
      console.log("   It will be auto-recreated with the correct String userId type when the server restarts.");
    } else {
      console.log("ℹ️  Collection 'problemanalytics' does not exist. Nothing to drop.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

run();
