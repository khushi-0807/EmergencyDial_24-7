import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());

// Get the directory name from the current file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/problem", problemRoutes);

// Create an HTTP server
const server = app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
  connectToMongoDB();
});

const io = new Server(server, {
  // pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //Listens for new client connections to establish communication.
  console.log("connected to Clients");
  socket.on("User_Problems", (data) => {
    // Listens for specific data sent by a client, enabling interaction based on custom events.
    console.log(data);
    io.emit("recieved_user_problems", data); //Broadcasts data to all clients, useful for sharing updates or information in real-time.
    console.log(data);
  });

  socket.on("Send_Status", (data) => {
    console.log(data);
    io.emit("Status_Checked", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
