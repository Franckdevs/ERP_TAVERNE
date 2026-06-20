/* ===========================================================================
   Espace Comptabilité — « Brouillard de caisse » La Taverne
   Données FICTIVES (aucune base / API). Tout est local et mocké.
   Devise : FCFA · Langue : français · Dates : DD/MM/YYYY
   --------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
export type Transaction = {
  id: number;
  date: string; // DD/MM/YYYY
  reference: string;
  entree: number;
  depense: number;
  isApproCaisse: boolean;
  projetId?: number | null;
  categorie: string; // slug de catégorie ("" si à catégoriser)
  sousCategorie: string;
};

export type LigneSolde = Transaction & { solde: number };

export type SousCategorie = string;

export type Categorie = {
  emoji: string;
  label: string;
  slug: string;
  couleur: string; // couleur du donut / des barres
  sousCategories: SousCategorie[];
};

export type Ouvrier = { nom: string; poste: string };

export type ProjetTransaction = {
  id: number;
  date: string;
  libelle: string;
  montant: number;
};

export type Projet = {
  id: number;
  nom: string;
  ouvriers: Ouvrier[];
  montantTotal: number;
  description: string;
  dateDebut: string;
  dateFin: string;
  transactions: ProjetTransaction[];
  /** dépenses du brouillard rattachées au projet (mock agrégé) */
  depensesBrouillard: number;
};

export type MoisRecap = {
  mois: number; // 1..12
  nom: string; // "Janvier"
  abrev: string; // "JAN"
  entrees: number;
  depenses: number;
  soldeInitial: number;
  soldeFin: number;
};

/* --------------------------------------------------------------------------
   Constantes calendrier (français)
   -------------------------------------------------------------------------- */
export const MOIS_ABREV = [
  "JAN", "FÉV", "MARS", "AVRIL", "MAI", "JUIN",
  "JUIL", "AOÛT", "SEP", "OCT", "NOV", "DÉC",
];

export const MOIS_COURT = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

export const MOIS_LONG = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export const ANNEE_COURANTE = 2026;
export const MOIS_COURANT = 6; // Juin

/* --------------------------------------------------------------------------
   Formatage
   -------------------------------------------------------------------------- */
const NF = new Intl.NumberFormat("fr-FR");

export const formatNombre = (n: number) => NF.format(Math.round(n));
export const formatFCFA = (n: number) => `${NF.format(Math.round(n))} FCFA`;
export const formatSigne = (n: number) =>
  `${n > 0 ? "+" : n < 0 ? "−" : ""}${NF.format(Math.abs(Math.round(n)))}`;
export const formatSigneFCFA = (n: number) =>
  `${n >= 0 ? "+" : "−"}${NF.format(Math.abs(Math.round(n)))} FCFA`;

/* Une « date du jour » figée (l'app est datée du 20/06/2026) */
export const AUJOURDHUI = "19/06/2026";

/* --------------------------------------------------------------------------
   Catégories (seed du prompt) + couleurs du donut
   -------------------------------------------------------------------------- */
export const CATEGORIES: Categorie[] = [
  {
    emoji: "👷",
    label: "Paiement Ouvriers",
    slug: "paiement-ouvriers",
    couleur: "#e8842c",
    sousCategories: [
      "Traoré Drissa", "Mohamed", "Fleuriste", "Afrimarbre",
      "Dépôt Monsieur/Madame", "Koffi", "Ibrahim", "Vitrier",
      "Autres paiements", "Poignées et cylindres", "Rodrigue", "Mr Brou",
      "Fatao", "Tapissier", "Eric", "Électricien", "Sam / Samson", "Lambert",
      "Geue", "Maçon", "Femi", "Plombier", "Parfait", "Catalogue",
      "Ferronnier", "Isa",
    ],
  },
  {
    emoji: "🚚",
    label: "Transport",
    slug: "transport",
    couleur: "#3b82f6",
    sousCategories: [
      "Livraisons", "Transports divers", "Cargo / Camion", "Yango",
      "Carburant", "Remboursements transport", "Taxi", "Tricycle",
    ],
  },
  {
    emoji: "🛒",
    label: "Achat",
    slug: "achat",
    couleur: "#16a34a",
    sousCategories: [
      "Peinture / Vernis / Éclairage", "Autres achats", "Réparation / Location",
      "Quincaillerie (rails, paumelles, supports)", "Tissu / Fourrure",
      "Plomberie / Mécanismes", "Vis et fixations", "Câbles", "Silicone",
      "Colle", "Matériel chantier",
    ],
  },
  {
    emoji: "🔌",
    label: "Rechargement CIE",
    slug: "rechargement-cie",
    couleur: "#eab308",
    sousCategories: ["Rechargement CIE"],
  },
  {
    emoji: "🌐",
    label: "Achat Internet",
    slug: "achat-internet",
    couleur: "#8b5cf6",
    sousCategories: [
      "Internet Showroom", "Internet Atelier", "Internet Madame",
      "Internet Monsieur",
    ],
  },
  {
    emoji: "🧾",
    label: "Frais de Transaction",
    slug: "frais-transaction",
    couleur: "#a855f7",
    sousCategories: ["Frais retrait", "Frais dépôt", "Frais Wave / Momo"],
  },
  {
    emoji: "📁",
    label: "Autre",
    slug: "autre",
    couleur: "#9ca3af",
    sousCategories: ["Divers"],
  },
];

