import { Component, input, output } from '@angular/core';
import { SuccesAvecEtat } from '../../types/succes';

@Component({
  selector: 'app-detail-succes',
  standalone: true,
  imports: [],
  templateUrl: './detail-succes.html',
  styleUrl: './detail-succes.scss'
})
export class DetailSucces {

  succes = input.required<SuccesAvecEtat>();
  fermer = output<void>();

  onFermer() {
    this.fermer.emit();
  }
}