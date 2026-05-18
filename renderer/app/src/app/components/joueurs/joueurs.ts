import { Component, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JoueurService } from '../../services/joueur';

@Component({
  selector: 'app-joueurs',
  imports: [FormsModule,RouterLink],
  templateUrl: './joueurs.html',
  styleUrl: './joueurs.scss',
})
export class Joueurs implements OnInit {

  // Les 3 signals
  joueurs = signal<{nom: string}[]>([]);
  joueurSurvole = signal<string | null>(null);
  modeCreation = signal<number | null>(null); // stocke l'index de la case cliquée

  cartesAffichees = computed(() => {
    const liste = this.joueurs();
    const vides = 6 - liste.length;
    return [...liste, ...Array(vides).fill(null)];
  });

  nomInput = '';
  erreur = '';

  constructor(
    private joueurService: JoueurService,
    private router: Router
  ) {}

  // Chargement au démarrage du composant
  async ngOnInit() {
    this.joueurs.set(await this.joueurService.getAllJoueurs());
  }

  async creerJoueur() {
    const nom = this.nomInput.trim();

    // Vérification doublon — on cherche dans le signal
    const existe = this.joueurs().some(j => j.nom === nom);
    if (existe) {
      this.erreur = 'Ce joueur existe déjà';
      return; 
    }

    await this.joueurService.createJoueur(nom);

    // On met à jour le signal localement sans refaire un appel
    this.joueurs.update(liste => [...liste, { nom }]);

    // Reset
    this.nomInput = '';
    this.erreur = '';
    this.modeCreation.set(null);
  }

  async supprimer(nom: string) {
    await this.joueurService.deleteJoueur(nom);

    // On retire le joueur de la liste
    this.joueurs.update(liste => liste.filter(j => j.nom !== nom));
  }

  voirHistorique(nom: string) {
    this.router.navigate(['/historique', nom, 'tous']);
  }

  annuler() {
    this.nomInput = '';
    this.modeCreation.set(null);
  }
}
