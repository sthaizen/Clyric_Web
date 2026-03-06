import { Inngest } from "inngest"
import { connectDB } from "./db.js"
import User from "../models/User.js"


export const inngest = new Inngest({ id: "Clyric" });


const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},

    async ({event}) =>{
        await connectDB()

        const {id,email_address, first_name, last_name, image_url} = event.data

        const newUser ={
            clerkId: id,
            email:email_address[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            profileImage:image_url
        }
        await User.create(newUser)
        

        //to do something 
    }


)

const deleteUserFromDb = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},

    async ({event}) =>{
        await connectDB()

        const {id} = event.data

        await User.deleteOne({clerkId: id});

        // to do something 
    }


)

export const functions = [syncUser, deleteUserFromDb];