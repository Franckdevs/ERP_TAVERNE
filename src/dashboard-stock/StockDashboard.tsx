import { useMemo, useRef, useState } from "react";
import "./StockDashboard.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import StatCards from "./components/StatCards/StatCards";
import Inventory from "./components/Inventory/Inventory";
import NewItemModal from "./components/NewItemModal/NewItemModal";
import {
  ARTICLES,
  MOUVEMENTS,
  FOURNISSEURS,
  VIEW_META,
  ETAT_LABEL,
  etatArticle,
  labelCategorie,
  formatNombre,
  type Article,
  type CategorieSlug,
  type ViewId,
} from "./data";

/* --------------------------------------------------------------------------
   Vues secondaires (Mouvements / Alertes / Fournisseurs)
   -------------------------------------------------------------------------- */
function MovementsView() {
  return (
    <section className="stk-card">
      <header className="stk-card__head">
        <h2 className="stk-card__title">Derniers mouvements</h2>
        <p className="stk-card__sub">{MOUVEMENTS.length} opérations récentes</p>
      </header>
      <div className="stk-card__scroll">
        <table className="stk-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Réf.</th>
              <th>Produit</th>
              <th className="stk-table__num">Quantité</th>
              <th>Origine / Destination</th>
            </tr>
          </thead>
          <tbody>
            {MOUVEMENTS.map((m) => (
              <tr key={m.id}>
                <td className="stk-table__muted">{m.date}</td>
                <td>
                  <span className={`mv-type mv-type--${m.type}`}>
                    {m.type === "entree" ? "Entrée" : "Sortie"}
                  </span>
                </td>
                <td className="stk-table__ref">{m.reference}</td>
                <td className="stk-table__name">{m.produit}</td>
                <td
                  className={`stk-table__num mv-qty mv-qty--${m.type}`}
                >
                  {m.type === "entree" ? "+" : "−"}
                  {formatNombre(m.quantite)}
                </td>
                <td className="stk-table__muted">{m.acteur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AlertsView({ articles }: { articles: Article[] }) {
  const ordre = { rupture: 0, faible: 1, ok: 2 } as const;
  const aRisque = articles
    .filter((a) => etatArticle(a) !== "ok")
    .sort((x, y) => ordre[etatArticle(x)] - ordre[etatArticle(y)]);

  return (
    <section className="stk-card">
      <header className="stk-card__head">
        <h2 className="stk-card__title">Articles à réapprovisionner</h2>
        <p className="stk-card__sub">
          {aRisque.length} référence{aRisque.length > 1 ? "s" : ""} sous le seuil
        </p>
      </header>
      <div className="stk-card__scroll">
        <table className="stk-table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>Produit</th>
              <th>Catégorie</th>
              <th className="stk-table__num">Stock</th>
              <th className="stk-table__num">Seuil</th>
              <th className="stk-table__num">Manque</th>
              <th className="stk-table__center">État</th>
            </tr>
          </thead>
          <tbody>
            {aRisque.map((a) => {
              const etat = etatArticle(a);
              const manque = Math.max(0, a.seuil - a.quantite);
              return (
                <tr key={a.id}>
                  <td className="stk-table__ref">{a.reference}</td>
                  <td className="stk-table__name">{a.produit}</td>
                  <td className="stk-table__muted">
                    {labelCategorie(a.categorie)}
                  </td>
                  <td className="stk-table__num">{formatNombre(a.quantite)}</td>
                  <td className="stk-table__num stk-table__muted">
                    {formatNombre(a.seuil)}
                  </td>
                  <td className="stk-table__num mv-qty--sortie">
                    {formatNombre(manque)}
                  </td>
                  <td className="stk-table__center">
                    <span className={`inv__etat inv__etat--${etat}`}>
                      {ETAT_LABEL[etat]}
                    </span>
                  </td>
                </tr>
              );
            })}
            {aRisque.length === 0 && (
              <tr>
                <td className="stk-table__empty" colSpan={7}>
                  Aucune alerte : tous les stocks sont au-dessus du seuil. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SuppliersView() {
  return (
    <div className="sup-grid">
      {FOURNISSEURS.map((f) => (
        <article className="sup-card" key={f.id}>
          <div className="sup-card__top">
            <h3 className="sup-card__name">{f.nom}</h3>
            <span className="sup-card__badge">{f.articles} réf.</span>
          </div>
          <p className="sup-card__cat">{f.categorie}</p>
          <dl className="sup-card__meta">
            <div>
              <dt>Ville</dt>
              <dd>{f.ville}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{f.contact}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Tableau de bord — Espace Stock
   -------------------------------------------------------------------------- */
export default function StockDashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<ViewId>("stock");
  const [dark, setDark] = useState(false);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [query, setQuery] = useState("");
  const [categorie, setCategorie] = useState<CategorieSlug | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const nextId = useRef(ARTICLES.length + 1);

  const meta = VIEW_META[view];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const okCat = categorie === "all" || a.categorie === categorie;
      const okQuery =
        !q ||
        a.reference.toLowerCase().includes(q) ||
        a.produit.toLowerCase().includes(q);
      return okCat && okQuery;
    });
  }, [articles, query, categorie]);

  const addArticle = (draft: Omit<Article, "id">) => {
    setArticles((prev) => [{ ...draft, id: nextId.current++ }, ...prev]);
    setModalOpen(false);
    setView("stock");
  };

  return (
    <div className={`stk${dark ? " stk--dark" : ""}`}>
      <Sidebar active={view} onNavigate={setView} onLogout={onLogout} />

      <div className="stk__main">
        <Topbar
          title={meta.title}
          subtitle={meta.sub}
          query={query}
          onQuery={setQuery}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
        />

        <main className="stk__content">
          {view === "stock" && (
            <>
              <StatCards />
              <Inventory
                articles={filtered}
                categorie={categorie}
                onCategorie={setCategorie}
                onAdd={() => setModalOpen(true)}
              />
            </>
          )}

          {view === "mouvements" && <MovementsView />}
          {view === "alertes" && <AlertsView articles={articles} />}
          {view === "fournisseurs" && <SuppliersView />}
        </main>
      </div>

      {modalOpen && (
        <NewItemModal
          nextSeq={nextId.current}
          onClose={() => setModalOpen(false)}
          onAdd={addArticle}
        />
      )}
    </div>
  );
}