import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import insertUrlParams from 'inserturlparams';

import app from '@src/server';

import SeanceRepo from '@src/repos/SeanceRepo';
import { Seance, ISeance } from '@src/models/Seance';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { SEANCE_NOT_FOUND_ERR } from '@src/services/SeanceService';

import Paths from 'spec/support/Paths';
import apiCb from 'spec/support/apiCb';
import { TApiCb } from 'spec/types/misc';
import { ValidationErr } from '@src/common/classes';

import { Mockgoose } from 'mockgoose';
import mongoose from 'mongoose';
import { format } from 'path';

const mockgoose = new Mockgoose(mongoose);
const SEANCE_REQUIS = "Seance requis";
const SEANCE_PAS_TROUVER = "La séance pas trouvé";
const MESSAGE_ERREUR = "The `uri` parameter to `openUri()` must be a string, got \"undefined\". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.";


// Dummy seances for GET request
const getDummySeances = (): ISeance[] => {
  return [
    {
      identifiant: 256181462530,
      date: new Date("2024-09-27"),
      typeExercice: 'Yoga',
      duration: '1h',
      caloriesBrulees: 200,
      distance: '',
      objectifSession: 'Relaxation',
      niveauIntensite: 'Faible',
      completer: false,
      commentaire: ["J'ai adoré ma session d'entrainement"]
    },
    {
      identifiant: 256181462531,
      date: new Date("2024-09-27"),
      typeExercice: 'Musculation',
      duration: '1h',
      caloriesBrulees: 250,
      distance: '',
      objectifSession: 'Force musculaire',
      niveauIntensite: 'Intense',
      completer: false,
      commentaire: [
        "J'ai adoré ma session d'entrainement",
        "J'ai hâte de le refaire"
      ]
    }
  ];
};

