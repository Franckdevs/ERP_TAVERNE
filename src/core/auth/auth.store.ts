/* ===========================================================================
   État d'authentification (client state) — Zustand.
   NB : tant qu'il n'y a pas de backend, on démarre sur un utilisateur de DÉMO
   afin que l'application fonctionne exactement comme aujourd'hui.
   Le jour où NestJS existe : `login()` est appelé après POST /auth/login.
   --------------------------------------------------------------------------- */
import { create } from "zustand";
import type { AuthUser } from "./rbac";
import { setAccessToken } from "./token";

export type AuthStatus = "authenticated" | "anonymous" | "loading";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  login: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
}

/** Utilisateur de démo (rôle admin → accès à tout). */
const DEMO_USER: AuthUser = {
  id: "demo",
  name: "Admin Direction",
  email: "admin@taverne.ci",
  role: "admin",
  permissions: [],
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEMO_USER,
  status: "authenticated",
  login: (user, accessToken) => {
    setAccessToken(accessToken);
    set({ user, status: "authenticated" });
  },
  logout: () => {
    setAccessToken(null);
    set({ user: null, status: "anonymous" });
  },
}));
