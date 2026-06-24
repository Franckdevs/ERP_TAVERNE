/* ===========================================================================
   Registre des modules — source de vérité de la navigation et du routage.
   Pour ajouter un pôle : créer modules/<x>/module.manifest.ts puis l'ajouter ici.
   --------------------------------------------------------------------------- */
import type { ModuleManifest } from "./module.types";
import type { AuthUser } from "@/core/auth/rbac";
import { hasPermission } from "@/core/auth/rbac";

import { adminModule } from "@/modules/admin/module.manifest";
import { accountingModule } from "@/modules/accounting/module.manifest";
import { assistantModule } from "@/modules/assistant/module.manifest";
import { crmModule } from "@/modules/crm/module.manifest";
import { commercialModule } from "@/modules/commercial/module.manifest";
import { inventoryModule } from "@/modules/inventory/module.manifest";
import { hrModule } from "@/modules/hr/module.manifest";

export const MODULES: ModuleManifest[] = [
  adminModule,
  accountingModule,
  assistantModule,
  crmModule,
  commercialModule,
  inventoryModule,
  hrModule,
];

export const moduleByPath = (path: string): ModuleManifest | undefined =>
  MODULES.find((m) => m.path === path);

export const moduleBySpaceId = (spaceId: string): ModuleManifest | undefined =>
  MODULES.find((m) => m.spaceId === spaceId);

/** Modules visibles par l'utilisateur (filtrage RBAC pour la navigation). */
export const modulesForUser = (user: AuthUser | null): ModuleManifest[] =>
  MODULES.filter(
    (m) =>
      m.permissions.length === 0 ||
      m.permissions.some((p) => hasPermission(user, p)),
  );
