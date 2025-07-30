import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Search } from "lucide-react";
import { useState } from "react";
import ShowUserInfos from "../components/ShowUserInfos";
import { useChatStore } from "../store/useChatStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { users, setSelectedUser } = useChatStore();

  const [showInfos, setShowInfos] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = searchTerm
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">

            {/* LOGO & TITLE */}
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Link
    to="/"
    className="size-9 rounded-lg bg-primary/10 flex items-center justify-center cursor-pointer select-none"
    title="Retour à l'accueil"
  >
    🇲🇭
  </Link>
              </div>
              <h1 className="text-lg font-bold hidden sm:block">Masolo </h1>
            </div>

            {/* ✅ SEARCH INPUT MOBILE */}
            <div className="flex-1 mx-3 sm:hidden">
              <div className="relative hidden">
                <Search className="absolute hidden left-2 top-2.5 size-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="input input-sm input-bordered w-full pl-8 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-base-100 shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
                    {searchResults.map((user) => (
                      
                      <>
                        <button
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchTerm("");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-base-200 text-sm"
                      >
                        {user.fullName}
                      </button>
                       <img
                src={user.profilePic}
                alt=""
                className="size-9 rounded-full object-cover cursor-pointer hover:ring-2 ring-primary transition hidden sm:block"
              />
                      </>
                    ))}
                    {searchResults.length === 0 && (
                      <div className="px-4 py-2 text-sm text-zinc-500">
                        Aucun utilisateur trouvé
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ICONES */}
            <div className="flex items-center gap-2">
              <Link to="/settings" className="btn btn-sm">
                <Settings className="w-4 h-4" />
              </Link>

              <Link to="/profile" className="btn btn-sm">
                <User className="w-4 h-4" />
              </Link>

              <button className="btn btn-sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </button>

              {/* ✅ Profil caché uniquement en mobile */}
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="profil"
                onClick={() => setShowInfos(true)}
                className="size-9 rounded-full object-cover cursor-pointer hover:ring-2 ring-primary transition hidden sm:block"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ✅ MODALE INFOS */}
      {showInfos && (
        <ShowUserInfos user={authUser} onClose={() => setShowInfos(false)} />
      )}
    </>
  );
};

export default Navbar;
