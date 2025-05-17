# Daily Updates App

Une application web qui permet de suivre vos réalisations quotidiennes.

## Fonctionnalités

- 📝 Création de mises à jour quotidiennes
- 📊 Visualisation des mises à jour précédentes
- 📈 Statistiques (nombre total, par jour, mots fréquents)
- 👤 Profil utilisateur simple

## Technologies utilisées

- **Frontend** : Next.js (React)
- **Backend** : API Routes de Next.js
- **UI** : Tailwind CSS et shadcn/ui
- **Base de données** : Firebase Firestore

## Comment démarrer

1. Cloner le dépôt
2. Installer les dépendances :
   ```
   npm install
   ```
3. Configurer Firebase :
   - Pour des instructions détaillées, consultez [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Pour le développement rapide, vous pouvez ignorer cette étape car l'application utilisera une implémentation simulée

4. Lancer le serveur de développement :
   ```
   npm run dev
   ```
5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

- `/src/app` - Pages de l'application (Next.js App Router)
- `/src/components` - Composants React réutilisables
- `/src/lib` - Utilitaires et services
  - `firebase-admin.ts` - Configuration et utilitaires Firebase
  - `updates.ts` - Opérations Firestore pour les mises à jour
- `/src/types` - Types TypeScript

## API

L'application expose les points d'API suivants :

- `GET /api/updates` - Récupère toutes les mises à jour
- `POST /api/updates` - Crée une nouvelle mise à jour
- `GET /api/stats` - Récupère les statistiques des mises à jour

## Collection Firestore

L'application utilise une collection Firestore nommée `updates` avec la structure suivante :
```
{
  id: string (automatiquement généré),
  userId: string,
  content: string,
  createdAt: Timestamp
}
```

## Authentification

L'authentification est simulée dans cette version de l'application, avec un ID utilisateur fixe (1).

## Mode de développement

En mode développement, l'application utilisera une implémentation simulée de Firestore si les variables d'environnement Firebase ne sont pas configurées. Cela permet un développement rapide sans avoir besoin de configurer Firebase immédiatement.

Pour un déploiement en production, assurez-vous de configurer correctement les variables d'environnement comme décrit dans [FIREBASE_SETUP.md](FIREBASE_SETUP.md).

## Licence

MIT
