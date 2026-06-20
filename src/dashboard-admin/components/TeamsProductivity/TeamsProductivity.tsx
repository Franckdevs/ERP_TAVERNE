import "./TeamsProductivity.css";
import type { CSSProperties } from "react";
import { TEAMS } from "../../data";

export default function TeamsProductivity() {
  return (
    <section className="card">
      <header className="card__head">
        <h2 className="card__title">Productivité des équipes</h2>
      </header>

      <div className="teams">
        {TEAMS.map((t) => (
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