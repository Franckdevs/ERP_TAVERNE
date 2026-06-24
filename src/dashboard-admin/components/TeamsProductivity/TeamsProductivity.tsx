import "./TeamsProductivity.css";
import { useState, type CSSProperties } from "react";
import { TEAMS } from "../../data";
import PeriodFilter from "../../../components/period/PeriodFilter";
import { periodFactor, EMPTY_PERIOD, type Period } from "../../../components/period/periodSeries";

const YEAR = 2026;

export default function TeamsProductivity() {
  const [period, setPeriod] = useState<Period>(EMPTY_PERIOD);

  const teams = TEAMS.map((t, i) => ({
    ...t,
    pct: Math.max(5, Math.min(100, Math.round(t.pct * periodFactor(i, period)))),
  }));

  return (
    <section className="card">
      <header className="card__head">
        <h2 className="card__title">Productivité des équipes</h2>
        <PeriodFilter value={period} onChange={setPeriod} year={YEAR} size="sm" />
      </header>

      <div className="teams">
        {teams.map((t) => (
          <div className="team" key={t.label}>
            <span className="team__pct">{t.pct}%</span>
            <div className="team__track">
              <span
                className="team__bar"
                style={{ "--h": `${t.pct}%` } as CSSProperties}
              />
            </div>
            <span className="team__label">{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
