import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 *
 * @param {Request} req - La requête au serveur
 * @param {Response} res - La réponse du serveur
 * @param {NextFunction} next - La fonction a appeler pour continuer le processus.
 */
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  
  const lastPartOfUrl = req.url.split('/').at(-1);
  if (lastPartOfUrl === 'generatetoken') {
    next();
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (token == null) return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
   
      if (err.name === 'TokenExpiredError') {
        return res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Jeton expiré' });
      }
      return res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'Jeton invalide' });
    }

    
    next();
  });
}

export default authenticateToken;
