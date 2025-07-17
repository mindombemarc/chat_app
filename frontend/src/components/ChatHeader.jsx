import { X, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AudioCallModal from "./AudioCallModal";
import VideoCallModal from "./VideoCallModal";

const socket = io("http://localhost:5001");

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { user, onlineUsers } = useAuthStore();

  const [callStatus, setCallStatus] = useState("idle"); // idle | calling | in-call
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

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

      if (data.isVideo) {
        setIsVideoCall(true);
      } else {
        setIsAudioCall(true);
      }
      setCallStatus("in-call"); // ✅ Dès qu'on répond
    });

    socket.on("answer-made", async (data) => {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      console.log("✅ Appel accepté !");
      setCallStatus("in-call"); // 🚀 Démarre compteur
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
    setCallStatus("calling"); // ⏳ En attente
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
    setCallStatus("calling"); // ⏳ En attente
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

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
              {onlineUsers.includes(selectedUser?._id) ? "En ligne" : "Off"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleAudioCall} title="Appel audio">
            <Phone />
          </button>
          <button onClick={handleVideoCall} title="Appel vidéo">
            <Video />
          </button>
          <button onClick={() => setSelectedUser(null)} title="Fermer">
            <X />
          </button>
        </div>
      </div>

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
