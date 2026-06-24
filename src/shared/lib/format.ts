/* ===========================================================================
   Formatage — centralisé (FCFA + dates fr-FR). Réutilisable par tous les modules.
   --------------------------------------------------------------------------- */
const NF = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 1500000 → "1 500 000 FCFA". */
export const formatFCFA = (montant: number): string => `${NF.format(montant)} FCFA`;

/** 1500000 → "1 500 000" (sans devise). */
export const formatNombre = (n: number): string => NF.format(n);

/** "2026-06-24" → "24 juin 2026" (options surchargeables). */
export const formatDateFr = (
  iso: string,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" },
): string => new Date(iso).toLocaleDateString("fr-FR", options);
