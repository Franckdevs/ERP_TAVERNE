import { useEffect, useMemo, useState } from "react";
import type { ComponentType, FormEvent, SVGProps } from "react";
import { createPortal } from "react-dom";
import {
  AlarmClock,
  CalendarClock,
  Clock,
  Check,
  Trash2,
  Plus,
  X,
} from "../icons";
import "./RappelsMenu.css";

/* ===========================================================================
   Menu « Rappels » — commun à tous les espaces (admin, comptabilité, stock,
   assistanat, conseil, personnel).

   Composant autonome : il rend lui-même son bouton de menu (stylé pour épouser
   la sidebar hôte via `className`/`iconClassName`) et, au clic, ouvre une modale
   où l'on crée un rappel avec un **intitulé**, une **date** et une **heure**.
   Les rappels sont conservés dans le `localStorage`, séparés par espace (`scope`).
   --------------------------------------------------------------------------- */

export type Rappel = {
  id: string;
  titre: string;
  date: string; // AAAA-MM-JJ (input date)
  heure: string; // HH:MM (input time)
  fait: boolean;
};

type Props = {
  /** Identifiant de l'espace → clé de stockage distincte (ex. "admin"). */
  scope: string;
  /** Classe du bouton, pour épouser le style de la sidebar hôte. */
  className?: string;
  /** Classe de l'icône du bouton (selon la sidebar hôte). */
  iconClassName?: string;
  /** Libellé du menu (défaut : « Rappels »). */
  label?: string;
  /** Icône du bouton (défaut : réveil). */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

const KEY = (scope: string) => `taverne:rappels:${scope}`;

function charger(scope: string): Rappel[] {
  try {
    const brut = localStorage.getItem(KEY(scope));
    if (!brut) return [];
    const data = JSON.parse(brut);
    return Array.isArray(data) ? (data as Rappel[]) : [];
  } catch {
    return [];
  }
}

function enregistrer(scope: string, rappels: Rappel[]) {
  try {
    localStorage.setItem(KEY(scope), JSON.stringify(rappels));
  } catch {
    /* quota / mode privé — on ignore silencieusement */
  }
}

const nouvelId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `r${Date.now()}${Math.floor(Math.random() * 1e4)}`;

/** Date du jour au format AAAA-MM-JJ (heure locale). */
function aujourdhui(): string {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

/** Horodatage comparable « AAAA-MM-JJTHH:MM ». */
const clef = (r: Rappel) => `${r.date}T${r.heure || "00:00"}`;

/** Libellé relatif lisible (Aujourd'hui / Demain / date complète). */
function libelleDate(r: Rappel): string {
  const d = new Date(`${r.date}T${r.heure || "00:00"}`);
  if (Number.isNaN(d.getTime())) return r.date;
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const cible = new Date(r.date + "T00:00");
  const jours = Math.round((cible.getTime() - base.getTime()) / 86_400_000);
  if (jours === 0) return "Aujourd'hui";
  if (jours === 1) return "Demain";
  if (jours === -1) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: cible.getFullYear() === base.getFullYear() ? undefined : "numeric",
  });
}

function estEchu(r: Rappel): boolean {
  if (r.fait) return false;
  const d = new Date(`${r.date}T${r.heure || "00:00"}`);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}

export default function RappelsMenu({
  scope,
  className,
  iconClassName,
  label = "Rappels",
  icon: Icon = AlarmClock,
}: Props) {
  const [ouvert, setOuvert] = useState(false);
  const [rappels, setRappels] = useState<Rappel[]>(() => charger(scope));

  // Formulaire
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState(aujourdhui());
  const [heure, setHeure] = useState("09:00");

  // Persistance à chaque changement
  useEffect(() => {
    enregistrer(scope, rappels);
  }, [scope, rappels]);

  // Fermeture par Échap + blocage du défilement quand la modale est ouverte
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [ouvert]);

  const tries = useMemo(
    () => [...rappels].sort((a, b) => clef(a).localeCompare(clef(b))),
    [rappels],
  );
  const aVenir = tries.filter((r) => !r.fait).length;

  const ajouter = (e: FormEvent) => {
    e.preventDefault();
    const t = titre.trim();
    if (!t || !date || !heure) return;
    setRappels((prev) => [
      ...prev,
      { id: nouvelId(), titre: t, date, heure, fait: false },
    ]);
    setTitre("");
    setHeure("09:00");
    setDate(aujourdhui());
  };

  const basculer = (id: string) =>
    setRappels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, fait: !r.fait } : r)),
    );

  const supprimer = (id: string) =>
    setRappels((prev) => prev.filter((r) => r.id !== id));

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOuvert(true)}
        aria-haspopup="dialog"
      >
        <Icon className={iconClassName} />
        <span>{label}</span>
        {aVenir > 0 && <span className="rpl-badge">{aVenir}</span>}
      </button>

      {ouvert &&
        createPortal(
          <div
            className="rpl-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Rappels"
            onClick={() => setOuvert(false)}
          >
            <div className="rpl-panel" onClick={(e) => e.stopPropagation()}>
              <header className="rpl-head">
                <span className="rpl-head__icon">
                  <AlarmClock />
                </span>
                <div className="rpl-head__text">
                  <h2 className="rpl-head__title">Rappels</h2>
                  <p className="rpl-head__sub">
                    {aVenir > 0
                      ? `${aVenir} rappel${aVenir > 1 ? "s" : ""} à venir`
                      : "Aucun rappel à venir"}
                  </p>
                </div>
                <button
                  type="button"
                  className="rpl-close"
                  aria-label="Fermer"
                  onClick={() => setOuvert(false)}
                >
                  <X />
                </button>
              </header>

              <form className="rpl-form" onSubmit={ajouter}>
                <input
                  type="text"
                  className="rpl-input rpl-input--titre"
                  placeholder="Intitulé du rappel…"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  maxLength={120}
                />
                <div className="rpl-form__row">
                  <label className="rpl-field">
                    <CalendarClock className="rpl-field__icon" />
                    <input
                      type="date"
                      className="rpl-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      aria-label="Date du rappel"
                    />
                  </label>
                  <label className="rpl-field">
                    <Clock className="rpl-field__icon" />
                    <input
                      type="time"
                      className="rpl-input"
                      value={heure}
                      onChange={(e) => setHeure(e.target.value)}
                      aria-label="Heure du rappel"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rpl-add"
                    disabled={!titre.trim() || !date || !heure}
                  >
                    <Plus />
                    <span>Ajouter</span>
                  </button>
                </div>
              </form>

              <div className="rpl-list">
                {tries.length === 0 && (
                  <p className="rpl-empty">
                    Aucun rappel pour le moment. Ajoutez-en un ci-dessus.
                  </p>
                )}
                {tries.map((r) => (
                  <div
                    key={r.id}
                    className={`rpl-item${r.fait ? " is-done" : ""}${
                      estEchu(r) ? " is-late" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="rpl-check"
                      aria-label={r.fait ? "Marquer à faire" : "Marquer comme fait"}
                      onClick={() => basculer(r.id)}
                    >
                      {r.fait && <Check />}
                    </button>
                    <div className="rpl-item__text">
                      <span className="rpl-item__titre">{r.titre}</span>
                      <span className="rpl-item__when">
                        <CalendarClock />
                        {libelleDate(r)}
                        <span className="rpl-item__heure">
                          <Clock />
                          {r.heure}
                        </span>
                        {estEchu(r) && <span className="rpl-late">En retard</span>}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="rpl-del"
                      aria-label="Supprimer le rappel"
                      onClick={() => supprimer(r.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
