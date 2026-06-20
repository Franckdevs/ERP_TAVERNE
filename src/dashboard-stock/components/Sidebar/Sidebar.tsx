import "./Sidebar.css";
import { House, LogOut } from "../../../icons";
import { NAV, USER, type ViewId } from "../../data";

type Props = {
  active: ViewId;
  onNavigate: (id: ViewId) => void;
  onLogout?: () => void;
};

export default function Sidebar({ active, onNavigate, onLogout }: Props) {
  return (
    <aside className="stk-sb">
      <div className="stk-sb__brand">
        <span className="stk-sb__brand-mark">
          <House />
        </span>
        <span className="stk-sb__brand-text">
          <span className="stk-sb__brand-name">Taverne</span>
          <span className="stk-sb__brand-sub">Espace Stock</span>
        </span>
      </div>

      <nav className="stk-sb__nav">
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            className={`stk-sb__item ${active === id ? "is-active" : ""}`}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? "page" : undefined}
          >
            <Icon className="stk-sb__item-icon" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="stk-sb__footer">
        <div className="stk-sb__user">
          <span className="stk-sb__avatar">{USER.initiales}</span>
          <span className="stk-sb__user-text">
            <span className="stk-sb__user-name">{USER.nom}</span>
            <span className="stk-sb__user-mail">{USER.poste}</span>
          </span>
        </div>
        <button
          type="button"
          className="stk-sb__logout"
          aria-label="Déconnexion"
          onClick={onLogout}
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
