import { Component, input, output } from '@angular/core';
import { SuccesAvecEtat } from '../../types/succes';

// Panneau de détail d'un succès — composant enfant pur (input/output uniquement)
@Component({
  selector: 'app-detail-succes',
  standalone: true,
  imports: [],
  templateUrl: './detail-succes.html',
  styleUrl: './detail-succes.scss'
})
export class DetailSucces {

  // Succès à afficher, passé obligatoirement par le parent (Succes)
  succes = input.required<SuccesAvecEtat>();

  // Événement émis vers le parent pour fermer le panneau
  fermer = output<void>();

  onFermer() {
    this.fermer.emit();
  }
}