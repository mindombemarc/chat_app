import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Check, CheckCheck, Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    lastMessagesByUser,
    recentChats,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getUsers();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // breakpoint lg = 1024px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getUsers]);

  const filteredUsers = (showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users
  ).sort((a, b) => {
    const indexA = recentChats.indexOf(a._id);
    const indexB = recentChats.indexOf(b._id);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200
        ${isMobile && selectedUser ? "hidden" : "flex"}
      `}
    >
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Utilisateurs en ligne</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} en ligne)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSeen = lastMessagesByUser[user._id]?.seen;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="hidden lg:flex flex-col text-left min-w-0 flex-1">
                <div className="font-medium truncate">{user.fullName}</div>

                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <span>{isOnline ? "En ligne" : "Déconnecter"}</span>
                  {isSeen ? (
                    <div className="flex gap-1">
                      <CheckCheck className="size-4 text-blue-500" />
                    </div>
                  ) : (
                    <Check className="size-4 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">personne connectée</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
