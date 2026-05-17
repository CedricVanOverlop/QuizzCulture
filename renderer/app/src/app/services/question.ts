import { Injectable } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class QuestionService {
  private api = (window as any).api;

  async getQuestionRandom() {
    return await this.api.getQuestionRandom();
  }

  async getQuestionById(id: number) {
    return await this.api.getQuestionById(id);
  }

  async getQuestionByCategorie(id_cat: number) {
    return await this.api.getQuestionByCategorie(id_cat);
  }

  async getManyQuestionByCategorie(id_cat: number, nb_questions: number) {
    return await this.api.getManyQuestionByCategorie(id_cat, nb_questions);
  }

  async checkReponse(id_question: number) {
    return await this.api.checkReponse(id_question);
  }

  async getCategorie(id_cat: number) {
    return await this.api.getCategorie(id_cat);
  }
}
