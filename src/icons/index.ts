/* ===========================================================================
   Icônes du projet — point d'entrée unique (package lucide-react).
   On importe les icônes depuis ce module partout dans le projet :
     import { Wallet, LayoutDashboard } from "@/icons";  (ou chemin relatif)
   --------------------------------------------------------------------------- */
export {
  // Marque / navigation
  House,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  // Applications (métiers)
  CreditCard,
  Calendar,
  User,
  Users,
  Package,
  Briefcase,
  // Gestion de stock
  Boxes,
  Coins,
  AlertTriangle,
  PackageX,
  PackagePlus,
  ArrowLeftRight,
  Truck,
  Warehouse,
  Filter,
  Plus,
  X,
  // Topbar
  Search,
  Bell,
  Moon,
  Sun,
  // Rappels (menu commun à tous les espaces)
  AlarmClock,
  CalendarClock,
  Clock,
  Check,
  Trash2,
  // Indicateurs / stats
  Wallet,
  Activity,
  FilePlus2,
  FileText,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";

// Icône monnaie maison (FCFA) — remplace le symbole dollar partout.
export { Fcfa } from "./Fcfa";

export type { LucideIcon } from "lucide-react";
