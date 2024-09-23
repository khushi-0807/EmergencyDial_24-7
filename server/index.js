import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Increase to 10MB
app.use('/uploads', express.static(path.join(__dirname, 'controllers', 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/problem", problemRoutes);

// Create an HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to Clients");

  socket.on("User_Problems", (data) => {
    console.log(data);
    io.emit("recieved_user_problems", data);
  });

  socket.on("Send_Status", (data) => {
    console.log(data);
    io.emit("Status_Checked", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
