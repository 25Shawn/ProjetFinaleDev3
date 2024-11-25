/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes';

import Paths from '@src/common/Paths';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';
import { NodeEnvs } from '@src/common/misc';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';


// **** Variables **** //

const app = express();
// Configuration de base
app.use(cors());
// configuration Swagger

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation API Fitness',
      version: '1.0.0',
    },
    servers: [
      {
        description: 'Local',
        url: 'http://localhost:3000/fitness',
      },
      {
        description: 'Production',
        url: 'https://fitness-api.onrender.com/fitness',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Seance: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Identifiant unique de la séance',
            },
            idUtilisateur: {
              type: 'number',
              description: 'Identifiant de l’utilisateur qui a fait la séance',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Date de la séance',
            },
            typeExercice: {
              type: 'string',
              description: 'Type d’exercice réalisé',
            },
            duration: {
              type: 'string',
              description: 'Durée de la séance',
            },
            caloriesBrulees: {
              type: 'number',
              description: 'Calories brûlées durant la séance',
            },
            distance: {
              type: 'string',
              description: 'Distance parcourue durant la séance',
            },
            objectifSession: {
              type: 'string',
              description: 'Objectif fixé pour la séance',
            },
            niveauIntensite: {
              type: 'string',
              description: 'Niveau d’intensité de la séance',
            },
            completer: {
              type: 'boolean',
              description: 'Indique si la séance est terminée',
            },
            commentaire: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Commentaires sur la séance',
            },
          },
        },
        Utilisateur: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'Identifiant unique de l’utilisateur',
            },
            username: {
              type: 'string',
              description: 'Nom d’utilisateur',
            },
            password: {
              type: 'string',
              description: 'Mot de passe de l’utilisateur',
            },
          },
        },
      },
    },
    tags:[
      {
        name: 'Utilisateur',
        description: 'Operations sur les utilisateurs',
      },
      {
        name: 'Seance',
        description: 'Operations sur les séances',
      },
      {
        name: 'Jeton',
        description: 'Operations sur les jetons',
      }

    ]
  },
  apis: ['./src/routes/*.ts'], // Chemin vers vos routes
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/fitness/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// **** Setup **** //


// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);
// **** Export default **** //

export default app;