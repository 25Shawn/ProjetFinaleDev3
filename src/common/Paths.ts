/**
 * Express router paths go here.
 */


export default {
  Base: '/fitness',
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/',
  },
  Seance: {
    Base: '/',
    Get: '/TousLesSeances/:idUtilisateur',
    GetOne: '/Seance/:idSeance/:idUtilisateur',
    GetMoyenneTempsIntensite: '/MoyenneTempsIntensite/:type/:niveauIntensite',
    GetTypeEntrainement: '/TypeEntrainement/:type',
    GetAllUsers: '/TousLesUtilisateurs',
    Add: '/AjouterSeance',
    AddUser: '/AjouterUtilisateur',
    Update: '/ModifierSeance',
    Delete: '/SupprimerSeance/:id',
  },
} as const;
