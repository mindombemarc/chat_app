import React from "react";

const About = () => {
  return (
    <section className="mb-12 flex flex-col-reverse lg:flex-row items-center gap-8 px-4 lg:px-12">
      {/* Texte */}
      <div className="w-full lg:w-1/2 text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Marc Mindombe</h2>
        <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
          Je suis né à Kinshasa, capitale de la République Démocratique du Congo, le 12 décembre 2002. 
          Quelques mois après ma naissance, j'ai perdu mon père, ce qui a marqué le début d’une enfance douloureuse, 
          marquée par la souffrance, le rejet et les difficultés. N’ayant pas les moyens financiers pour accéder à 
          l’université, j’ai suivi des études secondaires en humanités, souvent en sautant des niveaux pour avancer malgré les obstacles. 
          En 2021, grâce au soutien bienveillant d’une dame qui a cru en moi, j’ai pu obtenir mon diplôme d’État. 
          Ce parcours difficile m’a forgé et m’a donné la force de poursuivre mes rêves.
        </p>
      </div>

      {/* Image et titre */}
      <div className="w-full lg:w-1/2 flex flex-col items-center">
        <h3 className="text-xl lg:text-2xl text-gray-500 mb-2 uppercase tracking-wider">
          Fondateur
        </h3>
        <img
          src="./marc_elvie.jpg"
          alt="Marc Mindombe"
          className="w-48 h-48 lg:w-60 lg:h-60 object-cover rounded-full shadow-md border-2 border-gray-200"
        />
      </div>
    </section>
  );
};

export default About;
