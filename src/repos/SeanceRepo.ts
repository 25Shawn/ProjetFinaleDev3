import { ISeance, Seance } from '@src/models/Seance';
import { getRandomInt } from '@src/util/misc';
import { Utilisateur, IUtilisateur } from '@src/models/Utilisateur';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// **** Functions **** //


async function getOne(idSeance: number, idUtilisateur: number): Promise<ISeance | null> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
  const uneSeance = await Seance.findOne({ identifiant: idSeance, idUtilisateur: idUtilisateur });
  mongoose.connection.close();
  return uneSeance;
}


async function getAll(idUtilisateur: number): Promise<ISeance[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
  const Seances = await Seance.find({ idUtilisateur: idUtilisateur });
  mongoose.connection.close();
  return Seances;
}


async function getMoyenneTempsIntensite(type: string, intensite: string, idUtilisateur: number): Promise<number> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const connectionState = mongoose.connection.readyState;
    console.log("État de la connexion MongoDB :", connectionState);
    
    const idUtilisateurNumber = parseInt(idUtilisateur.toString(), 10);
    console.log('Calculating average duration for type:', type, 'and intensity:', intensite, 'idUtilisateur:', typeof idUtilisateurNumber);
    const moyenne = await Seance.aggregate([
      {
        $match: {
          idUtilisateur: idUtilisateurNumber,
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

    const moyenneArrondie = Math.round(moyenne[0]?.moyenne ?? 0);
    return moyenneArrondie;
  } catch (error) {
    console.error('Error calculating average duration:', error);
    return 0; 
  } finally {
    mongoose.connection.close();
  }
}


async function getTypeEntrainement(type: string, idUtilisateur: number): Promise<ISeance[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
  const Seances = await Seance.find({ typeExercice: type , idUtilisateur: idUtilisateur });
  mongoose.connection.close();
  return Seances;
}

async function ajouterUtilisateur(utilisateur: IUtilisateur): Promise<number> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);

  const identifiant = getRandomInt();
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(utilisateur.password, salt);
  const nouvelleSeance = new Utilisateur(
    {
      identifiant: identifiant,
      username: utilisateur.username,
      password: passwordHash
    });
  
  const resultat = await nouvelleSeance.save();
  console.log(resultat.identifiant);
  mongoose.connection.close();
  return resultat.identifiant;
}

async function getAllUsers(): Promise<IUtilisateur[]> {
  await mongoose.connect(process.env.MONGO_URI as string)
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
  const utilisateurs = await Utilisateur.find();
  mongoose.connection.close();
  return utilisateurs;
}


async function add(seance: ISeance, idUtilisateur: number): Promise<number> {

  await mongoose.connect(process.env.MONGO_URI as string)
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
  const identifiantSeance = getRandomInt();

  const nouvelleSeance = new Seance({
    identifiant: identifiantSeance,
    idUtilisateur: idUtilisateur,
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



async function updateSeance(seance: ISeance): Promise<ISeance | null> {
  
  if (mongoose.connection.readyState !== 1) {
    console.log("Connexion à MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connecté à MongoDB !");
  }

  console.log("État de la connexion :", mongoose.connection.readyState);

  const updatedSeance = await Seance.findOneAndUpdate(
    { identifiant: seance.identifiant },
    { $set: { ...seance } },
    { new: true }
  );

  if (!updatedSeance) {
    console.log("Aucune séance trouvée avec cet identifiant :", seance.identifiant);
    return null;
  }

  return updatedSeance;
}



async function utilisateurExiste(id: number): Promise<boolean> {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const connectionState = mongoose.connection.readyState;
    console.log("État de la connexion MongoDB :", connectionState);
    const utilisateur = await Utilisateur.findOne({ identifiant: id });
    mongoose.connection.close();
    return utilisateur !== null;
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur :', error);
    return false;
  }
}

async function persists(id: number): Promise<boolean> {
  await mongoose.connect(process.env.MONGO_URI as string);
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
  const uneSeance = await Seance.findOne({identifiant: id});
  mongoose.connection.close();
  return uneSeance !== null;
}


async function deleteSeance(id: number, idUtilisateur: number): Promise<boolean> {
  await mongoose.connect(process.env.MONGO_URI as string);
  const connectionState = mongoose.connection.readyState;
  console.log("État de la connexion MongoDB :", connectionState);
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
  utilisateurExiste,
  getAllUsers,
  add,
  updateSeance,
  deleteSeance,
  persists
} as const;
