import { useState } from "react";
import type { ComponentType, FormEvent, ReactNode, SVGProps } from "react";
import "./AssistantDashboard.css"; // coquille « dash » partagée (sidebar, topbar, modal…)
import "./ConseilDashboard.css"; // barres de progression, badges, tables (crm-*)
import "./CommercialDashboard.css"; // spécifique au tableau de bord commercial
import { XIcon } from "../components/icons";
import RappelsMenu from "../rappels/RappelsMenu";
import AlertesMenu from "../alertes/AlertesMenu";
import AlertesBanner from "../alertes/AlertesBanner";

/* --------------------------------------------------------------------------
   Icônes propres au tableau de bord (au trait, basées sur currentColor)
   -------------------------------------------------------------------------- */
type IconProps = SVGProps<SVGSVGElement>;
function I({ children, ...p }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

const SearchIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </I>
);
const MoonIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </I>
);
const SunIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
  </I>
);
const PlusIcon = (p: IconProps) => (
  <I {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </I>
);
const LogOutIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </I>
);
const TargetIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </I>
);
const TrendingUpIcon = (p: IconProps) => (
  <I {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </I>
);
const FileTextIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </I>
);
const HandshakeIcon = (p: IconProps) => (
  <I {...p}>
    <path d="m11 17 2 2a1 1 0 0 0 1.41 0l3.3-3.3" />
    <path d="m13 14 2.5 2.5a1 1 0 0 0 1.41 0l2.18-2.18a1 1 0 0 0 0-1.41L15 8.5" />
    <path d="M4 14 2.5 12.5a1 1 0 0 1 0-1.41L7.18 6.4a1 1 0 0 1 1.41 0l2.62 2.6" />
    <path d="m8 13 2 2" />
  </I>
);
const PhoneIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </I>
);
const UsersIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </I>
);
const BriefcaseIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </I>
);
const CalendarIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </I>
);
const MapPinIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </I>
);
const CheckIcon = (p: IconProps) => (
  <I {...p}>
    <polyline points="20 6 9 17 4 12" />
  </I>
);
const ClockIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </I>
);

/* --------------------------------------------------------------------------
   Données de démonstration (à brancher sur l'API NestJS)
   -------------------------------------------------------------------------- */
type Objectif = { label: string; valeur: number; cible: number; unite: string };
const OBJECTIFS: Objectif[] = [
  { label: "Chiffre d'affaires", valeur: 38, cible: 50, unite: "M FCFA" },
  { label: "Devis signés", valeur: 7, cible: 12, unite: "devis" },
  { label: "Nouveaux clients", valeur: 4, cible: 6, unite: "clients" },
  { label: "Relances effectuées", valeur: 23, cible: 30, unite: "relances" },
];

type DevisStatut = "Brouillon" | "Envoyé" | "Relancé" | "Signé" | "Perdu";
type Devis = { ref: string; client: string; montant: string; statut: DevisStatut };

const SEED_DEVIS: Devis[] = [
  { ref: "DV-2026-064", client: "Villa Bingerville", montant: "22 000 000", statut: "Signé" },
  { ref: "DV-2026-063", client: "Filtisac", montant: "34 800 000", statut: "Relancé" },
  { ref: "DV-2026-062", client: "Hôtel Tiama", montant: "19 600 000", statut: "Envoyé" },
  { ref: "DV-2026-061", client: "Résidence Cocody", montant: "27 300 000", statut: "Envoyé" },
  { ref: "DV-2026-060", client: "Bureau Orange", montant: "11 400 000", statut: "Brouillon" },
];

const devisChip: Record<DevisStatut, string> = {
  Brouillon: "wait",
  Envoyé: "doing",
  Relancé: "todo",
  Signé: "done",
  Perdu: "wait",
};

