import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] overflow-hidden">
          <div className="flex h-full rounded-lg overflow-hidden">

            {/* ✅ MOBILE FULLSCREEN LOGIC */}
            {isMobile ? (
              selectedUser ? (
                <div className="w-full h-full">
                  <ChatContainer />
                </div>
              ) : (
                <div className="w-full h-full">
                  <Sidebar />
                </div>
              )
            ) : (
              <>
                <Sidebar />
                {selectedUser ? <ChatContainer /> : <NoChatSelected />}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
