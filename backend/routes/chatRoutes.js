import express from "express";
import { getConversations, getMessages, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getConversations);
router.get("/:userId", getMessages);
router.post("/:userId", sendMessage);

export default router;