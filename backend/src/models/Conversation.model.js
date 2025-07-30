// /home/mindombemarc/chat_app/backend/src/
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    // 'participants' sera un tableau d'IDs d'utilisateurs qui font partie de cette conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Fait référence au modèle 'User'
        required: true,
      },
    ],
    // 'messages' sera un tableau d'IDs de messages appartenant à cette conversation
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // Fait référence au modèle 'Message'
        default: [], // Une nouvelle conversation commence sans messages
      },
    ],
  },
  { timestamps: true } // Ajoute automatiquement 'createdAt' et 'updatedAt'
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;