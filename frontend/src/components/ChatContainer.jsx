import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import AudioCallModal from "./AudioCallModal";
import VideoCallModal from "./VideoCallModal";

import { formatMessageTime } from "../lib/utils";
import { X } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    incomingCall,
    clearIncomingCall,
    subscribeToCalls,
    unsubscribeFromCalls,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    subscribeToCalls();

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromCalls();
    };
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToCalls,
    unsubscribeFromCalls,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen">
      <ChatHeader />

      {/* ✅ Modal pour appel entrant */}
      {incomingCall && (
        <AudioCallModal
          user={{ fullName: incomingCall.name }}
          callStatus="calling"
          onHangUp={clearIncomingCall}
        />
      )}

      {/* ✅ Zone scrollable des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition"
                  onClick={() => setSelectedImage(message.image)}
                />
              )}
              {message.audio && (
                <audio
                  controls
                  src={message.audio}
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Modale image en plein écran */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // évite la fermeture si clic sur l’image
          >
            <img
              src={selectedImage}
              alt="Full view"
              className="rounded-lg max-w-full max-h-full"
            />
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
