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
const MESSAGE_ERREUR = "The `uri` parameter to `openUri()` must be a string, got \"undefined\". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.";


// Dummy seances for GET request
const getDummySeances = (): ISeance[] => {
  return [
    {
      identifiant: 1,
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
      identifiant: 2,
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

  // Run before all tests
  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });

  // Get all seances
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
              expect(res.body).toEqual({ seances: data });
              
              // Comparaison des dates
              expect(new Date(res.body.user[0].date).getTime()).toBe(new Date(data[0].date).getTime());
              
              done();
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

  // Update seance
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

  // Delete seance
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
});
