import "./Topbar.css";
import { Search, Moon, Sun, Bell } from "../../../icons";
import { USER } from "../../data";

type Props = {
  title: string;
  subtitle: string;
  query: string;
  onQuery: (value: string) => void;
  dark: boolean;
  onToggleDark: () => void;
};

export default function Topbar({
  title,
  subtitle,
  query,
  onQuery,
  dark,
  onToggleDark,
}: Props) {
  return (
    <header className="stk-tb">
      <div className="stk-tb__heading">
        <h1 className="stk-tb__title">{title}</h1>
        <p className="stk-tb__subtitle">{subtitle}</p>
      </div>

      <label className="stk-tb__search">
        <Search />
        <input
          type="search"
          placeholder="Rechercher projets, clients, factures…"
          aria-label="Rechercher"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </label>

      <div className="stk-tb__actions">
        <button
          type="button"
          className="stk-tb__icon-btn"
          aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
          onClick={onToggleDark}
        >
          {dark ? <Sun /> : <Moon />}
        </button>
        <button
          type="button"
          className="stk-tb__icon-btn stk-tb__icon-btn--dot"
          aria-label="Notifications"
        >
          <Bell />
        </button>
        <span className="stk-tb__avatar">{USER.initiales}</span>
      </div>
    </header>
  );
}