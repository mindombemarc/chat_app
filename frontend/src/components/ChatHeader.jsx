import { X, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useLanguageStore } from "../store/langueStore.js";
import translations from "../lib/translations.js";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AudioCallModal from "./AudioCallModal";
import VideoCallModal from "./VideoCallModal";

const socket = io("http://localhost:5001");

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { user, onlineUsers } = useAuthStore();


const { language } = useLanguageStore();
  const t = translations[language];

  const [callStatus, setCallStatus] = useState("idle");
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [showUserInfos, setShowUserInfos] = useState(false);
  const [showImageFull, setShowImageFull] = useState(false);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: targetId,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
    };

    return pc;
  };

  useEffect(() => {
    socket.on("call-made", async (data) => {
      peerConnectionRef.current = createPeerConnection(data.from);

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: data.isVideo,
      });
      localStreamRef.current = localStream;

      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
      });

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("make-answer", {
        answer,
        to: data.from,
      });

      setCallStatus("in-call");
      data.isVideo ? setIsVideoCall(true) : setIsAudioCall(true);
    });

    socket.on("answer-made", async (data) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      setCallStatus("in-call");
    });

    socket.on("ice-candidate", (data) => {
      const candidate = new RTCIceCandidate(data.candidate);
      peerConnectionRef.current.addIceCandidate(candidate);
    });

    return () => {
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
    };
  }, []);

  const handleAudioCall = async () => {
    peerConnectionRef.current = createPeerConnection(selectedUser._id);
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    localStreamRef.current = localStream;
    localStream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("call-user", {
      offer,
      to: selectedUser._id,
      isVideo: false,
    });

    setIsAudioCall(true);
    setCallStatus("calling");
  };

  const handleVideoCall = async () => {
    peerConnectionRef.current = createPeerConnection(selectedUser._id);
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localStreamRef.current = localStream;
    localStream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("call-user", {
      offer,
      to: selectedUser._id,
      isVideo: true,
    });

    setIsVideoCall(true);
    setCallStatus("calling");
  };

  const hangUpCall = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    setIsAudioCall(false);
    setIsVideoCall(false);
    setCallStatus("idle");
  };

  /*const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };*/
   const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(language === "ln" ? "fr-FR" : language);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowUserInfos(true)}
        >
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
            {onlineUsers.includes(selectedUser?._id)
              ? t.online
              : t.offline}
          </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button
          onClick={handleAudioCall}
          className="btn btn-sm btn-outline"
          title={t.audioCall}
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          onClick={handleVideoCall}
          className="btn btn-sm btn-outline"
          title={t.videoCall}
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-ghost"
          title={t.close}
        >
          <X className="w-5 h-5" />
        </button>
        </div>
      </div>

      {showUserInfos && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-base-100 w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
            <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-ghost"
          title={t.close}
        >
          <X className="w-5 h-5" />
        </button>
            <div className="flex flex-col items-center gap-4 mt-4">
              <img
                onClick={() => setShowImageFull(true)}
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-40 h-40 object-cover rounded-full ring-2 ring-primary cursor-pointer"
              />
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold">{selectedUser.fullName}</h2>
                <p className="text-sm text-zinc-500">{selectedUser.email}</p>
                {selectedUser.username && (
                  <p className="text-sm text-zinc-400">@{selectedUser.username}</p>
                )}
                {selectedUser.createdAt && (
                   <p className="text-sm text-zinc-500 mt-1">
            {t.memberSince} <strong>{formatDate(selectedUser?.createdAt)}</strong>
          </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showImageFull && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setShowImageFull(false)}
        >
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt="Profil"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {isAudioCall && (
        <AudioCallModal
          user={selectedUser}
          callStatus={callStatus}
          onHangUp={hangUpCall}
        />
      )}
      {isVideoCall && (
        <VideoCallModal
          user={selectedUser}
          localStream={localStreamRef.current}
          remoteStream={remoteStreamRef.current}
          callStatus={callStatus}
          onHangUp={hangUpCall}
        />
      )}
    </div>
  );
};

export default ChatHeader;