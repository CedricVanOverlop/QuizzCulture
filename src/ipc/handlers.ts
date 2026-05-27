import { ipcMain } from 'electron';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../prisma/generated/client.js';
import path from 'node:path';

const dbPath = path.join(__dirname, '..', '..', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

export function registerHandlers() {
    ipcMain.handle('get-all-joueurs', async () => {
        return await prisma.joueur.findMany({
            where: { actif: true }
        });
    });

    ipcMain.handle('create-joueur', async (_event, nom: string) => {
        try {
            // Vérifie si le joueur existe déjà (actif ou inactif)
            const existant = await prisma.joueur.findUnique({ where: { nom } });

            if (existant) {
                // Réactive le joueur existant avec tout son historique
                return await prisma.joueur.update({
                    where: { nom },
                    data: { actif: true }
                });
            }

            // Sinon crée un nouveau joueur
            return await prisma.joueur.create({
                data: { nom, actif: true }
            });
        } catch (error) {
            console.error('message', error);
            throw error;
        }
    });

    ipcMain.handle('delete-joueur', async (_event, nom: string) => {
        try {
            return await prisma.joueur.update({
                where: { nom },
                data: { actif: false }
            });
        } catch (error) {
            console.error('message', error);
            throw error;
        }
    });

    ipcMain.handle('get-all-succes', async () => {
        return await prisma.succes.findMany();
    });

    ipcMain.handle('get-succes-joueur', async(_event, nom: string) => {
        return await prisma.joueurSucces.findMany({
            where: { nom_joueur: nom }
        })
    });


    ipcMain.handle('get-all-categories', async () => {
        return await prisma.categorie.findMany();
    });

    ipcMain.handle('get-many-question-random', async(_event, nb_questions: number) => {
        const questions = await prisma.question.findMany({
            omit: { reponse: true }
        });
        const melange = questions.sort(() => Math.random() - 0.5);
        return melange.slice(0, nb_questions);
    });

    ipcMain.handle('get-many-question-by-categorie', async(_event, id_cat: number, nb_questions: number) => {
        const questions = await prisma.question.findMany({
            where: { id_categorie: id_cat },
            omit: { reponse: true }
        });
        const melange = questions.sort(() => Math.random() - 0.5);
        return melange.slice(0, nb_questions);
    });

    ipcMain.handle('check-reponse', async(_event, id_question: number) => {
        return await prisma.question.findUnique({
            where: { id: id_question },
            select: { reponse: true }
        });
    });

    ipcMain.handle('get-all-parties', async () => {
        return await prisma.partie.findMany({
            include: {
                vainqueur: true,
                categorie: true,
                joueurs: true
            }
        });
    });

    ipcMain.handle('get-partie-by-id', async(_event, id_partie: number) => {
        return await prisma.partie.findUnique({
            where: { id: id_partie },
            include: {
                categorie: true,
                joueurs: true,
                vainqueur: true
            }
        })
    });

    ipcMain.handle('get-parties-by-joueur', async(_event, nom: string) => {
        return await prisma.partieJoueur.findMany({
            where: { nom_joueur: nom },
            include: { partie: true }
        })
    });

    ipcMain.handle('get-parties-by-vainqueur', async(_event, nom: string) => {
        return await prisma.partie.findMany({
            where: { nom_vainqueur: nom },
            include: { joueurs: true }
        })
    });

    ipcMain.handle('create-partie', async(_event, nb_questions: number, id_categorie: number | null) => {
        return await prisma.partie.create({
            data: {
                nb_questions: nb_questions,
                id_categorie: id_categorie
            }
        })
    });

    ipcMain.handle('update-vainqueur', async(_event, id_partie: number, nom: string) => {
        return await prisma.partie.update({
            where: { id: id_partie },
            data: { nom_vainqueur: nom }
        })
    });

    ipcMain.handle('delete-partie', async(_event, id: number) => {
        return await prisma.partie.delete({
            where: { id: id }
        })
    });

    ipcMain.handle('get-partiejoueur-by-joueur', async(_event, nom: string) => {
        return await prisma.partieJoueur.findMany({
            where: { nom_joueur: nom }
        })
    });

    ipcMain.handle('get-partiejoueur-by-partie', async(_event, id: number) => {
        return await prisma.partieJoueur.findMany({
            where: { id_partie: id }
        })
    });

    ipcMain.handle('get-classement-by-partie', async(_event, id: number) => {
        return await prisma.partieJoueur.findMany({
            where: { id_partie: id },
            orderBy: { points: 'desc' }
        })
    });

    ipcMain.handle('create-partiejoueur', async(_event, id_partie: number, nom_joueur: string) => {
        return await prisma.partieJoueur.create({
            data: {
                nom_joueur: nom_joueur,
                id_partie: id_partie,
                points: 0
            }
        })
    });

    ipcMain.handle('update-points-joueur', async(_event, id_partie: number, nom_joueur: string, points_gagnes: number) => {
        return await prisma.partieJoueur.update({
            where: {
                nom_joueur_id_partie: {
                    id_partie: id_partie,
                    nom_joueur: nom_joueur
                }
            },
            data: {
                points: { increment: points_gagnes }
            }
        })
    });

    ipcMain.handle('get-partiequestion-by-partie', async(_event, id: number) => {
        return await prisma.partieQuestion.findMany({
            where: { id_partie: id },
            include: { question: true }
        })
    });

    ipcMain.handle('create-partiequestion', async(_event, id_partie: number, id_question: number, ordre: number) => {
        return await prisma.partieQuestion.create({
            data: {
                id_partie: id_partie,
                id_question: id_question,
                ordre: ordre
            }
        })
    });

    ipcMain.handle('update-repondant', async(_event, id_partie: number, id_question: number, id_joueur: string, est_correcte: boolean, points_gagnes: number) => {
        return await prisma.partieQuestion.update({
            where: {
                id_partie_id_question: {
                    id_partie: id_partie,
                    id_question: id_question
                }
            },
            data: {
                joueur: { connect: { nom: id_joueur } },
                est_correcte: est_correcte,
                points_gagnes: points_gagnes
            }
        })
    });

    ipcMain.handle('delete-partiequestion', async(_event, id_partie: number, id_question: number) => {
        return await prisma.partieQuestion.delete({
            where: {
                id_partie_id_question: {
                    id_partie: id_partie,
                    id_question: id_question
                }
            }
        })
    });

    ipcMain.handle('check-and-unlock-succes', async (_event, id_partie: number) => {

        const partie = await prisma.partie.findUnique({
            where: { id: id_partie },
            include: { joueurs: true, partieQuestions: true, categorie: true }
        });
        if (!partie) return [];

        const joueursPartie = partie.joueurs.map((j: any) => j.nom_joueur);

        // Libellés des succès nouvellement débloqués (toutes joueurs confondus)
        const nouveauxSucces: { joueur: string, libelle: string }[] = [];

        for (const nom of joueursPartie) {

            const dejaDébloques = await prisma.joueurSucces.findMany({ where: { nom_joueur: nom } });
            const idsDebloques = new Set(dejaDébloques.map((js: any) => js.id_succes));

            const unlock = async (id: number) => {
                if (!idsDebloques.has(id)) {
                    await prisma.joueurSucces.create({ data: { nom_joueur: nom, id_succes: id } });
                    idsDebloques.add(id);
                    const succes = await prisma.succes.findUnique({ where: { id } });
                    if (succes) nouveauxSucces.push({ joueur: nom, libelle: succes.libelle });
                }
            };

            // ── Succès 1 : Première victoire ─────────────────────────────────
            if (partie.nom_vainqueur === nom) {
                const nbVictoires = await prisma.partie.count({ where: { nom_vainqueur: nom } });
                if (nbVictoires >= 1) await unlock(1);
            }

            // ── Succès 2 : Sans faute ─────────────────────────────────────────
            const questionsJoueur = partie.partieQuestions.filter((pq: any) => pq.id_joueur === nom);
            const toutesCorrectes = questionsJoueur.length > 0 && questionsJoueur.every((pq: any) => pq.est_correcte === true);
            if (toutesCorrectes) await unlock(2);

            // ── Succès 3 : Vétéran ────────────────────────────────────────────
            const nbParties = await prisma.partieJoueur.count({ where: { nom_joueur: nom } });
            if (nbParties >= 5) await unlock(3);

            // ── Succès 4 : Maître du Cash ─────────────────────────────────────
            const nbCash = await prisma.partieQuestion.count({
                where: { id_joueur: nom, est_correcte: true, points_gagnes: 3 }
            });
            if (nbCash >= 10) await unlock(4);

            // ── Succès 5 : Érudit ─────────────────────────────────────────────
            const categories = await prisma.categorie.findMany();
            let erudit = true;
            for (const cat of categories) {
                const bonneReponse = await prisma.partieQuestion.findFirst({
                    where: {
                        id_joueur: nom,
                        est_correcte: true,
                        question: { id_categorie: cat.id }
                    },
                    include: { question: true }
                });
                if (!bonneReponse) { erudit = false; break; }
            }
            if (erudit) await unlock(5);

            // ── Succès 6-10 : Champions par catégorie ────────────────────────
            if (partie.nom_vainqueur === nom && partie.id_categorie !== null) {
                const championsMap: Record<number, number> = { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10 };
                const idSucces = championsMap[partie.id_categorie];
                if (idSucces) await unlock(idSucces);
            }

            // ── Succès 11 : Grand Explorateur ────────────────────────────────
            let grandExplorateur = true;

            const victoireMixte = await prisma.partie.findFirst({
                where: { nom_vainqueur: nom, id_categorie: null }
            });
            if (!victoireMixte) grandExplorateur = false;

            if (grandExplorateur) {
                const cats = await prisma.categorie.findMany();
                for (const cat of cats) {
                    const victoireCat = await prisma.partie.findFirst({
                        where: { nom_vainqueur: nom, id_categorie: cat.id }
                    });
                    if (!victoireCat) { grandExplorateur = false; break; }
                }
            }
            if (grandExplorateur) await unlock(11);
        }

        return nouveauxSucces;
    });

    ipcMain.handle('count-victoires', async (_event, nom: string) => {
        return await prisma.partie.count({
            where: { nom_vainqueur: nom }
        });
    });
}