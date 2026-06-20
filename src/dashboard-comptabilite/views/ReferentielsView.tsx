import { useMemo, useState } from "react";
import {
  CATEGORIES,
  EMOJI_PALETTE,
  LIBELLES_SEED,
  POSTES_SEED,
  type Categorie,
} from "../data";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  ChevronDownIcon,
  SearchIcon,
} from "../icons";
import { Overlay, ConfirmDialog } from "./BrouillardView";
import { Pagination } from "./DashboardView";

/* ==========================================================================
   Catégories & sous-catégories
   ========================================================================== */
let scId = 1;
export function CategoriesView() {
  const [cats, setCats] = useState<Categorie[]>(() =>
    CATEGORIES.map((c) => ({ ...c, sousCategories: [...c.sousCategories] }))
  );
  const [open, setOpen] = useState<string | null>(CATEGORIES[0]?.slug ?? null);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftEmoji, setDraftEmoji] = useState("📋");
  const [newSub, setNewSub] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [confirm, setConfirm] = useState<{ kind: "cat" | "sub"; slug: string; sub?: string } | null>(null);

  const startEdit = (c: Categorie) => {
    setEditSlug(c.slug);
    setDraftLabel(c.label);
    setDraftEmoji(c.emoji);
  };
  const saveEdit = (slug: string) => {
    setCats((prev) => prev.map((c) => (c.slug === slug ? { ...c, label: draftLabel.trim() || c.label, emoji: draftEmoji } : c)));
    setEditSlug(null);
  };
  const addSub = (slug: string) => {
    const val = (newSub[slug] ?? "").trim();
    if (!val) return;
    setCats((prev) => prev.map((c) => (c.slug === slug ? { ...c, sousCategories: [...c.sousCategories, val] } : c)));
    setNewSub((p) => ({ ...p, [slug]: "" }));
  };
  const removeSub = (slug: string, sub: string) => {
    setCats((prev) => prev.map((c) => (c.slug === slug ? { ...c, sousCategories: c.sousCategories.filter((s) => s !== sub) } : c)));
    setConfirm(null);
  };
  const removeCat = (slug: string) => {
    setCats((prev) => prev.filter((c) => c.slug !== slug));
    setConfirm(null);
  };
  const addCat = (emoji: string, label: string) => {
    const slug = `cat-${scId++}`;
    setCats((prev) => [...prev, { emoji, label, slug, couleur: "#9ca3af", sousCategories: [] }]);
    setCreating(false);
    setOpen(slug);
  };

  return (
    <div className="cc-stack">
      <section className="cc-card cc-toolbar">
        <p className="cc-toolbar__hint">{cats.length} catégories · {cats.reduce((s, c) => s + c.sousCategories.length, 0)} sous-catégories</p>
        <button type="button" className="cc-btn cc-btn--primary" onClick={() => setCreating(true)}>
          <PlusIcon /> Nouvelle catégorie
        </button>
      </section>

      <div className="cc-accordion">
        {cats.map((c) => {
          const isOpen = open === c.slug;
          const isEdit = editSlug === c.slug;
          return (
            <article key={c.slug} className="cc-card cc-acc">
              <header className="cc-acc__head">
                {isEdit ? (
                  <div className="cc-acc__edit">
                    <div className="cc-emoji-palette">
                      {EMOJI_PALETTE.map((e) => (
                        <button key={e} type="button" className={`cc-emoji${draftEmoji === e ? " is-active" : ""}`} onClick={() => setDraftEmoji(e)}>{e}</button>
                      ))}
                    </div>
                    <input className="cc-control" value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} />
                    <button type="button" className="cc-icon-btn cc-icon-btn--ok" onClick={() => saveEdit(c.slug)}><CheckIcon /></button>
                    <button type="button" className="cc-icon-btn" onClick={() => setEditSlug(null)}><XIcon /></button>
                  </div>
                ) : (
                  <>
                    <button type="button" className="cc-acc__toggle" onClick={() => setOpen(isOpen ? null : c.slug)}>
                      <span className="cc-acc__emoji">{c.emoji}</span>
                      <span className="cc-acc__label">{c.label}</span>
                      <span className="cc-acc__count">{c.sousCategories.length}</span>
                      <ChevronDownIcon className={`cc-acc__chev${isOpen ? " is-open" : ""}`} />
                    </button>
                    <div className="cc-acc__actions">
                      <button type="button" className="cc-icon-btn" onClick={() => startEdit(c)}><PencilIcon /></button>
                      <button type="button" className="cc-icon-btn cc-icon-btn--danger" onClick={() => setConfirm({ kind: "cat", slug: c.slug })}><TrashIcon /></button>
                    </div>
                  </>
                )}
              </header>

              {isOpen && !isEdit && (
                <div className="cc-acc__body">
                  <ol className="cc-subcat-list">
                    {c.sousCategories.map((s, i) => (
                      <li key={s}>
                        <span className="cc-subcat-num">{i + 1}</span>
                        <span>{s}</span>
                        <button type="button" className="cc-icon-btn cc-icon-btn--danger cc-icon-btn--xs" onClick={() => setConfirm({ kind: "sub", slug: c.slug, sub: s })}><TrashIcon /></button>
                      </li>
                    ))}
                    {c.sousCategories.length === 0 && <li className="cc-empty cc-empty--sm">Aucune sous-catégorie.</li>}
                  </ol>
                  <div className="cc-subcat-add">
                    <input
                      className="cc-control"
                      placeholder="Nouvelle sous-catégorie"
                      value={newSub[c.slug] ?? ""}
                      onChange={(e) => setNewSub((p) => ({ ...p, [c.slug]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && addSub(c.slug)}
                    />
                    <button type="button" className="cc-btn cc-btn--ghost" onClick={() => addSub(c.slug)}><PlusIcon /> Ajouter</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {creating && <NewCategorieModal onClose={() => setCreating(false)} onSave={addCat} />}
      {confirm && (
        <ConfirmDialog
          onCancel={() => setConfirm(null)}
          onConfirm={() => (confirm.kind === "cat" ? removeCat(confirm.slug) : removeSub(confirm.slug, confirm.sub!))}
          message={confirm.kind === "cat" ? "Supprimer cette catégorie et toutes ses sous-catégories ?" : "Supprimer cette sous-catégorie ?"}
        />
      )}
    </div>
  );
}

function NewCategorieModal({ onClose, onSave }: { onClose: () => void; onSave: (emoji: string, label: string) => void }) {
  const [emoji, setEmoji] = useState("📋");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  return (
    <Overlay title="Nouvelle catégorie" onClose={onClose} small>
      <div className="cc-form">
        <span className="cc-field"><span>Emoji</span></span>
        <div className="cc-emoji-palette">
          {EMOJI_PALETTE.map((e) => (
            <button key={e} type="button" className={`cc-emoji${emoji === e ? " is-active" : ""}`} onClick={() => setEmoji(e)}>{e}</button>
          ))}
        </div>
        <label className="cc-field">
          <span>Nom de la catégorie</span>
          <input className="cc-control" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus placeholder="Ex : Maintenance" />
        </label>
        {error && <p className="cc-error">{error}</p>}
        <div className="cc-form__foot">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onClose}>Annuler</button>
          <button type="button" className="cc-btn cc-btn--primary" onClick={() => (label.trim() ? onSave(emoji, label.trim()) : setError("Indiquez un nom."))}>Créer</button>
        </div>
      </div>
    </Overlay>
  );
}

/* ==========================================================================
   CRUD simple (Libellés / Postes)
   ========================================================================== */
function SimpleCrud({ titre, singulier, seed }: { titre: string; singulier: string; seed: string[] }) {
  const [items, setItems] = useState<string[]>(seed);
  const [recherche, setRecherche] = useState("");
  const [nouveau, setNouveau] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  const filtres = useMemo(
    () => items.map((v, i) => ({ v, i })).filter((x) => x.v.toLowerCase().includes(recherche.toLowerCase())),
    [items, recherche]
  );
  const PAGE = 10;
  const pageItems = filtres.slice(page * PAGE, page * PAGE + PAGE);

  const add = () => {
    const val = nouveau.trim();
    if (!val) return setError(`Saisissez un ${singulier}.`);
    if (items.some((x) => x.toLowerCase() === val.toLowerCase())) return setError("Cet élément existe déjà.");
    setItems((p) => [...p, val]);
    setNouveau("");
    setError("");
  };
  const save = (idx: number) => {
    const val = draft.trim();
    if (!val) return;
    setItems((p) => p.map((x, i) => (i === idx ? val : x)));
    setEditIdx(null);
  };
  const remove = (idx: number) => {
    setItems((p) => p.filter((_, i) => i !== idx));
    setConfirmIdx(null);
  };

  return (
    <div className="cc-stack">
      <section className="cc-card cc-toolbar cc-toolbar--col">
        <div className="cc-crud-add">
          <input
            className="cc-control"
            placeholder={`Ajouter un ${singulier}…`}
            value={nouveau}
            onChange={(e) => { setNouveau(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button type="button" className="cc-btn cc-btn--primary" onClick={add}><PlusIcon /> Ajouter</button>
        </div>
        {error && <p className="cc-error">{error}</p>}
      </section>

      <section className="cc-card cc-panel">
        <header className="cc-panel__head">
          <h2 className="cc-panel__title cc-panel__title--sm">{titre}</h2>
          <label className="cc-search cc-search--inline">
            <SearchIcon />
            <input type="search" placeholder="Rechercher…" value={recherche} onChange={(e) => { setRecherche(e.target.value); setPage(0); }} />
          </label>
        </header>

        <ul className="cc-crud-list">
          {pageItems.map(({ v, i }) => (
            <li key={i} className="cc-crud-row">
              <span className="cc-crud-num">{i + 1}</span>
              {editIdx === i ? (
                <>
                  <input className="cc-control" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save(i)} autoFocus />
                  <button type="button" className="cc-icon-btn cc-icon-btn--ok" onClick={() => save(i)}><CheckIcon /></button>
                  <button type="button" className="cc-icon-btn" onClick={() => setEditIdx(null)}><XIcon /></button>
                </>
              ) : (
                <>
                  <span className="cc-crud-label">{v}</span>
                  <button type="button" className="cc-icon-btn" onClick={() => { setEditIdx(i); setDraft(v); }}><PencilIcon /></button>
                  <button type="button" className="cc-icon-btn cc-icon-btn--danger" onClick={() => setConfirmIdx(i)}><TrashIcon /></button>
                </>
              )}
            </li>
          ))}
          {pageItems.length === 0 && <li className="cc-empty">Aucun résultat.</li>}
        </ul>
        <Pagination page={page} total={filtres.length} perPage={PAGE} onPage={setPage} />
      </section>

      {confirmIdx !== null && (
        <ConfirmDialog
          onCancel={() => setConfirmIdx(null)}
          onConfirm={() => remove(confirmIdx)}
          message={`Supprimer « ${items[confirmIdx]} » ?`}
        />
      )}
    </div>
  );
}

export function LibellesView() {
  return <SimpleCrud titre="Libellés enregistrés" singulier="libellé" seed={LIBELLES_SEED} />;
}

export function PostesView() {
  return <SimpleCrud titre="Postes (métiers)" singulier="poste" seed={POSTES_SEED} />;
}