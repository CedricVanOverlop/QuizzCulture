import { Injectable } from '@angular/core';

@Injectable({ 
  providedIn: 'root' 
})
export class SuccesService {
  private api = (window as any).api;

  async getAllSucces() {
    return await this.api.getAllSucces();
  }

  async getSuccesJoueur(nom: string) {
    return await this.api.getSuccesJoueur(nom);
  }

  async getSuccesNonObtenusParJoueur(nom: string) {
    return await this.api.getSuccesNonObtenusParJoueur(nom);
  }

  async unlockSucces(nom: string, id: number) {
    return await this.api.unlockSucces(nom, id);
  }
}
