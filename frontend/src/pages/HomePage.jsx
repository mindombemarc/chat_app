import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // vérifie au chargement
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] overflow-hidden">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* ✅ Affiche la sidebar uniquement si pas de user sélectionné sur mobile */}
            {(!isMobile || !selectedUser) && <Sidebar />}

            {/* ✅ Affiche soit la page d'accueil soit la conversation */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
