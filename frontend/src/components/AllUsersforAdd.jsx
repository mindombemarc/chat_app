import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import ShowUserInfos from "../components/ShowUserInfos";

const AllUsersforAdd = () => {
  const { getUsers, users, setSelectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [userInfoToShow, setUserInfoToShow] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    navigate("/"); // redirection vers la page de chat
  };

  const filteredUsers = users.filter((u) => u._id !== authUser._id);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Retour
      </button>

      <h1 className="text-2xl font-semibold mb-4">Tous les utilisateurs</h1>

      {filteredUsers.length === 0 ? (
        <p className="text-zinc-500">Aucun autre utilisateur trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-base-200 transition cursor-pointer"
            >
              {/* IMAGE CLIQUABLE → Affiche ShowUserInfos */}
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                onClick={(e) => {
                  e.stopPropagation(); // bloque le clic du parent
                  setUserInfoToShow(user);
                }}
              />
              <span className="font-medium text-left">{user.fullName}</span>
            </div>
          ))}
        </div>
      )}

      {/* MODALE INFOS UTILISATEUR */}
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
