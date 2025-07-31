import { create } from "zustand";

export const useLanguageStore = create((set) => {
  const savedLang = localStorage.getItem("appLanguage") || "fr";

  return {
    language: savedLang,
    setLanguage: (lang) => {
      localStorage.setItem("appLanguage", lang);
      set({ language: lang });
    },
  };
});
