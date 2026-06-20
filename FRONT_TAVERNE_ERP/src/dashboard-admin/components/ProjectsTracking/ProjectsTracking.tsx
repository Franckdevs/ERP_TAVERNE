import "./ProjectsTracking.css";
import { PROJECTS, type ProjectStatus } from "../../data";

const STATUS_CLASS: Record<ProjectStatus, string> = {
  "En cours": "is-progress",
  Finition: "is-finishing",
  "Démarrage": "is-starting",
};

export default function ProjectsTracking() {
  return (
    <section className="card">
      <header className="card__head">
        <h2 className="card__title">Suivi des projets</h2>
      </header>

      <ul className="projects">
        {PROJECTS.map((p) => (
          <li className="project" key={p.name}>
            <div className="project__row">
              <div className="project__info">
                <p className="project__name">{p.name}</p>
                <p className="project__client">{p.client}</p>
              </div>
              <span className={`project__status ${STATUS_CLASS[p.status]}`}>
                {p.status}
              </span>
            </div>
            <div
              className="project__bar"
              role="progressbar"
              aria-valuenow={p.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span
                className="project__bar-fill"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