type Activite = {
  icon: ComponentType<IconProps>;
  titre: string;
  meta: string;
  statut: string;
  chip: string;
};
const ACTIVITES: Activite[] = [
  { icon: PhoneIcon, titre: "Appel de relance — Filtisac", meta: "Aujourd'hui · 10:15", statut: "Fait", chip: "done" },
  { icon: FileTextIcon, titre: "Devis envoyé — Hôtel Tiama", meta: "Hier · 16:40", statut: "En attente", chip: "doing" },
  { icon: UsersIcon, titre: "Visite client — Résidence Cocody", meta: "Demain · 09:00", statut: "Planifié", chip: "plan" },
  { icon: HandshakeIcon, titre: "Commande signée — Villa Bingerville", meta: "il y a 2 j", statut: "Gagné", chip: "done" },
  { icon: PhoneIcon, titre: "Rappeler M. Koné (négociation)", meta: "il y a 3 j", statut: "À faire", chip: "todo" },
];

type TopClient = { nom: string; ca: number }; // ca en M FCFA
const TOP_CLIENTS: TopClient[] = [
  { nom: "Filtisac", ca: 148 },
  { nom: "Hôtel Tiama", ca: 96 },
  { nom: "Famille Kouassi", ca: 62 },
  { nom: "Ivoire Décor", ca: 41 },
  { nom: "Résidence Les Palmiers", ca: 38 },
];

const pct = (valeur: number, cible: number) =>
  Math.min(100, Math.round((valeur / cible) * 100));

const CA_MAX = Math.max(...TOP_CLIENTS.map((c) => c.ca));

/* --- Pipeline commercial (opportunités par étape) ------------------------ */
type Opp = { client: string; montant: number; proba: number }; // montant en M FCFA
type PipeCol = { stage: string; couleur: string; items: Opp[] };
const PIPELINE: PipeCol[] = [
  {
    stage: "Prospection",
    couleur: "#9c6b3f",
    items: [
      { client: "Résidence Les Palmiers", montant: 18, proba: 20 },
      { client: "Clinique Sainte-Anne", montant: 25, proba: 15 },
    ],
  },
  {
    stage: "Qualification",
    couleur: "#b5760f",
    items: [
      { client: "Bureau Orange", montant: 11, proba: 40 },
      { client: "Lycée Blaise", montant: 9, proba: 35 },
    ],
  },
  {
    stage: "Proposition",
    couleur: "#a85c1f",
    items: [
      { client: "Hôtel Tiama", montant: 19, proba: 55 },
      { client: "Résidence Cocody", montant: 27, proba: 50 },
    ],
  },
  {
    stage: "Négociation",
    couleur: "#7a4a16",
    items: [{ client: "Filtisac", montant: 34, proba: 70 }],
  },
  {
    stage: "Gagné",
    couleur: "#2f7d4f",
    items: [{ client: "Villa Bingerville", montant: 22, proba: 100 }],
  },
];

/* --- Clients & prospects ------------------------------------------------- */
type ClientType = "Client" | "Prospect";
type ClientRow = {
  nom: string;
  type: ClientType;
  contact: string;
  ville: string;
  ca: string;
  dernier: string;
};
const CLIENTS: ClientRow[] = [
  { nom: "Filtisac", type: "Client", contact: "+225 07 01 02 03", ville: "Abidjan", ca: "148 M", dernier: "il y a 3 j" },
  { nom: "Hôtel Tiama", type: "Client", contact: "+225 07 11 22 33", ville: "Plateau", ca: "96 M", dernier: "il y a 1 sem" },
  { nom: "Résidence Cocody", type: "Prospect", contact: "+225 05 44 55 66", ville: "Cocody", ca: "—", dernier: "il y a 2 j" },
  { nom: "Clinique Sainte-Anne", type: "Prospect", contact: "+225 01 77 88 99", ville: "Marcory", ca: "—", dernier: "Aujourd'hui" },
  { nom: "Famille Kouassi", type: "Client", contact: "+225 07 23 45 67", ville: "Riviera", ca: "62 M", dernier: "il y a 5 j" },
  { nom: "Ivoire Décor", type: "Client", contact: "+225 27 20 30 40", ville: "Treichville", ca: "41 M", dernier: "il y a 2 sem" },
];

