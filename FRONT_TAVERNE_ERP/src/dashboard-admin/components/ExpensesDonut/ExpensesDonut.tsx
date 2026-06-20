import "./ExpensesDonut.css";
import { EXPENSES, EXPENSES_TOTAL } from "../../data";

const R = 70;
const C = 2 * Math.PI * R;

export default function ExpensesDonut() {
  let acc = 0;

  return (
    <section className="card donut-card">
      <header className="card__head">
        <div>
          <h2 className="card__title">Répartition des dépenses</h2>
        </div>
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
            {EXPENSES.map((e) => {
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
            {EXPENSES_TOTAL}
          </text>
          <text x="90" y="102" className="donut__unit" textAnchor="middle">
            FCFA · mois
          </text>
        </svg>
      </div>

      <ul className="donut__legend">
        {EXPENSES.map((e) => (
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
