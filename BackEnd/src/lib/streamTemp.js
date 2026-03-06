import {StreamChat} from "stream-chat"
import {StreamClient} from "@stream-io/node-sdk"
import { ENV } from "./env.js";

const  apikey = ENV.STREAM_API_KEY
const apisecret = ENV.STREAM_API_SECRET

if (!apikey || !apisecret){
    console.error("Apikey or secret is missing")

}

export const streamClient = new StreamClient(apikey,apisecret); // for video calls
export const chatClient = StreamChat.getInstance(apikey,apisecret); // for chat feature


export const upsertStreamUser = async(userData) => { //create and update the data
    try{
        await chatClient.upsertUser(userData)
       console.log("Stream user upserted success:", userData)
    }catch (error){
        console.error("Error upserting Stream user", error)
    }
}

export const deleteStreamUser = async(userId) => { //create and update the data
    try{
        await chatClient.deleteUser(userId)
        console.log("Stream user deleted success:", userId)
    }catch (error){
        console.error("Error deleting the Stream user", error)
    }
    
}
