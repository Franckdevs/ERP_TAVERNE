import { useMemo, useState } from "react";
import {
  PROJETS,
  formatNombre,
  type Projet,
} from "../data";
import { SearchIcon, ArrowRightIcon, DownloadIcon, PlusIcon } from "../icons";

/* Agrégats d'un projet */
function totaux(p: Projet) {
  const depProjet = p.transactions.reduce((s, t) => s + t.montant, 0);
  const totalGlobal = depProjet + p.depensesBrouillard;
  const restant = p.montantTotal - totalGlobal;
  const pct = p.montantTotal > 0 ? (totalGlobal / p.montantTotal) * 100 : 0;
  return { depProjet, totalGlobal, restant, pct };
}

function couleurBarre(pct: number) {
  if (pct > 100) return "#dc2626";
  if (pct >= 80) return "#d97706";
  return "#8b4513";
}

export default function ProjetsView() {
  const [recherche, setRecherche] = useState("");
  const [selId, setSelId] = useState<number | null>(null);
  const [flash, setFlash] = useState("");

  const projets = useMemo(
    () =>
      PROJETS.filter((p) => {
        const q = recherche.toLowerCase();
        return (
          p.nom.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ouvriers.some((o) => o.nom.toLowerCase().includes(q))
        );
      }),
    [recherche]
  );

  const selected = PROJETS.find((p) => p.id === selId) ?? null;

  if (selected) {
    return <ProjetDetail projet={selected} onBack={() => setSelId(null)} />;
  }

  return (
    <div className="cc-stack">
      {flash && <div className="cc-flash">{flash}</div>}

      <section className="cc-card cc-toolbar">
        <label className="cc-search cc-search--inline">
          <SearchIcon />
          <input
            type="search"
            placeholder="Rechercher un projet, un ouvrier…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="cc-btn cc-btn--primary"
          onClick={() => setFlash("Création de projet (démo) — données fictives.")}
        >
          <PlusIcon /> Nouveau projet
        </button>
      </section>

      <div className="cc-projets">
        {projets.map((p) => {
          const t = totaux(p);
          return (
            <article key={p.id} className="cc-card cc-projet">
              <header className="cc-projet__head">
                <h3 className="cc-projet__name">{p.nom}</h3>
                <button type="button" className="cc-link cc-link--sm" onClick={() => setSelId(p.id)}>
                  Détail <ArrowRightIcon />
                </button>
              </header>

              <div className="cc-projet__ouvriers">
                {p.ouvriers.map((o) => (
                  <span key={o.nom} className="cc-badge">{o.nom} · {o.poste}</span>
                ))}
              </div>

              <p className="cc-projet__desc">{p.description}</p>
              <p className="cc-projet__dates">{p.dateDebut} → {p.dateFin}</p>

              <div className="cc-projet__stats">
                <div><span>Budget</span><strong>{formatNombre(p.montantTotal)}</strong></div>
                <div><span>Dépensé</span><strong className="cc-neg">{formatNombre(t.totalGlobal)}</strong></div>
                <div><span>Restant</span><strong className={t.restant < 0 ? "cc-neg" : "cc-pos"}>{formatNombre(t.restant)}</strong></div>
              </div>

              <div className="cc-progress">
                <span className="cc-progress__fill" style={{ width: `${Math.min(100, t.pct)}%`, background: couleurBarre(t.pct) }} />
              </div>
              <p className="cc-projet__foot">
                {t.pct.toFixed(0)}% du budget · {p.transactions.length} transaction(s)
                {p.depensesBrouillard > 0 && " · dépenses brouillard liées"}
              </p>
            </article>
          );
        })}
        {projets.length === 0 && <p className="cc-empty">Aucun projet trouvé.</p>}
      </div>
    </div>
  );
}

/* --- Détail projet -------------------------------------------------------- */
function ProjetDetail({ projet, onBack }: { projet: Projet; onBack: () => void }) {
  const t = totaux(projet);
  const [flash, setFlash] = useState("");

  /* Table unifiée : transactions propres (📄) + brouillard lié (📓) */
  const rows = [
    ...projet.transactions.map((x) => ({
      id: `p${x.id}`,
      date: x.date,
      libelle: x.libelle,
      montant: x.montant,
      source: "projet" as const,
      contexte: "",
    })),
    ...(projet.depensesBrouillard > 0
      ? [{
          id: "b1",
          date: "18/06/2026",
          libelle: "Dépense rattachée depuis le brouillard",
          montant: projet.depensesBrouillard,
          source: "brouillard" as const,
          contexte: "(Juin 2026)",
        }]
      : []),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="cc-stack">
      {flash && <div className="cc-flash">{flash}</div>}

      <section className="cc-card cc-projet-hero">
        <button type="button" className="cc-link cc-link--back" onClick={onBack}>← Retour aux projets</button>
        <div className="cc-projet-hero__top">
          <div>
            <h2 className="cc-projet-hero__name">{projet.nom}</h2>
            <div className="cc-projet__ouvriers">
              {projet.ouvriers.map((o) => (
                <span key={o.nom} className="cc-badge cc-badge--light">{o.nom} · {o.poste}</span>
              ))}
            </div>
            <p className="cc-projet-hero__dates">{projet.dateDebut} → {projet.dateFin}</p>
            <p className="cc-projet-hero__desc">{projet.description}</p>
          </div>
          <button type="button" className="cc-btn cc-btn--light" onClick={() => setFlash("Export .xlsx du projet généré (démo).")}>
            <DownloadIcon /> Exporter
          </button>
        </div>
      </section>

      <div className="cc-kpis cc-kpis--4">
        <article className="cc-card cc-stat cc-stat--brown"><p className="cc-stat__label">Budget</p><p className="cc-stat__value">{formatNombre(projet.montantTotal)} FCFA</p></article>
        <article className="cc-card cc-stat cc-stat--red"><p className="cc-stat__label">Dépenses projet</p><p className="cc-stat__value">{formatNombre(t.depProjet)} FCFA</p></article>
        <article className="cc-card cc-stat cc-stat--red"><p className="cc-stat__label">Dép. brouillard liées</p><p className="cc-stat__value">{formatNombre(projet.depensesBrouillard)} FCFA</p></article>
        <article className={`cc-card cc-stat ${t.restant < 0 ? "cc-stat--red" : "cc-stat--green"}`}><p className="cc-stat__label">{t.restant < 0 ? "Dépassement" : "Restant"}</p><p className="cc-stat__value">{formatNombre(Math.abs(t.restant))} FCFA</p></article>
      </div>

      <div className="cc-progress cc-progress--lg">
        <span className="cc-progress__fill" style={{ width: `${Math.min(100, t.pct)}%`, background: couleurBarre(t.pct) }} />
      </div>

      <section className="cc-card cc-panel">
        <header className="cc-panel__head">
          <h2 className="cc-panel__title cc-panel__title--sm">Dépenses du projet</h2>
        </header>
        <div className="cc-table-wrap">
          <table className="cc-table">
            <thead>
              <tr><th>Date</th><th>Libellé</th><th className="cc-num">Montant</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="cc-row-hover">
                  <td>{r.date}</td>
                  <td>
                    <span className={`cc-src cc-src--${r.source}`}>{r.source === "projet" ? "📄" : "📓"}</span>
                    {r.libelle} {r.contexte && <em className="cc-ctx">{r.contexte}</em>}
                  </td>
                  <td className="cc-num cc-neg">{formatNombre(r.montant)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="cc-total-row">
                <td colSpan={2}>TOTAL</td>
                <td className="cc-num cc-strong">{formatNombre(t.totalGlobal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}