/* ===========================================================================
   Contrat (interface) du repository Comptabilité.
   L'UI et les hooks dépendent de CETTE abstraction, jamais d'une implémentation
   concrète → on swappe mock ↔ HTTP sans toucher au reste.
   --------------------------------------------------------------------------- */
import type { NewTransaction, Periode, Transaction } from "./accounting.types";

export interface AccountingRepository {
  listTransactions(periode?: Periode): Promise<Transaction[]>;
  createTransaction(dto: NewTransaction): Promise<Transaction>;
}
