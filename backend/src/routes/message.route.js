import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLastMessage, getMessages, getUsersForSidebar, markMessagesAsSeen, sendMessage ,markNotificationsAsSeen} from "../controllers/message.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.patch("/mark-as-seen/:id", protectRoute, markMessagesAsSeen);

router.post("/send/:id", protectRoute, upload.single("media"), sendMessage);
router.get("/last/:id", protectRoute, getLastMessage);
router.put("/notifications/:id", protectRoute, markNotificationsAsSeen);

export default router;
