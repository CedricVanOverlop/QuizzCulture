import { Component, input, output, OnInit, signal } from '@angular/core';
import { Partie } from '../../types/partie';
import { PartieQuestionAvecDetail } from '../../types/partie';
import { PartieService } from '../../services/partie';

@Component({
  selector: 'app-detail-partie',
  standalone: true,
  imports: [],
  templateUrl: './detail-partie.html',
  styleUrl: './detail-partie.scss'
})
export class DetailPartie implements OnInit {

  partie = input.required<Partie>();
  fermer = output<void>();

  questions = signal<PartieQuestionAvecDetail[]>([]);

  constructor(private partieService: PartieService) {}

  async ngOnInit() {
    const result = await this.partieService.getPartieQuestionByPartie(this.partie().id);
    const trie = result.sort((a: PartieQuestionAvecDetail, b: PartieQuestionAvecDetail) => a.ordre - b.ordre);
    this.questions.set(trie);
  }

  onFermer() {
    this.fermer.emit();
  }
}