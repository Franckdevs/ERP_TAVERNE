import { lazy } from "react";
import { User } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Conseil client — CRM, prospects et pipeline. */
export const crmModule: ModuleManifest = {
  id: "crm",
  spaceId: "conseil",
  label: "Conseil client",
  description: "Prospects, pipeline et clients actifs",
  icon: User,
  path: "/conseil",
  permissions: ["crm:read"],
  element: lazy(() => import("@/pages/ConseilDashboard")),
};
