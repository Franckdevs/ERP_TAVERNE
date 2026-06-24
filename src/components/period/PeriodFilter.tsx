import "./PeriodFilter.css";
import { MOIS_LONG, daysInMonth, type Period } from "./periodSeries";

/* Petite icône calendrier autonome (ne dépend d'aucun jeu d'icônes). */
function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/* ===========================================================================
   PeriodFilter — deux listes déroulantes (Mois + Jour) pour filtrer un
   graphique. « Année » = vue annuelle ; choisir un mois active le sélecteur
   de jour. S'adapte aux fonds clairs comme sombres (couleurs en currentColor).
   --------------------------------------------------------------------------- */
export default function PeriodFilter({
  value,
  onChange,
  year,
  className = "",
  size = "md",
}: {
  value: Period;
  onChange: (p: Period) => void;
  year: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const nDays = value.month != null ? daysInMonth(year, value.month) : 0;

  return (
    <div className={`pf pf--${size} ${className}`} role="group" aria-label="Filtrer par période">
      <span className="pf__lead" aria-hidden="true"><CalIcon /></span>

      <span className="pf__field">
        <select
          className="pf__select"
          aria-label="Filtrer par mois"
          value={value.month ?? ""}
          onChange={(e) =>
            onChange({ month: e.target.value === "" ? null : Number(e.target.value), day: null })
          }
        >
          <option value="">Année</option>
          {MOIS_LONG.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
        <span className="pf__chevron" aria-hidden="true">▾</span>
      </span>

      <span className="pf__field">
        <select
          className="pf__select"
          aria-label="Filtrer par jour"
          value={value.day ?? ""}
          disabled={value.month == null}
          onChange={(e) =>
            onChange({ ...value, day: e.target.value === "" ? null : Number(e.target.value) })
          }
        >
          <option value="">{value.month == null ? "Jour" : "Tous les jours"}</option>
          {Array.from({ length: nDays }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <span className="pf__chevron" aria-hidden="true">▾</span>
      </span>
    </div>
  );
}
