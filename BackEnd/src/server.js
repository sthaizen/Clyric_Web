import express from "express";
import path from "path"
import cors from "cors"
import {serve} from "inngest/express"
import {clerkMiddleware} from "@clerk/express"

import {ENV} from "./lib/env.js" 
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js"

const app = express();

const __dirname = path.resolve()

//middleware
app.use(express.json())

//credentials:true = server allows the browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true})) 

app.use (clerkMiddleware())// this adds auth field to request object 

app.use("/api/inngest",serve({client: inngest, functions}))

app.use("/api/chat",chatRoutes)

app.get("/health", (req, res) => {

  res.status(200).json({ msg: "success api is running" });
});


// if the NODE_ENV is in production then only the frontend part gets activated 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../FrontEnd/dist")));

  app.get("/{any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../FrontEnd/dist/index.html"));
  });
}


app.listen(ENV.PORT, () => {
  console.log("Server is running on port:",ENV.PORT)
  connectDB();
}); 

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error(" Error starting the server", error);
  }
};

startServer();