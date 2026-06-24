import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  CalendarClock,
  Clock,
  Check,
  Trash2,
  Plus,
  X,
  AlertTriangle,
} from "../icons";
import {
  useAlertes,
  useNow,
  PRIORITES,
  rangPriorite,
  aujourdhui,
  estDeclenchee,
  horodatage,
  libelleDate,
  type Priorite,
} from "./useAlertes";
import "./Alertes.css";

/* ===========================================================================
   Menu « Alertes » — bouton (cloche) + modale de gestion.

   On y planifie une alerte avec un intitulé, une date, une heure et une
   priorité (Maximale / Moyenne / Basse). Quand la date arrive, l'alerte est
   déclenchée : elle apparaît partout sur le tableau de bord (voir
   AlertesBanner) et incrémente le compteur de la cloche.
   --------------------------------------------------------------------------- */

type Props = {
  /** Identifiant de l'espace → clé de stockage distincte (ex. "comptabilite"). */
  scope: string;
  /** Classe du bouton déclencheur (pour épouser le style hôte). */
  className?: string;
  /** Classe de l'icône du bouton. */
  iconClassName?: string;
  /** "icon" : cloche + pastille (topbar) · "item" : cloche + label + badge (sidebar). */
  variant?: "icon" | "item";
  /** Libellé en variante "item" (défaut : « Alertes »). */
  label?: string;
};

