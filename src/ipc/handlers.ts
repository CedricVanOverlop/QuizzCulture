import { ipcMain } from 'electron';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../prisma/generated/client.js';
import path from 'node:path';
import { error } from 'node:console';

const dbPath = path.join(__dirname, '..', '..', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const prisma = new PrismaClient({ adapter });

export function registerHandlers() {
    ipcMain.handle('get-all-joueurs', async () => { //Récupérer la liste de tous les joueurs
        return await prisma.joueur.findMany();
    });

    ipcMain.handle('create-joueur', async (_event, nom: string) => { //Créer un joueur
        try {
            return await prisma.joueur.create({
                data: {
                    nom: nom
                }
            })
        } catch (error){
            console.error('message', error);
            throw error; 
        }
    });

    ipcMain.handle('delete-joueur', async (_event, nom: string) => { //Supprimer un joueur
        try {
            return await prisma.joueur.delete({
                where: {
                    nom: nom
                }
            })
        } catch (error){
            console.error('message', error);
            throw error; 
        }
    });

    ipcMain.handle('get-all-succes', async () => { // Récupérer tout les succès
        return await prisma.succes.findMany();
    });

    ipcMain.handle('get-succes-joueur', async(_event, nom: string) => { // Récupérer tous les succès débloqués par un joueur
        return await prisma.joueurSucces.findMany({
            where: {
                nom_joueur:nom
            }
        })
    });

    ipcMain.handle('get-succes-non-obtenus-par-joueur', async(_event,nom:string) => { // Récupérer tous les succès non-débloqués par un joueur
        return await prisma.succes.findMany({
            where: {
                joueurSucces : {
                    none: {
                        nom_joueur:nom
                    }
                }
            }
        })
    });

    ipcMain.handle('unlock_succes', async(_event, nom:string, id:number) =>{ // Unlock un succès d'un joueur
        return await prisma.joueurSucces.create({
            data: {
                nom_joueur:nom,
                id_succes:id
            }
        })
    });

    ipcMain.handle('get-categorie', async(_event, id_cat:number) => {
        return await prisma.categorie.findMany({
            where: {
                id:id_cat
            }
        })
    });

    ipcMain.handle('get-question-random', async() => {
        const questions = await prisma.question.findMany();
        const random = questions[Math.floor(Math.random() * questions.length)];
        return random;
    });

    ipcMain.handle('get-question-by-id', async(_event, id_question:number) => {
        return await prisma.question.findUnique({
            where: { id: id_question },
            omit: { reponse: true }  
        });
    });

    ipcMain.handle('get-question-by-categorie', async(_event, id_cat:number) => {
        const questions = await prisma.question.findMany({
            where: { id_categorie: id_cat },
            omit: { reponse: true }
        });
        const random = questions[Math.floor(Math.random() * questions.length)];
        return random;
    });

    ipcMain.handle('get-many-question-by-categorie', async(_event, id_cat:number, nb_questions: number) => {
        const questions = await prisma.question.findMany({
            where: { id_categorie: id_cat },
            omit: { reponse: true }
        });
        const melange = questions.sort(() => Math.random() - 0.5);
        return melange.slice(0, nb_questions);
    });

    ipcMain.handle('check-reponse', async(_event, id_question:number) =>{
        return await prisma.question.findUnique({
            where: { id: id_question },
            select: { reponse: true }  
        });
    });

    


}