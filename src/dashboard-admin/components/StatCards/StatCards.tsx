import "./StatCards.css";
import { STATS } from "../../data";

export default function StatCards() {
  return (
    <div className="stats">
      {STATS.map(({ icon: Icon, label, value, unit, badge, tone }) => (
        <article className="stat-card" key={label}>
          <div className="stat-card__top">
            <span className="stat-card__icon">
              <Icon />
            </span>
            <span className={`stat-card__badge stat-card__badge--${tone}`}>
              {badge}
            </span>
          </div>
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">
            {value}
            {unit && <span className="stat-card__unit"> {unit}</span>}
          </p>
        </article>
      ))}
    </div>
  );
}
