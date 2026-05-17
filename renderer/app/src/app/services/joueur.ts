import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {
  private api = (window as any).api;

  async getAllJoueurs() {
    return await this.api.getAllJoueurs();
  }

  async createJoueur(nom: string) {
    return await this.api.createJoueur(nom);
  }

  async deleteJoueur(nom: string) {
    return await this.api.deleteJoueur(nom);
  }
}
