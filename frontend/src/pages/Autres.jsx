import React from "react";
import {
  Lock,
  Bell,
  Palette,
  Globe,
  Phone,
  Info,
  Trash2,
  AlertCircle,
  LogOut,
  Cloud,
  HelpCircle,
  Smartphone,
  ShieldCheck,
  UserMinus,
  DownloadCloud,
  Volume2,
  Moon,
  MessageCircle,
  EyeOff
} from "lucide-react";

const Section = ({ title, options }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <ul className="space-y-2">
      {options.map(({ label, icon: Icon }, idx) => (
        <li
          key={idx}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">{label}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Autres = () => {
  return (
    <section className="px-4 py-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Autres options</h2>

      <Section
        title="Sécurité & Confidentialité"
        options={[
          { label: "Changer le mot de passe", icon: Lock },
          { label: "Vérification en deux étapes", icon: ShieldCheck },
          { label: "Gérer les appareils connectés", icon: Smartphone },
          { label: "Verrouiller l'application", icon: Lock },
          { label: "Masquer le statut en ligne", icon: EyeOff },
          { label: "Contrôler qui peut voir mon profil", icon: EyeOff }
        ]}
      />

      <Section
        title="Personnalisation"
        options={[
          { label: "Changer le thème (clair/sombre)", icon: Moon },
          { label: "Changer les couleurs de chat", icon: Palette },
          { label: "Taille de la police", icon: TextIcon },
          { label: "Son de notification", icon: Volume2 }
        ]}
      />

      <Section
        title="Notifications"
        options={[
          { label: "Activer/Désactiver notifications", icon: Bell },
          { label: "Personnaliser les sons", icon: Volume2 },
          { label: "Mode ne pas déranger", icon: Bell },
          { label: "Notifications par utilisateur", icon: MessageCircle }
        ]}
      />

      <Section
        title="Stockage & Données"
        options={[
          { label: "Gérer le stockage", icon: Cloud },
          { label: "Nettoyer les anciens fichiers", icon: Trash2 },
          { label: "Téléchargement automatique", icon: DownloadCloud },
          { label: "Limiter la consommation", icon: Cloud }
        ]}
      />

      <Section
        title="Compte & Confidentialité"
        options={[
          { label: "Changer de numéro", icon: Phone },
          { label: "Bloquer/Débloquer des contacts", icon: UserMinus },
          { label: "Supprimer mon compte", icon: Trash2 },
          { label: "Exporter mes données", icon: DownloadCloud }
        ]}
      />

      <Section
        title="Assistance & Support"
        options={[
          { label: "Centre d’aide / FAQ", icon: HelpCircle },
          { label: "Signaler un problème", icon: AlertCircle },
          { label: "Envoyer un feedback", icon: MessageCircle },
          { label: "Version & infos techniques", icon: Info }
        ]}
      />

      <Section
        title="Général"
        options={[
          { label: "Changer la langue", icon: Globe },
          { label: "À propos de l'application", icon: Info },
          { label: "Contact", icon: Phone },
          { label: "Se déconnecter", icon: LogOut }
        ]}
      />
    </section>
  );
};

// Icône temporaire si TextIcon n'est pas dans lucide-react
const TextIcon = (props) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

export default Autres;
