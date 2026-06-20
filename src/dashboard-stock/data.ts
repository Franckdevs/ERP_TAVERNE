/* ===========================================================================
   Espace Stock — « Stock & Inventaire » La Taverne
   Données FICTIVES (aucune base / API). Tout est local et mocké.
   Devise : FCFA · Langue : français · Dates : DD/MM/YYYY
   --------------------------------------------------------------------------- */
import {
  Boxes,
  Coins,
  AlertTriangle,
  PackageX,
  ArrowLeftRight,
  Truck,
  type LucideIcon,
} from "../icons";

/* --------------------------------------------------------------------------
   Formatage
   -------------------------------------------------------------------------- */
const NF = new Intl.NumberFormat("fr-FR");
export const formatNombre = (n: number) => NF.format(Math.round(n));
export const formatFCFA = (n: number) => `${NF.format(Math.round(n))} FCFA`;
/** Abrège un montant FCFA : 63 400 000 → « 63,4 M » */
export const formatCompact = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(".", ",")} k`;
  return NF.format(Math.round(n));
};

/* --------------------------------------------------------------------------
   Utilisateur connecté (magasinier)
   -------------------------------------------------------------------------- */
export const USER = {
  nom: "Modou Kane",
  poste: "Magasinier",
  initiales: "MK",
};

/* --------------------------------------------------------------------------
   Catégories d'articles
   -------------------------------------------------------------------------- */
export type CategorieSlug =
  | "matiere-premiere"
  | "produit-fini"
  | "consommable"
  | "quincaillerie";

export type Categorie = {
  slug: CategorieSlug;
  label: string;
  couleur: string;
  /** préfixe de référence (MP-0042…) */
  prefixe: string;
};

export const CATEGORIES: Categorie[] = [
  { slug: "matiere-premiere", label: "Matière première", couleur: "#a85c1f", prefixe: "MP" },
  { slug: "produit-fini", label: "Produit fini", couleur: "#2f8f4e", prefixe: "PF" },
  { slug: "consommable", label: "Consommable", couleur: "#8b5cf6", prefixe: "CS" },
  { slug: "quincaillerie", label: "Quincaillerie", couleur: "#3b82f6", prefixe: "QC" },
];

export const categorieBySlug = (slug: CategorieSlug) =>
  CATEGORIES.find((c) => c.slug === slug);

export const labelCategorie = (slug: CategorieSlug) =>
  categorieBySlug(slug)?.label ?? slug;

/* --------------------------------------------------------------------------
   Articles (inventaire) — échantillon représentatif du catalogue
   -------------------------------------------------------------------------- */
export type Article = {
  id: number;
  reference: string;
  produit: string;
  categorie: CategorieSlug;
  quantite: number;
  seuil: number;
  prixUnitaire: number; // FCFA / unité
};

export const ARTICLES: Article[] = [
  { id: 1, reference: "MP-0042", produit: "Panneau MDF 18mm", categorie: "matiere-premiere", quantite: 128, seuil: 40, prixUnitaire: 18_000 },
  { id: 2, reference: "MP-0118", produit: "Bois chêne massif", categorie: "matiere-premiere", quantite: 14, seuil: 20, prixUnitaire: 45_000 },
  { id: 3, reference: "PF-0301", produit: "Table à manger 6 pl.", categorie: "produit-fini", quantite: 7, seuil: 5, prixUnitaire: 320_000 },
  { id: 4, reference: "MP-0205", produit: "Vernis polyuréthane", categorie: "consommable", quantite: 0, seuil: 15, prixUnitaire: 12_500 },
  { id: 5, reference: "QC-0067", produit: "Charnières inox", categorie: "quincaillerie", quantite: 32, seuil: 50, prixUnitaire: 1_500 },
  { id: 6, reference: "PF-0412", produit: "Armoire 3 portes", categorie: "produit-fini", quantite: 11, seuil: 4, prixUnitaire: 280_000 },
  { id: 7, reference: "MP-0073", produit: "Contreplaqué 15mm", categorie: "matiere-premiere", quantite: 64, seuil: 30, prixUnitaire: 14_500 },
  { id: 8, reference: "CS-0014", produit: "Colle à bois 5L", categorie: "consommable", quantite: 9, seuil: 12, prixUnitaire: 8_000 },
  { id: 9, reference: "QC-0102", produit: "Vis aggloméré 4×40 (boîte)", categorie: "quincaillerie", quantite: 210, seuil: 60, prixUnitaire: 3_200 },
  { id: 10, reference: "QC-0145", produit: "Coulisses tiroir 45cm", categorie: "quincaillerie", quantite: 18, seuil: 25, prixUnitaire: 4_800 },
  { id: 11, reference: "PF-0388", produit: "Chaise capitonnée", categorie: "produit-fini", quantite: 26, seuil: 10, prixUnitaire: 65_000 },
  { id: 12, reference: "MP-0156", produit: "Tissu d'ameublement (m)", categorie: "matiere-premiere", quantite: 0, seuil: 30, prixUnitaire: 6_500 },
  { id: 13, reference: "CS-0031", produit: "Papier abrasif grain 120", categorie: "consommable", quantite: 140, seuil: 50, prixUnitaire: 700 },
  { id: 14, reference: "QC-0210", produit: "Poignées laiton brossé", categorie: "quincaillerie", quantite: 47, seuil: 40, prixUnitaire: 2_900 },
  { id: 15, reference: "PF-0455", produit: "Bibliothèque modulaire", categorie: "produit-fini", quantite: 3, seuil: 6, prixUnitaire: 195_000 },
  { id: 16, reference: "CS-0048", produit: "Mèches forets (jeu)", categorie: "consommable", quantite: 22, seuil: 10, prixUnitaire: 11_000 },
];

/* --------------------------------------------------------------------------
   Logique métier : état d'un article (OK / Faible / Rupture)
   -------------------------------------------------------------------------- */
export type Etat = "ok" | "faible" | "rupture";

export const ETAT_LABEL: Record<Etat, string> = {
  ok: "OK",
  faible: "Faible",
  rupture: "Rupture",
};

export const etatArticle = (a: Article): Etat =>
  a.quantite === 0 ? "rupture" : a.quantite <= a.seuil ? "faible" : "ok";

export const valeurArticle = (a: Article) => a.quantite * a.prixUnitaire;

/* --------------------------------------------------------------------------
   Statistiques d'en-tête (chiffres « catalogue complet », cf. maquette)
   -------------------------------------------------------------------------- */
export type StatTone = "default" | "brand" | "warn" | "danger";

export type StatCard = {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  tone: StatTone;
};

export const STATS: StatCard[] = [
  { icon: Boxes, label: "Références", value: "486", tone: "default" },
  { icon: Coins, label: "Valeur du stock", value: "63,4 M", unit: "FCFA", tone: "brand" },
  { icon: AlertTriangle, label: "Stock faible", value: "12", tone: "warn" },
  { icon: PackageX, label: "Ruptures", value: "4", tone: "danger" },
];

/* --------------------------------------------------------------------------
   Mouvements de stock (entrées / sorties récentes)
   -------------------------------------------------------------------------- */
export type Mouvement = {
  id: number;
  date: string; // DD/MM/YYYY
  type: "entree" | "sortie";
  reference: string;
  produit: string;
  quantite: number;
  acteur: string; // motif / projet / fournisseur
};

export const MOUVEMENTS: Mouvement[] = [
  { id: 1, date: "19/06/2026", type: "entree", reference: "MP-0042", produit: "Panneau MDF 18mm", quantite: 40, acteur: "Réception — Ivoire Bois" },
  { id: 2, date: "19/06/2026", type: "sortie", reference: "PF-0301", produit: "Table à manger 6 pl.", quantite: 2, acteur: "Projet — Villa Cocody" },
  { id: 3, date: "18/06/2026", type: "sortie", reference: "QC-0067", produit: "Charnières inox", quantite: 18, acteur: "Atelier menuiserie" },
  { id: 4, date: "18/06/2026", type: "entree", reference: "CS-0031", produit: "Papier abrasif grain 120", quantite: 100, acteur: "Réception — China Mall" },
  { id: 5, date: "17/06/2026", type: "sortie", reference: "MP-0205", produit: "Vernis polyuréthane", quantite: 15, acteur: "Atelier finition" },
  { id: 6, date: "17/06/2026", type: "entree", reference: "PF-0388", produit: "Chaise capitonnée", quantite: 12, acteur: "Production interne" },
  { id: 7, date: "16/06/2026", type: "sortie", reference: "QC-0102", produit: "Vis aggloméré 4×40", quantite: 40, acteur: "Pose & chantier" },
  { id: 8, date: "16/06/2026", type: "entree", reference: "MP-0118", produit: "Bois chêne massif", quantite: 8, acteur: "Réception — Afrimarbre Bois" },
];

/* --------------------------------------------------------------------------
   Fournisseurs
   -------------------------------------------------------------------------- */
export type Fournisseur = {
  id: number;
  nom: string;
  categorie: string;
  contact: string;
  ville: string;
  articles: number;
};

export const FOURNISSEURS: Fournisseur[] = [
  { id: 1, nom: "Ivoire Bois", categorie: "Panneaux & bois massif", contact: "+225 07 00 11 22", ville: "Abidjan — Yopougon", articles: 38 },
  { id: 2, nom: "China Mall Angré", categorie: "Consommables & abrasifs", contact: "+225 05 44 55 66", ville: "Abidjan — Cocody", articles: 64 },
  { id: 3, nom: "Quincaillerie du Plateau", categorie: "Quincaillerie & ferronnerie", contact: "+225 01 22 33 44", ville: "Abidjan — Plateau", articles: 121 },
  { id: 4, nom: "Afrimarbre Bois", categorie: "Bois exotique & chêne", contact: "+225 07 88 99 00", ville: "Grand-Bassam", articles: 19 },
];

/* --------------------------------------------------------------------------
   Navigation de la sidebar
   -------------------------------------------------------------------------- */
export type ViewId = "stock" | "mouvements" | "alertes" | "fournisseurs";

export type NavItem = { id: ViewId; icon: LucideIcon; label: string };

export const NAV: NavItem[] = [
  { id: "stock", icon: Boxes, label: "Stock" },
  { id: "mouvements", icon: ArrowLeftRight, label: "Mouvements" },
  { id: "alertes", icon: AlertTriangle, label: "Alertes" },
  { id: "fournisseurs", icon: Truck, label: "Fournisseurs" },
];

export const VIEW_META: Record<ViewId, { title: string; sub: string }> = {
  stock: { title: "Stock & Inventaire", sub: "Produits, matières premières et alertes" },
  mouvements: { title: "Mouvements de stock", sub: "Entrées et sorties récentes" },
  alertes: { title: "Alertes de stock", sub: "Articles à réapprovisionner" },
  fournisseurs: { title: "Fournisseurs", sub: "Partenaires et approvisionnements" },
};