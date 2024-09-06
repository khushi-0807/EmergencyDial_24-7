import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js"

dotenv.config();

const app=express();
const PORT=process.env.PORT || 5000;

app.use("/api/auth",authRoutes);

app.listen(5000,()=>{
    console.log(`server is running on port ${PORT}`);
    connectToMongoDB();
})

