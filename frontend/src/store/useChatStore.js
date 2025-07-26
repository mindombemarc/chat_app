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

  // ✅ Pour l'appel entrant
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
      toast.error(error.response?.data?.message || "Erreur lors de la récupération des messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });

      // ✅ Met à jour lastMessagesByUser et recentChats après envoi
      set((state) => ({
        lastMessagesByUser: {
          ...state.lastMessagesByUser,
          [selectedUser._id]: res.data,
        },
      }));

      get().addRecentChat(selectedUser._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du message.");
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
      console.error("Erreur lors de la récupération des derniers messages :", error);
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
        users,
      } = get();

      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser?._id;

      // ✅ Ajoute au fil si on est dans la bonne conversation
      if (isMessageSentFromSelectedUser) {
        set({ messages: [...messages, newMessage] });
      }

      // ✅ Ajouter à la liste des récents
      addRecentChat(newMessage.senderId);

      // ✅ Mettre à jour le dernier message reçu
      set({
        lastMessagesByUser: {
          ...lastMessagesByUser,
          [newMessage.senderId]: newMessage,
        },
      });

      // ✅ Optionnel : Ajouter l'utilisateur à users[] si inconnu
      const userExists = users.find((u) => u._id === newMessage.senderId);
      if (!userExists) {
        get().getUsers(); // Rafraîchir la liste des utilisateurs
      }
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
        await axiosInstance.patch(`/messages/mark-as-seen/${selectedUser._id}`);
      } catch (err) {
        console.error("Erreur lors du marquage du message comme vu :", err.message);
      }
    }
  },

  // ✅ Abonnement aux événements d'appel
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
      // Gère ton signal WebRTC ici
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
