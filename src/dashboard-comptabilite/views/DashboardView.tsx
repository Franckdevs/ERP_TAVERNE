import { useMemo, useState } from "react";
import type { Navigate } from "../types";
import {
  ANNEE_COURANTE,
  MOIS_COURT,
  MOIS_LONG,
  MOIS_COURANT,
  RECAP_2026,
  REPARTITION_JUIN,
  TOTAL_REPARTITION,
  TRANSACTIONS_JUIN,
  TOTAL_ENTREES_ANNEE,
  TOTAL_DEPENSES_ANNEE,
  RESULTAT_NET_ANNEE,
  NB_TRANSACTIONS_ANNEE,
  NB_MOIS_ENREGISTRES,
  SOLDE_ACTUEL,
  formatFCFA,
  formatNombre,
  formatSigne,
  estSoldeReporte,
  isoDate,
} from "../data";
import { Donut, GroupedBars, AreaCurve } from "../charts";
import {
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChartIcon,
  PieIcon,
  ArrowRightIcon,
  SearchIcon,
  FlagIcon,
} from "../icons";

/* --- Cartes KPI ---------------------------------------------------------- */
type Kpi = {
  accent: string;
  label: string;
  value: string;
  sub: string;
  icon: typeof WalletIcon;
  iconTone: "blue" | "green" | "red";
};

