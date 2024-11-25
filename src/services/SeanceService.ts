import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import SeanceRepo from '@src/repos/SeanceRepo';
import { ISeance } from '@src/models/Seance';
import { IUtilisateur } from '@src/models/Utilisateur';
import { ieNoOpen } from 'helmet';



// **** Variables **** //

export const SEANCE_NOT_FOUND_ERR = 'La séance est pas trouvé';


// **** Functions **** //

function getAll(idUtilisateur: number): Promise<ISeance[]> {
  return SeanceRepo.getAll(idUtilisateur);
}

function getOne(idSeance: number, idUtilisateur: number): Promise<ISeance | null> {
  return SeanceRepo.getOne(idSeance, idUtilisateur);
}

function getMoyenneTempsIntensite(type: string, intensite: string, idUtilisateur: number): Promise<number> {
  return SeanceRepo.getMoyenneTempsIntensite(type, intensite, idUtilisateur);
}

function getTypeEntrainement(type: string, idUtilisateur: number): Promise<ISeance[]> {
  return SeanceRepo.getTypeEntrainement(type, idUtilisateur);
}


function addOne(Seance: ISeance, idUtilisateur: number): Promise<number> {
  return SeanceRepo.add(Seance, idUtilisateur);
}

function ajouterUtilisateur(utilisateur: IUtilisateur): Promise<number> {
  return SeanceRepo.ajouterUtilisateur(utilisateur);
}

function getAllUsers(): Promise<IUtilisateur[]> {
  return SeanceRepo.getAllUsers();
}

async function updateOne(Seance: ISeance): Promise<ISeance | null> {
  const persists = await SeanceRepo.persists(Seance.identifiant)
  if (!persists) {
      throw new RouteError(HttpStatusCodes.NOT_FOUND, SEANCE_NOT_FOUND_ERR);
  }
  return SeanceRepo.update(Seance);
}

async function deleteSeance(id: number, idUtilisateur: number): Promise<boolean> {
  return SeanceRepo.deleteSeance(id, idUtilisateur);
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  getMoyenneTempsIntensite,
  ajouterUtilisateur,
  getAllUsers,
  getTypeEntrainement,
  addOne,
  updateOne,
  deleteSeance,
} as const;
