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
    GetMoyenneTempsIntensite: '/MoyenneTempsIntensite/:type/:niveauIntensite/:idUtilisateur',
    GetTypeEntrainement: '/TypeEntrainement/:type/:idUtilisateur',
    GetAllUsers: '/TousLesUtilisateurs',
    Add: '/AjouterSeance/:idUtilisateur',
    AddUser: '/AjouterUtilisateur',
    Update: '/ModifierSeance',
    Delete: '/SupprimerSeance/:id/:idUtilisateur',
  },
} as const;
