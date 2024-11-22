import JetonService from '@src/services/JetonService';
import { isUtilisateur } from '@src/models/Utilisateur';
import { IReq, IRes } from './common/types';
import check from './common/check';
// **** Functions **** //

/**
 * Générer un jeton.
 *
 * @param {IReq} req - La requête au serveur
 * @param {IRes} res - La réponse du serveur
 */
async function generateToken(req: IReq, res: IRes) {
  const userLogin = check.isValid(req.body, 'utilisateur', isUtilisateur);
  const token = await JetonService.generateToken(userLogin);
  return res.send({ token: token });
}

// **** Export default **** //

export default {
  generateToken,
} as const;