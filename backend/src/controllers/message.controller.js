import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import multer from "multer";
import streamifier from "streamifier"; 
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Erreur lors de l'obtention des utilisateurs pour la barre latérale: ", error.message);
    res.status(500).json({ error: "Erreur du Serveur" });
  }
};



export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Erreur lors de l'obtention des Messages: ", error.message);
    res.status(500).json({ error: "Erreur du Serveur" });
  }
};
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let media = null;

    if (req.file) {
      const uploadFromBuffer = (buffer, resourceType = "image") =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

      const mimeType = req.file.mimetype;
      let uploadResponse;

      if (mimeType.startsWith("image/")) {
        uploadResponse = await uploadFromBuffer(req.file.buffer, "image");
      } else if (mimeType.startsWith("video/")) {
        uploadResponse = await uploadFromBuffer(req.file.buffer, "video");
      } else if (mimeType.startsWith("audio/")) {
        // Cloudinary traite audio comme vidéo
        uploadResponse = await uploadFromBuffer(req.file.buffer, "video");
      } else {
        return res.status(400).json({ error: "Type de fichier non supporté." });
      }

      media = {
        url: uploadResponse.secure_url,
        type: mimeType,
      };
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      media,
      NotificationNewMessage: true,
    });

    await newMessage.save();

    // Socket.io notification en temps réel
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi du message" });
  }
};


//  Récupère le dernier message échangé avec un utilisateur spécifique
export const getLastMessage = async (req, res) => {
  try {
    const userId = req.params.id;
    const myId = req.user._id;

    const lastMessage = await Message.findOne({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(lastMessage);
  } catch (error) {
    console.error("Erreur lors de l'obtention du dernier message:", error.message);
    res.status(500).json({ error: "Erreur du Serveur lors de l'obtention du dernier message" });
  }
};
//  Met à jour le statut de lecture d'un message
// ✅ Marquer les messages comme "vus"
export const markMessagesAsSeen = async (req, res) => {
  try {
    const myId = req.user._id;
    const userId = req.params.id;

    await Message.updateMany(
      {
        senderId: userId,     // messages venant de ce user
        receiverId: myId,     // vers moi
        seen: false           // seulement ceux non vus
      },
      { $set: { seen: true } }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Erreur dans markMessagesAsSeen:", error.message);
    res.status(500).json({ error: "Erreur du Serveur lors du marquage des messages comme vus" });
  }
};

export const markNotificationsAsSeen = async (req, res) => {
  try {
    const senderId = req.params.id; // celui qui a envoyé
    const receiverId = req.user._id; // celui qui reçoit et ouvre la conversation

    await Message.updateMany(
      { senderId, receiverId, NotificationNewMessage: true },
      { $set: { NotificationNewMessage: false } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erreur reset Notification:", error.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


