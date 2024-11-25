import moment from 'moment';
import mongoose, { Schema, model } from 'mongoose';


export interface IUtilisateur {
    identifiant: number;
    username: string;
    password: string;
}

const UtilisateurSchema = new Schema<IUtilisateur>({
  identifiant: { type: Number, required: [true, "L'identifiant est requis"] },
  username: { type: String, required: [true, "Le username est requis"] },
  password: { type: String, required: [true, "Le password est requis"] },
});

mongoose.pluralize(null);
export const Utilisateur = model<IUtilisateur>('Utilisateur', UtilisateurSchema);

export function isUtilisateur(arg: unknown): arg is IUtilisateur {
  return typeof arg === 'object' && arg !== null &&
    'username' in arg && typeof (arg as any).username === 'string' &&
    'password' in arg && typeof (arg as any).password === 'string';
  
}
