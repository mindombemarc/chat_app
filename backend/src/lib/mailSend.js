import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { WelcomeTemplateEmail } from "../lib/EmailTemplate.js"; // Correction du nom

dotenv.config();

export async function sendEmail(to, activeLink, fullName) {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_NODEMAILER, // Exemple : "gmail"
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GOOGLE_PASSWORD, // Mot de passe d'application Gmail
    },
  });

  try {
    const mailOptions = {
      from: `"Mon Application" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Bienvenue sur notre plateforme 🎉",
      html: WelcomeTemplateEmail(activeLink, fullName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé avec succès ! ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Échec de l'envoi d'email:", error.message);
    throw error;
  }
}
