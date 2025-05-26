import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import companyRoutes from "./routes/company.routes.js";
import userRoutes from "./routes/user.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import paymentroutes from "./routes/payment.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uniqueId = uuidv4();
console.log(uniqueId);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "10mb" }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "controllers", "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/paymentreciept", companyRoutes);
app.use("/api/userInformation", userRoutes);
app.use("/api/problem", problemRoutes);
app.use("/", paymentroutes);

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

// let storedCharges = null;
// let storedServiceCharges = null;

io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle joining room
  socket.on("joinRoom", ({ userId, companyId }) => {
    const roomId = `${userId}_${companyId}`;
    const trackingRoomId = `${roomId}_tracking`;
    const roomNamed = `${userId}_${companyId}_workdone`;
    const roomName = `${userId}_${companyId}`;
    socket.join(roomName);
    socket.join(roomId);
    socket.join(trackingRoomId);
    socket.join(roomNamed);
    console.log(
      `User ${userId} joined room: ${roomId} and tracking room: ${trackingRoomId}`
    );

    socket.emit("roomJoined", { userId, companyId });
  });

  // Handle problems from the user
  socket.on("User_Problems", (data) => {
    const { userId, companyId, message, location } = data; // Include location in data
    const roomId = `${userId}_${companyId}`;

    console.log(
      `Received problems from User ${userId} for Company ${companyId}:`,
      data
    );

    if (roomId) {
      // Emit problems and location to the company (roomId)
      io.to(roomId).emit("recieved_user_problems", {
        message,
        location,
        userId,
        companyId,
      });
      console.log(`Emitted data to room ${roomId}`);
    } else {
      console.error("Room ID is not defined, unable to emit data.");
    }
    if (roomId) {
      // Emit problems and location to the company (roomId)
      io.to(roomId).emit("Payment_reciept", {
        message,
      });
      console.log(`Emitted message to payment room ${roomId}`);
    } else {
      console.error("Room ID is not defined, unable to emit data.");
    }
  });

  // Handle status updates
  socket.on("ProviderTrackingInformation", (data) => {
    console.log(data);
    io.emit("providerTrackingInformation", data);
  });
  socket.on("Send_Status", (data) => {
    io.emit("Status_Checked", data);
  });

  socket.on(
    "updateProviderLocation",
    ({ userId, companyId, location, senderType }) => {
      const trackingRoomId = `${userId}_${companyId}_tracking`;
      console.log(`Received location update from ${senderType}:`, location);

      io.to(trackingRoomId).emit("locationUpdateProvider", {
        location,
        senderType,
      });
      console.log(`Emitting to room ${trackingRoomId}:`, {
        location,
        senderType,
      });
    }
  );

  socket.on(
    "updateUserLocation",
    ({ userId, companyId, location, senderType }) => {
      const trackingRoomId = `${userId}_${companyId}_tracking`;
      console.log(`Received location update from ${senderType}:`, location);

      io.to(trackingRoomId).emit("locationUpdateUser", {
        location,
        senderType,
      });
      console.log(`Emitting to room ${trackingRoomId}:`, {
        location,
        senderType,
      });
    }
  );

  socket.on("PaymentDone", (data) => {
    console.log("Payment done", data);
    io.emit("Payment_Proceed", data);
  });

  socket.on("workDone", ({ userId, companyId }) => {
    const roomName = `${userId}_${companyId}`;

    console.log("Worked Done between", userId, companyId);
    io.to(roomName).emit("WorkDone");
  });

  socket.on(
    "WorkDoneXharges",
    ({ userId, companyId, charges, servicecharges }) => {
      const roomName = `${userId}_${companyId}`;
      console.log("Worked Done charges ", charges, servicecharges);
      io.to(roomName).emit("workdonecharges", { charges, servicecharges });
      console.log("workdonecharges emmitted", charges, servicecharges);
    }
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
