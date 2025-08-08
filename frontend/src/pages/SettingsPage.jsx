import { useState } from "react";
import { useLanguageStore } from "../store/langueStore.js" // import du store
import About from "./About.jsx";
import Contact from "./Contact.jsx"
import Autres from "./Autres.jsx";



const SettingsPage = () => {
 

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
            activeTab === "contact"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("contact")}
        >
          Etre en Contact
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
          Options
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

     
    </div>
  );
};

export default SettingsPage;
