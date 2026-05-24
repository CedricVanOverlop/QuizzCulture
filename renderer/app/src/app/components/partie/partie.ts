import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartieService } from '../../services/partie';
import { QuestionService } from '../../services/question';
import { PartieQuestionAvecDetail } from '../../types/partie';

type Mode = 'cash' | 'carre' | 'duo';

@Component({
  selector: 'app-partie',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './partie.html',
  styleUrl: './partie.scss'
})
export class Partie implements OnInit {

  private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private partieService   = inject(PartieService);
  private questionService = inject(QuestionService);

  partieId       = signal<number>(0);
  joueurs        = signal<string[]>([]);
  questions      = signal<PartieQuestionAvecDetail[]>([]);

  indexQuestion  = signal<number>(0);
  indexJoueur    = signal<number>(0);
  modeChoisi     = signal<Mode | null>(null);
  feedback       = signal<'correct' | 'incorrect' | null>(null);
  partieTerminee = signal<boolean>(false);
  classement     = signal<{ nom_joueur: string, points: number }[]>([]);

  cashInput = '';

  // Question courante
  questionCourante = computed(() => this.questions()[this.indexQuestion()] ?? null);

  // Joueur actif
  joueurActif = computed(() => this.joueurs()[this.indexJoueur()] ?? '');

  // Propositions selon le mode — la bonne réponse est mélangée parmi les mauvaises
  propositions = computed(() => {
    const q = this.questionCourante();
    const mode = this.modeChoisi();
    if (!q || !mode) return [];

    const mauvaises = [
      q.question.proposition1,
      q.question.proposition2,
      q.question.proposition3
    ];
    const melange = [...mauvaises].sort(() => Math.random() - 0.5);

    if (mode === 'carre') {
      // 4 propositions : les 3 mauvaises + la bonne, mélangées
      return [...mauvaises, q.question.reponse].sort(() => Math.random() - 0.5);
    }
    if (mode === 'duo') {
      // 2 propositions : 1 mauvaise + la bonne, mélangées
      return [melange[0], q.question.reponse].sort(() => Math.random() - 0.5);
    }
    return [];
  });

  points: Record<Mode, number> = { cash: 3, carre: 2, duo: 1 };

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.partieId.set(id);

    const partie = await this.partieService.getPartieById(id);
    this.joueurs.set(partie.joueurs.map((j: any) => j.nom_joueur));

    const questions = await this.partieService.getPartieQuestionByPartie(id);
    const triees = questions.sort((a: any, b: any) => a.ordre - b.ordre);
    this.questions.set(triees);
  }

  choisirMode(mode: Mode) {
    this.modeChoisi.set(mode);
    this.feedback.set(null);
    this.cashInput = '';
  }

  // Répondre en mode Carré ou Duo (bouton cliqué)
  async repondre(proposition: string) {
      const q = this.questionCourante();
      if (!q || this.feedback() !== null) return;

      const resultat = await this.questionService.checkReponse(q.id_question);
      const correct = proposition === resultat.reponse;
      const pts = correct ? this.points[this.modeChoisi()!] : 0;

      await this.partieService.updateRepondant(
          this.partieId(), q.id_question, this.joueurActif(), correct, pts
      );

      if (correct) {
          await this.partieService.updatePointsJoueur(this.partieId(), this.joueurActif(), pts);
          this.feedback.set('correct');
      } else {
          this.feedback.set('incorrect');
      }

      setTimeout(() => this.questionSuivante(), 1500);
  }

  // Répondre en mode Cash (input texte)
  async repondreCash(reponse: string) {
    const q = this.questionCourante();
    if (!q || this.feedback() !== null) return;

    const resultat = await this.questionService.checkReponse(q.id_question);
    const correct = reponse.trim().toLowerCase() === resultat.reponse.trim().toLowerCase();
    const pts = correct ? 3 : 0;

    await this.partieService.updateRepondant(
        this.partieId(), q.id_question, this.joueurActif(), correct, pts
    );

    if (correct) {
        await this.partieService.updatePointsJoueur(this.partieId(), this.joueurActif(), pts);
        this.feedback.set('correct');
    } else {
        this.feedback.set('incorrect');
    }

    setTimeout(() => this.questionSuivante(), 1500);
  }

  async questionSuivante() {
    this.feedback.set(null);
    this.modeChoisi.set(null);
    this.cashInput = '';

    const nextIndex = this.indexQuestion() + 1;

    if (nextIndex >= this.questions().length) {
      await this.terminerPartie();
      return;
    }

    this.indexQuestion.set(nextIndex);
    this.indexJoueur.set((this.indexJoueur() + 1) % this.joueurs().length);
  }

  async terminerPartie() {
      const classement = await this.partieService.getClassementByPartie(this.partieId());
      this.classement.set(classement);

      if (classement.length > 0) {
          const premier = classement[0];
          const deuxieme = classement[1];
          const egalite = deuxieme && premier.points === deuxieme.points;

          if (!egalite) {
              await this.partieService.updateVainqueur(this.partieId(), premier.nom_joueur);
          }
      }

      await this.partieService.checkAndUnlockSucces(this.partieId());
      this.partieTerminee.set(true);
  }
}