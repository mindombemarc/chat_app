import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, Smile, X, Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const recordInterval = useRef(null);

  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const { sendMessage } = useChatStore();

  // Gestion image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Gestion emoji
  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
  };

  // Gestion audio
  const handleStartRecording = async () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordInterval.current);
      setRecordTime(0);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      setMediaRecorder(mr);
      mr.start();
      setIsRecording(true);

      let chunks = [];
      mr.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        chunks = [];
        stream.getTracks().forEach((t) => t.stop());
      };

      let seconds = 0;
      recordInterval.current = setInterval(() => {
        seconds++;
        setRecordTime(seconds);
      }, 1000);
    } catch (error) {
      toast.error("Microphone access denied or not available");
      setIsRecording(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !audioBlob) return;

    try {
      let audioDataUrl = null;
      if (audioBlob) {
        audioDataUrl = await blobToDataURL(audioBlob);
      }

      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        audio: audioDataUrl,
      });

      setText("");
      setImagePreview(null);
      setAudioBlob(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const blobToDataURL = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className="p-4 w-full relative bg-base-100">
      {/* Preview image */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Preview audio */}
      {audioBlob && (
        <div className="mb-3 flex items-center gap-2">
          <audio controls src={URL.createObjectURL(audioBlob)} className="w-40" />
          <button
            onClick={removeAudio}
            className="btn btn-sm btn-error ml-2"
            type="button"
            title="Remove audio"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute z-50 bottom-20 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 w-[50vw] sm:w-96 bg-base-200 rounded-lg shadow-lg"
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" width="100%" height="420px" />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Emoji button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="btn btn-circle btn-xs text-yellow-500"
          title="Emoji picker"
        >
          <Smile size={18} />
        </button>

        {/* Input + icons */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-xs p-y-5 sm:input-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isRecording || !!audioBlob}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isRecording || !!audioBlob}
          />

          {/* Image button visible only on mobile */}
          <button
            type="button"
            className={`sm:hidden btn btn-circle btn-xs ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || !!audioBlob}
            title="Add image"
          >
            <Image size={18} />
          </button>

          {/* Audio record button */}
          <button
            type="button"
            onClick={handleStartRecording}
            className={`btn btn-circle btn-xs ${isRecording ? "btn-error" : "btn-ghost"} text-white-500`}
            title={isRecording ? `Arrêter Enregistrement (${recordTime}s)` : "Démarrer enregistrement"}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="btn btn-xs btn-circle"
          disabled={!text.trim() && !imagePreview && !audioBlob}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
