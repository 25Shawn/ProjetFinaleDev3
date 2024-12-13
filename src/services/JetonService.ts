import bcrypt from 'bcryptjs';
import { IUtilisateur } from '@src/models/Utilisateur';
import UserService from './SeanceService';
import jwt from 'jsonwebtoken';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';
export const INVALID_PASSWORD_ERR = 'Mot de passe incorrect';

async function generateToken(utilisateur: IUtilisateur): Promise<{ token: string; id: number; username: string }> {

  const utilisateurBD = (await UserService.getAllUsers()).find(
    (user) => user.username === utilisateur.username
  );

 
  if (!utilisateurBD) {
    throw new Error(UTILISATEUR_NOT_FOUND_ERR);
  }

  
  const isPasswordValid = await bcrypt.compare(utilisateur.password, utilisateurBD.password);

  if (!isPasswordValid) {
    throw new Error(INVALID_PASSWORD_ERR);
  }

  const token = jwt.sign(
    { username: utilisateur.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' } 
  );

  return { token, id: utilisateurBD.identifiant, username: utilisateurBD.username };
}

// **** Export default **** //
export default {
  generateToken,
} as const;