export const categorieBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

/* Palette d'emojis proposée dans l'éditeur de catégories */
export const EMOJI_PALETTE = [
  "📋", "👷", "🚚", "🛒", "🔌", "🌐", "💰", "🏗️", "🔧", "🎨",
  "🏠", "📦", "🧾", "💡", "🔑", "🪑", "🛠️", "🌿", "🧹", "🍽️",
];

/* --------------------------------------------------------------------------
   Postes (métiers) & Libellés (références fréquentes)
   -------------------------------------------------------------------------- */
export const POSTES_SEED = [
  "Menuisier", "Tapissier", "Vitrier", "Électricien", "Plombier", "Maçon",
  "Ferronnier", "Peintre", "Livreur", "Manœuvre",
];

export const LIBELLES_SEED = [
  "APPRO CAISSE", "RECHARGEMENT COMPTEUR", "ACHAT CARBURANT GROUPE ELECTROGENE",
  "LOCATION GROUPE ELECTROGENE", "TRANSPORT LIVRAISON", "ACHAT QUINCAILLERIE",
  "PAIEMENT OUVRIER", "ACHAT PEINTURE", "FRAIS WAVE", "ACHAT TISSU",
  "LIVRAISON PAUMELLE", "ACHAT SILICONE", "RECHARGEMENT CIE", "ACHAT VIS",
  "TRANSPORT CARGO", "ACHAT COLLE", "PAIEMENT TAPISSIER", "ACHAT CABLES",
];

/* --------------------------------------------------------------------------
   Récapitulatif annuel 2026 (chiffres des captures du vrai dashboard)
   -------------------------------------------------------------------------- */
export const RECAP_2026: MoisRecap[] = [
  { mois: 1, nom: "Janvier", abrev: "JAN", entrees: 4486735, depenses: 4447970, soldeInitial: 0, soldeFin: 38765 },
  { mois: 2, nom: "Février", abrev: "FÉV", entrees: 10684065, depenses: 10682657, soldeInitial: 0, soldeFin: 1408 },
  { mois: 3, nom: "Mars", abrev: "MARS", entrees: 13575915, depenses: 13270115, soldeInitial: 1408, soldeFin: 307208 },
  { mois: 4, nom: "Avril", abrev: "AVRIL", entrees: 8769603, depenses: 8728195, soldeInitial: 0, soldeFin: 41408 },
  { mois: 5, nom: "Mai", abrev: "MAI", entrees: 7196798, depenses: 7195075, soldeInitial: 0, soldeFin: 1723 },
  { mois: 6, nom: "Juin", abrev: "JUIN", entrees: 5130139, depenses: 5129314, soldeInitial: 0, soldeFin: 825 },
  { mois: 7, nom: "Juillet", abrev: "JUIL", entrees: 0, depenses: 0, soldeInitial: 0, soldeFin: 0 },
  { mois: 8, nom: "Août", abrev: "AOÛT", entrees: 0, depenses: 0, soldeInitial: 0, soldeFin: 0 },
  { mois: 9, nom: "Septembre", abrev: "SEP", entrees: 0, depenses: 0, soldeInitial: 0, soldeFin: 0 },
  { mois: 10, nom: "Octobre", abrev: "OCT", entrees: 0, depenses: 0, soldeInitial: 0, soldeFin: 0 },
  { mois: 11, nom: "Novembre", abrev: "NOV", entrees: 0, depenses: 0, soldeInitial: 0, soldeFin: 0 },
  { mois: 12, nom: "Décembre", abrev: "DÉC", entrees: 0, depenses: 0, soldeInitial: 0, soldeFin: 0 },
];

export const TOTAL_ENTREES_ANNEE = RECAP_2026.reduce((s, m) => s + m.entrees, 0);
export const TOTAL_DEPENSES_ANNEE = RECAP_2026.reduce((s, m) => s + m.depenses, 0);
export const RESULTAT_NET_ANNEE = TOTAL_ENTREES_ANNEE - TOTAL_DEPENSES_ANNEE;
export const NB_TRANSACTIONS_ANNEE = 2344; // agrégat mock (cf. capture)
export const NB_MOIS_ENREGISTRES = RECAP_2026.filter(
  (m) => m.entrees > 0 || m.depenses > 0
).length;
export const SOLDE_ACTUEL = RECAP_2026[MOIS_COURANT - 1].soldeFin;

