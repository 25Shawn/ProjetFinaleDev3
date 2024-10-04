/**
 * Express router paths go here.
 */


export default {
  Base: '/fitness',
  Seance: {
    Base: '/',
    Get: '/TousLesSeances',
    GetOne: '/Seance/:id',
    GetMoyenneTempsIntensite: '/MoyenneTempsIntensite/:type/:niveauIntensite',
    Add: '/AjouterSeance',
    Update: '/ModifierSeance',
    Delete: '/SupprimerSeance/:id',
  },
} as const;