export default function DashboardView({ navigate }: { navigate: Navigate }) {
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [rechMois, setRechMois] = useState("");
  const [rechTx, setRechTx] = useState("");
  const [pageMois, setPageMois] = useState(0);
  const [pageTx, setPageTx] = useState(0);

  const moisNom = MOIS_LONG[MOIS_COURANT - 1];

  const kpis: Kpi[] = [
    {
      accent: "#3b82f6",
      label: `Solde actuel — ${moisNom}`,
      value: `${formatNombre(SOLDE_ACTUEL)} FCFA`,
      sub: "Caisse courante",
      icon: WalletIcon,
      iconTone: "blue",
    },
    {
      accent: "#16a34a",
      label: `Total entrées ${ANNEE_COURANTE}`,
      value: `${formatNombre(TOTAL_ENTREES_ANNEE)} FCFA`,
      sub: `${NB_MOIS_ENREGISTRES} mois enregistrés`,
      icon: TrendingUpIcon,
      iconTone: "green",
    },
    {
      accent: "#dc2626",
      label: `Total dépenses ${ANNEE_COURANTE}`,
      value: `${formatNombre(TOTAL_DEPENSES_ANNEE)} FCFA`,
      sub: `${formatNombre(NB_TRANSACTIONS_ANNEE)} transactions`,
      icon: TrendingDownIcon,
      iconTone: "red",
    },
    {
      accent: "#16a34a",
      label: `Résultat net ${ANNEE_COURANTE}`,
      value: `${formatSigne(RESULTAT_NET_ANNEE)} FCFA`,
      sub: RESULTAT_NET_ANNEE >= 0 ? "Bénéficiaire" : "Déficitaire",
      icon: BarChartIcon,
      iconTone: RESULTAT_NET_ANNEE >= 0 ? "green" : "red",
    },
  ];

  /* données graphiques */
  const labels = MOIS_COURT;
  const entrees = RECAP_2026.map((m) => m.entrees);
  const depenses = RECAP_2026.map((m) => m.depenses);
  const soldes = RECAP_2026.map((m) => m.soldeFin);

  /* Bilan par mois (mois enregistrés) */
  const moisAvecData = RECAP_2026.filter((m) => m.entrees > 0 || m.depenses > 0);
  const moisFiltres = moisAvecData.filter((m) =>
    m.nom.toLowerCase().includes(rechMois.toLowerCase())
  );
  const PAGE = 6;
  const moisPage = moisFiltres.slice(pageMois * PAGE, pageMois * PAGE + PAGE);

  /* Transactions récentes (Juin), filtrées par recherche + période */
  const txFiltrees = useMemo(() => {
    return TRANSACTIONS_JUIN.filter((t) => !estSoldeReporte(t))
      .filter((t) => t.reference.toLowerCase().includes(rechTx.toLowerCase()))
      .filter((t) => {
        if (!du && !au) return true;
        const d = isoDate(t.date);
        if (du && d < du) return false;
        if (au && d > au) return false;
        return true;
      })
      .slice()
      .reverse();
  }, [rechTx, du, au]);
  const PAGE_TX = 10;
  const txPage = txFiltrees.slice(pageTx * PAGE_TX, pageTx * PAGE_TX + PAGE_TX);

  return (
    <div className="cc-stack">
      {/* --- Filtre période --- */}
      <section className="cc-card cc-period">
        <span className="cc-period__label">Période :</span>
        <label className="cc-period__field">
          <span>Du</span>
          <input type="date" value={du} onChange={(e) => setDu(e.target.value)} />
        </label>
        <label className="cc-period__field">
          <span>Au</span>
          <input type="date" value={au} onChange={(e) => setAu(e.target.value)} />
        </label>
        {(du || au) && (
          <button
            type="button"
            className="cc-btn cc-btn--ghost cc-period__reset"
            onClick={() => {
              setDu("");
              setAu("");
            }}
          >
            Réinitialiser
          </button>
        )}
      </section>

      {/* --- KPIs --- */}
      <div className="cc-kpis">
        {kpis.map((k) => (
          <article
            key={k.label}
            className="cc-card cc-kpi"
            style={{ borderTopColor: k.accent }}
          >
            <header className="cc-kpi__head">
              <p className="cc-kpi__label">{k.label}</p>
              <span className={`cc-kpi__icon cc-kpi__icon--${k.iconTone}`}>
                <k.icon />
              </span>
            </header>
            <p className="cc-kpi__value">{k.value}</p>
            <p className="cc-kpi__sub">{k.sub}</p>
          </article>
        ))}
      </div>

      {/* --- Graphiques --- */}
      <div className="cc-grid2">
        <section className="cc-card cc-panel">
          <header className="cc-panel__head cc-panel__head--bar">
            <div>
              <h2 className="cc-panel__title">Entrées vs Dépenses</h2>
              <p className="cc-panel__sub">{ANNEE_COURANTE}</p>
            </div>
          </header>
          <GroupedBars labels={labels} entrees={entrees} depenses={depenses} />
          <div className="cc-legend">
            <span className="cc-legend__item"><i style={{ background: "#dc2626" }} /> Dépenses</span>
            <span className="cc-legend__item"><i style={{ background: "#16a34a" }} /> Entrées</span>
          </div>
        </section>

        <section className="cc-card cc-panel">
          <header className="cc-panel__head cc-panel__head--bar">
            <div>
              <h2 className="cc-panel__title">Évolution du Solde</h2>
              <p className="cc-panel__sub">{ANNEE_COURANTE} — fin de chaque mois</p>
            </div>
          </header>
          <AreaCurve labels={labels} values={soldes} />
        </section>
      </div>

      {/* --- Répartition des dépenses --- */}
      <section className="cc-card cc-panel">
        <header className="cc-panel__head cc-panel__head--bar">
          <div>
            <h2 className="cc-panel__title">Répartition des dépenses</h2>
            <p className="cc-panel__sub">
              {moisNom} {ANNEE_COURANTE} — {REPARTITION_JUIN.length} catégories
            </p>
          </div>
          <button
            type="button"
            className="cc-link"
            onClick={() => navigate("repartition")}
          >
            <PieIcon /> Voir détail <ArrowRightIcon />
          </button>
        </header>

        <div className="cc-repart">
          <div className="cc-repart__donut">
            <Donut data={REPARTITION_JUIN.map((r) => ({ value: r.montant, color: r.couleur }))} />
          </div>
          <ul className="cc-repart__list">
            {REPARTITION_JUIN.map((r) => {
              const pct = (r.montant / TOTAL_REPARTITION) * 100;
              return (
                <li key={r.slug} className="cc-repart__row">
                  <span className="cc-repart__emoji">{r.emoji}</span>
                  <div className="cc-repart__body">
                    <div className="cc-repart__line">
                      <span className="cc-repart__name">{r.label}</span>
                      <span className="cc-repart__amount">
                        {formatFCFA(r.montant)} · {r.operations} op
                      </span>
                    </div>
                    <span className="cc-repart__bar">
                      <span
                        className="cc-repart__fill"
                        style={{ width: `${pct}%`, background: r.couleur }}
                      />
                    </span>
                  </div>
                  <span className="cc-repart__pct">{pct.toFixed(1)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* --- Bilan par mois + Transactions --- */}
      <div className="cc-grid2">
        <section className="cc-card cc-panel">
          <header className="cc-panel__head">
            <h2 className="cc-panel__title cc-panel__title--sm">Bilan par mois</h2>
            <label className="cc-search cc-search--inline">
              <SearchIcon />
              <input
                type="search"
                placeholder="Rechercher un mois…"
                value={rechMois}
                onChange={(e) => {
                  setRechMois(e.target.value);
                  setPageMois(0);
                }}
              />
            </label>
            <button type="button" className="cc-link cc-link--sm" onClick={() => navigate("recap")}>
              Voir tout <ArrowRightIcon />
            </button>
          </header>

          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th className="cc-num">Entrées</th>
                  <th className="cc-num">Dépenses</th>
                  <th className="cc-num">Solde fin</th>
                  <th>Accès</th>
                </tr>
              </thead>
              <tbody>
                {moisPage.map((m) => (
                  <tr key={m.mois} className="cc-row-hover">
                    <td className="cc-month">{m.abrev}</td>
                    <td className="cc-num cc-pos">{formatNombre(m.entrees)}</td>
                    <td className="cc-num cc-neg">{formatNombre(m.depenses)}</td>
                    <td className="cc-num cc-strong">{formatNombre(m.soldeFin)}</td>
                    <td>
                      <button type="button" className="cc-link cc-link--sm" onClick={() => navigate("brouillard")}>
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={pageMois}
            total={moisFiltres.length}
            perPage={PAGE}
            onPage={setPageMois}
          />
        </section>

        <section className="cc-card cc-panel">
          <header className="cc-panel__head">
            <div>
              <h2 className="cc-panel__title cc-panel__title--sm">Transactions</h2>
              <p className="cc-panel__sub">{ANNEE_COURANTE}</p>
            </div>
          </header>
          <label className="cc-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Rechercher un libellé…"
              value={rechTx}
              onChange={(e) => {
                setRechTx(e.target.value);
                setPageTx(0);
              }}
            />
          </label>

          <ul className="cc-tx-list">
            {txPage.map((t) => {
              const montant = t.entree - t.depense;
              return (
                <li key={t.id} className={`cc-tx${t.isApproCaisse ? " is-appro" : ""}`}>
                  <div className="cc-tx__text">
                    <span className="cc-tx__name">
                      {t.isApproCaisse && <FlagIcon className="cc-tx__flag" />}
                      {t.reference}
                    </span>
                    <span className="cc-tx__meta">
                      {t.date} · {MOIS_LONG[MOIS_COURANT - 1]}
                    </span>
                  </div>
                  <span className={`cc-tx__amount ${montant >= 0 ? "cc-pos" : "cc-neg"}`}>
                    {formatSigne(montant)}
                  </span>
                </li>
              );
            })}
            {txPage.length === 0 && (
              <li className="cc-empty">Aucune transaction.</li>
            )}
          </ul>
          <Pagination
            page={pageTx}
            total={txFiltrees.length}
            perPage={PAGE_TX}
            onPage={setPageTx}
          />
        </section>
      </div>
    </div>
  );
}

/* --- Pagination réutilisable --------------------------------------------- */
export function Pagination({
  page,
  total,
  perPage,
  onPage,
}: {
  page: number;
  total: number;
  perPage: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) {
    return (
      <p className="cc-pagination__info">
        {total === 0 ? "0 résultat" : `1–${total} sur ${total}`}
      </p>
    );
  }
  const from = page * perPage + 1;
  const to = Math.min((page + 1) * perPage, total);
  return (
    <div className="cc-pagination">
      <span className="cc-pagination__info">
        {from}–{to} sur {total}
      </span>
      <div className="cc-pagination__btns">
        <button
          type="button"
          className="cc-btn cc-btn--ghost"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
        >
          Précédent
        </button>
        <button
          type="button"
          className="cc-btn cc-btn--ghost"
          disabled={page >= pages - 1}
          onClick={() => onPage(page + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}