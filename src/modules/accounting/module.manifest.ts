import { lazy } from "react";
import { CreditCard } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Comptabilité — brouillard de caisse. */
export const accountingModule: ModuleManifest = {
  id: "accounting",
  spaceId: "comptabilite",
  label: "Comptabilité",
  description: "Brouillard de caisse, projets, rapports",
  icon: CreditCard,
  path: "/comptabilite",
  permissions: ["accounting:read"],
  element: lazy(() => import("@/dashboard-comptabilite/ComptabiliteDashboard")),
};
