import { useMemo, useState, type ReactNode } from "react";
import {
  ANNEE_COURANTE,
  MOIS_LONG,
  MOIS_COURANT,
  CATEGORIES,
  LIBELLES_SEED,
  PROJETS,
  SOLDE_INITIAL_JUIN,
  TRANSACTIONS_JUIN,
  categorieBySlug,
  computeSoldes,
  statsBrouillard,
  estSoldeReporte,
  formatNombre,
  formatSigne,
  type Transaction,
} from "../data";
import { Donut } from "../charts";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  DownloadIcon,
  UploadIcon,
  FlagIcon,
} from "../icons";

type Draft = {
  date: string;
  reference: string;
  entree: string;
  depense: string;
  isApproCaisse: boolean;
  projetId: string;
  categorie: string;
  sousCategorie: string;
};

const emptyDraft = (): Draft => ({
  date: "",
  reference: "",
  entree: "",
  depense: "",
  isApproCaisse: false,
  projetId: "",
  categorie: "",
  sousCategorie: "",
});

let nextId = 10_000;

export default function BrouillardView() {
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS_JUIN);
  const [tab, setTab] = useState<"tx" | "cat">("tx");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft());
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [flash, setFlash] = useState("");

  const lignes = useMemo(
    () => computeSoldes(SOLDE_INITIAL_JUIN, transactions),
    [transactions]
  );
  const stats = useMemo(() => statsBrouillard(transactions), [transactions]);

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(""), 3200);
  };

  /* --- Ajout --- */
  const addTransaction = (d: Draft) => {
    const t: Transaction = {
      id: nextId++,
      date: d.date || `19/06/${ANNEE_COURANTE}`,
      reference: d.reference.trim() || "SANS LIBELLÉ",
      entree: Number(d.entree) || 0,
      depense: Number(d.depense) || 0,
      isApproCaisse: d.isApproCaisse,
      projetId: d.projetId ? Number(d.projetId) : null,
      categorie: d.categorie,
      sousCategorie: d.sousCategorie,
    };
    setTransactions((prev) => [...prev, t]);
    setModalOpen(false);
    showFlash("Transaction ajoutée.");
  };

  /* --- Édition inline --- */
  const startEdit = (t: Transaction) => {
    setEditId(t.id);
    setEditDraft({
      date: t.date,
      reference: t.reference,
      entree: t.entree ? String(t.entree) : "",
      depense: t.depense ? String(t.depense) : "",
      isApproCaisse: t.isApproCaisse,
      projetId: t.projetId ? String(t.projetId) : "",
      categorie: t.categorie,
      sousCategorie: t.sousCategorie,
    });
  };
  const saveEdit = () => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editId
          ? {
              ...t,
              date: editDraft.date,
              reference: editDraft.reference,
              entree: Number(editDraft.entree) || 0,
              depense: Number(editDraft.depense) || 0,
              isApproCaisse: editDraft.isApproCaisse,
              projetId: editDraft.projetId ? Number(editDraft.projetId) : null,
              categorie: editDraft.categorie,
              sousCategorie: editDraft.sousCategorie,
            }
          : t
      )
    );
    setEditId(null);
    showFlash("Transaction modifiée.");
  };
  const removeTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setConfirmId(null);
    showFlash("Transaction supprimée.");
  };

  return (
    <div className="cc-stack">
      {flash && <div className="cc-flash">{flash}</div>}

      {/* --- Barre d'outils --- */}
      <section className="cc-card cc-toolbar">
        <div className="cc-toolbar__selects">
          <label className="cc-mini-field">
            <span>Année</span>
            <select defaultValue={ANNEE_COURANTE}>
              <option>{ANNEE_COURANTE}</option>
              <option>{ANNEE_COURANTE - 1}</option>
            </select>
          </label>
          <label className="cc-mini-field">
            <span>Mois</span>
            <select defaultValue={MOIS_COURANT}>
              {MOIS_LONG.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="cc-toolbar__actions">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={() => showFlash("Template Excel téléchargé (démo).")}>
            <DownloadIcon /> Template
          </button>
          <button type="button" className="cc-btn cc-btn--ghost" onClick={() => showFlash("Import CSV/XLSX (démo) — données fictives.")}>
            <UploadIcon /> Importer
          </button>
          <button type="button" className="cc-btn cc-btn--ghost" onClick={() => showFlash("Export .xlsx généré (démo).")}>
            <DownloadIcon /> Export Excel
          </button>
          <button type="button" className="cc-btn cc-btn--primary" onClick={() => setModalOpen(true)}>
            <PlusIcon /> Ajouter
          </button>
        </div>
      </section>

      {/* --- Stats --- */}
      <div className="cc-kpis cc-kpis--4">
        <StatBox label="Total Entrées" value={`${formatNombre(stats.totalEntrees)} FCFA`} tone="green" />
        <StatBox label="Total Dépenses" value={`${formatNombre(stats.totalDepenses)} FCFA`} tone="red" />
        <StatBox label="Solde net" value={`${formatSigne(stats.soldeNet)} FCFA`} tone={stats.soldeNet >= 0 ? "green" : "red"} />
        <StatBox label="Transactions" value={String(stats.nbTransactions)} tone="brown" />
      </div>

      {/* --- Onglets --- */}
      <div className="cc-tabs">
        <button type="button" className={`cc-tab${tab === "tx" ? " is-active" : ""}`} onClick={() => setTab("tx")}>
          Transactions
        </button>
        <button type="button" className={`cc-tab${tab === "cat" ? " is-active" : ""}`} onClick={() => setTab("cat")}>
          Dépenses par catégories
        </button>
      </div>

      {tab === "tx" ? (
        <section className="cc-card cc-panel">
          <div className="cc-table-wrap">
            <table className="cc-table cc-table--brouillard">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Référence</th>
                  <th className="cc-num">Entrée</th>
                  <th className="cc-num">Dépense</th>
                  <th className="cc-num">Solde</th>
                  <th className="cc-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* ligne d'ouverture */}
                <tr className="cc-opening">
                  <td>01/0{MOIS_COURANT}/{ANNEE_COURANTE}</td>
                  <td>SOLDE INITIAL</td>
                  <td className="cc-num">—</td>
                  <td className="cc-num">—</td>
                  <td className="cc-num cc-strong">{formatNombre(SOLDE_INITIAL_JUIN)}</td>
                  <td />
                </tr>

                {lignes.map((l) =>
                  editId === l.id ? (
                    <tr key={l.id} className="cc-editing">
                      <td>
                        <input className="cc-inline" value={editDraft.date} onChange={(e) => setEditDraft({ ...editDraft, date: e.target.value })} placeholder="JJ/MM/AAAA" />
                      </td>
                      <td>
                        <input className="cc-inline" value={editDraft.reference} onChange={(e) => setEditDraft({ ...editDraft, reference: e.target.value })} />
                      </td>
                      <td className="cc-num">
                        <input className="cc-inline cc-inline--num" inputMode="numeric" value={editDraft.entree} onChange={(e) => setEditDraft({ ...editDraft, entree: e.target.value.replace(/\D/g, "") })} />
                      </td>
                      <td className="cc-num">
                        <input className="cc-inline cc-inline--num" inputMode="numeric" value={editDraft.depense} onChange={(e) => setEditDraft({ ...editDraft, depense: e.target.value.replace(/\D/g, "") })} />
                      </td>
                      <td className="cc-num cc-muted">{formatNombre(l.solde)}</td>
                      <td className="cc-actions-col">
                        <button type="button" className="cc-icon-btn cc-icon-btn--ok" onClick={saveEdit} aria-label="Enregistrer"><CheckIcon /></button>
                        <button type="button" className="cc-icon-btn" onClick={() => setEditId(null)} aria-label="Annuler"><XIcon /></button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={l.id} className={`cc-row-hover${estSoldeReporte(l) ? " cc-reporte" : ""}`}>
                      <td>{l.date}</td>
                      <td className={l.isApproCaisse ? "cc-appro" : ""}>
                        {l.isApproCaisse && <FlagIcon className="cc-tx__flag" />}
                        {l.reference}
                        {l.categorie && (
                          <span className="cc-cat-chip">
                            {categorieBySlug(l.categorie)?.emoji} {categorieBySlug(l.categorie)?.label}
                          </span>
                        )}
                      </td>
                      <td className="cc-num cc-pos">{l.entree ? formatNombre(l.entree) : "—"}</td>
                      <td className="cc-num cc-neg">{l.depense ? formatNombre(l.depense) : "—"}</td>
                      <td className="cc-num cc-strong">{formatNombre(l.solde)}</td>
                      <td className="cc-actions-col">
                        <button type="button" className="cc-icon-btn" onClick={() => startEdit(l)} aria-label="Modifier"><PencilIcon /></button>
                        <button type="button" className="cc-icon-btn cc-icon-btn--danger" onClick={() => setConfirmId(l.id)} aria-label="Supprimer"><TrashIcon /></button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
              <tfoot>
                <tr className="cc-total-row">
                  <td colSpan={2}>TOTAL</td>
                  <td className="cc-num cc-pos">{formatNombre(stats.totalEntrees)}</td>
                  <td className="cc-num cc-neg">{formatNombre(stats.totalDepenses)}</td>
                  <td className="cc-num cc-strong">{formatNombre(lignes.length ? lignes[lignes.length - 1].solde : SOLDE_INITIAL_JUIN)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      ) : (
        <CategoriesTab transactions={transactions} />
      )}

      {/* --- Modal ajout --- */}
      {modalOpen && (
        <TransactionModal
          onClose={() => setModalOpen(false)}
          onSave={addTransaction}
        />
      )}

      {/* --- Confirmation suppression --- */}
      {confirmId !== null && (
        <ConfirmDialog
          onCancel={() => setConfirmId(null)}
          onConfirm={() => removeTransaction(confirmId)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
function StatBox({ label, value, tone }: { label: string; value: string; tone: "green" | "red" | "brown" }) {
  return (
    <article className={`cc-card cc-stat cc-stat--${tone}`}>
      <p className="cc-stat__label">{label}</p>
      <p className="cc-stat__value">{value}</p>
    </article>
  );
}

/* --- Onglet « Dépenses par catégories » ---------------------------------- */
function CategoriesTab({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const map = new Map<string, { montant: number; count: number }>();
    let aCategoriser = 0;
    for (const t of transactions) {
      if (t.depense <= 0) continue;
      if (!t.categorie) {
        aCategoriser += t.depense;
        continue;
      }
      const e = map.get(t.categorie) ?? { montant: 0, count: 0 };
      e.montant += t.depense;
      e.count += 1;
      map.set(t.categorie, e);
    }
    const rows = [...map.entries()]
      .map(([slug, v]) => {
        const cat = categorieBySlug(slug);
        return {
          slug,
          emoji: cat?.emoji ?? "📁",
          label: cat?.label ?? slug,
          couleur: cat?.couleur ?? "#9ca3af",
          ...v,
        };
      })
      .sort((a, b) => b.montant - a.montant);
    const total = rows.reduce((s, r) => s + r.montant, 0);
    return { rows, total, aCategoriser };
  }, [transactions]);

  if (data.rows.length === 0) {
    return (
      <section className="cc-card cc-panel">
        <p className="cc-empty">Aucune dépense catégorisée pour ce mois.</p>
      </section>
    );
  }

  return (
    <section className="cc-card cc-panel">
      <div className="cc-repart">
        <div className="cc-repart__donut">
          <Donut data={data.rows.map((r) => ({ value: r.montant, color: r.couleur }))} />
        </div>
        <ul className="cc-repart__list">
          {data.rows.map((r) => {
            const pct = (r.montant / data.total) * 100;
            return (
              <li key={r.slug} className="cc-repart__row">
                <span className="cc-repart__emoji">{r.emoji}</span>
                <div className="cc-repart__body">
                  <div className="cc-repart__line">
                    <span className="cc-repart__name">{r.label}</span>
                    <span className="cc-repart__amount">{formatNombre(r.montant)} FCFA · {r.count} op</span>
                  </div>
                  <span className="cc-repart__bar">
                    <span className="cc-repart__fill" style={{ width: `${pct}%`, background: r.couleur }} />
                  </span>
                </div>
                <span className="cc-repart__pct">{pct.toFixed(1)}%</span>
              </li>
            );
          })}
        </ul>
      </div>
      {data.aCategoriser > 0 && (
        <p className="cc-acat">
          ⚠️ À catégoriser : <strong>{formatNombre(data.aCategoriser)} FCFA</strong> de dépenses sans catégorie.
        </p>
      )}
    </section>
  );
}

/* --- Modal d'ajout de transaction ---------------------------------------- */
function TransactionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (d: Draft) => void;
}) {
  const [d, setD] = useState<Draft>(emptyDraft());
  const [showSug, setShowSug] = useState(false);
  const [error, setError] = useState("");

  const sugg = LIBELLES_SEED.filter(
    (l) => d.reference && l.toLowerCase().includes(d.reference.toLowerCase())
  ).slice(0, 6);

  const cat = CATEGORIES.find((c) => c.slug === d.categorie);

  const submit = () => {
    if (!d.reference.trim()) {
      setError("Indiquez une référence / un libellé.");
      return;
    }
    if (!Number(d.entree) && !Number(d.depense)) {
      setError("Saisissez une entrée ou une dépense.");
      return;
    }
    onSave(d);
  };

  return (
    <Overlay onClose={onClose} title="Ajouter une transaction">
      <div className="cc-form">
        <div className="cc-form__cols">
          <label className="cc-field">
            <span>Date</span>
            <input
              className="cc-control"
              placeholder="JJ/MM/AAAA"
              value={d.date}
              onChange={(e) => setD({ ...d, date: e.target.value })}
            />
          </label>
          <label className="cc-field cc-field--auto">
            <span>Référence / Libellé</span>
            <input
              className="cc-control"
              value={d.reference}
              onChange={(e) => {
                setD({ ...d, reference: e.target.value });
                setShowSug(true);
              }}
              onFocus={() => setShowSug(true)}
              placeholder="Ex : ACHAT QUINCAILLERIE"
              autoFocus
            />
            {showSug && sugg.length > 0 && (
              <ul className="cc-suggest">
                {sugg.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setD({ ...d, reference: s });
                        setShowSug(false);
                      }}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </label>
        </div>

        <div className="cc-form__cols">
          <label className="cc-field">
            <span>Entrée (FCFA)</span>
            <input className="cc-control" inputMode="numeric" value={d.entree} onChange={(e) => setD({ ...d, entree: e.target.value.replace(/\D/g, "") })} placeholder="0" />
          </label>
          <label className="cc-field">
            <span>Dépense (FCFA)</span>
            <input className="cc-control" inputMode="numeric" value={d.depense} onChange={(e) => setD({ ...d, depense: e.target.value.replace(/\D/g, "") })} placeholder="0" />
          </label>
        </div>

        <div className="cc-form__cols">
          <label className="cc-field">
            <span>Catégorie</span>
            <select
              className="cc-control"
              value={d.categorie}
              onChange={(e) => setD({ ...d, categorie: e.target.value, sousCategorie: "" })}
            >
              <option value="">— Aucune —</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </label>
          <label className="cc-field">
            <span>Sous-catégorie</span>
            <select
              className="cc-control"
              value={d.sousCategorie}
              onChange={(e) => setD({ ...d, sousCategorie: e.target.value })}
              disabled={!cat}
            >
              <option value="">— Aucune —</option>
              {cat?.sousCategories.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="cc-field">
          <span>Projet rattaché</span>
          <select className="cc-control" value={d.projetId} onChange={(e) => setD({ ...d, projetId: e.target.value })}>
            <option value="">— Aucun —</option>
            {PROJETS.map((p) => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </label>

        <label className="cc-check cc-check--appro">
          <input type="checkbox" checked={d.isApproCaisse} onChange={(e) => setD({ ...d, isApproCaisse: e.target.checked })} />
          <span>Appro caisse / à revoir</span>
        </label>

        {error && <p className="cc-error">{error}</p>}

        <div className="cc-form__foot">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onClose}>Annuler</button>
          <button type="button" className="cc-btn cc-btn--primary" onClick={submit}>Ajouter</button>
        </div>
      </div>
    </Overlay>
  );
}

/* --- Dialog de confirmation ---------------------------------------------- */
export function ConfirmDialog({
  onCancel,
  onConfirm,
  message = "Supprimer cette transaction ? Cette action est définitive.",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}) {
  return (
    <Overlay onClose={onCancel} title="Confirmer la suppression" small>
      <p className="cc-confirm__msg">{message}</p>
      <div className="cc-form__foot">
        <button type="button" className="cc-btn cc-btn--ghost" onClick={onCancel}>Annuler</button>
        <button type="button" className="cc-btn cc-btn--danger" onClick={onConfirm}>Supprimer</button>
      </div>
    </Overlay>
  );
}

/* --- Overlay générique --------------------------------------------------- */
export function Overlay({
  title,
  children,
  onClose,
  small,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  small?: boolean;
}) {
  return (
    <div
      className="cc-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`cc-modal${small ? " cc-modal--sm" : ""}`}>
        <header className="cc-modal__head">
          <h2 className="cc-modal__title">{title}</h2>
          <button type="button" className="cc-icon-btn" onClick={onClose} aria-label="Fermer"><XIcon /></button>
        </header>
        <div className="cc-modal__body">{children}</div>
      </div>
    </div>
  );
}