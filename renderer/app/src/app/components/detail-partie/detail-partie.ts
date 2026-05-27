import { Component, input, output, OnInit, signal, inject } from '@angular/core';
import { Partie, PartieQuestionAvecDetail } from '../../types/partie';
import { PartieService } from '../../services/partie';

// Panneau de détail d'une partie — affiche les questions et réponses de la partie sélectionnée
@Component({
  selector: 'app-detail-partie',
  standalone: true,
  imports: [],
  templateUrl: './detail-partie.html',
  styleUrl: './detail-partie.scss'
})
export class DetailPartie implements OnInit {

  private partieService = inject(PartieService);

  // Partie à afficher, passée obligatoirement par le parent (Historique)
  partie = input.required<Partie>();

  // Événement émis vers le parent pour fermer le panneau
  fermer = output<void>();

  // Questions de la partie chargées et triées par ordre de passage
  questions = signal<PartieQuestionAvecDetail[]>([]);

  async ngOnInit() {
    const result = await this.partieService.getPartieQuestionByPartie(this.partie().id);
    const trie = (result as PartieQuestionAvecDetail[]).sort((a, b) => a.ordre - b.ordre);
    this.questions.set(trie);
  }

  onFermer() {
    this.fermer.emit();
  }
}