import { useState } from "react";
import {
  ANNEE_COURANTE,
  RECAP_2026,
  TOTAL_ENTREES_ANNEE,
  TOTAL_DEPENSES_ANNEE,
  RESULTAT_NET_ANNEE,
  formatNombre,
  formatSigne,
} from "../data";
import { MiniBar } from "../charts";

export default function RecapView() {
  const [annee] = useState(ANNEE_COURANTE);

  const moisActifs = RECAP_2026.filter((m) => m.entrees > 0 || m.depenses > 0);
  const maxFlux = Math.max(
    1,
    ...RECAP_2026.map((m) => Math.max(m.entrees, m.depenses))
  );

  const meilleur = moisActifs.reduce(
    (best, m) =>
      m.entrees - m.depenses > best.entrees - best.depenses ? m : best,
    moisActifs[0]
  );
  const deficitaires = moisActifs.filter((m) => m.entrees - m.depenses < 0);

  return (
    <div className="cc-stack">
      <section className="cc-card cc-toolbar">
        <label className="cc-mini-field">
          <span>Année</span>
          <select defaultValue={annee}>
            <option>{ANNEE_COURANTE}</option>
            <option>{ANNEE_COURANTE - 1}</option>
          </select>
        </label>
        <p className="cc-toolbar__hint">Récapitulatif annuel — {annee}</p>
      </section>

      <div className="cc-kpis cc-kpis--3">
        <article className="cc-card cc-kpi" style={{ borderTopColor: "#16a34a" }}>
          <p className="cc-kpi__label">Total Entrées {annee}</p>
          <p className="cc-kpi__value cc-pos">{formatNombre(TOTAL_ENTREES_ANNEE)} FCFA</p>
          <p className="cc-kpi__sub">{moisActifs.length} mois enregistrés</p>
        </article>
        <article className="cc-card cc-kpi" style={{ borderTopColor: "#dc2626" }}>
          <p className="cc-kpi__label">Total Dépenses {annee}</p>
          <p className="cc-kpi__value cc-neg">{formatNombre(TOTAL_DEPENSES_ANNEE)} FCFA</p>
          <p className="cc-kpi__sub">Sorties de caisse</p>
        </article>
        <article className="cc-card cc-kpi" style={{ borderTopColor: RESULTAT_NET_ANNEE >= 0 ? "#16a34a" : "#dc2626" }}>
          <p className="cc-kpi__label">Résultat Net {annee}</p>
          <p className={`cc-kpi__value ${RESULTAT_NET_ANNEE >= 0 ? "cc-pos" : "cc-neg"}`}>{formatSigne(RESULTAT_NET_ANNEE)} FCFA</p>
          <p className="cc-kpi__sub">{RESULTAT_NET_ANNEE >= 0 ? "Bénéficiaire" : "Déficitaire"}</p>
        </article>
      </div>

      <div className="cc-grid2">
        <div className="cc-insight cc-insight--good">
          <p className="cc-insight__label">🏆 Meilleur mois</p>
          <p className="cc-insight__value">{meilleur?.nom}</p>
          <p className="cc-insight__sub">Net {formatSigne((meilleur?.entrees ?? 0) - (meilleur?.depenses ?? 0))} FCFA</p>
        </div>
        <div className={`cc-insight ${deficitaires.length ? "cc-insight--bad" : "cc-insight--neutral"}`}>
          <p className="cc-insight__label">📉 Mois déficitaire(s)</p>
          <p className="cc-insight__value">
            {deficitaires.length === 0 ? "Aucun" : deficitaires.map((m) => m.abrev).join(", ")}
          </p>
          <p className="cc-insight__sub">
            {deficitaires.length === 0 ? "Tous les mois sont à l'équilibre ou bénéficiaires." : `${deficitaires.length} mois sous zéro`}
          </p>
        </div>
      </div>

      <section className="cc-card cc-panel">
        <header className="cc-panel__head">
          <h2 className="cc-panel__title cc-panel__title--sm">Détail mensuel</h2>
        </header>
        <div className="cc-table-wrap">
          <table className="cc-table cc-table--recap">
            <thead>
              <tr>
                <th>Mois</th>
                <th>Entrées</th>
                <th>Dépenses</th>
                <th className="cc-num">Net</th>
                <th className="cc-num">Solde fin</th>
              </tr>
            </thead>
            <tbody>
              {RECAP_2026.map((m) => {
                const net = m.entrees - m.depenses;
                const vide = m.entrees === 0 && m.depenses === 0;
                return (
                  <tr key={m.mois} className={`cc-row-hover${vide ? " cc-muted-row" : ""}`}>
                    <td className="cc-month">{m.abrev}</td>
                    <td>
                      <div className="cc-bar-cell">
                        <MiniBar value={m.entrees} max={maxFlux} color="#16a34a" />
                        <span className="cc-pos">{formatNombre(m.entrees)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cc-bar-cell">
                        <MiniBar value={m.depenses} max={maxFlux} color="#dc2626" />
                        <span className="cc-neg">{formatNombre(m.depenses)}</span>
                      </div>
                    </td>
                    <td className={`cc-num ${net >= 0 ? "cc-pos" : "cc-neg"}`}>{vide ? "—" : formatSigne(net)}</td>
                    <td className="cc-num cc-strong">{vide ? "—" : formatNombre(m.soldeFin)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="cc-total-row">
                <td>TOTAL</td>
                <td className="cc-pos">{formatNombre(TOTAL_ENTREES_ANNEE)}</td>
                <td className="cc-neg">{formatNombre(TOTAL_DEPENSES_ANNEE)}</td>
                <td className="cc-num cc-strong">{formatSigne(RESULTAT_NET_ANNEE)}</td>
                <td className="cc-num cc-strong">{formatNombre(RECAP_2026[5].soldeFin)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}