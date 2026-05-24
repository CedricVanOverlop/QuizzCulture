# Quiz App 🎯

Application de quiz multijoueur développée dans le cadre du cours de projet de développement SGBD (BAC 2).
Elle permet de gérer des joueurs, des catégories, des questions et des parties de quiz, avec un système de succès.

Développée avec **Electron** (desktop), **Angular** (interface), **Prisma** (ORM) et **SQLite** (base de données locale).

---

## Table des matières

1. [Description du projet](#description-du-projet)
2. [Schéma de la base de données](#schéma-de-la-base-de-données)
3. [Explication de la modélisation](#explication-de-la-modélisation)
4. [Prérequis](#prérequis)
5. [Installation](#installation)
6. [Scripts disponibles](#scripts-disponibles)
7. [Structure du projet](#structure-du-projet)

---

## Description du projet

Quiz App est une application de bureau qui permet de :

- **Gérer des joueurs** : créer, consulter et supprimer des joueurs
- **Gérer des catégories** : organiser les questions par thème
- **Gérer des questions** : créer des questions à choix multiples (1 bonne réponse + 3 propositions)
- **Jouer des parties** : lancer des parties multijoueur, attribuer des questions aux joueurs, suivre les scores
- **Débloquer des succès** : système de récompenses pour les joueurs

L'application suit une architecture **Main / Preload / Renderer** imposée par Electron, avec communication via IPC entre le process principal (Node.js + Prisma) et le renderer (Angular).

---

## Schéma de la base de données

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Joueur    │         │   PartieJoueur   │         │   Partie    │
│─────────────│         │──────────────────│         │─────────────│
│ nom (PK)    │◄────────│ nom_joueur (FK)  │────────►│ id (PK)     │
│             │         │ id_partie (FK)   │         │ nb_questions│
│             │         │ points           │         │ nom_vainqueur│
└──────┬──────┘         └──────────────────┘         └──────┬──────┘
       │                                                     │
       │ 1                                                 1 │
       │                                                     │
       ▼ N                                                 N ▼
┌──────────────┐        ┌──────────────────┐        ┌──────────────┐
│ JoueurSucces │        │  PartieQuestion  │        │   Question   │
│──────────────│        │──────────────────│        │──────────────│
│ nom_joueur   │        │ id_partie (FK)   │        │ id (PK)      │
│ id_succes    │        │ id_question (FK) │        │ interrogation│
└──────┬───────┘        │ id_joueur (FK)   │        │ reponse      │
       │                │ ordre            │        │ proposition1 │
       │ N              └──────────────────┘        │ proposition2 │
       │                                            │ proposition3 │
       ▼ 1                                          │ id_categorie │
┌─────────────┐                                     └──────┬───────┘
│   Succes    │                                            │ N
│─────────────│                                            │
│ id (PK)     │                                            ▼ 1
│ libelle     │                                     ┌─────────────┐
│ description │                                     │  Categorie  │
└─────────────┘                                     │─────────────│
                                                    │ id (PK)     │
                                                    │ libelle     │
                                                    │ description │
                                                    └─────────────┘
```

---

## Explication de la modélisation

### Les entités principales

**Joueur**
Représente un joueur identifié par son nom (clé primaire). Un joueur peut participer à plusieurs parties, répondre à des questions et débloquer des succès.

**Partie**
Représente une session de jeu. Elle contient le nombre de questions jouées et le nom du vainqueur (nullable — la partie peut ne pas encore être terminée).

**Question**
Représente une question à choix multiples. Elle contient l'énoncé, la bonne réponse et trois propositions incorrectes. Chaque question appartient à une catégorie.

**Categorie**
Regroupe les questions par thème (ex : Histoire, Science, Sport...).

**Succes**
Représente une récompense débloquable par un joueur (ex : "Première victoire", "10 parties jouées"...).

---

### Les relations

**PartieJoueur** — Table de jonction N:M entre Joueur et Partie

Un joueur peut participer à plusieurs parties, et une partie peut avoir plusieurs joueurs.
Cette table stocke également les **points** obtenus par chaque joueur dans chaque partie.

**PartieQuestion** — Table de jonction N:M entre Partie et Question

Une partie contient plusieurs questions, et une question peut apparaître dans plusieurs parties.
Cette table stocke aussi quel joueur a répondu à la question (id_joueur, nullable) et l'**ordre** d'apparition de la question dans la partie.

**JoueurSucces** — Table de jonction N:M entre Joueur et Succes

Un joueur peut débloquer plusieurs succès, et un succès peut être débloqué par plusieurs joueurs.

---

### Choix de modélisation

| Choix | Justification |
|-------|---------------|
| nom comme PK pour Joueur | Le nom est l'identifiant naturel d'un joueur dans ce contexte |
| nom_vainqueur nullable dans Partie | La partie peut être en cours sans vainqueur encore désigné |
| id_joueur nullable dans PartieQuestion | Une question peut être posée sans qu'un joueur spécifique y ait encore répondu |
| Tables de jonction explicites | Permet de stocker des données supplémentaires sur la relation (points, ordre) |
| autoincrement sur les IDs numériques | Garantit l'unicité sans contrainte métier |

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [Git](https://git-scm.com/)
- Angular CLI : `npm install -g @angular/cli`
- **Windows uniquement** : [Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) avec le composant "Développement Desktop en C++"

> Les Visual Studio Build Tools sont obligatoires sur Windows pour compiler better-sqlite3, un module natif C++ requis par Prisma.

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/TON_USERNAME/quiz-app.git
cd quiz-app
```

### 2. Installer les dépendances Electron

```bash
npm install
```

### 3. Installer better-sqlite3 compilé pour Electron

Cette étape est obligatoire et distincte du npm install classique car better-sqlite3 doit être compilé spécifiquement pour la version d'Electron embarquée dans le projet.

```bash
npm install better-sqlite3 --build-from-source --runtime=electron --target=35.0.0 --dist-url=https://electronjs.org/headers
```

### 4. Créer le fichier d'environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```
DATABASE_URL="file:./dev.db"
```

> Ce fichier est ignoré par Git (`.gitignore`), il doit donc être recréé manuellement sur chaque machine.

### 5. Générer le client Prisma et créer la base de données

```bash
npx prisma migrate deploy
npx prisma generate
```

`prisma migrate deploy` applique les migrations existantes et crée le fichier `dev.db`.
`prisma generate` génère le client TypeScript dans `src/prisma/generated/`.

### 6. Installer les dépendances Angular et builder le renderer

```bash
cd renderer/app
npm install
ng build
cd ../..
```

### 7. Lancer l'application

```bash
npm start
```

L'application Electron s'ouvre.

---

## Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| npm start | electron-forge start | Lance l'application Electron |
| npm run build:angular | cd renderer/app && ng build | Compile le renderer Angular |
| npm run prisma:migrate | prisma migrate dev | Crée et applique une nouvelle migration |
| npm run prisma:generate | prisma generate | Régénère le client TypeScript Prisma |
| npm run prisma:studio | prisma studio | Ouvre l'interface visuelle de la base de données |

---

## Structure du projet

```
quiz-app/
├── src/
│   ├── main/
│   │   └── main.ts              # Process principal Electron (IPC handlers)
│   ├── preload/
│   │   └── preload.ts           # Bridge sécurisé via contextBridge
│   └── prisma/
│       └── generated/           # Client Prisma généré (ignoré par git)
├── renderer/
│   └── app/                     # Application Angular
│       ├── src/
│       │   └── app/
│       │       ├── components/  # Composants Angular
│       │       ├── services/    # Services Angular
│       │       └── types/       # Types TypeScript
│       └── dist/                # Build Angular (ignoré par git)
├── prisma/
│   ├── schema.prisma            # Schéma de la base de données
│   └── migrations/              # Migrations SQL versionnées
├── .env                         # Variables d'environnement (à créer manuellement, non versionné)
├── forge.config.ts              # Configuration Electron Forge
├── vite.main.config.mts         # Configuration Vite (main process)
├── vite.preload.config.mts      # Configuration Vite (preload)
└── README.md
```