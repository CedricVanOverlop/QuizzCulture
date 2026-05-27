import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {

    // Joueurs
    getAllJoueurs: () =>
        ipcRenderer.invoke('get-all-joueurs'),
    createJoueur: (nom: string) =>
        ipcRenderer.invoke('create-joueur', nom),
    deleteJoueur: (nom: string) =>
        ipcRenderer.invoke('delete-joueur', nom),

    // Succès
    getAllSucces: () =>
        ipcRenderer.invoke('get-all-succes'),
    getSuccesJoueur: (nom: string) =>
        ipcRenderer.invoke('get-succes-joueur', nom),
    // Catégories
    getAllCategories: () =>
        ipcRenderer.invoke('get-all-categories'),

    // Questions
    getManyQuestionByCategorie: (id_cat: number, nb_questions: number) =>
        ipcRenderer.invoke('get-many-question-by-categorie', id_cat, nb_questions),
    checkReponse: (id_question: number) =>
        ipcRenderer.invoke('check-reponse', id_question),
    getManyQuestionRandom: (nb_questions: number) =>
        ipcRenderer.invoke('get-many-question-random', nb_questions),

    // Parties
    getPartieById: (id_partie: number) =>
        ipcRenderer.invoke('get-partie-by-id', id_partie),
    getPartiesByJoueur: (nom: string) =>
        ipcRenderer.invoke('get-parties-by-joueur', nom),
    getPartiesByVainqueur: (nom: string) =>
        ipcRenderer.invoke('get-parties-by-vainqueur', nom),
    createPartie: (nb_questions: number, id_categorie: number | null) =>
        ipcRenderer.invoke('create-partie', nb_questions, id_categorie),
    updateVainqueur: (id_partie: number, nom: string) =>
        ipcRenderer.invoke('update-vainqueur', id_partie, nom),
    deletePartie: (id: number) =>
        ipcRenderer.invoke('delete-partie', id),
    getAllParties: () =>
    ipcRenderer.invoke('get-all-parties'),

    // PartieJoueur
    getPartieJoueurByJoueur: (nom: string) =>
        ipcRenderer.invoke('get-partiejoueur-by-joueur', nom),
    getPartieJoueurByPartie: (id: number) =>
        ipcRenderer.invoke('get-partiejoueur-by-partie', id),
    getClassementByPartie: (id: number) =>
        ipcRenderer.invoke('get-classement-by-partie', id),
    createPartieJoueur: (id_partie: number, nom_joueur: string) =>
        ipcRenderer.invoke('create-partiejoueur', id_partie, nom_joueur),
    updatePointsJoueur: (id_partie: number, nom_joueur: string, points_gagnes: number) =>
        ipcRenderer.invoke('update-points-joueur', id_partie, nom_joueur, points_gagnes),

    // PartieQuestion
    getPartieQuestionByPartie: (id: number) =>
        ipcRenderer.invoke('get-partiequestion-by-partie', id),
    createPartieQuestion: (id_partie: number, id_question: number, ordre: number) =>
        ipcRenderer.invoke('create-partiequestion', id_partie, id_question, ordre),
    updateRepondant: (id_partie: number, id_question: number, id_joueur: string, est_correcte: boolean, points_gagnes: number) =>
        ipcRenderer.invoke('update-repondant', id_partie, id_question, id_joueur, est_correcte, points_gagnes),
    deletePartieQuestion: (id_partie: number, id_question: number) =>
        ipcRenderer.invoke('delete-partiequestion', id_partie, id_question),

    checkAndUnlockSucces: (id_partie: number) =>
        ipcRenderer.invoke('check-and-unlock-succes', id_partie),
    
    countVictoires: (nom: string) =>
        ipcRenderer.invoke('count-victoires', nom),

});