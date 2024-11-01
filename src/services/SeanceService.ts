import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import SeanceRepo from '@src/repos/SeanceRepo';
import { ISeance } from '@src/models/Seance';


// **** Variables **** //

export const SEANCE_NOT_FOUND_ERR = 'La séance est pas trouvé';


// **** Functions **** //

function getAll(): Promise<ISeance[]> {
  return SeanceRepo.getAll();
}

function getOne(id: number): Promise<ISeance | null> {
  return SeanceRepo.getOne(id);
}

function getMoyenneTempsIntensite(type: string, intensite: string): Promise<number> {
  return SeanceRepo.getMoyenneTempsIntensite(type, intensite);
}


function addOne(Seance: ISeance): Promise<number> {
  return SeanceRepo.add(Seance);
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
  addOne,
  updateOne,
  deleteSeance,
} as const;
