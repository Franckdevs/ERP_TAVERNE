import "./NewItemModal.css";
import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "../../../icons";
import {
  CATEGORIES,
  categorieBySlug,
  type Article,
  type CategorieSlug,
} from "../../data";

type Props = {
  /** numéro de séquence suggéré pour la référence (ex. 17 → « MP-0017 ») */
  nextSeq: number;
  onClose: () => void;
  onAdd: (article: Omit<Article, "id">) => void;
};

const suggestRef = (categorie: CategorieSlug, seq: number) =>
  `${categorieBySlug(categorie)?.prefixe ?? "AR"}-${String(seq).padStart(4, "0")}`;

export default function NewItemModal({ nextSeq, onClose, onAdd }: Props) {
  const [categorie, setCategorie] = useState<CategorieSlug>("matiere-premiere");
  const [reference, setReference] = useState(suggestRef("matiere-premiere", nextSeq));
  const [produit, setProduit] = useState("");
  const [quantite, setQuantite] = useState("0");
  const [seuil, setSeuil] = useState("0");
  const [prix, setPrix] = useState("0");
  const [error, setError] = useState("");

  const onCategorie = (slug: CategorieSlug) => {
    setCategorie(slug);
    // resynchronise le préfixe de la référence si l'utilisateur ne l'a pas
    // personnalisée (on conserve seulement le numéro de séquence proposé).
    setReference(suggestRef(slug, nextSeq));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!produit.trim()) {
      setError("Le nom du produit est obligatoire.");
      return;
    }
    const q = Number(quantite);
    const s = Number(seuil);
    const p = Number(prix);
    if ([q, s, p].some((n) => Number.isNaN(n) || n < 0)) {
      setError("Quantité, seuil et prix doivent être des nombres positifs.");
      return;
    }
    onAdd({
      reference: reference.trim() || suggestRef(categorie, nextSeq),
      produit: produit.trim(),
      categorie,
      quantite: q,
      seuil: s,
      prixUnitaire: p,
    });
  };

  return (
    <div className="nim" role="dialog" aria-modal="true" aria-labelledby="nim-title">
      <div className="nim__overlay" onClick={onClose} />
      <div className="nim__panel">
        <header className="nim__head">
          <h2 className="nim__title" id="nim-title">
            Nouvel article
          </h2>
          <button
            type="button"
            className="nim__close"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X />
          </button>
        </header>

        <form className="nim__form" onSubmit={submit}>
          <label className="nim__field">
            <span className="nim__label">Catégorie</span>
            <select
              className="nim__input"
              value={categorie}
              onChange={(e) => onCategorie(e.target.value as CategorieSlug)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <div className="nim__row">
            <label className="nim__field">
              <span className="nim__label">Référence</span>
              <input
                className="nim__input"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </label>
            <label className="nim__field nim__field--grow">
              <span className="nim__label">Produit</span>
              <input
                className="nim__input"
                placeholder="Ex. Panneau MDF 18mm"
                value={produit}
                onChange={(e) => setProduit(e.target.value)}
                autoFocus
              />
            </label>
          </div>

          <div className="nim__row">
            <label className="nim__field">
              <span className="nim__label">Quantité</span>
              <input
                className="nim__input"
                type="number"
                min={0}
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
              />
            </label>
            <label className="nim__field">
              <span className="nim__label">Seuil d'alerte</span>
              <input
                className="nim__input"
                type="number"
                min={0}
                value={seuil}
                onChange={(e) => setSeuil(e.target.value)}
              />
            </label>
            <label className="nim__field">
              <span className="nim__label">Prix unit. (FCFA)</span>
              <input
                className="nim__input"
                type="number"
                min={0}
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="nim__error">{error}</p>}

          <div className="nim__actions">
            <button type="button" className="nim__btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="nim__btn nim__btn--primary">
              Ajouter l'article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}