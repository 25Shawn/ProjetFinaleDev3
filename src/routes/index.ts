import { Router, Request, Response, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '../common/Paths';
import SeanceRoutes from './SeanceRoutes';
import { Seance } from '@src/models/Seance';


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
userRouter.get(Paths.Seance.Get, SeanceRoutes.getAllSeance);
userRouter.get(Paths.Seance.GetOne, SeanceRoutes.getOneSeance);
userRouter.get(Paths.Seance.GetMoyenneTempsIntensite, SeanceRoutes.getMoyenneTempsIntensite);
userRouter.post(Paths.Seance.Add, validateSeance, SeanceRoutes.addSeance);
userRouter.put(Paths.Seance.Update, validateSeance, SeanceRoutes.updateSeance);
userRouter.delete(Paths.Seance.Delete, SeanceRoutes.deleteSeance);

// Add UserRouter
apiRouter.use(Paths.Seance.Base, userRouter);


// **** Export default **** //

export default apiRouter;