// Tests
describe('SeanceRouter', () => {
  let agent: TestAgent<Test>;
  
  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });

  describe(`"GET:${Paths.Seance.Get}"`, () => {

    const api = (cb: TApiCb) => 
      agent
        .get(Paths.Seance.Get)
        .end(apiCb(cb));

        it('Il devrait te retourner une séance de format JSON avec le code ' + 
          `"${HttpStatusCodes.OK}" si le resultat est correct.`, (done) => {
            const data = getDummySeances();
            spyOn(SeanceRepo, 'getAll').and.resolveTo(data);
            api(res => {
              expect(res.status).toBe(HttpStatusCodes.OK);
              
              done();
            });
          });
  });

  describe(`"GET:${Paths.Seance.GetOne}"`, () => {
  // Fonction pour appeler l'API avec un ID donné
  const api = (id: number, cb: TApiCb) => 
    agent
      .get(`${Paths.Seance.GetOne}/${id}`)  // Appel de l'API GET avec l'ID de la séance
      .end(apiCb(cb));                      // Gestion du callback avec apiCb

  it('devrait retourner une séance au format JSON avec le code ' + 
    `"${HttpStatusCodes.OK}" si le résultat est correct.`, (done) => {
      
      // Simule une séance fictive pour le test
      const data = getDummySeances();
      spyOn(SeanceRepo, 'getOne').and.resolveTo(data[0]);  // Mock de la méthode `getOne`
      
      const seanceId = data[0].identifiant as number;  // Récupère l'ID de la première séance
      
      // Appel de l'API avec l'ID de la séance
      api(seanceId, res => {
        console.log(typeof seanceId);
        expect(res.status).toBe(HttpStatusCodes.OK);  // Vérifie le statut de la réponse
        
        expect(res.body).toEqual({ seance: data[0] });  // Vérifie que le corps de la réponse contient bien la séance
        
        done();  // Fin du test
      });
    });
  });

  describe(`"POST:${Paths.Seance.Add}"`, () => {
    const ERROR_MSG = ValidationErr.GetMsg('seance'),
      DUMMY_SEANCE = getDummySeances()[0];

    const callApi = (seance: ISeance | null, cb: TApiCb) => 
      agent
        .post(Paths.Seance.Add)
        .send({ seance })
        .end(apiCb(cb));

    it(`Il devrait de retourner le code "${HttpStatusCodes.OK}" si la ` + 
    'requete est bonne.', (done) => {
      spyOn(SeanceRepo, 'add').and.resolveTo();
      callApi(DUMMY_SEANCE, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    it(`Il devrait te retourner un message d'erreur de type "${SEANCE_REQUIS}" ` + 
    `et un code  "${HttpStatusCodes.BAD_REQUEST}" si la séance ` + 
    'manque des paramètres.', (done) => {
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(SEANCE_REQUIS);
        done();
      });
    });
  });

  describe(`"PUT:${Paths.Seance.Update}"`, () => {
    const ERROR_MSG = ValidationErr.GetMsg('seance'),
      DUMMY_SEANCE = getDummySeances()[0];

    const callApi = (seance: ISeance | null, cb: TApiCb) => 
      agent
        .put(Paths.Seance.Update)
        .send({ seance })
        .end(apiCb(cb));

    it(`Il devrait te retourner un code "${HttpStatusCodes.OK}" si la` + 
    'requete est correct', (done) => {
      spyOn(SeanceRepo, 'update').and.resolveTo();
      spyOn(SeanceRepo, 'persists').and.resolveTo(true);
      callApi(DUMMY_SEANCE, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    it(`Il devrait te retourner un message d'erreur de type "${ERROR_MSG}" ` +
    `and a status code of "${HttpStatusCodes.BAD_REQUEST}" if the seance ` + 
    'param was missing.', (done) => {
      callApi(null, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(SEANCE_REQUIS);
        done();
      });
    });

    it('Il devrait te retourner un message d\'erreur de type ' + 
    `"${SEANCE_NOT_FOUND_ERR}" et un code ` + 
    `"${HttpStatusCodes.BAD_REQUEST}" si la seance est pas trouvé`, (done) => {
      callApi(DUMMY_SEANCE, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(MESSAGE_ERREUR);
        done();
      });
    });
  });

  describe(`"DELETE:${Paths.Seance.Delete}"`, () => {
    const callApi = (id: number, cb: TApiCb) => 
      agent
        .delete(insertUrlParams(Paths.Seance.Delete, { id }))
        .end(apiCb(cb));

    it(`Il devrait te retourner un code "${HttpStatusCodes.OK}" si la ` + 
    'requete est correct', (done) => {
      spyOn(SeanceRepo, 'deleteSeance').and.resolveTo();
      callApi(1, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        done();
      });
    });

    it('Il devrait te retourner un message d\'erreur de type ' + 
    `"${SEANCE_NOT_FOUND_ERR}" et un code ` + 
    `"${HttpStatusCodes.BAD_REQUEST}" si le id est pas trouver`, (done) => {
      callApi(-1, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(MESSAGE_ERREUR);
        done();
      });
    });
  });

  import getMoyenneTempsIntensite from '@src/services/SeanceService';
  
describe('getMoyenneTempsIntensite', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('devrait retourner la moyenne de la durée des séances pour un type et une intensité donnés', async () => {
    // Mock de la méthode aggregate de Seance
    const mockResult = [{ moyenne: 45 }];
    (Seance.aggregate as jest.Mock).mockResolvedValue(mockResult);

    const moyenne = await getMoyenneTempsIntensite.getMoyenneTempsIntensite('Yoga', 'Faible');

    expect(moyenne).toBe(45);
    expect(Seance.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          typeExercice: 'Yoga',
          niveauIntensite: 'Faible',
        },
      },
      {
        $addFields: {
          durationNumeric: { $toInt: { $substr: ['$duration', 0, { $indexOfBytes: ['$duration', ' '] }] } },
        },
      },
      {
        $group: {
          _id: null,
          moyenne: { $avg: '$durationNumeric' },
        },
      },
    ]);
  });

  it('devrait retourner 0 si aucune séance ne correspond', async () => {
    (Seance.aggregate as jest.Mock).mockResolvedValue([]);

    const moyenne = await getMoyenneTempsIntensite('Musculation', 'Intense');

    expect(moyenne).toBe(0);
  });

  it('devrait gérer les erreurs et retourner 0 en cas d\'erreur', async () => {
    (Seance.aggregate as jest.Mock).mockRejectedValue(new Error('Erreur de base de données'));

    const moyenne = await getMoyenneTempsIntensite('Cardio', 'Moyen');

    expect(moyenne).toBe(0);
  });
});
