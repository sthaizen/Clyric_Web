import { Inngest } from "inngest"
import { connectDB } from "./db.js"
import User from "../models/User.js"
import { upsertStreamUser, deleteStreamUser } from "./streamTemp.js";



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
        

       await upsertStreamUser({
        id: newUser.clerkId.tostring(),
        name: newUser.name,
        image: newUser.profileImage,
       })

       // send welcome email to the user
       
    }


)

const deleteUserFromDb = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},

    async ({event}) =>{
        await connectDB()

        const {id} = event.data

        await User.deleteOne({clerkId: id});

        await deleteStreamUser(id.tostring());
    }


)

export const functions = [syncUser, deleteUserFromDb];