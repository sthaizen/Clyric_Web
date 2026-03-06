import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
    throw new Error("DB_URL is not defined in environment variables");
  }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Connected to mongoDB:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to mongoDB", error);
    process.exit(1); // 0 = success, 1 = fail
  }
};