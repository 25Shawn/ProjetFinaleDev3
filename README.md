# ApiFitness

## Résumé
ApiFitness est une API conçue pour gérer les séances d'entraînement des utilisateurs dans un site web de fitness. L'application permet aux utilisateurs de suivre leurs performances, d'enregistrer leurs séances et d'obtenir des informations sur leur progression physique.

---

## Information d'authentification

- **Pour s'authentifier** :
  - **Chemin** : `/fitness/AjouterUtilisateur`
  - **Méthode** : `POST`
  - **Description** : Cette route permet à un utilisateur de s'inscrire dans l'application en fournissant un nom d'utilisateur et un mot de passe.
  - **Corps de la requête** (JSON) :
    ```json
    {
      "username": "nouveau_nom_utilisateur",
      "password": "mot_de_passe"
    }
    ```

- **Pour se connecter** :
  - **Chemin** : `/fitness/generatetoken`
  - **Méthode** : `POST`
  - **Description** : Cette route permet à un utilisateur de se connecter et d'obtenir un token JWT en utilisant son nom d'utilisateur et son mot de passe.
  - **Corps de la requête** (JSON) :
    ```json
    {
      "username": "nom_utilisateur",
      "password": "mot_de_passe"
    }
    ```

  - **Réponse** :
    ```json
    {
      "token": "string",
      "idUtilisateur": 0,
      "username": "string"
    }
    ```

  **Note** : Le token JWT généré doit être utilisé pour les requêtes suivantes pour accéder aux ressources protégées.

---

## Procédure d'installation

### 1. Base de données
- **MongoDB** : Créez une instance locale de MongoDB, par exemple :
  ```bash
  mongodb://localhost:27017/

