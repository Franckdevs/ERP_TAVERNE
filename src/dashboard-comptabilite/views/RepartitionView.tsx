import { useMemo, useState } from "react";
import {
  ANNEE_COURANTE,
  MOIS_LONG,
  MOIS_COURANT,
  REPARTITION_JUIN,
  TOTAL_REPARTITION,
  categorieBySlug,
  formatNombre,
  formatFCFA,
} from "../data";
import { Donut } from "../charts";
import { periodFactor, daysInMonth } from "../../components/period/periodSeries";
import { DownloadIcon, ChevronDownIcon } from "../icons";

/* Répartition fictive d'une catégorie sur ses sous-catégories (déterministe) */
function splitSousCategories(slug: string, montant: number, operations: number) {
  const cat = categorieBySlug(slug);
  const subs = cat?.sousCategories.slice(0, Math.min(4, operations || 1)) ?? ["Divers"];
  const poids = subs.map((_, i) => subs.length - i); // décroissant
  const somme = poids.reduce((s, p) => s + p, 0);
  let reste = montant;
  return subs.map((label, i) => {
    const part = i === subs.length - 1 ? reste : Math.round((montant * poids[i]) / somme);
    reste -= part;
    return { label, montant: part };
  });
}

export default function RepartitionView() {
  const [mois, setMois] = useState(MOIS_COURANT);
  const [jour, setJour] = useState<number | null>(null);
  const [actifs, setActifs] = useState<Set<string>>(new Set());
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  const toggleFiltre = (slug: string) => {
    setActifs((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const lignes = useMemo(
    () =>
      actifs.size === 0
        ? REPARTITION_JUIN
        : REPARTITION_JUIN.filter((r) => actifs.has(r.slug)),
    [actifs]
  );
  /* repondération selon mois/jour (Juin sans jour ciblé = données de référence) */
  const facteur = (i: number) =>
    mois === MOIS_COURANT && jour == null
      ? 1
      : periodFactor(i, { month: mois - 1, day: jour });
  const lignesP = lignes.map((r, i) => ({
    ...r,
    montant: Math.max(1, Math.round(r.montant * facteur(i))),
  }));

  const total = lignesP.reduce((s, r) => s + r.montant, 0);
  const operations = lignesP.reduce((s, r) => s + r.operations, 0);

  const showExport = () => {
    setFlash("Export .xlsx multi-feuilles généré (démo).");
    window.setTimeout(() => setFlash(""), 3200);
  };

  return (
    <div className="cc-stack">
      {flash && <div className="cc-flash">{flash}</div>}

      <section className="cc-card cc-toolbar">
        <div className="cc-toolbar__selects">
          <label className="cc-mini-field">
            <span>Mois</span>
            <select
              value={mois}
              onChange={(e) => {
                setMois(Number(e.target.value));
                setJour(null);
              }}
            >
              {MOIS_LONG.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>
          <label className="cc-mini-field">
            <span>Jour</span>
            <select
              value={jour ?? ""}
              onChange={(e) => setJour(e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">Tous</option>
              {Array.from({ length: daysInMonth(ANNEE_COURANTE, mois - 1) }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="cc-mini-field">
            <span>Année</span>
            <select defaultValue={ANNEE_COURANTE}>
              <option>{ANNEE_COURANTE}</option>
              <option>{ANNEE_COURANTE - 1}</option>
            </select>
          </label>
        </div>
        <button type="button" className="cc-btn cc-btn--ghost" onClick={showExport}>
          <DownloadIcon /> Export Excel
        </button>
      </section>

      {/* filtres par catégorie (pills) */}
      <div className="cc-pills">
        {REPARTITION_JUIN.map((r) => (
          <button
            key={r.slug}
            type="button"
            className={`cc-pill${actifs.has(r.slug) ? " is-active" : ""}`}
            style={actifs.has(r.slug) ? { borderColor: r.couleur, background: r.couleur } : undefined}
            onClick={() => toggleFiltre(r.slug)}
          >
            {r.emoji} {r.label}
          </button>
        ))}
        {actifs.size > 0 && (
          <button type="button" className="cc-pill cc-pill--reset" onClick={() => setActifs(new Set())}>
            ✕ Tout afficher
          </button>
        )}
      </div>

      <div className="cc-kpis cc-kpis--3">
        <article className="cc-card cc-stat cc-stat--red">
          <p className="cc-stat__label">Total Dépenses</p>
          <p className="cc-stat__value">{formatNombre(total)} FCFA</p>
        </article>
        <article className="cc-card cc-stat cc-stat--brown">
          <p className="cc-stat__label">Opérations</p>
          <p className="cc-stat__value">{operations}</p>
        </article>
        <article className="cc-card cc-stat cc-stat--brown">
          <p className="cc-stat__label">Catégories actives</p>
          <p className="cc-stat__value">{lignes.length}</p>
        </article>
      </div>

      <section className="cc-card cc-panel">
        <header className="cc-panel__head">
          <div>
            <h2 className="cc-panel__title cc-panel__title--sm">Répartition par catégorie</h2>
            <p className="cc-panel__sub">
              {jour ? `${jour} ` : ""}{MOIS_LONG[mois - 1]} {ANNEE_COURANTE}
            </p>
          </div>
        </header>

        <div className="cc-repart">
          <div className="cc-repart__donut">
            <Donut data={lignesP.map((r) => ({ value: r.montant, color: r.couleur }))} />
            <p className="cc-repart__center">{formatNombre(total / 1000)}k<br /><small>FCFA</small></p>
          </div>

          <ul className="cc-repart__list">
            {lignesP.map((r) => {
              const pct = (r.montant / (total || 1)) * 100;
              const isOpen = ouvert === r.slug;
              const subs = splitSousCategories(r.slug, r.montant, r.operations);
              return (
                <li key={r.slug} className="cc-repart__row cc-repart__row--clickable">
                  <button
                    type="button"
                    className="cc-repart__toggle"
                    onClick={() => setOuvert(isOpen ? null : r.slug)}
                  >
                    <span className="cc-repart__emoji">{r.emoji}</span>
                    <div className="cc-repart__body">
                      <div className="cc-repart__line">
                        <span className="cc-repart__name">{r.label}</span>
                        <span className="cc-repart__amount">{formatFCFA(r.montant)} · {r.operations} op</span>
                      </div>
                      <span className="cc-repart__bar">
                        <span className="cc-repart__fill" style={{ width: `${pct}%`, background: r.couleur }} />
                      </span>
                    </div>
                    <span className="cc-repart__pct">{pct.toFixed(1)}%</span>
                    <ChevronDownIcon className={`cc-repart__chev${isOpen ? " is-open" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="cc-repart__detail">
                      <div className="cc-repart__stats">
                        <span>Moyenne / op : <strong>{formatNombre(r.montant / Math.max(1, r.operations))}</strong></span>
                        <span>Part du total : <strong>{((r.montant / TOTAL_REPARTITION) * 100).toFixed(1)}%</strong></span>
                      </div>
                      <ul className="cc-subcat">
                        {subs.map((s) => (
                          <li key={s.label}>
                            <span>{s.label}</span>
                            <span className="cc-num">{formatNombre(s.montant)} FCFA</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}