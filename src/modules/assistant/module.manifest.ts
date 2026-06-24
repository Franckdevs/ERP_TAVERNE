import { lazy } from "react";
import { Calendar } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Assistanat — agenda, communication, documents. */
export const assistantModule: ModuleManifest = {
  id: "assistant",
  spaceId: "assistanat",
  label: "Assistanat",
  description: "Agenda, communication et documents",
  icon: Calendar,
  path: "/assistanat",
  permissions: ["assistant:read"],
  element: lazy(() => import("@/pages/AssistantDashboard")),
};
