// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectToMongoDB from "./db/connectToMongoDB.js";
// import authRoutes from "./routes/auth.routes.js";
// import emergencyRoutes from "./routes/emergency.routes.js";
// import problemRoutes from "./routes/problem.routes.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import { Server } from "socket.io";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Define __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: "10mb" })); // Increase to 10MB
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "controllers", "uploads"))
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/emergency", emergencyRoutes);
// app.use("/api/problem", problemRoutes);

// // Create an HTTP server
// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectToMongoDB();
// });

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connected to Clients");

//   socket.on("joinRoom", ({ userId, companyId }) => {
//     const roomId = `${userId}_${companyId}`;
//     socket.join(roomId);
//     console.log(`User with ID: ${userId} joined room: ${roomId}`);
//   });

//   socket.on("User_Problems", (data) => {
//     const { userId, companyId } = data;
//     const roomId = `${userId}_${companyId}`;
//     console.log(
//       `Received problems from User ${userId} for Company ${companyId}:`,
//       data
//     );
//     io.to(roomId).emit("recieved_user_problems", data);

//     // io.emit("recieved_user_problems", data);
//   });

//   socket.on("Send_Status", (data) => {
//     console.log(data);
//     io.emit("Status_Checked", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import problemRoutes from "./routes/problem.routes.js";
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

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "controllers", "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/problem", problemRoutes);

// Create an HTTP server

// const server = app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectToMongoDB();
// });

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Client connected");

//   // Fetch userId and companyId upon connection or from client request
//   socket.on("joinRoom", ({ userId, companyId }) => {
//     const roomId = `${userId}_${companyId}`;
//     socket.join(roomId);
//     console.log(`User ${userId} joined room: ${roomId}`);

//     // Emit userId and companyId directly back to the client
//     socket.emit("roomJoined", { userId, companyId });
//   });

//   socket.on("User_Problems", (data) => {
//     const { userId, companyId } = data;
//     const roomId = `${userId}_${companyId}`;
//     console.log(
//       `Received problems from User ${userId} for Company ${companyId}:`,
//       data
//     );

//     if (roomId) {
//       io.to(roomId).emit("recieved_user_problems", data);
//       console.log(`Emitted data to room ${roomId}`);
//     } else {
//       console.error("Room ID is not defined, unable to emit data.");
//     }
//   });

//   socket.on("Send_Status", (data) => {
//     io.emit("Status_Checked", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Assuming you have a MongoDB connection function
  connectToMongoDB();
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle joining room
  socket.on("joinRoom", ({ userId, companyId }) => {
    const roomId = `${userId}_${companyId}`;
    const trackingRoomId = `${roomId}_tracking`;
    // Define tracking room here
    const roomName = `${userId}_${companyId}`;
    socket.join(roomName);
    socket.join(roomId);
    socket.join(trackingRoomId); // Join tracking room for location updates
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
  });

  // Handle status updates
  socket.on("ProviderTrackingInformation", (data) => {
    console.log(data);
    io.emit("providerTrackingInformation", data);
  });
  socket.on("Send_Status", (data) => {
    io.emit("Status_Checked", data);
  });

  socket.on("updateLocation", ({ userId, companyId, location, senderType }) => {
    const trackingRoomId = `${userId}_${companyId}_tracking`;
    console.log(`Received location update from ${senderType}:`, location);
    if (1) {
      console.log(
        `Received location update from emitted ${senderType}:`,
        location
      );
      io.to(trackingRoomId).emit("locationUpdateUser", {
        location,
        senderType,
      });
      console.log(
        `Received location update from emitted  ${senderType}:`,
        location
      );
      io.to(trackingRoomId).emit("locationUpdateProvider", {
        location,
        senderType,
      });
    }
  });

  socket.on("workDone", ({ userId, companyId }) => {
    const roomName = `${userId}_${companyId}`;
    console.log("Worked Done");
    // io.to(roomName).emit("WorkDone");
    io.emit("WorkDone");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
