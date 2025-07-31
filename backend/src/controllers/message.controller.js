import User from "../models/user.model.js";
import Message from "../models/message.model.js";

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



export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio } = req.body;   // ajout audio
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let audioUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    if (audio) {
      // audio doit être un base64 dataURL (ex: data:audio/webm;base64,...)
      // Cloudinary accepte les upload base64 aussi
      const uploadAudioResponse = await cloudinary.uploader.upload(audio, {
        resource_type: "video", // nécessaire pour audio/webm sur Cloudinary
      });
      audioUrl = uploadAudioResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      audio: audioUrl,
      NotificationNewMessage: true,
    });

    await newMessage.save();

    // Socket.io notification
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Erreur lors de l'envoi du message: ", error.message);
    res.status(500).json({ error: "Erreur du Serveur lors de l'envoi du message" });
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


