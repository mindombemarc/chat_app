import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { sendEmail } from "../lib/mailSend.js";
//import { VericationCompteTemplete} from "../lib/EmailTemplate.js";
import twilio from "twilio";

export const signup = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  try {
    // Champs obligatoires
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "Tous les champs sont exigés" });
    }

    // Mot de passe min. 6 caractères
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit être supérieur à 6 caractères" });
    }

    // Validation numéro +243 + 9 chiffres
    const regexPhone = /^\+243\d{9}$/;
    if (!regexPhone.test(phone)) {
      return res.status(400).json({ message: "Numéro manquant ou mal tapé (format +243XXXXXXXXX)" });
    }

    // Vérifier si email ou téléphone existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email ou téléphone existe déjà" });
    }

    // Créer le nouvel utilisateur
    const newUser = new User({
      fullName,
      email,
      password, // sera hashé dans pre('save')
      phone,
    });

    await newUser.save();

    // Générer token et le mettre en cookie
    generateToken(newUser._id, res);
    // Envoyer email de vérification
    const activation_link = "https://res-console.cloudinary.com/di68u9gkm/thumbnails/v1/image/upload/v1750487788/dXg0am9rOHhjdG83d3IxaXl0OXg=/drilldown";
    await sendEmail(
      email,
      activation_link,
      fullName
    );

    // Réponse
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès. Veuillez vérifier votre email.",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.error("Erreur dans signup:", error);
    res.status(500).json({ message: "Erreur du serveur lors de la création de l'utilisateur" });
  }
};



/*export const VericationCompte = async (req, res,method) => {

  const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  
  const { email, phone } = req.body;

  try {
    if (!email && !phone) {
      return res.status(400).json({ message: "Veuillez entrer une email ou un numéro de téléphone" });
    }

    // Validation numéro de téléphone si fourni
    const validatePhoneNumber = (phone) => {
      const regex = /^\+243\d{9}$/;
      return regex.test(phone);
    };

    if (phone && !validatePhoneNumber(phone)) {
      return res.status(400).json({ message: "Numéro de téléphone invalide" });
    }

    // Chercher utilisateur existant par email ou téléphone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé !" });
    }

    // Limite tentative de vérification (exemple ici on stocke dans un champ, tu peux adapter)
    // Tu peux ajouter un champ `verificationAttempts` et `lastVerificationAttempt` dans ton model User pour gérer ça
    if (existingUser.verificationAttempts >= 3 && existingUser.lastVerificationAttempt && (Date.now() - existingUser.lastVerificationAttempt) < 60 * 60 * 1000) {
      return res.status(400).json({ message: "Vous avez dépassé la limite de tentatives, veuillez réessayer dans 1 heure" });
    }

    // Générer un nouveau code de vérification
    const verificationCode = existingUser.generateVerificationCode();
       sendVerificationCode(verificationCode, method, email, phone)
    // Mettre à jour le compteur de tentatives + date
    existingUser.verificationAttempts = (existingUser.verificationAttempts || 0) + 1;
    existingUser.lastVerificationAttempt = Date.now();

    await existingUser.save();

    // Envoyer le code par email ou téléphone
    if (email) {
      const message = VericationCompteTemplete(verificationCode);
      await sendEmail(email, "Ton code de vérification", "", message);
    }

    if (phone) {
      // Ici, tu peux envoyer le code par SMS ou par appel vocal avec Twilio
      // Par exemple SMS (exemple simple, à adapter selon ta config Twilio) :
      await client.messages.create({
        body: `Ton code de vérification est : ${verificationCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Code de vérification envoyé",
      email: email || null,
      phone: phone || null,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du compte:", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};




export async function sendVerificationCode(verificationCode, method, email, phone) {
  if (method === "email" && email) {
    const message = VericationCompteTemplete(verificationCode);
    try {
      await sendEmail(email, "Ton code de vérification", "", message);
      console.log("Code de vérification envoyé par email à", email);
    } catch (error) {
      console.error("Erreur envoi email de vérification:", error);
      throw error;
    }
  } else if (method === "phone" && phone) {
    const verificationWithSpaces = verificationCode.toString().split("").join(" ");
    try {
      await client.messages.create({
        body: `Ton code de vérification est : ${verificationWithSpaces}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log("Code de vérification envoyé par SMS à", phone);
    } catch (error) {
      console.error("Erreur envoi SMS de vérification:", error);
      throw error;
    }
  } else {
    throw new Error("Méthode de vérification invalide ou destinataire manquant");
  }
}
*/








export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }
    const isPasswordInCorrect =  user.password !== password;
    if (isPasswordInCorrect) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Erreur du Serveur lors de la connexion" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Deconnexion Reussi !" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Erreur du Serveur lors de la déconnexion" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "la photo de profile est exiger" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Erreur lors de la mise a jour du profile:", error);
    res.status(500).json({ message: "Erreur lors de la mise en jour du profile" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Erreur lors de l'obtention de l'informations de l'utilisateur:", error.message);
    res.status(500).json({ message: "Erreur du Serveur" });
  }
};
