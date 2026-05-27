import { Injectable } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class QuestionService {
  private api = (window as any).api;

  async getManyQuestionByCategorie(id_cat: number, nb_questions: number) {
    return await this.api.getManyQuestionByCategorie(id_cat, nb_questions);
  }

  async checkReponse(id_question: number) {
    return await this.api.checkReponse(id_question);
  }

  async getAllCategories() {
    return await this.api.getAllCategories();
  }

  async getManyQuestionRandom(nb_questions: number) {
    return await this.api.getManyQuestionRandom(nb_questions);
  }
}
