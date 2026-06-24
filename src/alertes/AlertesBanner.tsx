import { useMemo } from "react";
import { createPortal } from "react-dom";
import { Bell, AlertTriangle, X } from "../icons";
import {
  useAlertes,
  useNow,
  PRIORITES,
  rangPriorite,
  estDeclenchee,
  horodatage,
  libelleDate,
} from "./useAlertes";
import "./Alertes.css";

/* ===========================================================================
   Bannière d'alertes — flotte « partout sur le tableau de bord ».

   Affiche, en pile flottante (portail dans <body>, position fixe), toutes les
   alertes déclenchées et non acquittées de l'espace. Reste visible quelle que
   soit la vue active et la position de défilement. Chaque carte est colorée
   selon la priorité et peut être acquittée individuellement.
   --------------------------------------------------------------------------- */

export default function AlertesBanner({ scope }: { scope: string }) {
  const { alertes, acquitter, supprimer } = useAlertes(scope);
  const now = useNow();

  const actives = useMemo(
    () =>
      alertes
        .filter((a) => !a.vu && estDeclenchee(a, now))
        .sort((a, b) => {
          const r = rangPriorite[a.priorite] - rangPriorite[b.priorite];
          return r !== 0 ? r : horodatage(a) - horodatage(b);
        }),
    [alertes, now],
  );

  if (actives.length === 0) return null;

  return createPortal(
    <div className="alt-toaster" role="region" aria-label="Alertes en cours">
      {actives.map((a) => (
        <article key={a.id} className={`alt-toast alt-toast--${a.priorite}`} role="alert">
          <span className="alt-toast__icon">
            {a.priorite === "max" ? <AlertTriangle /> : <Bell />}
          </span>
          <div className="alt-toast__body">
            <span className="alt-toast__top">
              <span className={`alt-tag alt-tag--${a.priorite}`}>
                {PRIORITES.find((p) => p.id === a.priorite)?.label}
              </span>
              <span className="alt-toast__when">{libelleDate(a)} · {a.heure}</span>
            </span>
            <p className="alt-toast__titre">{a.titre}</p>
          </div>
          <div className="alt-toast__actions">
            <button
              type="button"
              className="alt-toast__btn"
              onClick={() => acquitter(a.id)}
            >
              J'ai vu
            </button>
            <button
              type="button"
              className="alt-toast__close"
              aria-label="Supprimer l'alerte"
              onClick={() => supprimer(a.id)}
            >
              <X />
            </button>
          </div>
        </article>
      ))}
    </div>,
    document.body,
  );
}
