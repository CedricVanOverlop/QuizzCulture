import { Injectable } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class PartieService {
  private api = (window as any).api;

  async getPartieById(id: number) {
    return await this.api.getPartieById(id);
  }

  async getPartiesByJoueur(nom: string) {
    return await this.api.getPartiesByJoueur(nom);
  }

  async getPartiesByVainqueur(nom: string) {
    return await this.api.getPartiesByVainqueur(nom);
  }

  async createPartie(nb_questions: number, id_categorie: number | null) {
      return await this.api.createPartie(nb_questions, id_categorie);
  }

  async updateVainqueur(id_partie: number, nom: string) {
    return await this.api.updateVainqueur(id_partie, nom);
  }

  async deletePartie(id: number) {
    return await this.api.deletePartie(id);
  }

  async getPartieJoueurByJoueur(nom: string) {
    return await this.api.getPartieJoueurByJoueur(nom);
  }

  async getPartieJoueurByPartie(id: number) {
    return await this.api.getPartieJoueurByPartie(id);
  }

  async getClassementByPartie(id: number) {
    return await this.api.getClassementByPartie(id);
  }

  async createPartieJoueur(id_partie: number, nom_joueur: string) {
    return await this.api.createPartieJoueur(id_partie, nom_joueur);
  }

  async updatePointsJoueur(id_partie: number, nom_joueur: string, points_gagnes: number) {
    return await this.api.updatePointsJoueur(id_partie, nom_joueur, points_gagnes);
  }

  async getPartieQuestionByPartie(id: number) {
    return await this.api.getPartieQuestionByPartie(id);
  }

  async createPartieQuestion(id_partie: number, id_question: number, ordre: number) {
    return await this.api.createPartieQuestion(id_partie, id_question, ordre);
  }

  async updateRepondant(id_partie: number, id_question: number, id_joueur: string) {
    return await this.api.updateRepondant(id_partie, id_question, id_joueur);
  }

  async deletePartieQuestion(id_partie: number, id_question: number) {
    return await this.api.deletePartieQuestion(id_partie, id_question);
  }

  async getAllParties() {
    return await this.api.getAllParties();
  }
}
