/* ===========================================================================
   RBAC — rôles, permissions, utilisateur authentifié.
   Le front s'en sert pour l'ERGONOMIE (masquer ce qui n'est pas autorisé).
   La sécurité réelle reste l'affaire du backend NestJS.
   --------------------------------------------------------------------------- */
export type Permission = string; // ex. "accounting:read", "hr:write"

export type Role =
  | "admin"
  | "comptable"
  | "assistant"
  | "conseiller"
  | "commercial"
  | "magasinier"
  | "rh";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

/** L'admin a tout ; sinon on vérifie la liste de permissions. */
export const hasPermission = (user: AuthUser | null, perm: Permission): boolean =>
  !!user && (user.role === "admin" || user.permissions.includes(perm));
