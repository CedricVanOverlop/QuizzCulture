-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nb_questions" INTEGER NOT NULL,
    "nom_vainqueur" TEXT,
    "id_categorie" INTEGER,
    CONSTRAINT "Partie_nom_vainqueur_fkey" FOREIGN KEY ("nom_vainqueur") REFERENCES "Joueur" ("nom") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Partie_id_categorie_fkey" FOREIGN KEY ("id_categorie") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Partie" ("id", "nb_questions", "nom_vainqueur") SELECT "id", "nb_questions", "nom_vainqueur" FROM "Partie";
DROP TABLE "Partie";
ALTER TABLE "new_Partie" RENAME TO "Partie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
