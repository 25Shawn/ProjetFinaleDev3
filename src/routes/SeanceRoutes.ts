import HttpStatusCodes from '@src/common/HttpStatusCodes';
import SeanceService from '@src/services/SeanceService';
import SeanceRepo from '@src/repos/SeanceRepo';
import {isSeance} from '@src/models/Seance';
import {isUtilisateur} from '@src/models/Utilisateur';

import { IReq, IRes } from './common/types';
import check from './common/check';


// **** Functions **** //

/**
 * @swagger
 * /TousLesSeances/{idUtilisateur}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retourne la liste des seances d'un utilisateur
 *     tags:
 *       - Seance
 *     parameters:
 *       - name: idUtilisateur
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *           format: int64
 *         description: L'identifiant de l'utilisateur
 *     responses:
 *       200:
 *         description: Retourne la liste des seances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Seance:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seance'
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur introuvable
 *       400:
 *         description: idUtilisateur incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: idUtilisateur incorrect
 */
async function getAllSeance(req: IReq, res: IRes) {
  const idUtilisateur = req.params.idUtilisateur as number;
  
  if (isNaN(idUtilisateur)) {
    return res.status(400).json({ message: 'idUtilisateur incorrect' });
  }
  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);
  if (!utilisateurExiste) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }

  const Seance = await SeanceService.getAll(idUtilisateur);
  if(!Seance){
    return res.status(404).json({ message: 'Aucune seance' });
  }
  return res.status(HttpStatusCodes.OK).json({ Seance });
}


/**
 * @swagger
 * /seance/{idSeance}/{idUtilisateur}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retourne une seance
 *     tags:
 *       - Seance
 *     parameters:
 *       - name: idSeance
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *           format: int64
 *         description: L'identifiant de la séance
 *       - name: idUtilisateur
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *           format: int64
 *         description: L'identifiant de l'utilisateur
 *     responses:
 *       200:
 *         description: Retourne une seance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Seance:
 *                   $ref: '#/components/schemas/Seance'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Requête invalide
 *       404:
 *         description: Utilisateur ou identifiant de la séance introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur interne du serveur
 */
async function getOneSeance(req: IReq, res: IRes) {
  const idSeance = req.params.idSeance as number;
  const idUtilisateur = req.params.idUtilisateur as number;

  if (isNaN(idSeance) || isNaN(idUtilisateur)) {
    return res.status(400).json({ message: 'Paramètre incorrect' }); 
  }

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);
  if (!utilisateurExiste) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' }); 
  }
  const idSeanceExiste = await SeanceRepo.persists(idSeance);
  if (!idSeanceExiste) {
    return res.status(404).json({ message: 'Seance non trouvé' }); 
  }
  const Seance = await SeanceService.getOne(idSeance, idUtilisateur);

  if (!Seance) {
    return res.status(404).json({ message: 'Seance non trouvée' }); 
  }
  return res.status(HttpStatusCodes.OK).json({ Seance });
}


/**
 * @swagger
 * /MoyenneTempsIntensite/{type}/{niveauIntensite}/{idUtilisateur}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retourne la moyenne des temps d'une séance
 *     tags:
 *       - Seance
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Le type d'entraînement
 *       - name: niveauIntensite
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Le niveau d'intensité
 *       - name: idUtilisateur
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *           format: int64
 *         description: L'identifiant de l'utilisateur
 *     responses:
 *       200:
 *         description: Retourne la moyenne des temps d'une séance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 moyenne:
 *                   type: number
 *                   description: La moyenne des temps d'une séance
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Requête invalide
 *       404:
 *         description: Utilisateur ou séance introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur interne du serveur
 */
