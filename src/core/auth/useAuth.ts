/* ===========================================================================
   Hooks d'auth — sélecteurs fins (évitent les re-renders globaux).
   --------------------------------------------------------------------------- */
import { useAuthStore } from "./auth.store";
import { hasPermission, type Permission } from "./rbac";

export const useAuthUser = () => useAuthStore((s) => s.user);
export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useLogin = () => useAuthStore((s) => s.login);
export const useLogout = () => useAuthStore((s) => s.logout);

/** Vrai si l'utilisateur courant possède la permission. */
export const useCan = (perm: Permission) =>
  useAuthStore((s) => hasPermission(s.user, perm));
