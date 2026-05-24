import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JoueurService } from '../../services/joueur';

@Component({
  selector: 'app-joueurs',
  imports: [FormsModule, RouterLink],
  templateUrl: './joueurs.html',
  styleUrl: './joueurs.scss',
})
export class Joueurs implements OnInit {

  private joueurService = inject(JoueurService);
  private router        = inject(Router);

  joueurs       = signal<{ nom: string }[]>([]);
  joueurSurvole = signal<string | null>(null);
  modeCreation  = signal<number | null>(null); // stocke l'index de la case cliquée

  // Map nom -> nombre de victoires
  victoires = signal<Record<string, number>>({});

  cartesAffichees = computed(() => {
    const liste = this.joueurs();
    const vides = 6 - liste.length;
    return [...liste, ...Array(vides).fill(null)];
  });

  nomInput = '';
  erreur   = '';

  async ngOnInit() {
    const liste = await this.joueurService.getAllJoueurs();
    this.joueurs.set(liste);

    // Charger le nombre de victoires pour chaque joueur
    const map: Record<string, number> = {};
    for (const j of liste) {
      map[j.nom] = await this.joueurService.countVictoires(j.nom);
    }
    this.victoires.set(map);
  }

  async creerJoueur() {
    const nom = this.nomInput.trim();

    const existe = this.joueurs().some(j => j.nom === nom);
    if (existe) {
      this.erreur = 'Ce joueur existe déjà';
      return;
    }

    await this.joueurService.createJoueur(nom);

    this.joueurs.update(liste => [...liste, { nom }]);

    // Initialiser à 0 victoire pour le nouveau joueur
    this.victoires.update(map => ({ ...map, [nom]: 0 }));

    this.nomInput = '';
    this.erreur   = '';
    this.modeCreation.set(null);
  }

  async supprimer(nom: string) {
    await this.joueurService.deleteJoueur(nom);
    this.joueurs.update(liste => liste.filter(j => j.nom !== nom));
    this.victoires.update(map => {
      const copie = { ...map };
      delete copie[nom];
      return copie;
    });
  }

  voirHistorique(nom: string) {
    this.router.navigate(['/historique', nom, 'tous']);
  }

  annuler() {
    this.nomInput = '';
    this.modeCreation.set(null);
  }
}