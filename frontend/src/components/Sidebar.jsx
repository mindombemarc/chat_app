import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Check, CheckCheck, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShowUserInfos from "./ShowUserInfos";

const Sidebar = () => {
  const { getUsers,users, selectedUser, setSelectedUser,isUsersLoading, lastMessagesByUser,
     recentChats,
    addRecentChat,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState("");

  const [userInfoToShow, setUserInfoToShow] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getUsers]);

  const isUserInConversation = (userId) =>
    !!lastMessagesByUser[userId] || selectedUser?._id === userId;

  const filteredUsers = (showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users
  )
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => isUserInConversation(user._id))
    .sort((a, b) => {
      const indexA = recentChats.indexOf(a._id);
      const indexB = recentChats.indexOf(b._id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    addRecentChat(user._id); // remonte en haut
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full flex flex-col transition-all duration-200 ${
        isMobile ? "w-full bg-base-100" : "w-20 lg:w-72 border-r border-base-300"
      }`}
    >
      {isMobile && selectedUser && (
        <button
          onClick={() => setSelectedUser(null)}
          className="p-3 text-sm bg-base-300 text-left flex items-center gap-2"
        >
          ⬅️ Retour aux contacts
        </button>
      )}

      <div className="sm:border-b-none border-b border-base-300 w-full p-5">
        <div className="flex justify-between items-center lg:block">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium lg:block">Contacts</span>
          </div>

          {isMobile && (
            <input
              type="text"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-sm ml-3 max-w-[140px] lg:hidden"
            />
          )}
          <button
            onClick={() => navigate("/all-users")}
            className="ml-auto tooltip"
            data-tip="Voir tous les utilisateurs"
          >
            <Plus className="size-5 text-zinc-500 hover:text-zinc-800" />
          </button>
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
              onClick={() => handleSelectUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div
                className="relative mx-auto lg:mx-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // empêche la sélection
                  setUserInfoToShow(user);
                }}
              >
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="lg:flex flex-col text-left min-w-0 flex-1">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <span>{isOnline ? "En ligne" : "Déconnecté"}</span>
                  {isSeen ? (
                    <CheckCheck className="size-4 text-blue-500" />
                  ) : (
                    <Check className="size-4 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* MODALE ShowUserInfos */}
      {userInfoToShow && (
        <ShowUserInfos
          user={userInfoToShow}
          onClose={() => setUserInfoToShow(null)}
        />
      )}
    </aside>
  );
};

export default Sidebar;
