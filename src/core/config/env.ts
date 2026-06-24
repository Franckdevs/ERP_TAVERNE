/* ===========================================================================
   Configuration applicative typée — point d'accès unique à import.meta.env.
   N'utilise JAMAIS import.meta.env directement ailleurs : passe par `env`.
   --------------------------------------------------------------------------- */
export interface AppEnv {
  /** URL de base de l'API NestJS (vide tant que le backend n'existe pas). */
  apiUrl: string;
  /** true → on sert les repositories mock ; false → on tape la vraie API. */
  useMocks: boolean;
  /** Mode Vite ("development" | "production"). */
  mode: string;
}

export const env: AppEnv = {
  apiUrl: import.meta.env.VITE_API_URL ?? "",
  // Par défaut on est en mock (aucun backend) ; passe VITE_USE_MOCKS=false
  // quand NestJS est en ligne.
  useMocks: (import.meta.env.VITE_USE_MOCKS ?? "true") !== "false",
  mode: import.meta.env.MODE,
};
