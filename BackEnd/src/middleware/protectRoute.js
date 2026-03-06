import { requireAuth} from "@clerk/express";
import User from "../models/User.js";


export const protectRoute = [
    requireAuth(),
    async (req,res, next) =>{
        try{
            const clerkId = req.auth().userId;

            if(!clerkId) return res.status(401).json({
                msg: "Unauthorized - invalid token"
            })

            const user = await User.findOne({clerkId})

            if(!user) return res.status(404).json({msg: "User not found"})

                req.user= user
                next()
        }catch (error){
            console.error("Error in protected Rout",error);
            res.status(500).json({message: "Internal Server Error"})
        }

    }
]