/* --- Visites & rendez-vous ----------------------------------------------- */
type Visite = {
  date: string;
  heure: string;
  client: string;
  objet: string;
  lieu: string;
  statut: string;
  chip: string;
};
const VISITES: Visite[] = [
  { date: "Aujourd'hui", heure: "14:30", client: "Résidence Cocody", objet: "Présentation du devis", lieu: "Cocody Riviera", statut: "À venir", chip: "plan" },
  { date: "Demain", heure: "09:00", client: "Clinique Sainte-Anne", objet: "Découverte du besoin", lieu: "Marcory", statut: "Planifié", chip: "plan" },
  { date: "Demain", heure: "16:00", client: "Hôtel Tiama", objet: "Négociation", lieu: "Plateau", statut: "Planifié", chip: "todo" },
  { date: "Jeu. 26", heure: "11:00", client: "Filtisac", objet: "Signature de commande", lieu: "Zone 4", statut: "Confirmé", chip: "done" },
];

/* --- Relances ------------------------------------------------------------ */
type Priorite = "Haute" | "Moyenne" | "Basse";
type Relance = { id: string; client: string; raison: string; echeance: string; priorite: Priorite };
const SEED_RELANCES: Relance[] = [
  { id: "r1", client: "Filtisac", raison: "Devis DV-2026-063 sans réponse", echeance: "Aujourd'hui", priorite: "Haute" },
  { id: "r2", client: "M. Koné", raison: "Négociation prix en attente", echeance: "il y a 1 j", priorite: "Haute" },
  { id: "r3", client: "Hôtel Tiama", raison: "Relancer après envoi du devis", echeance: "Demain", priorite: "Moyenne" },
  { id: "r4", client: "Bureau Orange", raison: "Confirmer le rendez-vous", echeance: "Cette semaine", priorite: "Basse" },
];
const prioClass: Record<Priorite, string> = { Haute: "haute", Moyenne: "moyenne", Basse: "basse" };

/* --- Navigation (vues du tableau de bord) -------------------------------- */
type ViewId =
  | "overview"
  | "pipeline"
  | "devis"
  | "clients"
  | "visites"
  | "objectifs"
  | "relances";

type NavItem = { id: ViewId; label: string; icon: ComponentType<IconProps> };
const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Pilotage", items: [{ id: "overview", label: "Vue d'ensemble", icon: BriefcaseIcon }] },
  {
    group: "Ventes",
    items: [
      { id: "pipeline", label: "Pipeline", icon: TrendingUpIcon },
      { id: "devis", label: "Devis & commandes", icon: FileTextIcon },
    ],
  },
  {
    group: "Clients",
    items: [
      { id: "clients", label: "Clients & prospects", icon: UsersIcon },
      { id: "visites", label: "Visites & RDV", icon: CalendarIcon },
    ],
  },
  {
    group: "Performance",
    items: [
      { id: "objectifs", label: "Objectifs", icon: TargetIcon },
      { id: "relances", label: "Relances", icon: PhoneIcon },
    ],
  },
];

const META: Record<ViewId, { title: string; sub: string }> = {
  overview: { title: "Tableau de bord commercial", sub: "Ventes, objectifs, devis et clients" },
  pipeline: { title: "Pipeline commercial", sub: "Opportunités par étape de vente" },
  devis: { title: "Devis & commandes", sub: "Suivi des documents émis" },
  clients: { title: "Clients & prospects", sub: "Portefeuille et prospection" },
  visites: { title: "Visites & rendez-vous", sub: "Planning terrain de la semaine" },
  objectifs: { title: "Objectifs commerciaux", sub: "Cibles du mois et de l'année" },
  relances: { title: "Relances", sub: "Suivi des relances à effectuer" },
};

/* --------------------------------------------------------------------------
   Tableau de bord Chargé commercial
   -------------------------------------------------------------------------- */
