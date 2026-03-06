import express from "express";
import path from "path"
import {ENV} from "./lib/env.js" 
import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve()


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "success api is running" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "success the book end point" });
});

// if the NODE_ENV is in production then only the frontend part gets activated 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../FrontEnd/dist")));

  app.get("/{any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../FrontEnd/dist/index.html "));
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