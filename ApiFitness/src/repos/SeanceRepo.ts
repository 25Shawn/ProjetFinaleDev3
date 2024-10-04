import { ISeance, Seance } from '@src/models/Seance';
import { getRandomInt } from '@src/util/misc';
import mongoose from 'mongoose';
import { env } from 'process';

// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(id: number): Promise<ISeance | null> {
  console.log(id);
  await mongoose.connect(process.env.MONGO_URI as string)
  const uneSeance = await Seance.findOne({ identifiant: id });
  mongoose.connection.close();
  return uneSeance;
}


/**
 * Get all users.
 */
async function getAll(): Promise<ISeance[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const Seances = await Seance.find();
  mongoose.connection.close();
  return Seances;
}

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
    return 0; // Return 0 in case of error
  } finally {
    mongoose.connection.close(); // Ensure connection is closed in the end
  }
}

/**
 * Add one user.
 */
async function add(seance: ISeance): Promise<number> {

  await mongoose.connect(process.env.MONGO_URI as string)
  seance.identifiant = getRandomInt();

  const nouvelleSeance = new Seance({
    identifiant: seance.identifiant,
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
 * Update a user.
 */
async function update(seance: ISeance): Promise<ISeance | null> {
    
  await mongoose.connect(process.env.MONGO_URI as string);

  if (!seance) {
    console.log("Séance non définie");
    return null;
  }

  console.log("Identifiant de la séance:", seance.identifiant);

 


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
async function persists(id: number): Promise<boolean> {
  await mongoose.connect(process.env.MONGODB_URI!);
  const uneSeance = await Seance.findOne({identifiant: id});
  mongoose.connection.close();
  return uneSeance !== null;
}

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
  add,
  update,
  deleteSeance,
  persists
} as const;
