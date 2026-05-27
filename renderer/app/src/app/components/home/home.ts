import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Composant de la page d'accueil — sert uniquement de hub de navigation
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}