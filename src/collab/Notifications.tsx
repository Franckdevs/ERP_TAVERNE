import "./Notifications.css";
import {
  AlertTriangle,
  FileText,
  MessageCircle,
  Calendar,
  TrendingUp,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Alert, AlertType } from "./collabData";

type Props = {
  alerts: Alert[];
  onClose: () => void;
  onToggleRead: (id: number) => void;
  onMarkAllRead: () => void;
};

const META: Record<AlertType, { icon: LucideIcon; color: string; bg: string }> = {
  stock: { icon: AlertTriangle, color: "#b5791b", bg: "#fbefd6" },
  facture: { icon: FileText, color: "#8b4513", bg: "#f3e7d8" },
  message: { icon: MessageCircle, color: "#2f8f4e", bg: "#e7f4ec" },
  rdv: { icon: Calendar, color: "#4a6da7", bg: "#e6edf7" },
  objectif: { icon: TrendingUp, color: "#2f8f4e", bg: "#e7f4ec" },
  client: { icon: UserPlus, color: "#6b3fa0", bg: "#efe7f7" },
};

export default function Notifications({ alerts, onClose, onToggleRead, onMarkAllRead }: Props) {
  const unread = alerts.filter((a) => !a.read).length;

  return (
    <div className="notif" role="dialog" aria-label="Alertes">
      <header className="notif__head">
        <div>
          <h2 className="notif__title">Alertes</h2>
          <p className="notif__sub">
            {unread > 0 ? `${unread} non lue${unread > 1 ? "s" : ""}` : "Tout est à jour"}
          </p>
        </div>
        <button type="button" className="notif__close" onClick={onClose} aria-label="Fermer">
          <X />
        </button>
      </header>

      {unread > 0 && (
        <button type="button" className="notif__mark" onClick={onMarkAllRead}>
          Tout marquer comme lu
        </button>
      )}

      <ul className="notif__list">
        {alerts.map((a) => {
          const m = META[a.type];
          const Icon = m.icon;
          return (
            <li key={a.id}>
              <button
                type="button"
                className={`alert ${a.read ? "" : "is-unread"}`}
                onClick={() => onToggleRead(a.id)}
              >
                <span className="alert__icon" style={{ color: m.color, backgroundColor: m.bg }}>
                  <Icon />
                </span>
                <span className="alert__body">
                  <span className="alert__title">{a.title}</span>
                  <span className="alert__desc">{a.desc}</span>
                  <span className="alert__time">{a.time}</span>
                </span>
                {!a.read && <span className="alert__dot" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}