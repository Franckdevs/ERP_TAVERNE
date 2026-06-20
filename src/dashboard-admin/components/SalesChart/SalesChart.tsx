import "./SalesChart.css";
import { useState } from "react";
import { MONTHS, SALES } from "../../data";

const W = 560;
const H = 230;
const PAD = 14;

function buildPaths(values: number[]) {
  const max = Math.max(...values) * 1.05;
  const min = Math.min(...values) * 0.85;
  const span = max - min || 1;

  const pts = values.map((v, i) => {
    const x = PAD + (i * (W - 2 * PAD)) / (values.length - 1);
    const y = H - PAD - ((v - min) / span) * (H - 2 * PAD);
    return [x, y] as const;
  });

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${pts[pts.length - 1][0].toFixed(1)} ${H - PAD} L ${pts[0][0].toFixed(1)} ${H - PAD} Z`;
  return { line, area, last: pts[pts.length - 1] };
}

export default function SalesChart() {
  const years = Object.keys(SALES);
  const [year, setYear] = useState(years[0]);
  const { line, area, last } = buildPaths(SALES[year]);

  return (
    <section className="card chart-card">
      <header className="card__head">
        <div>
          <h2 className="card__title">Évolution des ventes</h2>
          <p className="card__sub">12 derniers mois · en millions FCFA</p>
        </div>
        <div className="seg" role="tablist" aria-label="Année">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              role="tab"
              aria-selected={year === y}
              className={`seg__btn ${year === y ? "is-active" : ""}`}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </header>

      <svg
        className="sales__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Évolution des ventes ${year}`}
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
        <circle
          cx={last[0]}
          cy={last[1]}
          r="4.5"
          fill="#8b4513"
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>

      <div className="sales__months">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </section>
  );
}
