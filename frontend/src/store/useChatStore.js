import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  lastMessagesByUser: {}, // userId -> lastMessage
  recentChats: [],
  incomingCall: null,

  addRecentChat: (userId) => {
    const { recentChats } = get();
    const updated = [userId, ...recentChats.filter((id) => id !== userId)];
    set({ recentChats: updated });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      await get().fetchLastMessages();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des utilisateurs."
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors du chargement des messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    try {
      const config = formData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        formData,
        config
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message");
    }
  },

  fetchLastMessages: async () => {
    const { users } = get();
    const lastMessages = {};

    try {
      await Promise.all(
        users.map(async (user) => {
          const res = await axiosInstance.get(`/messages/last/${user._id}`);
          lastMessages[user._id] = res.data;
        })
      );
      set({ lastMessagesByUser: lastMessages });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des derniers messages :",
        error
      );
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const {
        addRecentChat,
        messages,
        selectedUser,
        lastMessagesByUser,
      } = get();

      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser?._id;

      // Ajouter à la conversation ouverte si concernée
      if (isMessageSentFromSelectedUser) {
        set({ messages: [...messages, newMessage] });
      }

      // Mettre à jour la notification et dernier message
      const updatedLastMessages = {
        ...lastMessagesByUser,
        [newMessage.senderId]: {
          ...newMessage,
          NotificationNewMessage: true,
        },
      };
      set({ lastMessagesByUser: updatedLastMessages });

      addRecentChat(newMessage.senderId);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });

    const { lastMessagesByUser } = get();
    const lastMessage = lastMessagesByUser[selectedUser._id];

    // Marquer messages comme vus
    if (lastMessage && !lastMessage.seen) {
      const updatedLastMessages = {
        ...lastMessagesByUser,
        [selectedUser._id]: {
          ...lastMessage,
          seen: true,
        },
      };
      set({ lastMessagesByUser: updatedLastMessages });

      try {
        await axiosInstance.patch(
          `/messages/mark-as-seen/${selectedUser._id}`
        );
      } catch (err) {
        console.error("Erreur marquage vu :", err.message);
      }
    }

    // Désactiver notification de nouveau message
    if (lastMessage?.NotificationNewMessage) {
      const updatedLastMessages = {
        ...lastMessagesByUser,
        [selectedUser._id]: {
          ...lastMessage,
          NotificationNewMessage: false,
        },
      };
      set({ lastMessagesByUser: updatedLastMessages });

      try {
        await axiosInstance.put(
          `/messages/notifications/${selectedUser._id}`
        );
      } catch (err) {
        console.error("Erreur désactivation notification :", err.message);
      }
    }
  },

  subscribeToCalls: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("incomingCall", (data) => {
      console.log("📞 Appel entrant :", data);
      set({
        incomingCall: {
          from: data.from,
          name: data.name,
          signal: data.signal,
        },
      });
    });

    socket.on("callAccepted", (signal) => {
      console.log("✅ Appel accepté :", signal);
      // Gérer signal WebRTC ici si besoin
    });
  },

  unsubscribeFromCalls: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("incomingCall");
    socket.off("callAccepted");
  },

  clearIncomingCall: () => {
    set({ incomingCall: null });
  },
}));
