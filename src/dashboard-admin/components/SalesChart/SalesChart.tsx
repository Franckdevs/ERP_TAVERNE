import "./SalesChart.css";
import { useState } from "react";
import { MONTHS, SALES } from "../../data";
import PeriodFilter from "../../../components/period/PeriodFilter";
import {
  resolveSeries,
  periodLabel,
  EMPTY_PERIOD,
  type Period,
} from "../../../components/period/periodSeries";

const W = 560;
const H = 230;
const PAD = 14;

function buildPaths(values: number[]) {
  const max = Math.max(...values) * 1.05;
  const min = Math.min(...values) * 0.85;
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = PAD + (i * (W - 2 * PAD)) / Math.max(1, values.length - 1);
    const y = H - PAD - ((v - min) / span) * (H - 2 * PAD);
    return [x, y] as const;
  });

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${pts[pts.length - 1][0].toFixed(1)} ${H - PAD} L ${pts[0][0].toFixed(1)} ${H - PAD} Z`;
  return { line, area, pts, last: pts[pts.length - 1] };
}

export default function SalesChart() {
  const years = Object.keys(SALES);
  const [year, setYear] = useState(years[0]);
  const [period, setPeriod] = useState<Period>(EMPTY_PERIOD);

  const { values, labels, highlight } = resolveSeries(
    SALES[year],
    MONTHS,
    period,
    Number(year),
    "flow"
  );
  const { line, area, pts, last } = buildPaths(values);
  const hp = highlight != null ? pts[highlight] : null;

  /* axe X : 12 mois ou les jours du mois (allégés si trop nombreux) */
  const dense = labels.length > 16;
  const axis = labels.map((l, i) => (!dense || i % 3 === 0 ? l : ""));

  const sub =
    period.month == null
      ? "12 derniers mois · en millions FCFA"
      : `${periodLabel(period, Number(year))} · en millions FCFA`;

  return (
    <section className="card chart-card">
      <header className="card__head">
        <div>
          <h2 className="card__title">Évolution des ventes</h2>
          <p className="card__sub">{sub}</p>
        </div>
        <div className="chart-card__controls">
          <PeriodFilter value={period} onChange={setPeriod} year={Number(year)} size="sm" />
          <div className="seg" role="tablist" aria-label="Année">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                role="tab"
                aria-selected={year === y}
                className={`seg__btn ${year === y ? "is-active" : ""}`}
                onClick={() => {
                  setYear(y);
                  setPeriod(EMPTY_PERIOD);
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </header>

      <svg
        className="sales__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Évolution des ventes · ${periodLabel(period, Number(year))}`}
      >
        <defs>
          <linearGradient id="sales-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a85c1f" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a85c1f" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1={PAD}
            x2={W - PAD}
            y1={PAD + r * (H - 2 * PAD)}
            y2={PAD + r * (H - 2 * PAD)}
            stroke="#ece3d8"
            strokeWidth="1"
          />
        ))}

        <path className="sales__area" d={area} fill="url(#sales-area)" />
        <path
          className="sales__line"
          d={line}
          fill="none"
          stroke="#a85c1f"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* jour mis en évidence */}
        {hp && (
          <>
            <line x1={hp[0]} x2={hp[0]} y1={PAD} y2={H - PAD} stroke="#8b4513" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx={hp[0]} cy={hp[1]} r="6" fill="#8b4513" stroke="#fff" strokeWidth="2.5" />
          </>
        )}

        {/* dernier point (vue annuelle / mensuelle sans jour ciblé) */}
        {!hp && (
          <circle cx={last[0]} cy={last[1]} r="4.5" fill="#8b4513" stroke="#fff" strokeWidth="2" />
        )}
      </svg>

      <div className="sales__months">
        {axis.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </section>
  );
}
