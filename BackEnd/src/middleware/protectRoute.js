import { requireAuth} from "@clerk/express";
import User from "../models/User.js";


export const protectRoute = async (req, res, next) => {
    try {
        const auth = req.auth();
        const clerkId = auth.userId;

        if (!clerkId) {
            console.log("[Auth] Unauthorized access attempt detected (302 prevention)");
            return res.status(401).json({
                success: false,
                message: "Unauthorized - session missing or expired"
            });
        }

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User account not linked in database" 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error during authentication" 
        });
    }
};
