import { useEffect, useState, useRef } from "react";

const VideoCallModal = ({ user, localStream, remoteStream, callStatus, onHangUp }) => {
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    let interval;
    if (callStatus === "in-call") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-white text-xl font-semibold">🎥 Appel vidéo</h2>
        <p className="text-white font-medium">{user.fullName}</p>
        <p className="text-white">
          {callStatus === "calling"
            ? "En attente d'acceptation..."
            : `Durée : ${formatTime(callDuration)}`}
        </p>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <p className="text-white text-xs mb-1">Vous</p>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-40 rounded shadow"
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-white text-xs mb-1">Partenaire</p>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-40 rounded shadow"
            />
          </div>
        </div>
        <button
          onClick={onHangUp}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
        >
          Raccrocher
        </button>
      </div>
    </div>
  );
};

export default VideoCallModal;