/* --------------------------------------------------------------------------
   Répartition des dépenses du mois courant (Juin) — cf. capture (7 catégories)
   -------------------------------------------------------------------------- */
export type RepartLigne = {
  slug: string;
  emoji: string;
  label: string;
  couleur: string;
  montant: number;
  operations: number;
};

export const REPARTITION_JUIN: RepartLigne[] = [
  { slug: "achat", emoji: "🛒", label: "Achat", couleur: "#16a34a", montant: 899500, operations: 23 },
  { slug: "paiement-ouvriers", emoji: "👷", label: "Paiement Ouvriers", couleur: "#e8842c", montant: 300000, operations: 5 },
  { slug: "transport", emoji: "🚚", label: "Transport", couleur: "#3b82f6", montant: 180050, operations: 40 },
  { slug: "achat-internet", emoji: "🌐", label: "Achat Internet", couleur: "#8b5cf6", montant: 26400, operations: 2 },
  { slug: "frais-transaction", emoji: "🧾", label: "Frais de Transaction", couleur: "#a855f7", montant: 9968, operations: 42 },
  { slug: "autre", emoji: "📁", label: "Autre", couleur: "#9ca3af", montant: 7000, operations: 2 },
  { slug: "rechargement-cie", emoji: "🔌", label: "Rechargement CIE", couleur: "#eab308", montant: 5000, operations: 1 },
];

/* --------------------------------------------------------------------------
   Transactions du mois courant (Juin) — échantillon représentatif
   (le vrai mois en compte ~2300 ; on en montre un extrait fidèle aux captures)
   -------------------------------------------------------------------------- */
export const SOLDE_INITIAL_JUIN = 1723; // = solde fin de mai

let _id = 1;
const tx = (
  date: string,
  reference: string,
  entree: number,
  depense: number,
  categorie = "",
  sousCategorie = "",
  isApproCaisse = false,
  projetId: number | null = null
): Transaction => ({
  id: _id++,
  date,
  reference,
  entree,
  depense,
  isApproCaisse,
  projetId,
  categorie,
  sousCategorie,
});

export const TRANSACTIONS_JUIN: Transaction[] = [
  tx("01/06/2026", "SOLDE REPORTÉ — MAI", 1723, 0),
  tx("03/06/2026", "APPRO CAISSE", 250000, 0, "", "", true),
  tx("03/06/2026", "ACHAT QUINCAILLERIE — RAILS & PAUMELLES", 0, 84500, "achat", "Quincaillerie (rails, paumelles, supports)"),
  tx("05/06/2026", "PAIEMENT OUVRIER — TRAORÉ DRISSA", 0, 60000, "paiement-ouvriers", "Traoré Drissa"),
  tx("07/06/2026", "TRANSPORT CARGO — LIVRAISON PANNEAUX", 0, 35000, "transport", "Cargo / Camion"),
  tx("09/06/2026", "APPRO CAISSE ( BONUS WAVE)", 100, 0, "", "", true),
  tx("10/06/2026", "ACHAT PEINTURE / VERNIS", 0, 47800, "achat", "Peinture / Vernis / Éclairage"),
  tx("11/06/2026", "INTERNET SHOWROOM — JUIN", 0, 15400, "achat-internet", "Internet Showroom"),
  tx("12/06/2026", "RECHARGEMENT COMPTEUR", 0, 3000, "rechargement-cie", "Rechargement CIE"),
  tx("12/06/2026", "ACHAT PELLICULE PLASTIQUE", 0, 8800, "achat", "Autres achats"),
  tx("13/06/2026", "APPRO CAISE", 8800, 0, "", "", true),
  tx("14/06/2026", "TRANSPORT MOUSTAPHA À CHINA MALL DE ANGRÉ", 0, 2500, "transport", "Transports divers"),
  tx("15/06/2026", "LIVRAISON PAUMELLE COUDÉE", 0, 3600, "transport", "Livraisons"),
  tx("16/06/2026", "ACHAT CARBURANT GROUPE ELECTROGENE", 0, 3000, "achat", "Réparation / Location"),
  tx("16/06/2026", "LOCATION GROUPE ELECTROGENE", 0, 15000, "achat", "Réparation / Location"),
  tx("17/06/2026", "PAIEMENT PROFILÉ LED F3", 0, 10000, "achat", "Peinture / Vernis / Éclairage"),
  tx("18/06/2026", "TRANSPORT MISS ZABÉ SUR LE CHANTIER MR TANO", 0, 3500, "transport", "Transports divers", false, 1),
  tx("18/06/2026", "FRAIS WAVE — RETRAIT", 0, 240, "frais-transaction", "Frais Wave / Momo"),
  tx("19/06/2026", "ACHAT TISSU / FOURRURE — CANAPÉ", 0, 72000, "achat", "Tissu / Fourrure", false, 2),
  tx("19/06/2026", "APPRO CAISSE", 120000, 0, "", "", true),
];

