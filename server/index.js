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
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Ensure the port is set to 5000 to match frontend calls

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

// Initialize server for Express.js
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongoDB();
});

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  console.log("New WebSocket connection established");

  ws.send(JSON.stringify({ message: "Welcome user, How can I assist you?" }));

  ws.on("message", function message(data) {
    console.log("Message received:", data);

    // Broadcast the message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(data); // Broadcast the received message
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
