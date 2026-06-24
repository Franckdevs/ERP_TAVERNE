import { lazy } from "react";
import { Package } from "@/icons";
import type { ModuleManifest } from "@/core/module/module.types";

/** Gestion de stock — inventaire, mouvements, alertes. */
export const inventoryModule: ModuleManifest = {
  id: "inventory",
  spaceId: "stock",
  label: "Gestion de stock",
  description: "Inventaire, mouvements et alertes",
  icon: Package,
  path: "/stock",
  permissions: ["inventory:read"],
  element: lazy(() => import("@/dashboard-stock/StockDashboard")),
};
