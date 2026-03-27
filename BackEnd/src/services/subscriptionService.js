import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

/**
 * Periodically checks for active subscriptions that have passed their end date
 * and reverts those users back to the free tier.
 */
export const checkExpiredSubscriptions = async () => {
    try {
        const now = new Date();
        // Find active subscriptions where endDate is less than or equal to now
        const expiredSubscriptions = await Subscription.find({
            status: "active",
            endDate: { $lte: now }
        });

        if (expiredSubscriptions.length === 0) return;

        console.log(`[Subscription Service] Found ${expiredSubscriptions.length} expired subscriptions to process.`);

        for (const sub of expiredSubscriptions) {
            try {
                // 1. Update the User record in DB
                const user = await User.findById(sub.userId);
                if (user) {
                    user.subscriptionTier = "free";
                    user.subscriptionExpiry = null;
                    user.isPro = false;
                    await user.save();

                    // 2. Sync the status with Clerk publicMetadata
                    await clerkClient.users.updateUserMetadata(user.clerkId, {
                        publicMetadata: {
                            subscriptionTier: "free",
                            subscriptionExpiry: null,
                            isPro: false
                        }
                    });
                    console.log(`[Subscription Service] Reverted user ${user.clerkId} to free tier.`);
                }

                // 3. Mark the Subscription record as expired
                sub.status = "expired";
                await sub.save();

                console.log(`[Subscription Service] Marked subscription ${sub._id} as expired.`);
            } catch (err) {
                console.error(`[Subscription Service] Failed to process expiry for subscription ${sub._id}:`, err);
            }
        }
    } catch (error) {
        console.error("[Subscription Service] Fatal error in periodic expiry check:", error);
    }
};
