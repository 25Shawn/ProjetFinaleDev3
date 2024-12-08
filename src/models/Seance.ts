import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose';


export interface ISeance {
  identifiant: number;
  idUtilisateur: number;
  date: Date;
  typeExercice: string;
  duration: string;
  caloriesBrulees: number;
  distance: string;
  objectifSession: string;
  niveauIntensite: string;
  completer: boolean;
  commentaire: string[];
}

const SeanceSchema = new Schema<ISeance>({
  identifiant: { type: Number},
  idUtilisateur: { type: Number},
  date: { type: Date, required:true,  validate: {
    validator: (value: Date) => value <= new Date(),
    message: 'La date ne peut pas être dans le futur.'
  }},
  typeExercice: { type: String, required: [true, "Le type d'exercice est requis"] },
  duration: { type: String, required: [true, "La duration de l'entrainement est requis"] },
  caloriesBrulees: { type: Number, required: [true, "Le nombre de calorie brulées est requis" ], min:0 },
  distance: { type: String, required: false},
  objectifSession: { type: String, required: [true, "L'objectif de la session d'entrainement est requis"] },
  niveauIntensite: { type: String, required: [true, "Le niveau d'intensité est requis"], enum: ['Faible', 'Moderee', 'Elevee'] },
  completer: { type: Boolean, required: [true, "Mettre l'entrainement completer est requis"] },
  commentaire: { type: [String], required: [true, "Les commentaires sont requis pour voir votre amélioration dans votre attitude"] }
});

mongoose.pluralize(null);
export const Seance = model<ISeance>('Entrainement', SeanceSchema);

export function isSeance(arg: unknown): arg is ISeance {
  return typeof arg === 'object' && arg !== null &&
    'date' in arg && moment((arg as any).date).isValid() &&
    'typeExercice' in arg && typeof (arg as any).typeExercice === 'string' &&
    'duration' in arg && typeof (arg as any).duration === 'string' &&
    'caloriesBrulees' in arg && typeof (arg as any).caloriesBrulees === 'number' &&
    'distance' in arg && typeof (arg as any).distance === 'string' &&
    'objectifSession' in arg && typeof (arg as any).objectifSession === 'string' &&
    'niveauIntensite' in arg && typeof (arg as any).niveauIntensite === 'string' &&
    'completer' in arg && typeof (arg as any).completer === 'boolean' &&
    'commentaire' in arg && Array.isArray((arg as any).commentaire) &&
    (arg as any).commentaire.every((item: any) => typeof item === 'string');
}
