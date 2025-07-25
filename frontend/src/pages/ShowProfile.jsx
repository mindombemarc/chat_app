import { X } from "lucide-react";

const ShowProfile = ({ imgSrc, onClose }) => {
  if (!imgSrc) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex justify-center items-center"
    >
      {/* bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 btn btn-circle bg-white text-black hover:bg-red-500 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      {/* image plein écran */}
      <img
        src={imgSrc}
        alt="Image Profil"
        className="w-full h-full object-contain"
        onClick={(e) => e.stopPropagation()} // ne ferme pas quand on clique l'image
      />
    </div>
  );
};

export default ShowProfile;