/* --------------------------------------------------------------------------
   Projets (fictifs)
   -------------------------------------------------------------------------- */
export const PROJETS: Projet[] = [
  {
    id: 1,
    nom: "Showroom Plateau — agencement complet",
    ouvriers: [
      { nom: "Traoré Drissa", poste: "Menuisier" },
      { nom: "Eric", poste: "Vitrier" },
      { nom: "Lambert", poste: "Électricien" },
    ],
    montantTotal: 4500000,
    description: "Mobilier, vitrines et éclairage du nouveau showroom du Plateau.",
    dateDebut: "02/05/2026",
    dateFin: "30/06/2026",
    depensesBrouillard: 3500,
    transactions: [
      { id: 1, date: "06/05/2026", libelle: "Achat panneaux MDF", montant: 620000 },
      { id: 2, date: "14/05/2026", libelle: "Quincaillerie vitrines", montant: 410000 },
      { id: 3, date: "28/05/2026", libelle: "Paiement menuisier (acompte)", montant: 350000 },
      { id: 4, date: "10/06/2026", libelle: "Éclairage LED F3", montant: 285000 },
    ],
  },
  {
    id: 2,
    nom: "Villa Cocody — mobilier sur mesure",
    ouvriers: [
      { nom: "Rodrigue", poste: "Menuisier" },
      { nom: "Tapissier", poste: "Tapissier" },
    ],
    montantTotal: 2800000,
    description: "Dressing, tête de lit capitonnée et canapé sur mesure.",
    dateDebut: "20/05/2026",
    dateFin: "15/07/2026",
    depensesBrouillard: 72000,
    transactions: [
      { id: 1, date: "22/05/2026", libelle: "Bois & contreplaqué", montant: 480000 },
      { id: 2, date: "02/06/2026", libelle: "Tissu / fourrure capitonnage", montant: 360000 },
      { id: 3, date: "12/06/2026", libelle: "Mécanismes & coulisses", montant: 175000 },
    ],
  },
  {
    id: 3,
    nom: "Bureaux SIFCA — rénovation",
    ouvriers: [{ nom: "Maçon", poste: "Maçon" }, { nom: "Femi", poste: "Peintre" }],
    montantTotal: 1500000,
    description: "Cloisons, peinture et postes de travail open-space.",
    dateDebut: "01/06/2026",
    dateFin: "31/07/2026",
    depensesBrouillard: 0,
    transactions: [
      { id: 1, date: "05/06/2026", libelle: "Peinture & enduit", montant: 220000 },
      { id: 2, date: "15/06/2026", libelle: "Plans de travail mélaminés", montant: 540000 },
    ],
  },
];

/* --------------------------------------------------------------------------
   Logique métier
   -------------------------------------------------------------------------- */

/** Une ligne « SOLDE REPORTÉ » est un report : exclue des totaux d'entrées. */
export const estSoldeReporte = (t: Transaction) =>
  t.reference.toUpperCase().startsWith("SOLDE REPORTÉ");

/** Solde courant cumulatif : solde = solde + entree - depense, ligne par ligne. */
export function computeSoldes(
  soldeInitial: number,
  transactions: Transaction[]
): LigneSolde[] {
  let solde = soldeInitial;
  return transactions.map((t) => {
    solde = solde + t.entree - t.depense;
    return { ...t, solde };
  });
}

export type StatsBrouillard = {
  totalEntrees: number;
  totalDepenses: number;
  soldeNet: number;
  nbTransactions: number;
};

export function statsBrouillard(
  transactions: Transaction[]
): StatsBrouillard {
  const totalEntrees = transactions
    .filter((t) => !estSoldeReporte(t))
    .reduce((s, t) => s + t.entree, 0);
  const totalDepenses = transactions.reduce((s, t) => s + t.depense, 0);
  return {
    totalEntrees,
    totalDepenses,
    soldeNet: totalEntrees - totalDepenses,
    nbTransactions: transactions.filter((t) => !estSoldeReporte(t)).length,
  };
}

/** Total répartition (mois courant) */
export const TOTAL_REPARTITION = REPARTITION_JUIN.reduce(
  (s, r) => s + r.montant,
  0
);

/** Convertit DD/MM/YYYY → YYYY-MM-DD (comparaisons de dates) */
export const isoDate = (d: string) => {
  const [j, m, a] = d.split("/");
  return `${a}-${m}-${j}`;
};
