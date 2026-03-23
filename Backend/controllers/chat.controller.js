import mongoose from "mongoose";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";

function normalizeLimit(value, fallback = 50) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 100);
}

export async function getChatBootstrap(req, res) {
  try {
    const [users, recentRoomMessages] = await Promise.all([
      User.find({ _id: { $ne: req.user._id } })
        .select("_id username email")
        .sort({ username: 1 })
        .limit(200),
      Message.find({ kind: "room", room: "global" })
        .populate("from", "_id username")
        .sort({ createdAt: -1 })
        .limit(40)
        .lean(),
    ]);

    const roomMessages = recentRoomMessages.reverse().map((message) => ({
      _id: message._id,
      kind: message.kind,
      room: message.room,
      text: message.text,
      createdAt: message.createdAt,
      from: {
        _id: message.from?._id,
        username: message.from?.username || "Unknown",
      },
    }));

    res.status(200).json({
      message: "Chat bootstrap",
      users,
      roomMessages,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getDirectMessages(req, res) {
  try {
    const { userId } = req.params;
    const limit = normalizeLimit(req.query.limit, 80);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await Message.find({
      kind: "dm",
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id },
      ],
    })
      .populate("from", "_id username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      message: "Direct messages",
      messages: messages.reverse().map((entry) => ({
        _id: entry._id,
        kind: entry.kind,
        text: entry.text,
        to: entry.to,
        createdAt: entry.createdAt,
        from: {
          _id: entry.from?._id,
          username: entry.from?.username || "Unknown",
        },
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
