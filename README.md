# MedGlass

**MedGlass** est une plateforme de planification intelligente dédiée aux établissements de santé et aux hôpitaux. Elle permet de gérer facilement les gardes, les astreintes, les congés, les échanges de shifts ainsi que la matrice de compétences pour les équipes médicales et paramédicales.

## Technologies

Ce projet est une application web moderne construite avec :
- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Librairie UI** : [React 18](https://react.dev/)
- **Stylisation** : [Tailwind CSS](https://tailwindcss.com/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)

## Prérequis

Assurez-vous d'avoir installé sur votre machine :
- [Node.js](https://nodejs.org/en/) (version 18.x ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)

## Installation et démarrage en local

Pour faire tourner l'application sur votre environnement local, suivez ces étapes :

1. **Cloner le repo** (si ce n'est pas déjà fait) et naviguer dans le dossier du projet :
   ```bash
   cd MedGlass-webapp
   ```

2. **Installer les dépendances** via npm :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Accéder à l'application** :  
   Ouvrez votre navigateur web et allez à l'adresse suivante :  [http://localhost:3000](http://localhost:3000)

## Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter les commandes suivantes :

- `npm run dev` : Lance l'application en mode développement (avec rechargement à chaud).
- `npm run build` : Construit l'application optimisée pour la production.
- `npm run start` : Lance le serveur avec la version de production préalablement construite.
- `npm run lint` : Vérifie la qualité du code à l'aide de ESLint.
- `npm run typecheck` : Vérifie les erreurs de typage TypeScript sans générer de fichiers.
