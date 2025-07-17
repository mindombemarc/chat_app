import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connecté :", conn.connection.host);
  } catch (error) {
    console.error("❌ Erreur connexion MongoDB :", error.message);
  }
};
