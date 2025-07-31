import { useState, useRef } from "react";
import { ImageIcon, Send, X, Mic, StopCircle } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const inputRef = useRef(null);

  const { sendMessage } = useChatStore();

  // Gérer image/vidéo
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeMB = 20;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`Le fichier dépasse ${maxSizeMB} Mo.`);
      return;
    }

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setMediaPreview(URL.createObjectURL(file));
      setMediaFile(file);
    }
  };

  // Enregistrement audio
  const handleAudioRecord = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      audioChunksRef.current = [];
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.start();
        setIsRecording(true);

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const audioFile = new File([audioBlob], "audio-message.webm", {
            type: "audio/webm",
          });

          setMediaPreview(URL.createObjectURL(audioBlob));
          setMediaFile(audioFile);
          stream.getTracks().forEach((track) => track.stop());
        };
      }).catch(() => {
        alert("Impossible d'accéder au microphone.");
      });
    }
  };

  const handleSend = async () => {
    if (!text && !mediaFile) return;

    const formData = new FormData();
    formData.append("text", text);
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    await sendMessage(formData);

    setText("");
    setMediaFile(null);
    setMediaPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="p-2 border-t bg-white w-full">
      {/* Preview image / vidéo / audio */}
      {mediaPreview && (
        <div className="relative mb-2 w-fit max-w-[200px]">
          <button
            className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow"
            onClick={() => {
              setMediaFile(null);
              setMediaPreview(null);
            }}
          >
            <X size={16} />
          </button>

          {mediaFile?.type.startsWith("image/") && (
            <img
              src={mediaPreview}
              alt="preview"
              className="rounded max-w-full max-h-[200px]"
            />
          )}

          {mediaFile?.type.startsWith("video/") && (
            <video
              controls
              src={mediaPreview}
              className="rounded max-w-full max-h-[200px]"
            />
          )}

          {mediaFile?.type.startsWith("audio/") && (
            <audio controls src={mediaPreview} className="rounded max-w-full" />
          )}
        </div>
      )}

      {/* Barre de saisie + icônes */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 🎤 Micro */}
        <button
          onClick={handleAudioRecord}
          className={`text-blue-500 ${isRecording ? "text-red-500 animate-pulse" : ""}`}
          title={isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message audio"}
        >
          {isRecording ? <StopCircle /> : <Mic />}
        </button>

        {/* Champ de texte */}
        <input
          type="text"
          placeholder="Écrire un message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none min-w-[120px]"
        />

        {/* 📎 Image/Vidéo */}
        <label className="cursor-pointer">
          <ImageIcon />
          <input
            type="file"
            ref={inputRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMediaChange}
          />
        </label>

        {/* 📤 Envoyer */}
        <button onClick={handleSend} className="text-blue-500">
          <Send />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
