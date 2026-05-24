import { Component, input, output, OnInit, signal, inject } from '@angular/core';
import { Partie, PartieQuestionAvecDetail } from '../../types/partie';
import { PartieService } from '../../services/partie';

@Component({
  selector: 'app-detail-partie',
  standalone: true,
  imports: [],
  templateUrl: './detail-partie.html',
  styleUrl: './detail-partie.scss'
})
export class DetailPartie implements OnInit {

  private partieService = inject(PartieService);

  partie = input.required<Partie>();
  fermer = output<void>();

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