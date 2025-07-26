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
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const usersWithMessages = users.filter((user) => lastMessagesByUser[user._id]);

  const sortedUsers = (showOnlineOnly
    ? usersWithMessages.filter((user) => onlineUsers.includes(user._id))
    : usersWithMessages
  ).sort((a, b) => {
    const dateA = new Date(lastMessagesByUser[a._id]?.updatedAt || lastMessagesByUser[a._id]?.createdAt || 0);
    const dateB = new Date(lastMessagesByUser[b._id]?.updatedAt || lastMessagesByUser[b._id]?.createdAt || 0);
    return dateB - dateA;
  });

  const searchResults = searchTerm
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-24 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* ✅ Barre de recherche élargie */}
        <input
          type="text"
          placeholder=" Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-sm w-full text-sm input-bordered px-4 py-2"
          autoComplete="off"
        />

        {/* ✅ Filtre des utilisateurs en ligne */}
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

      {/* ✅ Liste des utilisateurs avec messages */}
      <div className="overflow-y-auto w-full py-3">
        {searchTerm === "" && sortedUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSeen = lastMessagesByUser[user._id]?.seen;

          return (
            <UserItem
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              isOnline={isOnline}
              isSeen={isSeen}
              onClick={() => setSelectedUser(user)}
            />
          );
        })}

        {searchTerm && (
          <>
            <div className="px-4 pb-1 pt-2 text-xs font-semibold text-zinc-400">
              Résultats de recherche
            </div>
            {searchResults.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                isSelected={selectedUser?._id === user._id}
                isOnline={onlineUsers.includes(user._id)}
                isSeen={lastMessagesByUser[user._id]?.seen}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchTerm("");
                }}
              />
            ))}
            {searchResults.length === 0 && (
              <div className="text-sm px-4 py-2 text-zinc-500">Aucun utilisateur trouvé</div>
            )}
          </>
        )}

        {!searchTerm && sortedUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            Aucun contact trouvé
          </div>
        )}
      </div>
    </aside>
  );
};

const UserItem = ({ user, isSelected, isOnline, isSeen, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full p-3 flex items-center gap-3
      hover:bg-base-300 transition-colors
      ${isSelected ? "bg-base-300 ring-1 ring-base-300" : ""}
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

export default Sidebar;