export default function CommercialDashboard({ onLogout }: { onLogout?: () => void }) {
  const [dark, setDark] = useState(false);
  const [devis, setDevis] = useState<Devis[]>(SEED_DEVIS);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<ViewId>("overview");
  const meta = META[view];

  let seq = 65;

  const addDevis = (d: { client: string; montant: string; statut: DevisStatut }) => {
    setDevis((prev) => [
      { ref: `DV-2026-0${seq++}`, client: d.client, montant: d.montant || "—", statut: d.statut },
      ...prev,
    ]);
    setModalOpen(false);
  };

  return (
    <div className={`dash${dark ? " dash--dark" : ""}`}>
      <AlertesBanner scope="commercial" />

      {/* --- Sidebar --- */}
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <img className="brand-logo" src="/logo-taverne.png" alt="Taverne" />
          <span className="dash__brand-text">
            <span className="dash__brand-sub">Espace Chargé commercial</span>
          </span>
        </div>

        <nav className="dash__nav">
          {NAV.map((g) => (
            <div className="dash__nav-group" key={g.group}>
              <p className="dash__nav-label">{g.group}</p>
              {g.items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className={`dash__nav-item${view === it.id ? " is-active" : ""}`}
                  onClick={() => setView(it.id)}
                >
                  <it.icon /> {it.label}
                </button>
              ))}
            </div>
          ))}

          <div className="dash__nav-group">
            <p className="dash__nav-label">Outils</p>
            <RappelsMenu scope="commercial" className="dash__nav-item" />
            <AlertesMenu scope="commercial" className="dash__nav-item" variant="item" />
          </div>
        </nav>

        <div className="dash__foot">
          <div className="dash__user">
            <span className="dash__user-avatar">KN</span>
            <span className="dash__user-text">
              <span className="dash__user-name">Koffi N'Guessan</span>
              <span className="dash__user-role">Chargé commercial</span>
            </span>
          </div>
          <button className="dash__logout" type="button" onClick={onLogout}>
            <LogOutIcon /> Déconnexion
          </button>
        </div>
      </aside>

      {/* --- Zone principale --- */}
      <div className="dash__main">
        <header className="dash__topbar">
          <div className="dash__heading">
            <h1 className="dash__title">{meta.title}</h1>
            <p className="dash__subtitle">{meta.sub}</p>
          </div>

          <label className="dash__search">
            <SearchIcon />
            <input type="search" placeholder="Rechercher un devis, un client..." />
          </label>

          <div className="dash__actions">
            <button
              className="dash__icon-btn"
              type="button"
              aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <AlertesMenu scope="commercial" className="dash__icon-btn" variant="icon" />
            <span className="dash__avatar">KN</span>
          </div>
        </header>

        <main className="dash__content">
          {view === "overview" && (
            <>
          {/* --- KPI --- */}
          <div className="dash__stats">
            <div className="d-stat">
              <p className="d-stat__label">CA réalisé · mois</p>
              <p className="d-stat__value crm-value--up">
                38 M <span className="crm-badge crm-badge--up">+12 %</span>
              </p>
            </div>

            <div className="d-stat">
              <p className="d-stat__label">Objectif mensuel</p>
              <p className="d-stat__value">
                76 % <span className="d-stat__unit">38 / 50 M FCFA</span>
              </p>
              <div className="crm-progress">
                <span style={{ width: "76%" }} />
              </div>
            </div>

            <div className="d-stat">
              <p className="d-stat__label">Devis en cours</p>
              <p className="d-stat__value">
                12 <span className="crm-badge">84 M FCFA</span>
              </p>
            </div>

            <div className="d-stat">
              <p className="d-stat__label">Commandes signées · mois</p>
              <p className="d-stat__value">
                7 <span className="d-stat__unit">taux de conversion 58 %</span>
              </p>
            </div>
          </div>

          {/* --- Barre d'outils --- */}
          <div className="crm-toolbar">
            <div>
              <h2 className="panel__title">Activité du mois</h2>
              <p className="panel__sub">Juin 2026 · suivi des objectifs et des ventes</p>
            </div>
            <button type="button" className="d-btn d-btn--primary" onClick={() => setModalOpen(true)}>
              <PlusIcon /> Nouveau devis
            </button>
          </div>

          {/* --- Grille : objectifs + devis récents --- */}
          <div className="dash__grid">
            {/* Objectifs commerciaux */}
            <section className="panel">
              <header className="panel__head">
                <div>
                  <h2 className="panel__title">Objectifs commerciaux</h2>
                  <p className="panel__sub">Progression vers les cibles du mois</p>
                </div>
                <span className="com-pill">
                  <TargetIcon /> Juin
                </span>
              </header>

              <ul className="com-objs">
                {OBJECTIFS.map((o) => {
                  const p = pct(o.valeur, o.cible);
                  return (
                    <li key={o.label} className="com-obj">
                      <div className="com-obj__top">
                        <span className="com-obj__label">{o.label}</span>
                        <span className="com-obj__val">
                          <strong>{o.valeur}</strong> / {o.cible} {o.unite} · {p} %
                        </span>
                      </div>
                      <div className="crm-progress">
                        <span style={{ width: `${p}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Devis & commandes récents */}
            <section className="panel">
              <header className="panel__head">
                <div>
                  <h2 className="panel__title">Devis &amp; commandes récents</h2>
                  <p className="panel__sub">Derniers documents émis</p>
                </div>
              </header>

              <div className="crm-table-wrap">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Client</th>
                      <th className="crm-num">Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devis.map((d) => (
                      <tr key={d.ref}>
                        <td className="com-ref">{d.ref}</td>
                        <td>{d.client}</td>
                        <td className="crm-num crm-ca">{d.montant}</td>
                        <td>
                          <span className={`chip chip--${devisChip[d.statut]}`}>{d.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* --- Activité récente + Top clients --- */}
          <div className="dash__grid">
            <section className="panel">
              <header className="panel__head">
                <div>
                  <h2 className="panel__title">Activité commerciale récente</h2>
                  <p className="panel__sub">Appels, visites, relances et signatures</p>
                </div>
                <span className="com-pill">
                  <TrendingUpIcon /> 5 actions
                </span>
              </header>

              <ul className="rows">
                {ACTIVITES.map((a, i) => (
                  <li className="row" key={i}>
                    <span className="row__icon">
                      <a.icon />
                    </span>
                    <div className="row__text">
                      <span className="row__name">{a.titre}</span>
                      <span className="row__desc">{a.meta}</span>
                    </div>
                    <span className={`chip chip--${a.chip}`}>{a.statut}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <header className="panel__head">
                <div>
                  <h2 className="panel__title">Top clients du mois</h2>
                  <p className="panel__sub">Chiffre d'affaires cumulé (M FCFA)</p>
                </div>
              </header>

              <ol className="com-rank">
                {TOP_CLIENTS.map((c, i) => (
                  <li className="com-rank__row" key={c.nom}>
                    <span className="com-rank__num">{i + 1}</span>
                    <div className="com-rank__body">
                      <div className="com-rank__line">
                        <span className="com-rank__name">{c.nom}</span>
                        <span className="com-rank__ca">{c.ca} M</span>
                      </div>
                      <span className="com-rank__bar">
                        <span
                          className="com-rank__fill"
                          style={{ width: `${Math.round((c.ca / CA_MAX) * 100)}%` }}
                        />
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
            </>
          )}

          {view === "pipeline" && <PipelineView />}
          {view === "devis" && (
            <DevisView devis={devis} onNewDevis={() => setModalOpen(true)} />
          )}
          {view === "clients" && <ClientsView />}
          {view === "visites" && <VisitesView />}
          {view === "objectifs" && <ObjectifsView />}
          {view === "relances" && <RelancesView />}
        </main>
      </div>

      {modalOpen && (
        <NewDevisModal onClose={() => setModalOpen(false)} onAdd={addDevis} />
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Vue « Pipeline commercial »
   -------------------------------------------------------------------------- */
function PipelineView() {
  const total = PIPELINE.reduce((s, c) => s + c.items.reduce((a, o) => a + o.montant, 0), 0);
  const pondere = Math.round(
    PIPELINE.reduce(
      (s, c) => s + c.items.reduce((a, o) => a + (o.montant * o.proba) / 100, 0),
      0,
    ),
  );
  const nb = PIPELINE.reduce((s, c) => s + c.items.length, 0);

  return (
    <>
      <div className="com-substats">
        <div className="com-substat">
          <p className="com-substat__label">Valeur du pipeline</p>
          <p className="com-substat__value">
            {total} <small>M FCFA</small>
          </p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Valeur pondérée (proba.)</p>
          <p className="com-substat__value">
            {pondere} <small>M FCFA</small>
          </p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Opportunités ouvertes</p>
          <p className="com-substat__value">{nb}</p>
        </div>
      </div>

      <section className="panel">
        <header className="panel__head">
          <div>
            <h2 className="panel__title">Pipeline commercial</h2>
            <p className="panel__sub">Opportunités par étape de vente</p>
          </div>
          <span className="com-pill">
            <TrendingUpIcon /> {nb} en cours
          </span>
        </header>

        <div className="com-pipe">
          {PIPELINE.map((col) => (
            <div className="com-pipe__col" key={col.stage}>
              <div className="com-pipe__col-head">
                <span className="com-pipe__col-title">
                  <span className="com-pipe__dot" style={{ backgroundColor: col.couleur }} />
                  {col.stage}
                </span>
                <span className="com-pipe__count">{col.items.length}</span>
              </div>
              {col.items.length === 0 ? (
                <p className="com-pipe__empty">—</p>
              ) : (
                col.items.map((o) => (
                  <div
                    className="com-pipe__card"
                    key={o.client}
                    style={{ borderLeftColor: col.couleur }}
                  >
                    <span className="com-pipe__client">{o.client}</span>
                    <div className="com-pipe__meta">
                      <span className="com-pipe__amount">{o.montant} M FCFA</span>
                      <span>{o.proba} %</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* --------------------------------------------------------------------------
   Vue « Devis & commandes »
   -------------------------------------------------------------------------- */
function DevisView({ devis, onNewDevis }: { devis: Devis[]; onNewDevis: () => void }) {
  const [filtre, setFiltre] = useState<DevisStatut | "Tous">("Tous");
  const filtres: (DevisStatut | "Tous")[] = ["Tous", "Brouillon", "Envoyé", "Relancé", "Signé", "Perdu"];
  const liste = filtre === "Tous" ? devis : devis.filter((d) => d.statut === filtre);
  const enCours = devis.filter((d) => d.statut === "Envoyé" || d.statut === "Relancé").length;
  const signes = devis.filter((d) => d.statut === "Signé").length;

  return (
    <>
      <div className="com-substats">
        <div className="com-substat">
          <p className="com-substat__label">Total devis</p>
          <p className="com-substat__value">{devis.length}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">En cours</p>
          <p className="com-substat__value">{enCours}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Signés</p>
          <p className="com-substat__value">{signes}</p>
        </div>
      </div>

      <div className="crm-toolbar">
        <div>
          <h2 className="panel__title">Devis &amp; commandes</h2>
          <p className="panel__sub">Tous les documents émis</p>
        </div>
        <button type="button" className="d-btn d-btn--primary" onClick={onNewDevis}>
          <PlusIcon /> Nouveau devis
        </button>
      </div>

      <div className="com-filters">
        {filtres.map((f) => (
          <button
            key={f}
            type="button"
            className={`com-filter${filtre === f ? " is-active" : ""}`}
            onClick={() => setFiltre(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="panel">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th className="crm-num">Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {liste.length === 0 ? (
                <tr>
                  <td colSpan={4} className="com-pipe__empty">
                    Aucun devis pour ce filtre.
                  </td>
                </tr>
              ) : (
                liste.map((d) => (
                  <tr key={d.ref}>
                    <td className="com-ref">{d.ref}</td>
                    <td>{d.client}</td>
                    <td className="crm-num crm-ca">{d.montant}</td>
                    <td>
                      <span className={`chip chip--${devisChip[d.statut]}`}>{d.statut}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* --------------------------------------------------------------------------
   Vue « Clients & prospects »
   -------------------------------------------------------------------------- */
function ClientsView() {
  const [filtre, setFiltre] = useState<ClientType | "Tous">("Tous");
  const liste = filtre === "Tous" ? CLIENTS : CLIENTS.filter((c) => c.type === filtre);
  const nbClients = CLIENTS.filter((c) => c.type === "Client").length;
  const nbProspects = CLIENTS.filter((c) => c.type === "Prospect").length;

  return (
    <>
      <div className="com-substats">
        <div className="com-substat">
          <p className="com-substat__label">Portefeuille</p>
          <p className="com-substat__value">{CLIENTS.length}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Clients actifs</p>
          <p className="com-substat__value">{nbClients}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Prospects</p>
          <p className="com-substat__value">{nbProspects}</p>
        </div>
      </div>

      <div className="com-filters">
        {(["Tous", "Client", "Prospect"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`com-filter${filtre === f ? " is-active" : ""}`}
            onClick={() => setFiltre(f)}
          >
            {f === "Tous" ? "Tous" : `${f}s`}
          </button>
        ))}
      </div>

      <section className="panel">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Ville</th>
                <th className="crm-num">CA</th>
                <th>Dernier échange</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((c) => (
                <tr key={c.nom}>
                  <td>
                    <strong>{c.nom}</strong>
                  </td>
                  <td>
                    <span className={`com-tag com-tag--${c.type === "Client" ? "client" : "prospect"}`}>
                      {c.type}
                    </span>
                  </td>
                  <td>{c.contact}</td>
                  <td>{c.ville}</td>
                  <td className="crm-num crm-ca">{c.ca}</td>
                  <td>{c.dernier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* --------------------------------------------------------------------------
   Vue « Visites & rendez-vous »
   -------------------------------------------------------------------------- */
function VisitesView() {
  const aujourdhui = VISITES.filter((v) => v.date === "Aujourd'hui").length;

  return (
    <>
      <div className="com-substats">
        <div className="com-substat">
          <p className="com-substat__label">RDV planifiés</p>
          <p className="com-substat__value">{VISITES.length}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Aujourd'hui</p>
          <p className="com-substat__value">{aujourdhui}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Cette semaine</p>
          <p className="com-substat__value">{VISITES.length}</p>
        </div>
      </div>

      <section className="panel">
        <header className="panel__head">
          <div>
            <h2 className="panel__title">Visites &amp; rendez-vous</h2>
            <p className="panel__sub">Planning terrain de la semaine</p>
          </div>
          <span className="com-pill">
            <CalendarIcon /> Semaine
          </span>
        </header>

        <ul className="rows">
          {VISITES.map((v, i) => (
            <li className="row" key={i}>
              <span className="row__icon">
                <MapPinIcon />
              </span>
              <div className="row__text">
                <span className="row__name">
                  {v.client} — {v.objet}
                </span>
                <span className="row__desc">
                  <ClockIcon style={{ width: "0.85rem", height: "0.85rem", verticalAlign: "-2px" }} />{" "}
                  {v.date} · {v.heure} · {v.lieu}
                </span>
              </div>
              <span className={`chip chip--${v.chip}`}>{v.statut}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

/* --------------------------------------------------------------------------
   Vue « Objectifs commerciaux »
   -------------------------------------------------------------------------- */
function ObjectifsView() {
  const annuels: Objectif[] = [
    { label: "CA annuel", valeur: 380, cible: 600, unite: "M FCFA" },
    { label: "Nouveaux clients (année)", valeur: 28, cible: 50, unite: "clients" },
    { label: "Taux de conversion", valeur: 58, cible: 65, unite: "%" },
  ];

  return (
    <>
      <div className="com-substats">
        <div className="com-substat">
          <p className="com-substat__label">Objectif du mois</p>
          <p className="com-substat__value">
            76 <small>%</small>
          </p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Objectif annuel</p>
          <p className="com-substat__value">
            63 <small>%</small>
          </p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Prime estimée</p>
          <p className="com-substat__value">
            1,2 <small>M FCFA</small>
          </p>
        </div>
      </div>

      <div className="dash__grid">
        <section className="panel">
          <header className="panel__head">
            <div>
              <h2 className="panel__title">Objectifs du mois</h2>
              <p className="panel__sub">Juin 2026</p>
            </div>
            <span className="com-pill">
              <TargetIcon /> Mensuel
            </span>
          </header>
          <ul className="com-objs">
            {OBJECTIFS.map((o) => {
              const p = pct(o.valeur, o.cible);
              return (
                <li key={o.label} className="com-obj">
                  <div className="com-obj__top">
                    <span className="com-obj__label">{o.label}</span>
                    <span className="com-obj__val">
                      <strong>{o.valeur}</strong> / {o.cible} {o.unite} · {p} %
                    </span>
                  </div>
                  <div className="crm-progress">
                    <span style={{ width: `${p}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="panel">
          <header className="panel__head">
            <div>
              <h2 className="panel__title">Objectifs annuels</h2>
              <p className="panel__sub">Cumul 2026</p>
            </div>
            <span className="com-pill">
              <CalendarIcon /> Annuel
            </span>
          </header>
          <ul className="com-objs">
            {annuels.map((o) => {
              const p = pct(o.valeur, o.cible);
              return (
                <li key={o.label} className="com-obj">
                  <div className="com-obj__top">
                    <span className="com-obj__label">{o.label}</span>
                    <span className="com-obj__val">
                      <strong>{o.valeur}</strong> / {o.cible} {o.unite} · {p} %
                    </span>
                  </div>
                  <div className="crm-progress">
                    <span style={{ width: `${p}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}

/* --------------------------------------------------------------------------
   Vue « Relances »
   -------------------------------------------------------------------------- */
function RelancesView() {
  const [faites, setFaites] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setFaites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const restantes = SEED_RELANCES.filter((r) => !faites.has(r.id)).length;
  const urgentes = SEED_RELANCES.filter((r) => r.priorite === "Haute" && !faites.has(r.id)).length;

  return (
    <>
      <div className="com-substats">
        <div className="com-substat">
          <p className="com-substat__label">À effectuer</p>
          <p className="com-substat__value">{restantes}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Prioritaires</p>
          <p className="com-substat__value">{urgentes}</p>
        </div>
        <div className="com-substat">
          <p className="com-substat__label">Traitées</p>
          <p className="com-substat__value">{faites.size}</p>
        </div>
      </div>

      <section className="panel">
        <header className="panel__head">
          <div>
            <h2 className="panel__title">Relances à effectuer</h2>
            <p className="panel__sub">Triées par priorité</p>
          </div>
          <span className="com-pill">
            <PhoneIcon /> {restantes} en attente
          </span>
        </header>

        <ul style={{ listStyle: "none" }}>
          {SEED_RELANCES.map((r) => {
            const done = faites.has(r.id);
            return (
              <li className={`com-relance${done ? " is-done" : ""}`} key={r.id}>
                <span className={`com-prio com-prio--${prioClass[r.priorite]}`}>{r.priorite}</span>
                <div className="com-relance__body">
                  <span className="com-relance__client">{r.client}</span>
                  <p className="com-relance__raison">{r.raison}</p>
                </div>
                <span className="com-relance__ech">{r.echeance}</span>
                <button type="button" className="com-relance__btn" onClick={() => toggle(r.id)}>
                  <CheckIcon /> {done ? "Annuler" : "Fait"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

/* --------------------------------------------------------------------------
   Modal « Nouveau devis »
   -------------------------------------------------------------------------- */
function NewDevisModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (d: { client: string; montant: string; statut: DevisStatut }) => void;
}) {
  const [client, setClient] = useState("");
  const [montant, setMontant] = useState("");
  const [statut, setStatut] = useState<DevisStatut>("Brouillon");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client.trim()) {
      setError("Indiquez le nom du client.");
      return;
    }
    onAdd({ client: client.trim(), montant: montant.trim(), statut });
  };

  return (
    <div
      className="plan__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nd-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="plan__panel">
        <header className="plan__head">
          <h2 id="nd-title" className="plan__title">
            Nouveau devis
          </h2>
          <button type="button" className="plan__close" aria-label="Fermer" onClick={onClose}>
            <XIcon />
          </button>
        </header>

        <form className="plan__form" onSubmit={submit}>
          <label className="plan__field">
            <span className="plan__label">Client</span>
            <input
              className="plan__control"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Ex : Villa Bingerville"
              autoFocus
            />
          </label>

          <div className="plan__cols">
            <label className="plan__field">
              <span className="plan__label">Montant (FCFA)</span>
              <input
                className="plan__control"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="Ex : 22 000 000"
                inputMode="numeric"
              />
            </label>
            <label className="plan__field">
              <span className="plan__label">Statut</span>
              <select
                className="plan__control"
                value={statut}
                onChange={(e) => setStatut(e.target.value as DevisStatut)}
              >
                <option value="Brouillon">Brouillon</option>
                <option value="Envoyé">Envoyé</option>
                <option value="Relancé">Relancé</option>
                <option value="Signé">Signé</option>
              </select>
            </label>
          </div>

          {error && <p className="plan__error">{error}</p>}

          <div className="plan__foot">
            <button type="button" className="d-btn d-btn--ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="d-btn d-btn--primary">
              Ajouter le devis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
