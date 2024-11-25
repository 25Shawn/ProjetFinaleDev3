import { Router, Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '../common/Paths';
import SeanceRoutes from './SeanceRoutes';
import { Seance } from '@src/models/Seance';
import JetonsRoutes from './JetonsRoutes';
import authenticateToken from '@src/util/authenticateToken';


// **** Variables **** //

const apiRouter = Router();


function validateSeance(req: Request, res: Response, next: NextFunction) {
    if (req.body === null) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send({ error: 'Seance requis' })
        .end();
      return;
    }
  
    if (req.body.seance === null) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send({ error: 'Seance requis' })
        .end();
      return;
    }
  
    const nouvelleSeance = new Seance(req.body.seance);
    const error = nouvelleSeance.validateSync();
    if (error !== null && error !== undefined) {
      res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
    } else {
      next();
    }
  }

// ** Add UserRouter ** //

// Init router
const userRouter = Router();
// Get all users
userRouter.get(Paths.Seance.Get,authenticateToken, SeanceRoutes.getAllSeance);
userRouter.get(Paths.Seance.GetOne,authenticateToken, SeanceRoutes.getOneSeance);
userRouter.get(Paths.Seance.GetMoyenneTempsIntensite,authenticateToken, SeanceRoutes.getMoyenneTempsIntensite);
userRouter.get(Paths.Seance.GetTypeEntrainement,authenticateToken, SeanceRoutes.getTypeEntrainement);

userRouter.get(Paths.Seance.GetAllUsers, SeanceRoutes.getAllUsers);
userRouter.post(Paths.Seance.AddUser, SeanceRoutes.ajouterUtilisateur);

userRouter.post(Paths.Seance.Add,authenticateToken, validateSeance, SeanceRoutes.addSeance);
userRouter.put(Paths.Seance.Update,authenticateToken, validateSeance, SeanceRoutes.updateSeance);
userRouter.delete(Paths.Seance.Delete,authenticateToken, SeanceRoutes.deleteSeance);

// Add UserRouter
apiRouter.use(Paths.Seance.Base, userRouter);


const jetonsRouter = Router();

jetonsRouter.post(Paths.GenerateToken.Get, JetonsRoutes.generateToken);

apiRouter.use(Paths.GenerateToken.Base, jetonsRouter);


// **** Export default **** //

export default apiRouter;
