import dotenv from "dotenv";
dotenv.config();
import { exec } from "child_process";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;

// Create HTTP and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
  },
});

// Socket.io Middleware for Authentication
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;

    // Validate Project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    // Find Project
    const project = await projectModel.findById(projectId);
    if (!project) {
      return next(new Error("Project not found"));
    }
    socket.project = project;

    // Validate Token
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    // Attach user info to socket
    socket.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
});

// Socket.io Connection Event
io.on("connection", (socket) => {
  try {
    const roomId = socket.project._id.toString();
    socket.roomId = roomId;

    console.log(`User connected with socket ID: ${socket.id}`);

    // Join the project-specific room
    socket.join(roomId);

    // Prevent duplicate listeners
    if (socket.eventNames().includes("project-message")) {
      console.warn("Duplicate event listener detected for project-message");
      return;
    }

    // Handle incoming messages
    socket.on("project-message", async (data) => {
      try {
        const message = data.message;
        console.log(message);
        // Broadcast the message to other users in the room
        socket.broadcast.to(roomId).emit("project-message", data);

        // Check if the message contains AI trigger
        if (message.includes("@ai")) {
          const prompt = message.replace("@ai", "").trim();
          const result = await generateResult(prompt);

          // Call Python function and get the output
          exec("python3 hello.py", (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing Python script: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Python script error: ${stderr}`);
              return;
            }

            // Output from the Python script
            const pythonOutput = stdout.trim();
            console.log(`Python script output: ${pythonOutput}`);

            // Send Python output back to all clients in the room
            io.to(roomId).emit("project-message", {
              message: result, // You can append your AI result here
              sender: {
                _id: "ai",
                email: "AI",
              },
            });
          });
        }
      } catch (error) {
        console.error("Error handling project-message:", error.message);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected with socket ID: ${socket.id}`);
      socket.leave(roomId);
    });
  } catch (error) {
    console.error("Error during connection:", error.message);
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
