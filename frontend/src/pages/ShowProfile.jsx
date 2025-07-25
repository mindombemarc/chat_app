import React from "react";

const ShowProfile = ({ imgSrc, onClose }) => {
  if (!imgSrc) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 cursor-pointer"
    >
      <img
        src={imgSrc}
        alt="Profile Enlarged"
        className="max-w-full max-h-full rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur l'image
      />
    </div>
  );
};

export default ShowProfile;
