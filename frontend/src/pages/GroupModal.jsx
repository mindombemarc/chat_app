// src/pages/GroupsPage.jsx
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const GroupsPage = () => {
  const { groups, fetchUserGroups } = useChatStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      await fetchUserGroups();
      setLoading(false);
    };
    loadGroups();
  }, [fetchUserGroups]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-dots loading-xl"></span>
        <span className="ml-3">Chargement des groupes...</span>
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="p-4 text-center">
        <p>Aucun groupe trouvé.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mes Groupes</h1>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li
            key={group._id}
            className="border rounded p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/groups/${group._id}`)} // à adapter selon ta navigation
          >
            <h2 className="text-xl font-semibold">{group.name}</h2>
            {group.description && (
              <p className="text-gray-600 mt-1">{group.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Membres: {group.members.length}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsPage;
