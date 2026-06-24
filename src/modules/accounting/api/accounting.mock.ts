/* ===========================================================================
   Implémentation MOCK du repository Comptabilité (en mémoire, contexte ivoirien).
   Remplaçable par accounting.http.ts sans aucun changement côté UI/hooks.
   --------------------------------------------------------------------------- */
import type { AccountingRepository } from "./accounting.repository";
import type { Transaction } from "./accounting.types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let seed: Transaction[] = [
  { id: "t1", date: "2026-06-03", reference: "BRD-0601", libelle: "Appro caisse", entree: 1_500_000, depense: 0, categorie: "Rechargement" },
  { id: "t2", date: "2026-06-05", reference: "BRD-0602", libelle: "Paiement ouvriers", entree: 0, depense: 420_000, categorie: "Paiement Ouvriers" },
  { id: "t3", date: "2026-06-08", reference: "BRD-0603", libelle: "Achat bois", entree: 0, depense: 310_000, categorie: "Achat" },
  { id: "t4", date: "2026-06-12", reference: "BRD-0604", libelle: "Transport chantier", entree: 0, depense: 85_000, categorie: "Transport" },
  { id: "t5", date: "2026-06-18", reference: "BRD-0605", libelle: "Règlement client Kouassi", entree: 2_300_000, depense: 0, categorie: "Vente" },
];

export const accountingMock: AccountingRepository = {
  async listTransactions(periode) {
    await delay(150);
    if (!periode) return [...seed];
    return seed.filter((t) => t.date >= periode.du && t.date <= periode.au);
  },
  async createTransaction(dto) {
    await delay(120);
    const created: Transaction = { ...dto, id: crypto.randomUUID() };
    seed = [created, ...seed];
    return created;
  },
};
