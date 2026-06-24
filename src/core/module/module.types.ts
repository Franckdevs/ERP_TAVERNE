/* ===========================================================================
   Contrat de MODULE (architecture plugin-based).
   Chaque pôle métier (comptabilité, CRM, stock…) exporte un ModuleManifest.
   Le routeur et la navigation se construisent À PARTIR de ces manifestes :
   ajouter un module = créer un dossier + l'enregistrer dans le registre.
   --------------------------------------------------------------------------- */
import type { ComponentType, LazyExoticComponent } from "react";
import type { LucideIcon } from "@/icons";
import type { Permission } from "@/core/auth/rbac";

/** Props standard d'un dashboard de module. */
export interface DashboardProps {
  onLogout?: () => void;
}

export interface ModuleManifest {
  /** Identifiant technique du module (ex. "accounting"). */
  id: string;
  /** Id de l'espace côté SpaceModal → la route est #/<spaceId>. */
  spaceId: string;
  /** Libellé affiché (sidebar, sélecteur d'espace). */
  label: string;
  description?: string;
  icon: LucideIcon;
  /** Chemin de route (ex. "/comptabilite"). */
  path: string;
  /** Permissions requises ([] = accessible à tout utilisateur connecté). */
  permissions: Permission[];
  /** Composant racine, chargé en lazy (code splitting par module). */
  element: LazyExoticComponent<ComponentType<DashboardProps>>;
}
