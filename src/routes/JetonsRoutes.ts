import JetonService from '@src/services/JetonService';
import { isUtilisateur } from '@src/models/Utilisateur';
import { IReq, IRes } from './common/types';
import check from './common/check';
// **** Functions **** //

async function generateToken(req: IReq, res: IRes) {
  const userLogin = check.isValid(req.body, 'utilisateur', isUtilisateur);
  const token = await JetonService.generateToken(userLogin);
  if (!token) {
    return res.status(404).send({ error: 'Identifiants incorrects' });
  }
  
  return res.send({ token: token });
}

// **** Export default **** //

export default {
  generateToken,
} as const;