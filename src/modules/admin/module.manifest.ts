import { lazy } from "react";
import { LayoutDashboard } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Supervision centrale (direction). */
export const adminModule: ModuleManifest = {
  id: "admin",
  spaceId: "admin",
  label: "Administration centrale",
  description: "Vue d'ensemble et supervision de tous les pôles",
  icon: LayoutDashboard,
  path: "/admin",
  permissions: ["admin:read"],
  element: lazy(() => import("@/dashboard-admin/DashboardAdmin")),
};
