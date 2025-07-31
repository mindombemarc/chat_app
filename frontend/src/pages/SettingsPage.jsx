import { useState } from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useLanguageStore } from "../store/langueStore.js" // import du store
import { Send } from "lucide-react";
import About from "./About.jsx";
import Contact from "./Contact.jsx"
import Autres from "./Autres.jsx";


const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! Marc comment vas-tu?", isSent: false },
  { id: 2, content: "oui je vais tres bien quoi de neuf ?.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  // Récupérer la langue et la fonction pour changer la langue depuis le store
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  // Gestion onglets
  const [activeTab, setActiveTab] = useState("language");

   const languages = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ln", label: "Lingala" },
  { code: "zh", label: "中文" },
  { code: "be", label: "Belge" }
];

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl space-y-6">
      
      {/* Barre onglets */}
      <nav className="flex gap-6 pb-4 mb-6 overflow-auto">
        <button
          type="button"
          className={`py-2 px-4 font-medium  ${
            activeTab === "language"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("language")}
        >
          Changer langue
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium ${
            activeTab === "about"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("about")}
        >
          À propos
        </button>
        <button
          type="button"
          className={`py-2 px-4 font-medium ${
            activeTab === "other"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("other")}
        >
          Autres
        </button>

         <button
          type="button"
          className={`py-2 px-4 font-medium ${
            activeTab === "contact"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("contact")}
        >
          contact
        </button>
      </nav>

      {/* Contenu onglets */}
      {activeTab === "language" && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Sélectionnez votre langue</h2>
          <ul>
            {languages.map(({ code, label }) => (
              <li key={code} className="mb-3 hover:bg-gray-800 p-3 hover:text-white">
                <label className="flex items-center gap-3 cursor-pointer ">
                  <input
                    type="radio"
                    name="language"
                    value={code}
                    checked={language === code}
                    onChange={() => setLanguage(code)}
                    className="cursor-pointer"
                  />
                  <span className="text-lg">{label}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-gray-400 text-lg ">
            Langue sélectionnée : <strong>{language}</strong>
          </p>
        </section>
      )}

      {activeTab === "about" && <About/>}

      {activeTab === "other" && <Autres/>}

      {activeTab === "contact" && <Contact />}

      {/* THEME & PREVIEW */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choisir un theme </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3">la vue</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium"></div>
                    <div>
                      <h3 className="font-medium text-sm">Marc Mindombe</h3>
                      <p className="text-xs text-base-content/70">En ligne</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Ecrire  un message..."
                      value="Ceci Est un exemple"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
