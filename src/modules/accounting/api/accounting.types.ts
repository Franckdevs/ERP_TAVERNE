/* Types du domaine Comptabilité (miroir des futurs DTO NestJS). */
export interface Periode {
  du: string; // AAAA-MM-JJ
  au: string;
}

export interface Transaction {
  id: string;
  date: string; // AAAA-MM-JJ
  reference: string;
  libelle: string;
  entree: number; // FCFA
  depense: number; // FCFA
  categorie: string;
}

export type NewTransaction = Omit<Transaction, "id">;
