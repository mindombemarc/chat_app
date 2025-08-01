import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div
      className="
        w-full flex-1 flex flex-col items-center justify-center
        p-16
        bg-chat-bg bg-cover bg-center
      "
    >
      {/* Zone centrale */}
      <div className="max-w-md text-center space-y-6 text-black">
        {/* Icône */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
                         justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary text-black" />
            </div>
          </div>
        </div>

        {/* Texte d’accueil */}
        <h2 className="text-2xl font-bold">Bienvenue sur Yabiso !</h2>
        <p className="text-black/60">
          Sélectionnez une conversation dans la barre latérale pour commencer à discuter
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
