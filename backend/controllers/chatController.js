import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";

// Meri saari conversations (har banday ka last message + unread count)
export const getConversations = async (req, res) => {
  try {
    const me = req.user._id;
    const messages = await Message.find({ $or: [{ sender: me }, { receiver: me }] })
      .sort({ createdAt: -1 })
      .populate("sender", "name shopName role")
      .populate("receiver", "name shopName role");

    const map = new Map();
    for (const m of messages) {
      if (!m.sender || !m.receiver) continue;
      const other = m.sender._id.equals(me) ? m.receiver : m.sender;
      const key = other._id.toString();
      if (!map.has(key)) {
        map.set(key, { user: other, lastMessage: m.text, updatedAt: m.createdAt, unread: 0 });
      }
      if (m.receiver._id.equals(me) && !m.read) map.get(key).unread += 1;
    }

    res.json([...map.values()]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kisi ek bande ke saath poori chat (aur unread ko read mark karo)
export const getMessages = async (req, res) => {
  try {
    const me = req.user._id;
    const otherId = req.params.userId;

    if (!mongoose.isValidObjectId(otherId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await Message.find({
      $or: [
        { sender: me, receiver: otherId },
        { sender: otherId, receiver: me },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { sender: otherId, receiver: me, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Message bhejo
export const sendMessage = async (req, res) => {
  try {
    const me = req.user;
    const otherId = req.params.userId;
    const text = req.body.text?.trim();

    if (!text) return res.status(400).json({ message: "Message is empty" });
    if (!mongoose.isValidObjectId(otherId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (otherId === me._id.toString()) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const other = await User.findById(otherId);
    if (!other) return res.status(404).json({ message: "User not found" });

    // Sirf buyer <-> seller chat allowed
    const allowed =
      (me.role === "buyer" && other.role === "seller") ||
      (me.role === "seller" && other.role === "buyer");
    if (!allowed) {
      return res.status(403).json({ message: "Chat is only between buyer and seller" });
    }

    const message = await Message.create({ sender: me._id, receiver: otherId, text });

    // Real-time push
    req.app.get("io")?.to(otherId).emit("newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};