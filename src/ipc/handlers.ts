import { ipcMain } from 'electron';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../prisma/generated/client.js';
import path from 'node:path';

const dbPath = path.join(__dirname, '..', '..', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

export function registerHandlers() {
    ipcMain.handle('get-all-joueurs', async () => {
        return await prisma.joueur.findMany();
    });

    ipcMain.handle('create-joueur', async (_event, nom: string) => {
        try {
            return await prisma.joueur.create({
                data: { nom: nom }
            })
        } catch (error){
            console.error('message', error);
            throw error; 
        }
    });

    ipcMain.handle('delete-joueur', async (_event, nom: string) => {
        try {
            return await prisma.joueur.delete({
                where: { nom: nom }
            })
        } catch (error){
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

    ipcMain.handle('get-succes-non-obtenus-par-joueur', async(_event, nom: string) => {
        return await prisma.succes.findMany({
            where: {
                joueurSucces: {
                    none: { nom_joueur: nom }
                }
            }
        })
    });

    ipcMain.handle('unlock_succes', async(_event, nom: string, id: number) => {
        return await prisma.joueurSucces.create({
            data: {
                nom_joueur: nom,
                id_succes: id
            }
        })
    });

    ipcMain.handle('get-all-categories', async () => {
        return await prisma.categorie.findMany();
    });

    ipcMain.handle('get-categorie', async(_event, id_cat: number) => {
        return await prisma.categorie.findMany({
            where: { id: id_cat }
        })
    });

    ipcMain.handle('get-question-random', async() => {
        const questions = await prisma.question.findMany();
        const random = questions[Math.floor(Math.random() * questions.length)];
        return random;
    });

    ipcMain.handle('get-question-by-id', async(_event, id_question: number) => {
        return await prisma.question.findUnique({
            where: { id: id_question },
            omit: { reponse: true }
        });
    });

    ipcMain.handle('get-question-by-categorie', async(_event, id_cat: number) => {
        const questions = await prisma.question.findMany({
            where: { id_categorie: id_cat },
            omit: { reponse: true }
        });
        const random = questions[Math.floor(Math.random() * questions.length)];
        return random;
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
            where: { id_partie: id }
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

    ipcMain.handle('update-repondant', async(_event, id_partie: number, id_question: number, id_joueur: string) => {
        return await prisma.partieQuestion.update({
            where: {
                id_partie_id_question: {
                    id_partie: id_partie,
                    id_question: id_question
                }
            },
            data: { id_joueur: id_joueur }
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
}