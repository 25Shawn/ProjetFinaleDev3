# ApiFitness

## Résumé
ApiFitness est une API conçue pour gérer les séances d'entraînement des utilisateurs dans un site web de fitness. L'application permet aux utilisateurs de suivre leurs performances, d'enregistrer leurs séances et d'obtenir des informations sur leur progression physique comme Strava.

---

## Information d'authentification

- **Pour se créer un compte** :
  - **Chemin** : `/fitness/AjouterUtilisateur`
  - **Méthode** : `POST`
  - **Description** : Cette route permet à un utilisateur de s'inscrire dans l'application en fournissant un nom d'utilisateur et un mot de passe.
  - **Corps de la requête** (JSON) :
    ```json
    {
      "utilisateur":{
          "username":"nom_utilisateur",
          "password":"mot_de_passe"
      }
    }
    ```

- **Pour se connecter** :
  - **Chemin** : `/fitness/generatetoken`
  - **Méthode** : `POST`
  - **Description** : Cette route permet à un utilisateur de se connecter et d'obtenir un token JWT en utilisant son nom d'utilisateur et son mot de passe.
  - **Corps de la requête** (JSON) :
    ```json
    {
      "utilisateur":{
          "username":"nom_utilisateur",
          "password":"mot_de_passe"
      }
    }
    ```

  - **Réponse** :
    ```json
    {
      "token": {
          "token": "string",
          "id": 0,
          "username": "string"
      }
    }
    ```
  **Note** : Le id dans la réponse est l'identifiant de l'utilisateur.
  
  **Note** : Le token JWT généré doit être utilisé pour les requêtes suivantes pour accéder aux ressources protégées.

---

## Procédure d'installation dans un poste local

### 1. Base de données
- **MongoDB** : Créez une connection locale de MongoDB, par exemple :
  ```bash
  mongodb://localhost:27017/
- **MongoDB** : Créer une base de données avec le nom de `Fitness` et les collections `Entrainement` et `Utilisateur`

- **MongoDB** : Importer les données initiales dans chaque collections respective qui se trouve dans le dossier `/Dev` de mon API:

### 2. L'api
- **Clonage** : Cloner le dépot de l'API
- **Installez les dépendances**
  ```bash
  npm install
- **Créer une variable d'environnement** : Créer une variable d'environement dans le dossier /env/developpement.env
  ```bash
  MONGO_URI="mongodb://localhost:27017/Fitness?readPreference=primary&ssl=false"
- **Lancer l'API en mode développement** : Utilisez la commande suivante pour démarrer l'API en mode développement
  ```bash
  npm run dev
- **Adresse de l'API** : L'API sera disponible à l'adresse suivante:
  ```bash
  http://localhost:3000
- **Information des chemins** : Pour plus d'information sur les chemins allez dans votre navigateur web et écriver le chemin à la suite de l'adresse de l'API `/fitness/docs`



  


  

