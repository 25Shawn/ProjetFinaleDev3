import { ISeance, Seance } from '@src/models/Seance';
import { getRandomInt } from '@src/util/misc';
import { Utilisateur, IUtilisateur } from '@src/models/Utilisateur';
import mongoose from 'mongoose';
import { env } from 'process';

// **** Functions **** //

/**
 * Aller chercher une seule seance.
 */
async function getOne(idSeance: number, idUtilisateur: number): Promise<ISeance | null> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const uneSeance = await Seance.findOne({ identifiant: idSeance, idUtilisateur: idUtilisateur });
  mongoose.connection.close();
  return uneSeance;
}


/**
 * Aller chercher toutes les seances.
 */
async function getAll(idUtilisateur: number): Promise<ISeance[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const Seances = await Seance.find({ idUtilisateur: idUtilisateur });
  mongoose.connection.close();
  return Seances;
}

/**
 * Calculer la moyenne de la durée des séances pour un type d'exercice et une intensité données.
 * @param type type d'exercice
 * @param intensite intensite de l'exercice
 * @returns une moyenne du temps d'exercice pour le type d'exercice et l'intensité de l'exercice
 */
async function getMoyenneTempsIntensite(type: string, intensite: string): Promise<number> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    
    const moyenne = await Seance.aggregate([
      {
        $match: {
          typeExercice: type,
          niveauIntensite: intensite,
        },
      },
      {
        $addFields: {
          durationNumeric: { $toInt: { $substr: ['$duration', 0, { $indexOfBytes: ['$duration', ' '] }] } }
        },
      },
      {
        $group: {
          _id: null,
          moyenne: { $avg: '$durationNumeric' },
        },
      },
    ]);

    return moyenne[0]?.moyenne ?? 0;
  } catch (error) {
    console.error('Error calculating average duration:', error);
    return 0; 
  } finally {
    mongoose.connection.close();
  }
}


async function getTypeEntrainement(type: string): Promise<ISeance[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const Seances = await Seance.find({ typeExercice: type });
  mongoose.connection.close();
  return Seances;
}

async function ajouterUtilisateur(utilisateur: IUtilisateur): Promise<number> {
  await mongoose.connect(process.env.MONGO_URI as string)
  utilisateur.identifiant = getRandomInt();

  const nouvelleSeance = new Utilisateur(
    {
      identifiant: utilisateur.identifiant,
      username: utilisateur.username,
      password: utilisateur.password
    });
  console.log(nouvelleSeance);
  const resultat = await nouvelleSeance.save();
  mongoose.connection.close();
  return resultat.identifiant;
}

async function getAllUsers(): Promise<IUtilisateur[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const utilisateurs = await Utilisateur.find();
  mongoose.connection.close();
  return utilisateurs;
}

/**
 * Ajouter une nouvelle seance.
 * @param seance une nouvelle seance
 * @returns l'identifiant de la nouvelle seance
 */
async function add(seance: ISeance): Promise<number> {

  await mongoose.connect(process.env.MONGO_URI as string)
  seance.identifiant = getRandomInt();

  const nouvelleSeance = new Seance({
    identifiant: seance.identifiant,
    idUtilisateur: seance.idUtilisateur,
    date: seance.date,
    typeExercice: seance.typeExercice,
    duration: seance.duration,
    caloriesBrulees: seance.caloriesBrulees,
    distance: seance.distance,
    objectifSession: seance.objectifSession,
    niveauIntensite: seance.niveauIntensite,
    completer: seance.completer,
    commentaire: seance.commentaire
  });

  const resultat = await nouvelleSeance.save();
  mongoose.connection.close();
  return resultat.identifiant;
}

/**
 * Mettre a jour une seance.
 * @param seance une seance
 * @returns la nouvelle seance
 */
async function update(seance: ISeance): Promise<ISeance | null> {
    
  await mongoose.connect(process.env.MONGO_URI as string);

  if (!seance) {
    return null;
  }

  const updateSeance = await Seance.findOneAndUpdate(
    { identifiant: seance.identifiant },
    {
      date: seance.date,
      typeExercice: seance.typeExercice,
      duration: seance.duration,
      caloriesBrulees: seance.caloriesBrulees,
      distance: seance.distance,
      objectifSession: seance.objectifSession,
      niveauIntensite: seance.niveauIntensite,
      completer: seance.completer,
      commentaire: seance.commentaire
    },
    { new: true }
  );

  if (!updateSeance) {
    console.log("Aucune séance trouvée avec cet identifiant:", seance.identifiant);
  }

  mongoose.connection.close();
  return updateSeance;
}
/**
 * Test si une seance existe.
 * @param id identifiant de la seance
 * @returns true si la seance existe, false sinon
*/
async function persists(id: number): Promise<boolean> {
  await mongoose.connect(process.env.MONGODB_URI!);
  const uneSeance = await Seance.findOne({identifiant: id});
  mongoose.connection.close();
  return uneSeance !== null;
}

/**
 * Supprimer une seance.
 * @param id identifiant de la seance
 * @returns true si la seance a été supprimée, false sinon
 */
async function deleteSeance(id: number): Promise<boolean> {
  await mongoose.connect(process.env.MONGO_URI as string);
  const result = await Seance.deleteOne({ identifiant: id });
  mongoose.connection.close();
  return result.deletedCount === 1;
}




// **** Export default **** //

export default {
  getOne,
  getAll,
  getMoyenneTempsIntensite,
  getTypeEntrainement,
  ajouterUtilisateur,
  getAllUsers,
  add,
  update,
  deleteSeance,
  persists
} as const;
