import mongoose from "mongoose";
import { ENV } from "../lib/env.js";
import User from "../models/User.js";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({ secretKey: ENV.CLERK_SECRET_KEY });

const promoteUser = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(ENV.DB_URL);
    console.log("Connected.");

    const email = "sthayathartha234@gmail.com";
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`Successfully promoted ${email} to admin in DB.`);
      
      // Update Clerk Metadata as well so frontend useUser() sees it
      await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: {
          role: "admin"
        }
      });
      console.log(`Successfully updated Clerk metadata for ${email}.`);
      console.log("User Data:", user);
    } else {
      console.log(`User with email ${email} not found.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
};

promoteUser();

