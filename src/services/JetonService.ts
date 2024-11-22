import { IUtilisateur } from '@src/models/Utilisateur';
import UserService from './SeanceService'; // Service pour gérer les utilisateurs
import jwt from 'jsonwebtoken';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';

async function generateToken(utilisateur: IUtilisateur): Promise<string> {
  // Récupérer tous les utilisateurs de la base de données
  const utilisateurBD = (await UserService.getAllUsers()).find(
    (user) => user.username === utilisateur.username
  );

  console.log(utilisateurBD);
  // Vérifier si l'utilisateur existe et si le mot de passe correspond
  if (utilisateurBD && utilisateurBD.password === utilisateur.password) {
    // Générer un token avec le `username` comme payload
    return jwt.sign(
      { username: utilisateur.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Durée de validité du token
    );
    
  } else {
    throw new Error(UTILISATEUR_NOT_FOUND_ERR);
  }
}

// **** Export default **** //
export default {
  generateToken,
} as const;
