/* ===========================================================================
   Détenteur du token d'accès, EN MÉMOIRE (jamais localStorage → anti-XSS).
   Module plat (pas de React) pour être lisible par le client HTTP sans cycle
   d'import avec le store d'auth.
   --------------------------------------------------------------------------- */
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};
