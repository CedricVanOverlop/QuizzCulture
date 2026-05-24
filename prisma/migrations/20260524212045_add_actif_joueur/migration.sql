-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Joueur" (
    "nom" TEXT NOT NULL PRIMARY KEY,
    "actif" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Joueur" ("nom") SELECT "nom" FROM "Joueur";
DROP TABLE "Joueur";
ALTER TABLE "new_Joueur" RENAME TO "Joueur";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