async function getMoyenneTempsIntensite(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const intensite = req.params.niveauIntensite as string;
  const idUtilisateur = req.params.idUtilisateur as number;

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);

  if (!type || !intensite || !idUtilisateur) {
    return res.status(400).json({ error: 'Requête invalide' });
  }

  if (!utilisateurExiste) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  const moyenne = await SeanceService.getMoyenneTempsIntensite(type, intensite,idUtilisateur);
  if (!moyenne) {
    return res.status(404).json({ error: 'Séance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ moyenne });
}


/**
 * @swagger
 * /GetTypeEntrainement/{type}/{idUtilisateur}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retourne le type d'entraînement
 *     tags:
 *       - Seance
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Le type d'entraînement
 *       - name: idUtilisateur
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *           format: int64
 *         description: L'identifiant de l'utilisateur
 *     responses:
 *       200:
 *         description: Retourne le type d'entraînement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Seance:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seance'
 *       400:
 *         description: Requête invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string 
 *                   example: Requête invalide
 *       404: 
 *         description: Utilisateur ou séance introuvable
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Utilisateur introuvable 
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur interne du serveur
 */
async function getTypeEntrainement(req: IReq, res: IRes) {
  const type = req.params.type as string;
  const idUtilisateur = req.params.idUtilisateur as number;

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);

  if (isNaN(idUtilisateur) || !type) {
    return res.status(400).json({ error: 'Requête invalide' });
  }

  if (!utilisateurExiste) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  const Seance = await SeanceService.getTypeEntrainement(type,idUtilisateur);
  if (!Seance) {
    return res.status(404).json({ error: 'Séance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ Seance });
}

/**
 * @swagger
 * /AjouterUtilisateur:
 *   post:
 *     summary: Ajouter un nouvel utilisateur
 *     tags:
 *       - Utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utilisateur:
 * 
 *               username:
 *                 type: string
 *                 description: Nom de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Utilisateur ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nouvelleUtilisateur:
 *                   type: object
 *                   $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Données utilisateur invalides
 *       500:
 *         description: Erreur interne du serveur
 */

async function ajouterUtilisateur(req: IReq, res: IRes) {
  const utilisateur = check.isValid(req.body, 'utilisateur', isUtilisateur);
  const nouvelleutilisateur = await SeanceService.ajouterUtilisateur(utilisateur);
  return res.status(HttpStatusCodes.OK).json({ nouvelleutilisateur });
}


/**
 * 
 * @swagger
 * /TousLesUtilisateurs:
 *   get:
 *     summary: Retourne tous les utilisateurs
 *     tags:
 *       - Utilisateur
 *     responses:
 *       200:
 *         description: Retourne tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utilisateurs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Utilisateur'
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Utilisateur introuvable
 */
async function getAllUsers(_: IReq, res: IRes) {
  const utilisateurs = await SeanceService.getAllUsers();
  if (!utilisateurs) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ utilisateurs });
}


/**
 * 
 * @swagger
 * /AjouterSeance:
 *   post:
 *     summary: Ajouter une nouvelle séance
 *     tags:
 *       - Seance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seance:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Date de la séance
 *                   typeExercice:
 *                     type: string
 *                     description: Type d'entraînement
 *                   duration:
 *                     type: number
 *                     description: Duree de la séance
 *                   caloriesBrulees:
 *                     type: number
 *                     description: Calories brulées
 *                   distance:
 *                     type: string
 *                     description: Distance parcourue
 *                   objectifSession:
 *                     type: string
 *                     description: Objectif de la séance
 *                   niveauIntensite:
 *                     type: string
 *                     description: Niveau d'intensité
 *                   completer:
 *                     type: boolean
 *                     description: Indique si la séance est complètee
 *                   commentaire:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: Commentaire de la séance
 *                   
 *     responses:
 *       200:
 *         description: Nouvelle séance ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 IdentifiantNouvelleSeance:
 *                   type: number
 *                   format: int64
 *                   example: 1234
 *       404:
 *         description: Seance introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Seance introuvable
 */
async function addSeance(req: IReq, res: IRes) {
  const idUtilisateur = req.params.idUtilisateur as number;
  const seance = check.isValid(req.body, 'seance', isSeance);
  const IdentifiantNouvelleSeance = await SeanceService.addOne(seance,idUtilisateur);
  return res.status(HttpStatusCodes.OK).json({ IdentifiantNouvelleSeance });
}

/**
 * @swagger
 * /ModifierSeance/{id}:
 *   put:
 *     summary: Modifier une séance
 *     tags:
 *       - Seance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seance:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Date de la séance
 *                   typeExercice:
 *                     type: string
 *                     description: Type d'entraînement
 *                   duration:
 *                     type: number
 *                     description: Duree de la séance
 *                   caloriesBrulees:
 *                     type: number
 *                     description: Calories brulées
 *                   distance:
 *                     type: string
 *                     description: Distance parcourue
 *                   objectifSession:
 *                     type: string
 *                     description: Objectif de la séance
 *                   niveauIntensite:
 *                     type: string
 *                     description: Niveau d'intensité
 *                   completer:
 *                     type: boolean
 *                     description: Indique si la séance est complètee
 *                   commentaire:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: Commentaire de la séance
 *                   
 *     responses:
 *       200:
 *         description: Nouvelle séance ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 IdentifiantNouvelleSeance:
 *                   type: number
 *                   format: int64
 *                   example: 1234
 *       404:
 *         description: Seance introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Seance introuvable
 */
async function updateSeance(req: IReq, res: IRes) {

  const seance = check.isValid(req.body, 'seance', isSeance);
  if(!seance) {
    return res.status(404).json({ error: 'Seance introuvable' });
  } 
  const seanceUpdate = await SeanceService.updateOne(seance);
  if(!seanceUpdate) {
    return res.status(404).json({ error: 'Seance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ seanceUpdate });
}

/**
 * @swagger
 * /SupprimerSeance/{id}/{idUtilisateur}:
 *   delete:
 *     summary: Supprimer une séance
 *     tags:
 *       - Seance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID de la séance
 *       - in: path
 *         name: idUtilisateur
 *         required: true
 *         schema:
 *           type: number
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Séance supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idSeance:
 *                   type: number 
 *                   format: int64
 *                   example: 1234
 *       404:
 *         description: Seance introuvable 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Seance introuvable 
 */
async function deleteSeance(req: IReq, res: IRes) {

  const idSeance = req.params.id as number;
  const idUtilisateur = req.params.idUtilisateur as number;

  const utilisateurExiste = await SeanceRepo.utilisateurExiste(idUtilisateur);

  if(!utilisateurExiste) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  const seanceSupprimee = await SeanceService.deleteSeance(idSeance,idUtilisateur);

  if(!seanceSupprimee) {
    return res.status(404).json({ error: 'Seance introuvable' });
  }
  return res.status(HttpStatusCodes.OK).json({ idSeance });
}


// **** Export default **** //

export default {
  getAllSeance,
  addSeance,
  ajouterUtilisateur,
  getAllUsers,
  updateSeance,
  getOneSeance,
  getMoyenneTempsIntensite,
  getTypeEntrainement,
  deleteSeance,
} as const;
