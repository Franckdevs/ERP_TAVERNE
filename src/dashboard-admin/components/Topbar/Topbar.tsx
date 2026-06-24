import "./Topbar.css";
import { Search, Moon } from "../../../icons";
import AlertesMenu from "../../../alertes/AlertesMenu";

export default function Topbar() {
  return (
    <header className="tb">
      <div className="tb__heading">
        <h1 className="tb__title">Tableau de bord</h1>
        <p className="tb__subtitle">Vue d'ensemble de l'activité Taverne</p>
      </div>

      <label className="tb__search">
        <Search />
        <input
          type="search"
          placeholder="Rechercher projets, clients, factures…"
          aria-label="Rechercher"
        />
      </label>

      <div className="tb__actions">
        <button type="button" className="tb__icon-btn" aria-label="Thème">
          <Moon />
        </button>
        <AlertesMenu scope="admin" className="tb__icon-btn" variant="icon" />
        <span className="tb__avatar">AD</span>
      </div>
    </header>
  );
}
