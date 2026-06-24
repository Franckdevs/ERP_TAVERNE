/* ===========================================================================
   Types transverses de la couche données.
   --------------------------------------------------------------------------- */

/** Erreur API normalisée. */
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

/** Résultat explicite (alternative au throw) — utile côté services. */
export type Result<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/** Réponse paginée standard (alignée sur la convention NestJS à venir). */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
