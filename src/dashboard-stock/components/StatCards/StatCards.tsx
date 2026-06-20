import "./StatCards.css";
import { STATS } from "../../data";

export default function StatCards() {
  return (
    <div className="kpis">
      {STATS.map(({ icon: Icon, label, value, unit, tone }) => (
        <article className={`kpi kpi--${tone}`} key={label}>
          <div className="kpi__head">
            <p className="kpi__label">{label}</p>
            <span className="kpi__icon">
              <Icon />
            </span>
          </div>
          <p className="kpi__value">
            {value}
            {unit && <span className="kpi__unit"> {unit}</span>}
          </p>
        </article>
      ))}
    </div>
  );
}