export default function AlertesMenu({
  scope,
  className,
  iconClassName,
  variant = "icon",
  label = "Alertes",
}: Props) {
  const { alertes, ajouter, supprimer, acquitter, reactiver } = useAlertes(scope);
  const now = useNow();
  const [ouvert, setOuvert] = useState(false);

  // Formulaire
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState(aujourdhui());
  const [heure, setHeure] = useState("09:00");
  const [priorite, setPriorite] = useState<Priorite>("moyenne");

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
    () =>
      [...alertes].sort((a, b) => {
        const da = estDeclenchee(a, now) && !a.vu ? 0 : 1;
        const db = estDeclenchee(b, now) && !b.vu ? 0 : 1;
        if (da !== db) return da - db; // alertes en cours en tête
        return horodatage(a) - horodatage(b);
      }),
    [alertes, now],
  );

  // Alertes en cours (déclenchées, non acquittées) → compteur de la cloche
  const enCours = useMemo(
    () => alertes.filter((a) => !a.vu && estDeclenchee(a, now)),
    [alertes, now],
  );
  const pirePriorite = useMemo<Priorite | null>(() => {
    if (enCours.length === 0) return null;
    return enCours.reduce<Priorite>(
      (p, a) => (rangPriorite[a.priorite] < rangPriorite[p] ? a.priorite : p),
      "basse",
    );
  }, [enCours]);

  const ajouterAlerte = (e: FormEvent) => {
    e.preventDefault();
    const t = titre.trim();
    if (!t || !date) return;
    ajouter({ titre: t, date, heure: heure || "00:00", priorite });
    setTitre("");
    setDate(aujourdhui());
    setHeure("09:00");
    setPriorite("moyenne");
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOuvert(true)}
        aria-haspopup="dialog"
        aria-label={`Alertes${enCours.length ? ` — ${enCours.length} en cours` : ""}`}
      >
        <Bell className={iconClassName} />
        {variant === "item" && <span>{label}</span>}
        {enCours.length > 0 &&
          (variant === "item" ? (
            <span className={`alt-badge alt-badge--${pirePriorite}`}>{enCours.length}</span>
          ) : (
            <span className={`alt-count alt-count--${pirePriorite}`}>{enCours.length}</span>
          ))}
      </button>

      {ouvert &&
        createPortal(
          <div
            className="alt-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Alertes"
            onClick={() => setOuvert(false)}
          >
            <div className="alt-panel" onClick={(e) => e.stopPropagation()}>
              <header className="alt-head">
                <span className="alt-head__icon">
                  <Bell />
                </span>
                <div className="alt-head__text">
                  <h2 className="alt-head__title">Alertes</h2>
                  <p className="alt-head__sub">
                    {enCours.length > 0
                      ? `${enCours.length} alerte${enCours.length > 1 ? "s" : ""} en cours`
                      : "Aucune alerte en cours"}
                  </p>
                </div>
                <button
                  type="button"
                  className="alt-close"
                  aria-label="Fermer"
                  onClick={() => setOuvert(false)}
                >
                  <X />
                </button>
              </header>

              <form className="alt-form" onSubmit={ajouterAlerte}>
                <input
                  type="text"
                  className="alt-input alt-input--titre"
                  placeholder="Intitulé de l'alerte…"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  maxLength={140}
                />
                <div className="alt-form__row">
                  <label className="alt-field">
                    <CalendarClock className="alt-field__icon" />
                    <input
                      type="date"
                      className="alt-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      aria-label="Date de l'alerte"
                    />
                  </label>
                  <label className="alt-field">
                    <Clock className="alt-field__icon" />
                    <input
                      type="time"
                      className="alt-input"
                      value={heure}
                      onChange={(e) => setHeure(e.target.value)}
                      aria-label="Heure de l'alerte"
                    />
                  </label>
                </div>

                <div className="alt-prio" role="radiogroup" aria-label="Priorité">
                  <span className="alt-prio__legend">Priorité</span>
                  <div className="alt-prio__opts">
                    {PRIORITES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={priorite === p.id}
                        className={`alt-prio__opt alt-prio__opt--${p.id}${
                          priorite === p.id ? " is-active" : ""
                        }`}
                        onClick={() => setPriorite(p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="alt-add" disabled={!titre.trim() || !date}>
                  <Plus />
                  <span>Planifier l'alerte</span>
                </button>
              </form>

              <div className="alt-list">
                {tries.length === 0 && (
                  <p className="alt-empty">
                    Aucune alerte planifiée. Ajoutez-en une ci-dessus : vous serez prévenu
                    partout sur le tableau de bord lorsque sa date arrivera.
                  </p>
                )}
                {tries.map((a) => {
                  const active = !a.vu && estDeclenchee(a, now);
                  return (
                    <div
                      key={a.id}
                      className={`alt-item alt-item--${a.priorite}${active ? " is-active" : ""}${
                        a.vu ? " is-seen" : ""
                      }`}
                    >
                      <span className={`alt-dot alt-dot--${a.priorite}`} aria-hidden="true" />
                      <div className="alt-item__text">
                        <span className="alt-item__titre">{a.titre}</span>
                        <span className="alt-item__when">
                          <CalendarClock />
                          {libelleDate(a)}
                          <span className="alt-item__heure">
                            <Clock />
                            {a.heure}
                          </span>
                          <span className={`alt-tag alt-tag--${a.priorite}`}>
                            {PRIORITES.find((p) => p.id === a.priorite)?.court}
                          </span>
                          {active && (
                            <span className="alt-state alt-state--on">
                              <AlertTriangle /> En cours
                            </span>
                          )}
                          {a.vu && <span className="alt-state alt-state--seen">Acquittée</span>}
                        </span>
                      </div>
                      <div className="alt-item__actions">
                        {active && (
                          <button
                            type="button"
                            className="alt-ack"
                            aria-label="Acquitter l'alerte"
                            title="Acquitter"
                            onClick={() => acquitter(a.id)}
                          >
                            <Check />
                          </button>
                        )}
                        {a.vu && (
                          <button
                            type="button"
                            className="alt-reactivate"
                            aria-label="Réactiver l'alerte"
                            title="Réactiver"
                            onClick={() => reactiver(a.id)}
                          >
                            <Bell />
                          </button>
                        )}
                        <button
                          type="button"
                          className="alt-del"
                          aria-label="Supprimer l'alerte"
                          onClick={() => supprimer(a.id)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
