import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLastMessage, getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.patch("/mark-as-seen/:userId", protectRoute, markMessagesAsSeen);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/last/:id", protectRoute, getLastMessage);
export default router;
