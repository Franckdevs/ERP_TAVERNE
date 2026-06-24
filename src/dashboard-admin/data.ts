import {
  Wallet,
  Activity,
  User,
  Users,
  FilePlus2,
  FileText,
  ShoppingCart,
  Fcfa,
  LayoutDashboard,
  CreditCard,
  Calendar,
  Package,
  Settings,
  type LucideIcon,
} from "../icons";

/* --- Statistiques (8 cartes) -------------------------------------------- */
export type Tone = "up" | "down" | "neutral";

export type Stat = {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  badge: string;
  tone: Tone;
};

export const STATS: Stat[] = [
  { icon: Wallet, label: "Chiffre d'affaires · mois", value: "48 750 000", unit: "FCFA", badge: "+12,4 %", tone: "up" },
  { icon: Activity, label: "Projets en cours", value: "17", badge: "+3", tone: "up" },
  { icon: User, label: "Clients actifs", value: "284", badge: "+9", tone: "up" },
  { icon: Users, label: "Employés", value: "42", badge: "stable", tone: "neutral" },
  { icon: FilePlus2, label: "Factures en attente", value: "8 450 000", unit: "FCFA", badge: "23 factures", tone: "neutral" },
  { icon: FileText, label: "Devis envoyés", value: "31", badge: "+6", tone: "up" },
  { icon: ShoppingCart, label: "Commandes en cours", value: "19", badge: "+2", tone: "up" },
  { icon: Fcfa, label: "Dépenses · mois", value: "22 300 000", unit: "FCFA", badge: "+4,1 %", tone: "up" },
];

/* --- Navigation de la sidebar ------------------------------------------- */
export type NavItem = { icon: LucideIcon; label: string };
export type NavGroup = { title: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    title: "Principal",
    items: [{ icon: LayoutDashboard, label: "Tableau de bord" }],
  },
  {
    title: "Applications",
    items: [
      { icon: CreditCard, label: "Comptabilité" },
      { icon: Calendar, label: "Assistanat" },
      { icon: User, label: "Conseil client" },
      { icon: Package, label: "Gestion de stock" },
      { icon: Users, label: "Gestion du personnel" },
    ],
  },
  {
    title: "Système",
    items: [{ icon: Settings, label: "Paramètres" }],
  },
];

/* --- Mois (axe des graphiques) ------------------------------------------ */
export const MONTHS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

/* --- Évolution des ventes (millions FCFA) ------------------------------- */
export const SALES: Record<string, number[]> = {
  "2026": [28, 31, 29, 36, 40, 35, 44, 47, 43, 49, 52, 58],
  "2025": [22, 24, 26, 25, 29, 31, 33, 30, 36, 38, 41, 45],
};

/* --- Répartition des dépenses (donut) ----------------------------------- */
export type Expense = { label: string; pct: number; color: string };

export const EXPENSES: Expense[] = [
  { label: "Matériaux", pct: 42, color: "#5a3210" },
  { label: "Salaires", pct: 30, color: "#a85c1f" },
  { label: "Sous-traitance", pct: 14, color: "#d6a02f" },
  { label: "Logistique", pct: 8, color: "#c8a07a" },
  { label: "Autres", pct: 6, color: "#b8b0a6" },
];

export const EXPENSES_TOTAL = "22,3M";

/* --- Suivi des projets -------------------------------------------------- */
export type ProjectStatus = "En cours" | "Finition" | "Démarrage";
export type Project = {
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
};

export const PROJECTS: Project[] = [
  { name: "Villa Cocody — mobilier complet", client: "Famille Kouassi", status: "En cours", progress: 55 },
  { name: "Rénovation bureaux SIFCA", client: "SIFCA Industries", status: "En cours", progress: 40 },
  { name: "Cuisine sur mesure — Résidence Riviera", client: "M. Koné", status: "Finition", progress: 80 },
  { name: "Aménagement showroom Plateau", client: "Ivoire Décor", status: "Démarrage", progress: 20 },
];

/* --- Productivité des équipes ------------------------------------------- */
export type Team = { label: string; pct: number };

export const TEAMS: Team[] = [
  { label: "Atelier menuiserie", pct: 88 },
  { label: "Pose & chantier", pct: 74 },
  { label: "Décoration", pct: 81 },
  { label: "Commercial", pct: 92 },
  { label: "Administration", pct: 69 },
];
