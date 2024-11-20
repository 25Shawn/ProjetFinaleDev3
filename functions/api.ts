/**
 * Point d'entrée pour les fonctions de Netlify
 */

import app from "../src/server";
import dotenv from 'dotenv';
import serverless from 'serverless-http';

// Charger les variables d'environnement
dotenv.config();

// Handler requis par Netlify pour gérer les requêtes
export const handler = serverless(app);