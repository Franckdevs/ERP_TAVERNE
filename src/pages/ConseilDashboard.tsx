import { useState } from "react";
import type {
  ComponentType,
  CSSProperties,
  FormEvent,
  ReactNode,
  SVGProps,
} from "react";
import "./AssistantDashboard.css"; // coquille « dash » partagée (sidebar, topbar, modal…)
import "./ConseilDashboard.css"; // styles propres au CRM
import { BellIcon, HouseIcon, XIcon } from "../components/icons";

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
const UsersIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </I>
);
const AlertTriangleIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </I>
);
const FileIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </I>
);
const InfoIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </I>
);

/* --------------------------------------------------------------------------
   Données du CRM (jeu de démonstration — à brancher sur l'API NestJS)
   -------------------------------------------------------------------------- */
type Stage = {
  id: string;
  label: string;
  color: string;
  deals: { name: string; amount: string; desc: string }[];
};

const PIPELINE: Stage[] = [
  {
    id: "prospect",
    label: "Prospect",
    color: "#9a8268",
    deals: [
      { name: "Résidence Le Baobab", amount: "8 500 000", desc: "Mobilier + déco" },
      { name: "Clinique de la Riviera", amount: "15 200 000", desc: "Aménagement" },
      { name: "Ivoire Béton", amount: "9 800 000", desc: "Cloisons bureaux" },
    ],
  },
  {
    id: "qualification",
    label: "Qualification",
    color: "#c79a3a",
    deals: [
      { name: "Villa Bingerville", amount: "22 000 000", desc: "Meubles cuisine + dressing" },
      { name: "Bureau Orange", amount: "11 400 000", desc: "Rénovation" },
    ],
  },
  {
    id: "devis",
    label: "Devis envoyé",
    color: "#a85c1f",
    deals: [
      { name: "Filtisac", amount: "34 800 000", desc: "Bureaux" },
      { name: "Hôtel Tiama", amount: "19 600 000", desc: "Chambres" },
    ],
  },
  {
    id: "negociation",
    label: "Négociation",
    color: "#3f7c9a",
    deals: [
      { name: "Résidence Cocody", amount: "27 300 000", desc: "Villa complète" },
    ],
  },
  {
    id: "gagne",
    label: "Gagné",
    color: "#2f8f4e",
    deals: [
      { name: "Famille Kouassi", amount: "48 000 000", desc: "Villa Riviera" },
      { name: "Ivoire Décor", amount: "13 500 000", desc: "Showroom" },
    ],
  },
  {
    id: "perdu",
    label: "Perdu",
    color: "#b5462f",
    deals: [{ name: "Société X", amount: "5 000 000", desc: "Budget" }],
  },
];

type Client = {
  name: string;
  email: string;
  city: string;
  projects: number;
  ca: string;
};

const SEED_CLIENTS: Client[] = [
  { name: "Famille Kouassi", email: "a.kouassi@mail.ci", city: "Abidjan — Cocody", projects: 4, ca: "62 M FCFA" },
  { name: "Filtisac", email: "achats@filtisac.ci", city: "Abidjan — Treichville", projects: 7, ca: "148 M FCFA" },
  { name: "Ivoire Décor", email: "contact@ivoiredecor.ci", city: "Abidjan — Plateau", projects: 3, ca: "41 M FCFA" },
  { name: "Hôtel Tiama", email: "dir@tiama.ci", city: "Grand-Bassam", projects: 5, ca: "96 M FCFA" },
  { name: "M. Koné", email: "m.kone@mail.ci", city: "Yamoussoukro", projects: 2, ca: "11 M FCFA" },
  { name: "Résidence Les Palmiers", email: "syndic@palmiers.ci", city: "Abidjan — Riviera", projects: 3, ca: "38 M FCFA" },
];

