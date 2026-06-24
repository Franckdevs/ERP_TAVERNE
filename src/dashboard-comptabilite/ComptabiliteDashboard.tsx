import { useState } from "react";
import "./ComptabiliteDashboard.css";
import type { ComptaView } from "./types";
import { ANNEE_COURANTE, MOIS_LONG, MOIS_COURANT } from "./data";
import {
  DashboardIcon,
  JournalIcon,
  TagIcon,
  GridIcon,
  BookIcon,
  IdCardIcon,
  CalendarIcon,
  PieIcon,
  WalletIcon,
  BarChartIcon,
  ChevronDownIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
  LogOutIcon,
  HouseIcon,
  SettingsIcon,
} from "./icons";
import DashboardView from "./views/DashboardView";
import BrouillardView from "./views/BrouillardView";
import RepartitionView from "./views/RepartitionView";
import RecapView from "./views/RecapView";
import ProjetsView from "./views/ProjetsView";
import { CategoriesView, LibellesView, PostesView } from "./views/ReferentielsView";
import ParametresView from "./views/ParametresView";
import RappelsMenu from "../rappels/RappelsMenu";
import AlertesMenu from "../alertes/AlertesMenu";
import AlertesBanner from "../alertes/AlertesBanner";

/* --- Navigation latérale (groupes repliables / menus déroulants) --------- */
type Leaf = { id: ComptaView; label: string; icon: typeof DashboardIcon };
type Group = { label: string; icon: typeof DashboardIcon; children: Leaf[] };
type Entry = Leaf | Group;

const isGroup = (e: Entry): e is Group => "children" in e;

