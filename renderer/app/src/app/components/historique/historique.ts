import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartieService } from '../../services/partie';
import { JoueurService } from '../../services/joueur';
import { QuestionService } from '../../services/question';
import { Partie } from '../../types/partie';
import { Joueur } from '../../types/joueur';
import { Categorie } from '../../types/question';
import { DetailPartie } from '../detail-partie/detail-partie';

// Affiche l'historique des parties avec filtres joueur et catégorie
@Component({
  selector: 'app-historique',
  imports: [FormsModule, RouterLink, DetailPartie],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique implements OnInit {

  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private partieService   = inject(PartieService);
  private joueurService   = inject(JoueurService);
  private questionService = inject(QuestionService);

  parties    = signal<Partie[]>([]);    // toutes les parties chargées depuis la base
  joueurs    = signal<Joueur[]>([]);    // liste des joueurs pour le select de filtre
  categories = signal<Categorie[]>([]); // liste des catégories pour le select de filtre

  filtreJoueur    = signal<string>('tous'); // filtre actif sur le joueur
  filtreCategorie = signal<string>('tous'); // filtre actif sur la catégorie

  partieSelectionnee = signal<Partie | null>(null); // partie ouverte dans le panneau de détail

  // Filtre les parties selon les deux critères actifs, puis les inverse (plus récentes en tête)
  partiesFiltrees = computed(() => {
    let liste = this.parties();

    const joueur = this.filtreJoueur();
    if (joueur !== 'tous') {
      liste = liste.filter(p => p.joueurs?.some(j => j.nom_joueur === joueur));
    }

    const cat = this.filtreCategorie();
    if (cat === '0') {
      // '0' représente le mode mixte (pas de catégorie)
      liste = liste.filter(p => p.id_categorie === null);
    } else if (cat !== 'tous') {
      liste = liste.filter(p => p.id_categorie === Number(cat));
    }

    return liste.reverse();
  });

  // Lit les filtres initiaux depuis les paramètres d'URL (:joueur/:categorie) puis charge les données
  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.filtreJoueur.set(params.get('joueur') ?? 'tous');
      this.filtreCategorie.set(params.get('categorie') ?? 'tous');
    });

    this.parties.set(await this.partieService.getAllParties());
    this.joueurs.set(await this.joueurService.getAllJoueurs());
    this.categories.set(await this.questionService.getAllCategories());
  }

  // Met à jour les filtres et l'URL simultanément pour garder la route cohérente
  changerFiltre(joueur: string, categorie: string) {
    this.router.navigate(['/historique', joueur, categorie]);
    this.filtreJoueur.set(joueur);
    this.filtreCategorie.set(categorie);
  }

  ouvrirDetail(partie: Partie) {
    this.partieSelectionnee.set(partie);
  }

  fermerDetail() {
    this.partieSelectionnee.set(null);
  }
}