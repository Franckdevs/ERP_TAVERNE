import "./LogoutConfirm.css";
import { useEffect } from "react";
import { LogOut } from "../icons";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/* Modal de confirmation de déconnexion — partagé par tous les espaces. */
export default function LogoutConfirm({ open, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="lc__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lc-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="lc">
        <span className="lc__icon">
          <LogOut />
        </span>
        <h2 id="lc-title" className="lc__title">
          Déconnexion
        </h2>
        <p className="lc__text">
          Voulez-vous vraiment vous déconnecter de votre espace&nbsp;?
        </p>
        <div className="lc__actions">
          <button type="button" className="lc__btn lc__btn--ghost" onClick={onCancel}>
            Annuler
          </button>
          <button
            type="button"
            className="lc__btn lc__btn--primary"
            onClick={onConfirm}
            autoFocus
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
