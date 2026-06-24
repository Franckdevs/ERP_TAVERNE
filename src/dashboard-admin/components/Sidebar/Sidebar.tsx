import "./Sidebar.css";
import { useState } from "react";
import { House, LogOut } from "../../../icons";
import { NAV } from "../../data";
import RappelsMenu from "../../../rappels/RappelsMenu";

export default function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const [active, setActive] = useState("Tableau de bord");

  return (
    <aside className="sb">
      <div className="sb__brand">
        <span className="sb__brand-mark">
          <House />
        </span>
        <span className="sb__brand-text">
          <span className="sb__brand-name">Taverne</span>
          <span className="sb__brand-sub">Administration centrale</span>
        </span>
      </div>

      <nav className="sb__nav">
        {NAV.map((group) => (
          <div className="sb__group" key={group.title}>
            <p className="sb__group-title">{group.title}</p>
            {group.items.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className={`sb__item ${active === label ? "is-active" : ""}`}
                onClick={() => setActive(label)}
              >
                <Icon className="sb__item-icon" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="sb__group">
          <p className="sb__group-title">Outils</p>
          <RappelsMenu
            scope="admin"
            className="sb__item"
            iconClassName="sb__item-icon"
          />
        </div>
      </nav>

      <div className="sb__footer">
        <div className="sb__user">
          <span className="sb__avatar">AD</span>
          <span className="sb__user-text">
            <span className="sb__user-name">Admin Direction</span>
            <span className="sb__user-mail">admin@taverne.ci</span>
          </span>
        </div>
        <button
          type="button"
          className="sb__logout"
          aria-label="Déconnexion"
          onClick={onLogout}
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