type RequestKind = "reclamation" | "demande";
type RequestStatus = "En cours" | "À traiter" | "Résolu";
const REQUESTS: {
  icon: ComponentType<IconProps>;
  title: string;
  meta: string;
  kind: RequestKind;
  status: RequestStatus;
}[] = [
  {
    icon: AlertTriangleIcon,
    title: "Retard de livraison — dressing",
    meta: "Famille Kouassi · il y a 2 h",
    kind: "reclamation",
    status: "En cours",
  },
  {
    icon: FileIcon,
    title: "Demande de devis — meubles de cuisine",
    meta: "Hôtel Tiama · hier",
    kind: "demande",
    status: "À traiter",
  },
  {
    icon: AlertTriangleIcon,
    title: "Finition peinture non conforme",
    meta: "Ivoire Décor · il y a 3 j",
    kind: "reclamation",
    status: "Résolu",
  },
  {
    icon: InfoIcon,
    title: "Information garantie mobilier",
    meta: "M. Koné · il y a 4 j",
    kind: "demande",
    status: "Résolu",
  },
];

const statusChip: Record<RequestStatus, string> = {
  "En cours": "doing",
  "À traiter": "todo",
  Résolu: "done",
};

/* Initiales pour les avatars (« Famille Kouassi » → « FK ») */
function initials(name: string) {
  return name
    .replace(/^(M\.|Mme|Dr)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* --------------------------------------------------------------------------
   Tableau de bord Conseil client (CRM & Clients)
   -------------------------------------------------------------------------- */
export default function ConseilDashboard({
  onLogout,
}: {
  onLogout?: () => void;
}) {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<"pipeline" | "clients">("pipeline");
  const [clients, setClients] = useState<Client[]>(SEED_CLIENTS);
  const [modalOpen, setModalOpen] = useState(false);

  const addClient = (c: { name: string; contact: string; city: string }) => {
    setClients((prev) => [
      {
        name: c.name,
        email: c.contact || "—",
        city: c.city || "—",
        projects: 0,
        ca: "—",
      },
      ...prev,
    ]);
    setModalOpen(false);
    setTab("clients");
  };

  return (
    <div className={`dash${dark ? " dash--dark" : ""}`}>
      {/* --- Sidebar --- */}
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <span className="dash__brand-mark">
            <HouseIcon />
          </span>
          <span className="dash__brand-text">
            <span className="dash__brand-name">Taverne</span>
            <span className="dash__brand-sub">Espace Conseil client</span>
          </span>
        </div>

        <nav className="dash__nav">
          <div className="dash__nav-group">
            <button type="button" className="dash__nav-item is-active">
              <UsersIcon /> CRM &amp; Clients
            </button>
          </div>
        </nav>

        <div className="dash__foot">
          <div className="dash__user">
            <span className="dash__user-avatar">OS</span>
            <span className="dash__user-text">
              <span className="dash__user-name">Omar Seck</span>
              <span className="dash__user-role">Conseiller commercial</span>
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
            <h1 className="dash__title">CRM &amp; Clients</h1>
            <p className="dash__subtitle">
              Prospects, pipeline et clients actifs
            </p>
          </div>

          <label className="dash__search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Rechercher projets, clients, factures..."
            />
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
            <button
              className="dash__icon-btn"
              type="button"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="dash__dot" />
            </button>
            <span className="dash__avatar">OS</span>
          </div>
        </header>

        <main className="dash__content">
          {/* --- KPI --- */}
          <div className="dash__stats">
            <div className="d-stat">
              <p className="d-stat__label">Portefeuille clients</p>
              <p className="d-stat__value">
                48 <span className="d-stat__unit">clients attitrés</span>
              </p>
            </div>

            <div className="d-stat">
              <p className="d-stat__label">Objectif commercial · mois</p>
              <p className="d-stat__value">
                72 % <span className="d-stat__unit">36 / 50 M FCFA</span>
              </p>
              <div className="crm-progress">
                <span style={{ width: "72%" }} />
              </div>
            </div>

            <div className="d-stat">
              <p className="d-stat__label">Opportunités ouvertes</p>
              <p className="d-stat__value">
                9 <span className="crm-badge">118 M FCFA</span>
              </p>
            </div>

            <div className="d-stat">
              <p className="d-stat__label">Satisfaction client</p>
              <p className="d-stat__value crm-value--up">
                94 % <span className="crm-badge crm-badge--up">+2 pts</span>
              </p>
            </div>
          </div>

          {/* --- Barre d'outils : onglets + nouveau client --- */}
          <div className="crm-toolbar">
            <div className="crm-tabs">
              <button
                type="button"
                className={`crm-tab${tab === "pipeline" ? " is-active" : ""}`}
                onClick={() => setTab("pipeline")}
              >
                Pipeline commercial
              </button>
              <button
                type="button"
                className={`crm-tab${tab === "clients" ? " is-active" : ""}`}
                onClick={() => setTab("clients")}
              >
                Liste clients
              </button>
            </div>

            <button
              type="button"
              className="d-btn d-btn--primary"
              onClick={() => setModalOpen(true)}
            >
              <PlusIcon /> Nouveau client
            </button>
          </div>

          {/* --- Pipeline (kanban) --- */}
          {tab === "pipeline" && (
            <div className="pipeline">
              {PIPELINE.map((stage) => (
                <section
                  className="pl-col"
                  key={stage.id}
                  style={{ "--k": stage.color } as CSSProperties}
                >
                  <header className="pl-col__head">
                    <span className="pl-col__title">{stage.label}</span>
                    <span className="pl-col__count">{stage.deals.length}</span>
                  </header>
                  <div className="pl-col__body">
                    {stage.deals.map((d) => (
                      <article className="pl-card" key={d.name}>
                        <h3 className="pl-card__name">{d.name}</h3>
                        <p className="pl-card__amount">{d.amount}</p>
                        <p className="pl-card__desc">{d.desc}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* --- Liste clients (table) --- */}
          {tab === "clients" && (
            <div className="panel crm-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Ville</th>
                    <th className="crm-num">Projets</th>
                    <th className="crm-num">CA total</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.name + c.email}>
                      <td>
                        <span className="crm-client">
                          <span className="crm-avatar">{initials(c.name)}</span>
                          <span className="crm-client__name">{c.name}</span>
                        </span>
                      </td>
                      <td className="crm-email">{c.email}</td>
                      <td>{c.city}</td>
                      <td className="crm-num">{c.projects}</td>
                      <td className="crm-num crm-ca">{c.ca}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- Demandes & réclamations --- */}
          <section className="panel">
            <header className="panel__head">
              <div>
                <h2 className="panel__title">Demandes &amp; réclamations</h2>
                <p className="panel__sub">
                  Suivi des dossiers clients · traitement et satisfaction
                </p>
              </div>
            </header>

            <ul className="rows">
              {REQUESTS.map((r, i) => (
                <li className="row" key={i}>
                  <span className={`req__icon req__icon--${r.kind}`}>
                    <r.icon />
                  </span>
                  <div className="row__text">
                    <span className="row__name">{r.title}</span>
                    <span className="row__desc">{r.meta}</span>
                  </div>
                  <span className={`req-tag req-tag--${r.kind}`}>
                    {r.kind === "reclamation" ? "Réclamation" : "Demande"}
                  </span>
                  <span className={`chip chip--${statusChip[r.status]}`}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      {modalOpen && (
        <NewClientModal
          onClose={() => setModalOpen(false)}
          onAdd={addClient}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Modal « Nouveau client »
   -------------------------------------------------------------------------- */
function NewClientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (c: { name: string; contact: string; city: string }) => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Indiquez le nom du client.");
      return;
    }
    onAdd({ name: name.trim(), contact: contact.trim(), city: city.trim() });
  };

  return (
    <div
      className="plan__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nc-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="plan__panel">
        <header className="plan__head">
          <h2 id="nc-title" className="plan__title">
            Nouveau client
          </h2>
          <button
            type="button"
            className="plan__close"
            aria-label="Fermer"
            onClick={onClose}
          >
            <XIcon />
          </button>
        </header>

        <form className="plan__form" onSubmit={submit}>
          <label className="plan__field">
            <span className="plan__label">Nom du client</span>
            <input
              className="plan__control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Résidence Le Baobab"
              autoFocus
            />
          </label>

          <div className="plan__cols">
            <label className="plan__field">
              <span className="plan__label">Contact</span>
              <input
                className="plan__control"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email / téléphone"
              />
            </label>
            <label className="plan__field">
              <span className="plan__label">Ville</span>
              <input
                className="plan__control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Abidjan"
              />
            </label>
          </div>

          {error && <p className="plan__error">{error}</p>}

          <div className="plan__foot">
            <button type="button" className="d-btn d-btn--ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="d-btn d-btn--primary">
              Ajouter le client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}