import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JoueurService } from '../../services/joueur';
import { QuestionService } from '../../services/question';
import { PartieService } from '../../services/partie';
import { Joueur } from '../../types/joueur';
import { Categorie, Question } from '../../types/question';

// Page de configuration d'une nouvelle partie
@Component({
  selector: 'app-jouer',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './jouer.html',
  styleUrl: './jouer.scss'
})
export class Jouer implements OnInit {

  private fb              = inject(FormBuilder);
  private router          = inject(Router);
  private joueurService   = inject(JoueurService);
  private questionService = inject(QuestionService);
  private partieService   = inject(PartieService);

  joueurs      = signal<Joueur[]>([]);        // liste de tous les joueurs disponibles
  categories   = signal<Categorie[]>([]);     // catégories de questions disponibles
  selectionnes = signal<string[]>([]);        // joueurs sélectionnés pour la partie
  erreur       = signal<string>('');          // message d'erreur affiché à l'utilisateur

  // Formulaire réactif : catégorie + nombre de questions
  form = this.fb.group({
    nbQuestions: [3, [Validators.required, Validators.min(1)]],
    idCategorie: [null as number | null]
  });

  // Calcule les multiples valides de nb joueurs (ex: 2 joueurs → 2, 4, 6, ...)
  // Garantit que chaque joueur répond au même nombre de questions
  multiplesValides = computed(() => {
    const nb = this.selectionnes().length;
    if (nb === 0) return [];
    const multiples: number[] = [];
    for (let i = nb; i <= 50; i += nb) {
      multiples.push(i);
    }
    return multiples;
  });

  // Charge les joueurs et catégories au démarrage du composant
  async ngOnInit() {
    this.joueurs.set(await this.joueurService.getAllJoueurs());
    this.categories.set(await this.questionService.getAllCategories());
  }

  // Ajoute ou retire un joueur de la sélection, puis recalibre nbQuestions
  toggleJoueur(nom: string) {
    const liste = this.selectionnes();
    if (liste.includes(nom)) {
      this.selectionnes.set(liste.filter(j => j !== nom));
    } else {
      this.selectionnes.set([...liste, nom]);
    }
    // Remet nbQuestions au premier multiple valide après changement de sélection
    const multiples = this.multiplesValides();
    if (multiples.length > 0) {
      this.form.patchValue({ nbQuestions: multiples[0] });
    }
  }

  async demarrer() {
    this.erreur.set('');

    if (this.selectionnes().length < 1) {
      this.erreur.set('Sélectionne au moins 1 joueur.');
      return;
    }
    if (!this.form.valid) {
      this.erreur.set('Formulaire invalide.');
      return;
    }

    const { nbQuestions, idCategorie } = this.form.value;

    // 1. Créer la partie en base
    const partie = await this.partieService.createPartie(nbQuestions!, idCategorie ?? null);

    // 2. Inscrire chaque joueur sélectionné à la partie
    for (const nom of this.selectionnes()) {
      await this.partieService.createPartieJoueur(partie.id, nom);
    }

    // 3. Tirer les questions : par catégorie ou aléatoire si mode mixte
    let questions: Question[];
    if (idCategorie) {
      questions = await this.questionService.getManyQuestionByCategorie(idCategorie, nbQuestions!);
    } else {
      questions = await this.questionService.getManyQuestionRandom(nbQuestions!);
    }

    // 4. Créer les entrées PartieQuestion avec leur ordre de passage
    for (let i = 0; i < questions.length; i++) {
      await this.partieService.createPartieQuestion(partie.id, questions[i].id, i + 1);
    }

    // 5. Rediriger vers la vue de jeu de la partie créée
    this.router.navigate(['/partie', partie.id]);
  }
}