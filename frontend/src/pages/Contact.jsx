import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "mindombe",               // Service ID
        "template_mindombe",      // Template ID
        formData,
        "BEx0BrFzC8AzCQ8ui"       // Public Key
      )
      .then(() => {
        setSuccess(true);
        setFormData({ nom: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi :", error);
      });
  };

  return (
    <section className="mb-12 px-4 lg:px-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact</h1>
        <p className="text-gray-600">Vous pouvez me contacter via ce formulaire.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* Infos de contact */}
        <div className="w-full lg:w-1/2 space-y-4 text-gray-700">
          <p><strong>Téléphone :</strong> +243 831 634 637</p>
          <p><strong>Email :</strong> marc.mindombe@email.com</p>
          <p><strong>Adresse :</strong> Kinshasa, République Démocratique du Congo</p>
          <p><strong>LinkedIn :</strong> <a href="https://www.linkedin.com/in/marc-mindombe-978b1b27a/" target="_blank" className="text-blue-600 underline">Voir le profil</a></p>
        </div>

        {/* Formulaire */}
        <div className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Votre adresse email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Votre message"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Envoyer
            </button>

            {success && (
              <p className="text-green-600 text-sm mt-2">Message envoyé avec succès !</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
