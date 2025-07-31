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
  const [selectedMedia, setSelectedMedia] = useState(null); // { url, type } ou null

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    subscribeToCalls();

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromCalls();
    };
  }, [
    selectedUser?._id,
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

      {incomingCall && (
        <AudioCallModal
          user={{ fullName: incomingCall.name }}
          callStatus="calling"
          onHangUp={clearIncomingCall}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
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

            {(message.media || message.text) && (
              <div className="chat-bubble flex flex-col gap-2 p-2 bg-[#f2f2f2] text-black">
                {/* Image */}
                {message.media && message.media.type.startsWith("image/") && (
                  <img
                    src={message.media.url}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md cursor-pointer hover:opacity-90 transition"
                    onClick={() =>
                      setSelectedMedia({ url: message.media.url, type: message.media.type })
                    }
                  />
                )}

                {/* Vidéo */}
                {message.media && message.media.type.startsWith("video/") && (
                  <video
                    controls
                    src={message.media.url}
                    className="sm:max-w-[200px] rounded-md cursor-pointer"
                    onClick={() =>
                      setSelectedMedia({ url: message.media.url, type: message.media.type })
                    }
                  />
                )}

                
                {message.media && message.media.type.startsWith("audio/") && (
                  <div className="bg-white text-black rounded-lg p-1 flex center">
                    <audio controls src={message.media.url} className="  sm:max-w-[200px] rounded-md mb-2" />
                  </div>
                )}

                {/* Texte */}
                {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
              </div>
            )}
          </div>
        ))}

        <div ref={messageEndRef} />
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type.startsWith("image/") && (
              <img
                src={selectedMedia.url}
                alt="Full view"
                className="rounded-lg max-w-full max-h-full"
              />
            )}
            {selectedMedia.type.startsWith("video/") && (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="rounded-lg max-w-full max-h-full"
              />
            )}

            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1"
              onClick={() => setSelectedMedia(null)}
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
