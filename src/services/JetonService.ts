import bcrypt from 'bcryptjs';
import { IUtilisateur } from '@src/models/Utilisateur';
import UserService from './SeanceService'; // Service pour gérer les utilisateurs
import jwt from 'jsonwebtoken';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_PASSWORD_ERR = 'Mot de passe incorrect';

async function generateToken(utilisateur: IUtilisateur): Promise<string> {
  // Récupérer tous les utilisateurs de la base de données
  const utilisateurBD = (await UserService.getAllUsers()).find(
    (user) => user.username === utilisateur.username
  );

  // Vérifier si l'utilisateur existe
  if (!utilisateurBD) {
    throw new Error(UTILISATEUR_NOT_FOUND_ERR);
  }

  console.log(utilisateurBD.password);
  console.log(utilisateur.password);



  // Vérifier si le mot de passe correspond
  const isPasswordValid = await bcrypt.compare(utilisateur.password, utilisateurBD.password);
  
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new Error(INVALID_PASSWORD_ERR);
  }

  // Générer un token avec le `username` comme payload
  return jwt.sign(
    { username: utilisateur.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' } // Durée de validité du token
  );
}

// **** Export default **** //
export default {
  generateToken,
} as const;
