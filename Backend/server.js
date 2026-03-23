import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./config/database.js";
import redis from "./config/cache.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "./model/message.model.js";
import { corsOptions } from "./config/cors.js";

connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new SocketIOServer(server, { cors: corsOptions });

const onlineByUserId = new Map(); // userId -> socketId

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
      socket.handshake.headers?.cookie?.split("token=")?.[1]?.split(";")?.[0];

    if (!token) return next(new Error("Unauthorized"));

    const isTokenBlacklisted = await redis.get(token);
    if (isTokenBlacklisted) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", async (socket) => {
  const userId = socket.user?._id?.toString();
  if (userId) onlineByUserId.set(userId, socket.id);

  io.emit("presence:update", { userId, online: true });

  socket.on("chat:joinRoom", ({ room }) => {
    if (typeof room === "string" && room.trim()) socket.join(room.trim());
  });

  socket.on("chat:leaveRoom", ({ room }) => {
    if (typeof room === "string" && room.trim()) socket.leave(room.trim());
  });

  socket.on("chat:sendRoom", async ({ room, text }) => {
    try {
      if (!room || !text) return;
      const msg = await Message.create({
        kind: "room",
        room,
        text,
        from: socket.user._id,
      });
      io.to(room).emit("chat:roomMessage", {
        _id: msg._id,
        room: msg.room,
        text: msg.text,
        from: { _id: socket.user._id, username: socket.user.username },
        createdAt: msg.createdAt,
      });
    } catch {
      // ignore
    }
  });

  socket.on("chat:sendDM", async ({ toUserId, text }) => {
    try {
      if (!toUserId || !text) return;
      const msg = await Message.create({
        kind: "dm",
        text,
        from: socket.user._id,
        to: toUserId,
      });
      const payload = {
        _id: msg._id,
        text: msg.text,
        from: { _id: socket.user._id, username: socket.user.username },
        to: msg.to,
        createdAt: msg.createdAt,
      };
      socket.emit("chat:dmMessage", payload);
      const toSocket = onlineByUserId.get(toUserId.toString());
      if (toSocket) io.to(toSocket).emit("chat:dmMessage", payload);
    } catch {
      // ignore
    }
  });

  socket.on("disconnect", () => {
    if (userId) onlineByUserId.delete(userId);
    io.emit("presence:update", { userId, online: false });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
