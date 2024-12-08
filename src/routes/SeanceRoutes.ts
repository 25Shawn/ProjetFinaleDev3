import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SeanceService from '@src/services/SeanceService';
import SeanceRepo from '@src/repos/SeanceRepo';
import {isSeance} from '@src/models/Seance';
import {isUtilisateur} from '@src/models/Utilisateur';

import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //


async function getAllSeance(req: IReq, res: IRes) {
  const idUtilisateur = req.params.idUtilisateur as number;
  
  if (isNaN(idUtilisateur)) {
    return res.status(400).json({ message: 'idUtilisateur incorrect' });
  }
  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);
  if (!utilisateurExiste) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  const Seance = await SeanceService.getAll(idUtilisateur);
  if(!Seance){
    return res.status(404).json({ message: 'Aucune seance' });
  }
  return res.status(HttpStatusCodes.OK).json({ Seance });
}


async function getOneSeance(req: IReq, res: IRes) {
  const idSeance = req.params.idSeance as number;
  const idUtilisateur = req.params.idUtilisateur as number;

  if (isNaN(idSeance) || isNaN(idUtilisateur)) {
    return res.status(400).json({ message: 'Paramètre incorrect' }); 
  }

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);
  if (!utilisateurExiste) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
  }
  const idSeanceExiste = await SeanceRepo.persists(idSeance);
  if (!idSeanceExiste) {
    return res.status(404).json({ message: 'Seance non trouvé' }); 
  }
  const Seance = await SeanceService.getOne(idSeance, idUtilisateur);

  if (!Seance) {
    return res.status(404).json({ message: 'Seance non trouvée' }); 
  }
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function getMoyenneTempsIntensite(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const intensite = req.params.niveauIntensite as string;
  const idUtilisateur = req.params.idUtilisateur as number;

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);

  if (!type || !intensite || !idUtilisateur) {
    return res.status(400).json({ error: 'Requête invalide' });
  }

  if (!utilisateurExiste) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  const moyenne = await SeanceService.getMoyenneTempsIntensite(type, intensite,idUtilisateur);
  if (!moyenne) {
    return res.status(404).json({ error: 'Séance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ moyenne });
}


async function getTypeEntrainement(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const idUtilisateur = req.params.idUtilisateur as number;

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);

  if (isNaN(idUtilisateur) || !type) {
    return res.status(400).json({ error: 'Requête invalide' });
  }

  if (!utilisateurExiste) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  const Seance = await SeanceService.getTypeEntrainement(type,idUtilisateur);
  if (!Seance) {
    return res.status(404).json({ error: 'Séance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

async function ajouterUtilisateur(req: IReq, res: IRes) {
  const utilisateur = check.isValid(req.body, 'utilisateur', isUtilisateur);
  const nouvelleutilisateur = await SeanceService.ajouterUtilisateur(utilisateur);
  return res.status(HttpStatusCodes.OK).json({ nouvelleutilisateur });
}


async function getAllUsers(_: IReq, res: IRes) {
  const utilisateurs = await SeanceService.getAllUsers();
  if (!utilisateurs) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ utilisateurs });
}

async function addSeance(req: IReq, res: IRes) {
  const idUtilisateur = req.params.idUtilisateur as number;
  const seance = check.isValid(req.body, 'seance', isSeance);
  const IdentifiantNouvelleSeance = await SeanceService.addOne(seance,idUtilisateur);
  return res.status(HttpStatusCodes.OK).json({ IdentifiantNouvelleSeance });
}

async function updateSeance(req: IReq, res: IRes) {

  const seance = check.isValid(req.body, 'seance', isSeance);
  if(!seance) {
    return res.status(404).json({ error: 'Seance introuvable' });
  } 
  const seanceUpdate = await SeanceService.updateOne(seance);
  if(!seanceUpdate) {
    return res.status(404).json({ error: 'Seance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ seanceUpdate });
}


async function deleteSeance(req: IReq, res: IRes) {

  const idSeance = req.params.id as number;
  const idUtilisateur = req.params.idUtilisateur as number;

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);

  if(!utilisateurExiste) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  const seanceSupprimee = await SeanceService.deleteSeance(idSeance,idUtilisateur);

  if(!seanceSupprimee) {
    return res.status(404).json({ error: 'Seance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ idSeance });
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
