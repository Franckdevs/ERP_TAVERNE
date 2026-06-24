import "./ExpensesDonut.css";
import { useState } from "react";
import { EXPENSES } from "../../data";
import PeriodFilter from "../../../components/period/PeriodFilter";
import {
  periodFactor,
  daysInMonth,
  EMPTY_PERIOD,
  type Period,
} from "../../../components/period/periodSeries";

const R = 70;
const C = 2 * Math.PI * R;
const YEAR = 2026;
const BASE_TOTAL_M = 22.3; // dépenses mensuelles de référence (millions FCFA)

export default function ExpensesDonut() {
  const [period, setPeriod] = useState<Period>(EMPTY_PERIOD);

  /* parts repondérées selon la période, renormalisées à 100 % */
  const weighted = EXPENSES.map((e, i) => e.pct * periodFactor(i, period));
  const sum = weighted.reduce((s, v) => s + v, 0) || 1;
  const slices = EXPENSES.map((e, i) => ({
    ...e,
    pct: Math.round((weighted[i] / sum) * 100),
  }));

  /* total affiché : mensuel, ou journalier si un jour est ciblé */
  const globalFactor = periodFactor(99, period);
  const isDay = period.day != null;
  const totalM = isDay
    ? (BASE_TOTAL_M * globalFactor) / daysInMonth(YEAR, period.month!)
    : BASE_TOTAL_M * globalFactor;
  const totalLabel = `${totalM.toFixed(1).replace(".", ",")}M`;
  const unit = isDay ? "FCFA · jour" : "FCFA · mois";

  let acc = 0;

  return (
    <section className="card donut-card">
      <header className="card__head">
        <div>
          <h2 className="card__title">Répartition des dépenses</h2>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} year={YEAR} size="sm" />
      </header>

      <div className="donut">
        <svg viewBox="0 0 180 180" className="donut__svg" role="img" aria-label="Répartition des dépenses">
          <g transform="rotate(-90 90 90)">
            <circle
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="20"
            />
            {slices.map((e) => {
              const len = (e.pct / 100) * C;
              const seg = (
                <circle
                  key={e.label}
                  cx="90"
                  cy="90"
                  r={R}
                  fill="none"
                  stroke={e.color}
                  strokeWidth="20"
                  strokeLinecap="butt"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-acc}
                />
              );
              acc += len;
              return seg;
            })}
          </g>
          <text x="90" y="84" className="donut__value" textAnchor="middle">
            {totalLabel}
          </text>
          <text x="90" y="102" className="donut__unit" textAnchor="middle">
            {unit}
          </text>
        </svg>
      </div>

      <ul className="donut__legend">
        {slices.map((e) => (
          <li className="donut__legend-item" key={e.label}>
            <span className="donut__dot" style={{ backgroundColor: e.color }} />
            <span className="donut__legend-label">{e.label}</span>
            <span className="donut__legend-pct">{e.pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
