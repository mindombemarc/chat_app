import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
//import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { mailerSendWithEmail } from "../lib/mailSend.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont exigés" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit être supérieur à 6 caractères" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Utilisateur existe déjà" });

    /*const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
*/
    const newUser = new User({
      fullName,
      email,
      password,
    });

    await newUser.save();  // Sauvegarde avant de générer le token

    generateToken(newUser._id, res);  // Génère le JWT après sauvegarde

    // Envoi mail avec await pour gestion d’erreur possible
    /*try {
      await mailerSendWithEmail(newUser.email, verificationToken);
    } catch (err) {
      console.error("Erreur envoi mail:", err);
      // Optionnel : ne pas bloquer la réponse à l’utilisateur si mail en erreur
    }*/

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Erreur du serveur lors de la création de l'utilisateur" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    /*
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }
    */
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
