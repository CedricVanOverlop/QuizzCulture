import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur';
import { SuccesService } from '../../services/succes';
import { RouterLink } from '@angular/router';
import { Joueur } from '../../types/joueur';
import { Succes as SuccesInterface, SuccesAvecEtat } from '../../types/succes';
import { DetailSucces } from '../detail-succes/detail-succes';

@Component({
  selector: 'app-succes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DetailSucces],
  templateUrl: './succes.html',
  styleUrl: './succes.scss'
})

export class Succes implements OnInit {
  private joueurService = inject(JoueurService);
  private succesService = inject(SuccesService);

  joueurs = signal<Joueur[]>([]);
  tousSucces = signal<SuccesInterface[]>([]);
  succesDebloques = signal<{ id_succes: number }[]>([]);
  joueurSelectionne = signal<string>('');
  succesSelectionne = signal<SuccesAvecEtat | null>(null);

  succesAvecEtat = computed<SuccesAvecEtat[]>(() => {
    const tous = this.tousSucces();
    const joueur = this.joueurSelectionne();
    if (!joueur) return tous.map(s => ({ ...s, debloque: null }));
    const ids = this.succesDebloques().map(js => js.id_succes);
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

  ouvrirDetail(succes: SuccesAvecEtat) {
    this.succesSelectionne.set(succes);
  }

  fermerDetail() {
    this.succesSelectionne.set(null);
  }
}