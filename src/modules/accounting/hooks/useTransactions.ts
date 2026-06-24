/* ===========================================================================
   Hooks Comptabilité — l'UI ne voit QUE ça (jamais le repository directement).
   TanStack Query gère cache, loading, erreurs et invalidation.
   --------------------------------------------------------------------------- */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountingRepo, type NewTransaction, type Periode } from "../api";

const ROOT_KEY = ["accounting", "transactions"] as const;
const listKey = (periode?: Periode) => [...ROOT_KEY, periode ?? "all"] as const;

/** Liste des transactions (optionnellement filtrées par période). */
export function useTransactions(periode?: Periode) {
  return useQuery({
    queryKey: listKey(periode),
    queryFn: () => accountingRepo.listTransactions(periode),
  });
}

/** Création d'une transaction + invalidation du cache liste. */
export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: NewTransaction) => accountingRepo.createTransaction(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ROOT_KEY }),
  });
}
