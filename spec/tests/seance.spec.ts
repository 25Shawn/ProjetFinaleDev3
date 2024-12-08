////////////////
//
// **** Pour tester les fonctions de add, updateSeance et addUser, il faut enlever les commentaires
//
////////////////
import mongoose from 'mongoose';
import SeanceRepo from '@src/repos/SeanceRepo';
import { Seance } from '@src/models/Seance';
import dotenv from 'dotenv';
import { Utilisateur } from '@src/models/Utilisateur';

dotenv.config();


describe('getOne', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait trouver une seance', async () => {

    const seance = await SeanceRepo.getOne(1, 123);

    expect(seance).toBeDefined();
  });
});

describe('getAll', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait trouver toutes les seances', async () => {

    const seances = await SeanceRepo.getAll(123);

    expect(seances.length).toBe(2); 
    
  });
})

describe('getTypeEntrainement', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait trouver toutes les séances', async () => {

    const seances = await SeanceRepo.getTypeEntrainement('Running', 123);

    expect(seances.length).toBe(2); 
    
  });
})

describe('getMoyenneTempsIntensite', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait trouver la moyenne des séances', async () => {


    const moyenne = await SeanceRepo.getMoyenneTempsIntensite('Running', 'Moderee', 123);
    expect(moyenne).toBe(30);
  });
});

// describe('add', () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI as string);
//   });
  
//   afterAll(async () => {
//     await mongoose.disconnect();
//   });

//   it('devrait ajouter une nouvelle séance', async () => {
//     const seanceData = {
//       identifiant: 1,
//       idUtilisateur: 123,
//       date: new Date(),
//       typeExercice: 'Running',
//       duration: '30 mins',
//       caloriesBrulees: 300,
//       distance: '5km',
//       objectifSession: 'Endurance',
//       niveauIntensite: 'Moderee',
//       completer: true,
//       commentaire: []
//     };

//     const nouvelleSeance = new Seance(seanceData);
//     await SeanceRepo.add(nouvelleSeance, 123);

//     const seance = await SeanceRepo.getOne(1, 123);

//     expect(seance).not.toBeNull();
//     expect(seance?.identifiant).toBe(1);
//     expect(seance?.idUtilisateur).toBe(123);
//   });
// })

// describe('updateSeance', () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI as string);
//   });
  
//   afterAll(async () => {
//     await mongoose.disconnect();
//   });

//   it('devrait mettre à jour une séance', async () => {
//     const seanceData = {
//       identifiant: 1,
//       idUtilisateur: 123,
//       date: new Date(),
//       typeExercice: 'Running',
//       duration: '30 mins',
//       caloriesBrulees: 300,
//       distance: '5km',
//       objectifSession: 'Endurance',
//       niveauIntensite: 'Moderee',
//       completer: true,
//       commentaire: []
//     };

//     const nouvelleSeance = new Seance(seanceData);
//     await nouvelleSeance.save();

//     const seance = await SeanceRepo.updateSeance(seanceData);

//     expect(seance).not.toBeNull();
//     expect(seance?.identifiant).toBe(1);
//     expect(seance?.idUtilisateur).toBe(123);
//   });
// })

describe('deleteSeance', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait supprimer une seance', async () => {

    const seance = await SeanceRepo.deleteSeance(1, 123);

    expect(seance).not.toBeNull();
  });
})

// describe('addUser', () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI as string);
//   });
  
//   afterAll(async () => {
//     await mongoose.disconnect();
//   });

//   it('devrait ajouter un nouvel utilisateur', async () => {
//     const utilisateurData = {
//       identifiant: 1,
//       username: 'test',
//       password: 'test'
//     };

//     const nouvelUtilisateur = new Utilisateur(utilisateurData);

//     const utilisateur = await SeanceRepo.ajouterUtilisateur(nouvelUtilisateur);

//     expect(utilisateur).not.toBeNull();
//   });
// })

describe('getAllUsers', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait trouver tous les utilisateurs', async () => {

    const users = await SeanceRepo.getAllUsers();

    expect(users.length).toBe(17); 
    
  });
})