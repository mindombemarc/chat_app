const ShowUserInfos = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-base-100 w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600"
        >
          ✕
        </button>

        {/* Contenu */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName}
            className="w-40 h-40 object-cover rounded-full ring-2 ring-primary"
          />
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
            {user.username && (
              <p className="text-sm text-zinc-400">@{user.username}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserInfos;
