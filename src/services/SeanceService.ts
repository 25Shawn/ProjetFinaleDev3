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

function getMoyenneTempsIntensite(type: string, intensite: string): Promise<number> {
  return SeanceRepo.getMoyenneTempsIntensite(type, intensite);
}

function getTypeEntrainement(type: string): Promise<ISeance[]> {
  return SeanceRepo.getTypeEntrainement(type);
}


function addOne(Seance: ISeance): Promise<number> {
  return SeanceRepo.add(Seance);
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

async function deleteSeance(id: number): Promise<boolean> {
  return SeanceRepo.deleteSeance(id);
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
