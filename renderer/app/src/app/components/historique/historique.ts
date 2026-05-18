import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartieService } from '../../services/partie';
import { JoueurService } from '../../services/joueur';
import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-historique',
  imports: [FormsModule, RouterLink],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private partieService = inject(PartieService);
  private joueurService = inject(JoueurService);
  private questionService = inject(QuestionService);

  // Données brutes
  parties = signal<any[]>([]);
  joueurs = signal<{nom: string}[]>([]);
  categories = signal<{id: number, libelle: string}[]>([]);

  // Filtres lus depuis l'URL
  filtreJoueur = signal<string>('tous');
  filtreCategorie = signal<string>('tous');

  // Partie sélectionnée pour le panneau détail
  partieSelectionnee = signal<any | null>(null);

  // Liste filtrée
  partiesFiltrees = computed(() => {
    let liste = this.parties();

    const joueur = this.filtreJoueur();
    if (joueur !== 'tous') {
      liste = liste.filter(p =>
        p.joueurs.some((j: any) => j.nom_joueur === joueur)
      );
    }

    const cat = this.filtreCategorie();
    if (cat === '0') {
      // Mixte = pas de catégorie
      liste = liste.filter(p => p.id_categorie === null);
    } else if (cat !== 'tous') {
      liste = liste.filter(p => p.id_categorie === Number(cat));
    }

    return liste;
  });

  async ngOnInit() {
    // Lire les paramètres de l'URL
    const joueur = this.route.snapshot.paramMap.get('joueur') ?? 'tous';
    const categorie = this.route.snapshot.paramMap.get('categorie') ?? 'tous';
    this.filtreJoueur.set(joueur);
    this.filtreCategorie.set(categorie);

    // Charger les données
    this.parties.set(await this.partieService.getAllParties());
    this.joueurs.set(await this.joueurService.getAllJoueurs());
    this.categories.set(await this.questionService.getAllCategories());
  }

  changerFiltre(joueur: string, categorie: string) {
    this.router.navigate(['/historique', joueur, categorie]);
    this.filtreJoueur.set(joueur);
    this.filtreCategorie.set(categorie);
  }

  ouvrirDetail(partie: any) {
    this.partieSelectionnee.set(partie);
  }

  fermerDetail() {
    this.partieSelectionnee.set(null);
  }
}