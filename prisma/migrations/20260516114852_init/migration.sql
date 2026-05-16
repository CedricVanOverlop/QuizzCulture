-- CreateTable
CREATE TABLE "Joueur" (
    "nom" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Succes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "interrogation" TEXT NOT NULL,
    "reponse" TEXT NOT NULL,
    "proposition1" TEXT NOT NULL,
    "proposition2" TEXT NOT NULL,
    "proposition3" TEXT NOT NULL,
    "id_categorie" INTEGER NOT NULL,
    CONSTRAINT "Question_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "Categorie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nb_questions" INTEGER NOT NULL,
    "nom_vainqueur" TEXT,
    CONSTRAINT "Partie_nom_vainqueur_fkey" FOREIGN KEY ("nom_vainqueur") REFERENCES "Joueur" ("nom") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JoueurSucces" (
    "nom_joueur" TEXT NOT NULL,
    "id_succes" INTEGER NOT NULL,

    PRIMARY KEY ("nom_joueur", "id_succes"),
    CONSTRAINT "JoueurSucces_nom_joueur_fkey" FOREIGN KEY ("nom_joueur") REFERENCES "Joueur" ("nom") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoueurSucces_id_succes_fkey" FOREIGN KEY ("id_succes") REFERENCES "Succes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PartieJoueur" (
    "nom_joueur" TEXT NOT NULL,
    "id_partie" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    PRIMARY KEY ("nom_joueur", "id_partie"),
    CONSTRAINT "PartieJoueur_nom_joueur_fkey" FOREIGN KEY ("nom_joueur") REFERENCES "Joueur" ("nom") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PartieJoueur_id_partie_fkey" FOREIGN KEY ("id_partie") REFERENCES "Partie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PartieQuestion" (
    "id_partie" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,
    "id_joueur" TEXT,
    "ordre" INTEGER NOT NULL,

    PRIMARY KEY ("id_partie", "id_question"),
    CONSTRAINT "PartieQuestion_id_partie_fkey" FOREIGN KEY ("id_partie") REFERENCES "Partie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PartieQuestion_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PartieQuestion_id_joueur_fkey" FOREIGN KEY ("id_joueur") REFERENCES "Joueur" ("nom") ON DELETE SET NULL ON UPDATE CASCADE
);
