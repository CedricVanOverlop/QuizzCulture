import { Joueur } from './joueur';
import { Question } from './question';
import { Categorie } from './question';

export interface PartieJoueur {
  nom_joueur: string;
  id_partie: number;
  points: number;
  joueur?: Joueur;
}

export interface PartieQuestion {
  id_partie: number;
  id_question: number;
  id_joueur: string | null;
  ordre: number;
  question?: Question;
  joueur?: Joueur;
}

export interface Partie {
  id: number;
  nb_questions: number;
  nom_vainqueur: string | null;
  id_categorie: number | null;
  categorie?: Categorie;
  joueurs?: PartieJoueur[];
  partieQuestions?: PartieQuestion[];
}

export interface PartieQuestionAvecDetail extends PartieQuestion {
  question: Question;
}