const NAV: Entry[] = [
  { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
  {
    label: "Caisse",
    icon: WalletIcon,
    children: [
      { id: "brouillard", label: "Brouillard", icon: JournalIcon },
      { id: "libelles", label: "Libellés", icon: TagIcon },
      { id: "categories", label: "Catégories", icon: GridIcon },
    ],
  },
  {
    label: "Projets",
    icon: BookIcon,
    children: [
      { id: "projets", label: "Projets", icon: BookIcon },
      { id: "postes", label: "Postes", icon: IdCardIcon },
    ],
  },
  {
    label: "Rapports",
    icon: BarChartIcon,
    children: [
      { id: "recap", label: "Récapitulatif", icon: CalendarIcon },
      { id: "repartition", label: "Répartition dépenses", icon: PieIcon },
    ],
  },
];

const META: Record<ComptaView, { title: string; sub: string }> = {
  dashboard: { title: "Tableau de bord", sub: `Brouillard de Caisse La Taverne — ${ANNEE_COURANTE} • ${MOIS_LONG[MOIS_COURANT - 1]}` },
  brouillard: { title: "Brouillard de caisse", sub: `${MOIS_LONG[MOIS_COURANT - 1]} ${ANNEE_COURANTE} — solde courant cumulatif` },
  libelles: { title: "Libellés", sub: "Références fréquentes du brouillard" },
  categories: { title: "Catégories", sub: "Catégories et sous-catégories de dépenses" },
  projets: { title: "Projets", sub: "Suivi budgétaire des chantiers" },
  postes: { title: "Postes", sub: "Métiers des ouvriers" },
  recap: { title: "Récapitulatif annuel", sub: `${ANNEE_COURANTE} — bilan mois par mois` },
  repartition: { title: "Répartition des dépenses", sub: `Par catégorie — ${MOIS_LONG[MOIS_COURANT - 1]} ${ANNEE_COURANTE}` },
  parametres: { title: "Paramètres généraux", sub: "Identité, exercice, caisse et préférences de l'espace" },
};

/* Groupe ouvert par défaut : celui qui contient la vue active */
const groupOf = (view: ComptaView) =>
  NAV.find((e): e is Group => isGroup(e) && e.children.some((c) => c.id === view))?.label;

export default function ComptabiliteDashboard({ onLogout }: { onLogout?: () => void }) {
  const [view, setView] = useState<ComptaView>("dashboard");
  const [dark, setDark] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [open, setOpen] = useState<string[]>(["Caisse"]);
  const [query, setQuery] = useState("");

  const navigate = (v: ComptaView) => {
    setView(v);
    setDrawer(false);
    const g = groupOf(v);
    if (g && !open.includes(g)) setOpen((o) => [...o, g]);
  };
  const toggleGroup = (label: string) =>
    setOpen((o) => (o.includes(label) ? o.filter((l) => l !== label) : [...o, label]));

  const meta = META[view];

  return (
    <div className={`cc${dark ? " cc--dark" : ""}`}>
      <AlertesBanner scope="comptabilite" />
      {drawer && <div className="cc-backdrop" onClick={() => setDrawer(false)} />}

      {/* --- Sidebar --- */}
      <aside className={`cc-sb${drawer ? " is-open" : ""}`}>
        <div className="cc-sb__brand">
          <span className="cc-sb__brand-mark"><HouseIcon /></span>
          <span className="cc-sb__brand-text">
            <span className="cc-sb__brand-name">Taverne</span>
            <span className="cc-sb__brand-sub">Espace Comptabilité</span>
          </span>
        </div>

        <nav className="cc-sb__nav">
          {NAV.map((entry) => {
            if (!isGroup(entry)) {
              return (
                <button
                  key={entry.id}
                  type="button"
                  className={`cc-sb__item${view === entry.id ? " is-active" : ""}`}
                  onClick={() => navigate(entry.id)}
                  aria-current={view === entry.id ? "page" : undefined}
                >
                  <entry.icon className="cc-sb__item-icon" />
                  <span>{entry.label}</span>
                </button>
              );
            }
            const isOpen = open.includes(entry.label);
            const hasActive = entry.children.some((c) => c.id === view);
            return (
              <div className="cc-sb__group" key={entry.label}>
                <button
                  type="button"
                  className={`cc-sb__head${hasActive ? " has-active" : ""}`}
                  onClick={() => toggleGroup(entry.label)}
                  aria-expanded={isOpen}
                >
                  <entry.icon className="cc-sb__item-icon" />
                  <span>{entry.label}</span>
                  <ChevronDownIcon className={`cc-sb__chev${isOpen ? " is-open" : ""}`} />
                </button>
                {isOpen && (
                  <div className="cc-sb__panel">
                    {entry.children.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`cc-sb__item cc-sb__item--sub${view === c.id ? " is-active" : ""}`}
                        onClick={() => navigate(c.id)}
                        aria-current={view === c.id ? "page" : undefined}
                      >
                        <c.icon className="cc-sb__item-icon" />
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <RappelsMenu
            scope="comptabilite"
            className="cc-sb__item"
            iconClassName="cc-sb__item-icon"
          />

          <button
            type="button"
            className={`cc-sb__item${view === "parametres" ? " is-active" : ""}`}
            onClick={() => navigate("parametres")}
            aria-current={view === "parametres" ? "page" : undefined}
          >
            <SettingsIcon className="cc-sb__item-icon" />
            <span>Paramètres généraux</span>
          </button>
        </nav>

        <div className="cc-sb__footer">
          <div className="cc-sb__user">
            <span className="cc-sb__avatar">BS</span>
            <span className="cc-sb__user-text">
              <span className="cc-sb__user-name">Bamba Ange Sarah</span>
              <span className="cc-sb__user-mail">Comptabilité</span>
            </span>
          </div>
          <button type="button" className="cc-sb__logout" aria-label="Déconnexion" onClick={onLogout}>
            <LogOutIcon />
          </button>
        </div>
      </aside>

      {/* --- Zone principale --- */}
      <div className="cc-main">
        <header className="cc-tb">
          <button type="button" className="cc-burger" aria-label="Menu" onClick={() => setDrawer(true)}>
            <span /><span /><span />
          </button>
          <div className="cc-tb__heading">
            <h1 className="cc-tb__title">{meta.title}</h1>
            <p className="cc-tb__subtitle">{meta.sub}</p>
          </div>

          <label className="cc-tb__search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Rechercher une transaction, un projet…"
              aria-label="Rechercher"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <div className="cc-tb__actions">
            <button
              type="button"
              className="cc-tb__icon-btn"
              aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <AlertesMenu scope="comptabilite" className="cc-tb__icon-btn" variant="icon" />
            <span className="cc-tb__avatar">BS</span>
          </div>
        </header>

        <main className="cc-content">
          {view === "dashboard" && <DashboardView navigate={navigate} />}
          {view === "brouillard" && <BrouillardView />}
          {view === "repartition" && <RepartitionView />}
          {view === "recap" && <RecapView />}
          {view === "projets" && <ProjetsView />}
          {view === "categories" && <CategoriesView />}
          {view === "libelles" && <LibellesView />}
          {view === "postes" && <PostesView />}
          {view === "parametres" && <ParametresView />}
        </main>
      </div>
    </div>
  );
}