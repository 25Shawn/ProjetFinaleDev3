import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SeanceService from '@src/services/SeanceService';
import {isSeance} from '@src/models/Seance';
import {isUtilisateur} from '@src/models/Utilisateur';

import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAllSeance(req: IReq, res: IRes) {
  const idUtilisateur = req.params.idUtilisateur as number;
  const Seance = await SeanceService.getAll(idUtilisateur);
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function getOneSeance(req: IReq, res: IRes) {
  const idSeance = req.params.idSeance as number;
  const idUtilisateur = req.params.idUtilisateur as number;
  
  const Seance = await SeanceService.getOne(idSeance, idUtilisateur);
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function getMoyenneTempsIntensite(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const intensite = req.params.niveauIntensite as string;

  console.log(type, intensite);
  const moyenne = await SeanceService.getMoyenneTempsIntensite(type, intensite);
  return res.status(HttpStatusCodes.OK).json({ moyenne });
}

async function getTypeEntrainement(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const Seance = await SeanceService.getTypeEntrainement(type);
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function ajouterUtilisateur(req: IReq, res: IRes) {
  const utilisateur = check.isValid(req.body, 'utilisateur', isUtilisateur);
  const IdentifiantNouvelleSeance = await SeanceService.ajouterUtilisateur(utilisateur);
  return res.status(HttpStatusCodes.OK).json({ utilisateur});
}

async function getAllUsers(req: IReq, res: IRes) {
  const utilisateurs = await SeanceService.getAllUsers();
  return res.status(HttpStatusCodes.OK).json({ utilisateurs });
}

async function addSeance(req: IReq, res: IRes) {
  const seance = check.isValid(req.body, 'seance', isSeance);
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
  ajouterUtilisateur,
  getAllUsers,
  updateSeance,
  getOneSeance,
  getMoyenneTempsIntensite,
  getTypeEntrainement,
  deleteSeance,
} as const;
