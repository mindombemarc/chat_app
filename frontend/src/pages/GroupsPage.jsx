import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const GroupsPage = () => {
  const { groups, fetchUserGroups } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserGroups();
  }, [fetchUserGroups]);

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 Mes Groupes</h1>

      {groups.length === 0 ? (
        <p className="text-zinc-500">Aucun groupe pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li
              key={group._id}
              className="border p-4 rounded-lg shadow-sm hover:shadow transition"
            >
              <h2 className="font-semibold text-lg">{group.name}</h2>
              {group.description && (
                <p className="text-zinc-600 mb-1">{group.description}</p>
              )}
              <p className="text-xs text-zinc-400">
                Membres : {group.members.length}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-zinc-200 rounded hover:bg-zinc-300"
        >
          Retour Accueil
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nouveau Groupe
        </button>
      </div>
    </div>
  );
};

export default GroupsPage;
