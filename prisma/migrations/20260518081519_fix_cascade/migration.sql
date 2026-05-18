-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PartieJoueur" (
    "nom_joueur" TEXT NOT NULL,
    "id_partie" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,

    PRIMARY KEY ("nom_joueur", "id_partie"),
    CONSTRAINT "PartieJoueur_nom_joueur_fkey" FOREIGN KEY ("nom_joueur") REFERENCES "Joueur" ("nom") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PartieJoueur_id_partie_fkey" FOREIGN KEY ("id_partie") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PartieJoueur" ("id_partie", "nom_joueur", "points") SELECT "id_partie", "nom_joueur", "points" FROM "PartieJoueur";
DROP TABLE "PartieJoueur";
ALTER TABLE "new_PartieJoueur" RENAME TO "PartieJoueur";
CREATE TABLE "new_PartieQuestion" (
    "id_partie" INTEGER NOT NULL,
    "id_question" INTEGER NOT NULL,
    "id_joueur" TEXT,
    "ordre" INTEGER NOT NULL,

    PRIMARY KEY ("id_partie", "id_question"),
    CONSTRAINT "PartieQuestion_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PartieQuestion_id_joueur_fkey" FOREIGN KEY ("id_joueur") REFERENCES "Joueur" ("nom") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PartieQuestion_id_partie_fkey" FOREIGN KEY ("id_partie") REFERENCES "Partie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PartieQuestion" ("id_joueur", "id_partie", "id_question", "ordre") SELECT "id_joueur", "id_partie", "id_question", "ordre" FROM "PartieQuestion";
DROP TABLE "PartieQuestion";
ALTER TABLE "new_PartieQuestion" RENAME TO "PartieQuestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
