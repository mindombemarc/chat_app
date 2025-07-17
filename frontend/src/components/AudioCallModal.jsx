import { useEffect, useState } from "react";

const AudioCallModal = ({ user, callStatus, onHangUp }) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (callStatus === "in-call") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex w-full h-full items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg text-center shadow-xl w-80">
        <h2 className="text-xl font-semibold mb-2">📞 Appel audio</h2>
        <p className="mb-1 font-medium">{user.fullName}</p>
        <p className="mb-4 text-gray-600">
          {callStatus === "calling"
            ? "En attente d'acceptation..."
            : `Durée : ${formatTime(callDuration)}`}
        </p>
        <button
          onClick={onHangUp}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white  shadow"
        >
          Raccrocher
        </button>
      </div>
    </div>
  );
};

export default AudioCallModal;
