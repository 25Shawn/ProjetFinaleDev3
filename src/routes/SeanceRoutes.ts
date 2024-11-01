import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SeanceService from '@src/services/SeanceService';
import {isSeance} from '@src/models/Seance';

import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAllSeance(_: IReq, res: IRes) {
  const Seance = await SeanceService.getAll();
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function getOneSeance(req: IReq, res: IRes) {
  const idSeance = req.params.id as number;
  
  const Seance = await SeanceService.getOne(idSeance);
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function getMoyenneTempsIntensite(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const intensite = req.params.niveauIntensite as string;

  console.log(type, intensite);
  const moyenne = await SeanceService.getMoyenneTempsIntensite(type, intensite);
  return res.status(HttpStatusCodes.OK).json({ moyenne });
}
/**
 * Add one user.
 */
async function addSeance(req: IReq, res: IRes) {
  const seance = check.isValid(req.body, 'seance', isSeance);
  console.log(seance);
  const IdentifiantNouvelleSeance = await SeanceService.addOne(seance);
  return res.status(HttpStatusCodes.OK).json({ IdentifiantNouvelleSeance });
}

/**
 * Update one user.
 */
async function updateSeance(req: IReq, res: IRes) {
  const seance = check.isValid(req.body, 'seance', isSeance);
  const seanceUpdate = await SeanceService.updateOne(seance);
  return res.status(HttpStatusCodes.OK).json({ seanceUpdate });
}

/**
 * Delete one user.
 */
async function deleteSeance(req: IReq, res: IRes) {

  const idSeance = req.params.id as number;

  await SeanceService.deleteSeance(idSeance);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  getAllSeance,
  addSeance,
  updateSeance,
  getOneSeance,
  getMoyenneTempsIntensite,
  deleteSeance,
} as const;
