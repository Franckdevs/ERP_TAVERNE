import { lazy } from "react";
import { Users } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Gestion du personnel — RH, présence, congés, paie. */
export const hrModule: ModuleManifest = {
  id: "hr",
  spaceId: "personnel",
  label: "Gestion du personnel",
  description: "Employés, présence, congés et paie",
  icon: Users,
  path: "/personnel",
  permissions: ["hr:read"],
  element: lazy(() => import("@/pages/PersonnelDashboard")),
};
