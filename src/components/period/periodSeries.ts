/* ===========================================================================
   periodSeries — utilitaires déterministes pour filtrer les graphiques par
   mois et par jour. Aucune dépendance, aucune valeur aléatoire : le rendu est
   stable d'un chargement à l'autre (hash sinusoïdal « seedé »).

   Sémantique d'une période :
     • month = null            → année entière (12 mois, comportement d'origine)
     • month = 0..11, day = null → détail jour par jour du mois choisi
     • month = 0..11, day = 1..N → idem, avec le jour choisi mis en évidence
   --------------------------------------------------------------------------- */

export type Period = { month: number | null; day: number | null };

export const EMPTY_PERIOD: Period = { month: null, day: null };

export const MOIS_LONG = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export const MOIS_COURT = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

/* Nombre de jours d'un mois (gère les années bissextiles). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/* Hash déterministe -> [0,1) (pas de Math.random : rendu stable). */
function noise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/* Libellé lisible de la période (sous-titres, légendes). */
export function periodLabel(period: Period, year: number): string {
  if (period.month == null) return `Année ${year}`;
  if (period.day == null) return `${MOIS_LONG[period.month]} ${year}`;
  return `${period.day} ${MOIS_LONG[period.month]} ${year}`;
}

/* --- Série de FLUX (ventes, entrées, dépenses…) ---------------------------
   Le total mensuel est réparti sur les jours du mois : la somme des valeurs
   journalières reste égale au total du mois (avec un creux le week-end). */
export function dailyFlow(monthlyValue: number, year: number, month: number): number[] {
  const n = daysInMonth(year, month);
  const raw = Array.from({ length: n }, (_, i) => {
    const f = 0.55 + 0.9 * noise((month + 1) * 131 + (i + 1) * 7);
    const weekday = new Date(year, month, i + 1).getDay();
    const we = weekday === 0 || weekday === 6 ? 0.5 : 1; // moins d'activité le week-end
    return f * we;
  });
  const sum = raw.reduce((s, v) => s + v, 0) || 1;
  return raw.map((v) => (v * monthlyValue) / sum);
}

/* --- Série de NIVEAU (solde, stock…) --------------------------------------
   On interpole entre la valeur de fin du mois précédent et celle du mois
   choisi, avec une légère ondulation déterministe. */
export function dailyLevel(values: number[], year: number, month: number): number[] {
  const n = daysInMonth(year, month);
  const end = values[month] ?? 0;
  const start = month > 0 ? values[month - 1] ?? end : end * 0.92;
  const span = Math.abs(end - start) || Math.abs(end) || 1;
  return Array.from({ length: n }, (_, i) => {
    const t = n > 1 ? i / (n - 1) : 1;
    const base = start + (end - start) * t;
    const wobble = (noise((month + 1) * 53 + (i + 1) * 3) - 0.5) * span * 0.1;
    return base + wobble;
  });
}

/* --- Résolution d'une série temporelle selon la période -------------------
   Renvoie les valeurs + libellés d'axe + l'index éventuel à mettre en évidence.
   mode "flow"  → séries de flux (réparties sur le mois)
   mode "level" → séries de niveau (interpolées). */
export function resolveSeries(
  monthly: number[],
  monthLabels: string[],
  period: Period,
  year: number,
  mode: "flow" | "level" = "flow"
): { values: number[]; labels: string[]; highlight: number | null } {
  if (period.month == null) {
    return { values: monthly, labels: monthLabels, highlight: null };
  }
  const values =
    mode === "level"
      ? dailyLevel(monthly, year, period.month)
      : dailyFlow(monthly[period.month] ?? 0, year, period.month);
  const labels = values.map((_, i) => String(i + 1));
  const highlight = period.day != null ? period.day - 1 : null;
  return { values, labels, highlight };
}

/* --- DISTRIBUTION (donut, barres de catégories) ---------------------------
   Multiplicateur déterministe par catégorie pour faire évoluer la répartition
   selon la période. Retourne 1 pour l'année entière (valeurs de base). */
export function periodFactor(index: number, period: Period): number {
  if (period.month == null) return 1;
  const d = period.day ?? 0;
  return 0.65 + 0.7 * noise((index + 1) * 17 + (period.month + 1) * 91 + d * 5);
}

/* Applique periodFactor à une liste d'objets en repondérant une clé numérique. */
export function scaleByPeriod<T>(
  items: T[],
  period: Period,
  read: (item: T) => number,
  write: (item: T, value: number) => T
): T[] {
  if (period.month == null) return items;
  return items.map((it, i) =>
    write(it, Math.max(1, Math.round(read(it) * periodFactor(i, period))))
  );
}
