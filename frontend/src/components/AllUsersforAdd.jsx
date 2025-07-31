import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import ShowUserInfos from "../components/ShowUserInfos";
import { Search } from "lucide-react";

// Supprime les accents et met en minuscule
const normalize = (text) =>
  text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const AllUsersforAdd = () => {
  const { getUsers, users, setSelectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [userInfoToShow, setUserInfoToShow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    navigate("/");
  };

  // sécurité si authUser non dispo
  const filteredUsers = (users || [])
    .filter((u) => u._id !== authUser?._id)
    .filter((u) => {
      const search = normalize(searchTerm);
      return (
        normalize(u.fullName || "").includes(search) ||
        normalize(u.username || "").includes(search) ||
        normalize(u.email || "").includes(search)
      );
    });

  return (
    <div className="p-4 max-w-4xl mx-auto mt-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Retour
      </button>

      <h1 className="text-2xl font-semibold mb-6">Tous les utilisateurs</h1>

      {/* 🔍 Barre de recherche stylée */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher par nom, pseudo ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-zinc-500">Aucun utilisateur correspondant.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserInfoToShow(user);
                }}
              />
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {userInfoToShow && (
        <ShowUserInfos
          user={userInfoToShow}
          onClose={() => setUserInfoToShow(null)}
        />
      )}
    </div>
  );
};

export default AllUsersforAdd;
