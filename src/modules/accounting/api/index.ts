/* ===========================================================================
   Factory du repository Comptabilité : le SEUL endroit où l'on choisit
   mock ↔ HTTP. Le jour où NestJS est en ligne → VITE_USE_MOCKS=false, et
   aucune page ne change.
   --------------------------------------------------------------------------- */
import { env } from "@/core/config/env";
import { accountingMock } from "./accounting.mock";
import { accountingHttp } from "./accounting.http";
import type { AccountingRepository } from "./accounting.repository";

export const accountingRepo: AccountingRepository = env.useMocks
  ? accountingMock
  : accountingHttp;

export type { AccountingRepository } from "./accounting.repository";
export type { Transaction, NewTransaction, Periode } from "./accounting.types";
