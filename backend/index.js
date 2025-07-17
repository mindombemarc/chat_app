import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';
import  MessageRoute  from './routes/messsage.route.js';
import authRouter from './routes/Auth.route.js'; 




dotenv.config();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// === Middlewares globaux ===
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // à adapter si déployé sur un domaine
  credentials: true,
}));

// === Connexion à MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté avec succès'))
  .catch(err => console.error('❌ Erreur MongoDB :', err.message));

// === Routes API ===
app.use('/api/auth', authRouter);
app.use('/api/messages', MessageRoute);

// === Servir le frontend React compilé en production ===
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur lancé sur http://0.0.0.0:${PORT}`);
});

// === Gestion des erreurs globales ===
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Rejet non intercepté:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Exception non interceptée:', err);
});
