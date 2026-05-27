import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur';
import { SuccesService } from '../../services/succes';
import { RouterLink } from '@angular/router';
import { Joueur } from '../../types/joueur';
import { Succes as SuccesInterface, SuccesAvecEtat } from '../../types/succes';
import { DetailSucces } from '../detail-succes/detail-succes';

// Affiche tous les succès disponibles et leur état de déblocage pour un joueur sélectionné
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

  joueurs           = signal<Joueur[]>([]);                       // liste des joueurs pour le sélecteur
  tousSucces        = signal<SuccesInterface[]>([]);              // tous les succès existants
  succesDebloques   = signal<{ id_succes: number }[]>([]);        // succès débloqués par le joueur sélectionné
  joueurSelectionne = signal<string>('');                         // nom du joueur actif dans le select
  succesSelectionne = signal<SuccesAvecEtat | null>(null);        // succès ouvert dans le panneau de détail

  // Enrichit chaque succès avec son état (débloqué/non/null si aucun joueur)
  succesAvecEtat = computed<SuccesAvecEtat[]>(() => {
    const tous   = this.tousSucces();
    const joueur = this.joueurSelectionne();

    // Aucun joueur sélectionné → état indéterminé pour tous les succès
    if (!joueur) return tous.map(s => ({ ...s, debloque: null }));

    const ids = this.succesDebloques().map(js => js.id_succes);
    return tous.map(s => ({ ...s, debloque: ids.includes(s.id) }));
  });

  // Charge joueurs et succès au démarrage
  async ngOnInit() {
    this.joueurs.set(await this.joueurService.getAllJoueurs());
    this.tousSucces.set(await this.succesService.getAllSucces());
  }

  // Recharge les succès débloqués quand l'utilisateur change de joueur
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