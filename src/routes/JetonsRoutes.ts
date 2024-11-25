import JetonService from '@src/services/JetonService';
import { isUtilisateur } from '@src/models/Utilisateur';
import { IReq, IRes } from './common/types';
import check from './common/check';
// **** Functions **** //

/**
 * @swagger
 * /generateToken:
 *   post:
 *     summary: Générer un jeton JWT pour l'utilisateur
 *     description: Valide les informations de l'utilisateur et retourne un token JWT si les informations sont correctes.
 *     tags:
 *       - Jeton
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utilisateur:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     description: Le nom d'utilisateur
 *                   password:
 *                     type: string
 *                     description: Le mot de passe
 *             required:
 *               - utilisateur
 *     responses:
 *       200:
 *         description: Jeton généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Jeton:
 *                   type: string
 *                   description: Le jeton JWT généré
 *       400:
 *         description: Champs manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Champs manquants ou invalides
 *       404:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Identifiants incorrects
 */

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