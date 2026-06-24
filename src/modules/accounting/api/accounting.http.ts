/* ===========================================================================
   Implémentation HTTP (réelle) du repository Comptabilité — API NestJS.
   Activée automatiquement quand VITE_USE_MOCKS=false (voir api/index.ts).
   --------------------------------------------------------------------------- */
import { httpClient } from "@/core/api/http-client";
import type { AccountingRepository } from "./accounting.repository";
import type { Transaction } from "./accounting.types";

export const accountingHttp: AccountingRepository = {
  listTransactions: (periode) =>
    httpClient.get<Transaction[]>("/accounting/transactions", {
      params: periode ? { du: periode.du, au: periode.au } : undefined,
    }),
  createTransaction: (dto) =>
    httpClient.post<Transaction>("/accounting/transactions", dto),
};
