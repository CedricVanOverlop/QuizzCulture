import { Routes } from '@angular/router';
import {Historique} from './components/historique/historique';
import {Home} from './components/home/home';
import {Jouer} from './components/jouer/jouer';
import {Joueurs} from './components/joueurs/joueurs';
import {Succes} from './components/succes/succes';
import {Partie} from './components/jouer/partie/partie'

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component : Home},
    {path: 'historique', redirectTo: 'historique/tous/tous', pathMatch: 'full'},
    {path: 'historique/:joueur/:categorie', component: Historique},
    {path: 'jouer', component : Jouer},
    {path: 'joueurs', component : Joueurs},
    {path: 'succes', component : Succes},
    {path: 'partie/:id', component : Partie},
];
