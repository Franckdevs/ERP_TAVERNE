import { lazy } from "react";
import { Briefcase } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Chargé commercial — ventes, objectifs, devis. */
export const commercialModule: ModuleManifest = {
  id: "commercial",
  spaceId: "commercial",
  label: "Chargé commercial",
  description: "Ventes, objectifs et devis",
  icon: Briefcase,
  path: "/commercial",
  permissions: ["commercial:read"],
  element: lazy(() => import("@/pages/CommercialDashboard")),
};
