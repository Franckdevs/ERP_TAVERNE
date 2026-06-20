import "./Inventory.css";
import { Plus } from "../../../icons";
import {
  CATEGORIES,
  ETAT_LABEL,
  etatArticle,
  labelCategorie,
  formatNombre,
  type Article,
  type CategorieSlug,
} from "../../data";

type Props = {
  articles: Article[];
  categorie: CategorieSlug | "all";
  onCategorie: (c: CategorieSlug | "all") => void;
  onAdd: () => void;
};

export default function Inventory({
  articles,
  categorie,
  onCategorie,
  onAdd,
}: Props) {
  return (
    <section className="inv">
      <header className="inv__head">
        <h2 className="inv__title">Inventaire</h2>
        <button type="button" className="inv__add" onClick={onAdd}>
          <Plus />
          Nouvel article
        </button>
      </header>

      <div className="inv__filters">
        <button
          type="button"
          className={`inv__chip ${categorie === "all" ? "is-active" : ""}`}
          onClick={() => onCategorie("all")}
        >
          Tout
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`inv__chip ${categorie === c.slug ? "is-active" : ""}`}
            onClick={() => onCategorie(c.slug)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="inv__scroll">
        <table className="inv__table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>Produit</th>
              <th>Catégorie</th>
              <th className="inv__num">Quantité</th>
              <th className="inv__num">Seuil</th>
              <th className="inv__center">État</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => {
              const etat = etatArticle(a);
              return (
                <tr key={a.id}>
                  <td className="inv__ref">{a.reference}</td>
                  <td className="inv__name">{a.produit}</td>
                  <td className="inv__cat">{labelCategorie(a.categorie)}</td>
                  <td className="inv__num inv__qty">{formatNombre(a.quantite)}</td>
                  <td className="inv__num inv__seuil">{formatNombre(a.seuil)}</td>
                  <td className="inv__center">
                    <span className={`inv__etat inv__etat--${etat}`}>
                      {ETAT_LABEL[etat]}
                    </span>
                  </td>
                </tr>
              );
            })}

            {articles.length === 0 && (
              <tr>
                <td className="inv__empty" colSpan={6}>
                  Aucun article ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}