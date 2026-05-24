export interface Succes {
  id: number;
  libelle: string;
  description: string;
}

export interface SuccesAvecEtat extends Succes {
  debloque: boolean | null;
}
