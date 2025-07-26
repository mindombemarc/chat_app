import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const UserSearchMobile = () => {
  const { users, setSelectedUser } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lg:hidden px-3 py-2">
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        className="input input-bordered w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <div className="mt-2 bg-base-100 rounded-lg shadow max-h-64 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setSearchTerm("");
                }}
              >
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="truncate font-medium">{user.fullName}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">Aucun utilisateur trouvé.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchMobile;
