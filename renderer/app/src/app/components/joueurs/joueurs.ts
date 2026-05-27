import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JoueurService } from '../../services/joueur';

// Gestion des joueurs : création, suppression, navigation vers l'historique
@Component({
  selector: 'app-joueurs',
  imports: [FormsModule, RouterLink],
  templateUrl: './joueurs.html',
  styleUrl: './joueurs.scss',
})
export class Joueurs implements OnInit {

  private joueurService = inject(JoueurService);
  private router        = inject(Router);

  joueurs       = signal<{ nom: string }[]>([]);      // liste des joueurs existants
  joueurSurvole = signal<string | null>(null);         // joueur survolé dans la grille
  modeCreation  = signal<number | null>(null);         // index de la case en cours de création

  // Map nom → nombre de victoires, chargée après la liste des joueurs
  victoires = signal<Record<string, number>>({});

  // Complète toujours la grille à 6 cartes (joueurs existants + cases vides)
  cartesAffichees = computed(() => {
    const liste = this.joueurs();
    const vides = 6 - liste.length;
    return [...liste, ...Array(vides).fill(null)];
  });

  nomInput = '';
  erreur   = '';

  // Charge les joueurs et leur nombre de victoires au démarrage
  async ngOnInit() {
    const liste = await this.joueurService.getAllJoueurs();
    this.joueurs.set(liste);

    const map: Record<string, number> = {};
    for (const j of liste) {
      map[j.nom] = await this.joueurService.countVictoires(j.nom);
    }
    this.victoires.set(map);
  }

  // Crée un nouveau joueur après vérification des doublons
  async creerJoueur() {
    const nom = this.nomInput.trim();

    const existe = this.joueurs().some(j => j.nom === nom);
    if (existe) {
      this.erreur = 'Ce joueur existe déjà';
      return;
    }

    await this.joueurService.createJoueur(nom);

    // Met à jour le signal local sans recharger depuis la base
    this.joueurs.update(liste => [...liste, { nom }]);
    this.victoires.update(map => ({ ...map, [nom]: 0 }));

    this.nomInput = '';
    this.erreur   = '';
    this.modeCreation.set(null);
  }

  // Supprime un joueur de la base et des deux signals locaux
  async supprimer(nom: string) {
    await this.joueurService.deleteJoueur(nom);
    this.joueurs.update(liste => liste.filter(j => j.nom !== nom));
    this.victoires.update(map => {
      const copie = { ...map };
      delete copie[nom];
      return copie;
    });
  }

  // Redirige vers l'historique filtré sur ce joueur
  voirHistorique(nom: string) {
    this.router.navigate(['/historique', nom, 'tous']);
  }

  // Annule la saisie en cours et ferme le formulaire de création
  annuler() {
    this.nomInput = '';
    this.modeCreation.set(null);
  }
}