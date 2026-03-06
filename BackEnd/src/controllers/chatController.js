import { chatClient } from "../lib/streamTemp.jsnp";

export async function getStreamToken( req,res) {
    try{
        const token = chatClient.createToken(req.user.clerkId) //clerk Id for stream 
        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image
        })
    }catch (error){
        console.log("Error in getStreamToken:", error.message)
            res.status(500).json({message: "Internal Server Error"})
    }
}