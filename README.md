## Api Fitness

### Résumé
ApiFitness est une API conçue pour gérer les séances d'entraînement des utilisateurs dans un site web de fitness. Le site web permet aux utilisateurs de suivre leurs performances, d'enregistrer leurs séances et d'obtenir des informations sur leur progression physique.

### Information d'authentification
Pour s'authentifier le chemin est /fitness/AjouterUtilisateur qui lui demande le nom d'utilisateur et le mot de passe dans le corps de la requete en JSON.
Pour se connecter à son compte le chemin est /fitness/generatetoken qui lui a besoin du nom d'utilisateur et le mot de passe dans le corps de la requête en JSON.
Cela te retourne `{
  "token": "string",
  "idUtilisateur": 0,
  "username": "string"
}`

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.


## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`. 
