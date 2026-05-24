import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur';
import { SuccesService } from '../../services/succes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-succes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './succes.html',
  styleUrl: './succes.scss'
})
export class Succes implements OnInit {
  private joueurService = inject(JoueurService);
  private succesService = inject(SuccesService);

  joueurs = signal<any[]>([]);
  tousSucces = signal<any[]>([]);
  succesDebloques = signal<any[]>([]);
  joueurSelectionne = signal<string>('');

  succesAvecEtat = computed(() => {
    const tous = this.tousSucces();
    const joueur = this.joueurSelectionne();
    if (!joueur) return tous.map(s => ({ ...s, debloque: null }));
    const ids = this.succesDebloques().map((js: any) => js.id_succes);
    return tous.map(s => ({ ...s, debloque: ids.includes(s.id) }));
  });

  async ngOnInit() {
    this.joueurs.set(await this.joueurService.getAllJoueurs());
    this.tousSucces.set(await this.succesService.getAllSucces());
  }

  async onJoueurChange(nom: string) {
    this.joueurSelectionne.set(nom);
    if (nom) {
      this.succesDebloques.set(await this.succesService.getSuccesJoueur(nom));
    } else {
      this.succesDebloques.set([]);
    }
  }
}