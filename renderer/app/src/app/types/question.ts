export interface Categorie {
  id: number;
  libelle: string;
  description: string;
}

export interface Question {
  id: number;
  interrogation: string;
  reponse: string;
  proposition1: string;
  proposition2: string;
  proposition3: string;
  id_categorie: number;
  categorie?: Categorie;
}