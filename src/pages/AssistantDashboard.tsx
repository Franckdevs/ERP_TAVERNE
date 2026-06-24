import { useRef, useState } from "react";
import type {
  ComponentType,
  CSSProperties,
  FormEvent,
  ReactNode,
  SVGProps,
} from "react";
import "./AssistantDashboard.css";
import {
  CalendarIcon,
  HouseIcon,
  MailIcon,
  MessageIcon,
  XIcon,
} from "../components/icons";
import RappelsMenu from "../rappels/RappelsMenu";
import AlertesMenu from "../alertes/AlertesMenu";

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
const PhoneIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </I>
);
const FileIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </I>
);
const LogOutIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </I>
);
const LayoutGridIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </I>
);
const MapPinIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </I>
);
const ReceiptIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 2v20l2-1.5L8 22l2-1.5L12 22l2-1.5L16 22l2-1.5L20 22V2l-2 1.5L16 2l-2 1.5L12 2l-2 1.5L8 2 6 3.5 4 2z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </I>
);
const ChevronDownIcon = (p: IconProps) => (
  <I {...p}>
    <polyline points="6 9 12 15 18 9" />
  </I>
);

/* --------------------------------------------------------------------------
   Types d'événements de l'agenda (réunions + autres catégories)
   -------------------------------------------------------------------------- */
type AgendaType =
  | "reunion"
  | "rdv"
  | "appel"
  | "deplacement"
  | "tache"
  | "echeance";

const AGENDA_TYPES: { id: AgendaType; label: string; color: string }[] = [
  { id: "reunion", label: "Réunion", color: "#8b4513" },
  { id: "rdv", label: "Rendez-vous", color: "#2f8f4e" },
  { id: "appel", label: "Appel", color: "#c79a3a" },
  { id: "deplacement", label: "Déplacement", color: "#9a6b3f" },
  { id: "tache", label: "Tâche", color: "#3f7c9a" },
  { id: "echeance", label: "Échéance", color: "#b5462f" },
];
const typeOf = (id: AgendaType) =>
  AGENDA_TYPES.find((t) => t.id === id) ?? AGENDA_TYPES[0];

type AgendaItem = {
  id: number;
  time: string;
  title: string;
  meta: string;
  type: AgendaType;
};

const SEED_AGENDA: AgendaItem[] = [
  {
    id: 1,
    time: "08:30",
    title: "Briefing direction",
    meta: "Salle de réunion · 30 min · 6 participants",
    type: "reunion",
  },
  {
    id: 2,
    time: "10:00",
    title: "RDV client — Filtisac Industries",
    meta: "Bureau direction · présentation du devis bureaux",
    type: "rdv",
  },
  {
    id: 3,
    time: "11:30",
    title: "Appel — Ivoire Bois",
    meta: "Téléphone · confirmation livraison panneaux",
    type: "appel",
  },
  {
    id: 4,
    time: "14:00",
    title: "Déplacement chantier Riviera",
    meta: "Voiture de service réservée · ordre de mission émis",
    type: "deplacement",
  },
  {
    id: 5,
    time: "16:30",
    title: "Point hebdo — atelier menuiserie",
    meta: "Atelier · 45 min · ordre du jour préparé",
    type: "reunion",
  },
];

/* --- Communication ------------------------------------------------------- */
type Level = "urgent" | "normal" | "secondaire";
const LEVEL_LABEL: Record<Level, string> = {
  urgent: "Urgent",
  normal: "Normal",
  secondaire: "Secondaire",
};

const MESSAGES: {
  icon: ComponentType<IconProps>;
  name: string;
  desc: string;
  level: Level;
}[] = [
  {
    icon: MailIcon,
    name: "M. Touré — Filtisac",
    desc: "Validation du devis bureaux",
    level: "urgent",
  },
  {
    icon: MailIcon,
    name: "Hôtel Tiama",
    desc: "Report de la réunion de jeudi",
    level: "urgent",
  },
  {
    icon: PhoneIcon,
    name: "Aïssatou — Décoration",
    desc: "Choix des échantillons de tissu",
    level: "normal",
  },
  {
    icon: FileIcon,
    name: "Banque Atlantique",
    desc: "Relevé mensuel · mai 2026",
    level: "secondaire",
  },
  {
    icon: MailIcon,
    name: "Peintures Sahel",
    desc: "Facture n° CMD-0330",
    level: "secondaire",
  },
];

/* --- Documents à préparer ------------------------------------------------ */
const DOCUMENTS: { title: string; meta: string; status: string }[] = [
  {
    title: "Compte rendu — Briefing direction",
    meta: "À diffuser avant 12:00",
    status: "En cours",
  },
  {
    title: "Présentation — devis bureaux Filtisac",
    meta: "Pour le RDV de 10:00",
    status: "À faire",
  },
  {
    title: "Note interne — congés atelier",
    meta: "Validation direction",
    status: "À faire",
  },
  {
    title: "Rapport hebdomadaire d'activité",
    meta: "Échéance vendredi 20 juin",
    status: "Planifié",
  },
];

/* --- Événements à organiser ---------------------------------------------- */
const EVENTS: { title: string; date: string; meta: string }[] = [
  {
    title: "Réunion trimestrielle de direction",
    date: "27 juin 2026",
    meta: "Salle à réserver · 12 participants",
  },
  {
    title: "Visite client au showroom",
    date: "2 juil. 2026",
    meta: "Préparer la présentation produits",
  },
  {
    title: "Formation logiciel — équipe",
    date: "5 juil. 2026",
    meta: "Intervenant à confirmer",
  },
];

/* --- Notes de frais ------------------------------------------------------ */
const NOTES: { title: string; amount: string; date: string; status: string }[] =
  [
    {
      title: "Carburant — déplacement Riviera",
      amount: "45 000",
      date: "18 juin 2026",
      status: "À valider",
    },
    {
      title: "Déjeuner client — Filtisac",
      amount: "62 000",
      date: "17 juin 2026",
      status: "À valider",
    },
    {
      title: "Fournitures de bureau",
      amount: "28 500",
      date: "16 juin 2026",
      status: "Validée",
    },
    {
      title: "Taxi — réunion Hôtel Tiama",
      amount: "18 000",
      date: "15 juin 2026",
      status: "À valider",
    },
    {
      title: "Hébergement — mission intérieure",
      amount: "120 000",
      date: "12 juin 2026",
      status: "En attente",
    },
    {
      title: "Impressions & reliures",
      amount: "46 500",
      date: "10 juin 2026",
      status: "Validée",
    },
  ];

function statusClass(s: string) {
  switch (s) {
    case "Validée":
      return "done";
    case "En cours":
      return "doing";
    case "Planifié":
      return "plan";
    case "En attente":
      return "wait";
    default:
      return "todo"; // « À faire » / « À valider »
  }
}

/* --------------------------------------------------------------------------
   Navigation (menu groupé) + en-têtes par vue
   -------------------------------------------------------------------------- */
type ViewId =
  | "overview"
  | "agenda"
  | "communication"
  | "documents"
  | "notes"
  | "evenements";

const NAV: {
  group: string;
  items: { id: ViewId; label: string; icon: ComponentType<IconProps> }[];
}[] = [
  {
    group: "Pilotage",
    items: [{ id: "overview", label: "Vue d'ensemble", icon: LayoutGridIcon }],
  },
  {
    group: "Organisation",
    items: [
      { id: "agenda", label: "Agenda", icon: CalendarIcon },
      { id: "evenements", label: "Événements", icon: MapPinIcon },
    ],
  },
  {
    group: "Communication",
    items: [
      { id: "communication", label: "Messages & appels", icon: MessageIcon },
    ],
  },
  {
    group: "Administratif",
    items: [
      { id: "documents", label: "Documents", icon: FileIcon },
      { id: "notes", label: "Notes de frais", icon: ReceiptIcon },
    ],
  },
];

const VIEW_META: Record<ViewId, { title: string; sub: string }> = {
  overview: {
    title: "Assistanat de direction",
    sub: "Agenda, communication, documents et organisation",
  },
  agenda: {
    title: "Agenda du jour",
    sub: "Planifiez et suivez les rendez-vous, réunions et déplacements",
  },
  communication: {
    title: "Communication & filtrage",
    sub: "Appels, e-mails et courriers triés par priorité",
  },
  documents: {
    title: "Documents à préparer",
    sub: "Comptes rendus, notes, présentations et rapports",
  },
  notes: {
    title: "Notes de frais",
    sub: "Suivi et validation des dépenses en attente",
  },
  evenements: {
    title: "Événements à organiser",
    sub: "Réunions, visites et formations à venir",
  },
};

/* --------------------------------------------------------------------------
   Briques d'affichage réutilisables
   -------------------------------------------------------------------------- */
function Panel({
  title,
  sub,
  action,
  children,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <header className="panel__head">
        <div>
          <h2 className="panel__title">{title}</h2>
          {sub && <p className="panel__sub">{sub}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function AgendaList({ items }: { items: AgendaItem[] }) {
  if (!items.length)
    return <p className="panel__empty">Aucun élément à l'agenda.</p>;
  return (
    <ul className="agenda">
      {items.map((it) => {
        const t = typeOf(it.type);
        return (
          <li className="agenda__row" key={it.id}>
            <span className="agenda__time">{it.time}</span>
            <div
              className="agenda__item"
              style={{ "--k": t.color } as CSSProperties}
            >
              <div className="agenda__item-head">
                <span className="agenda__item-title">{it.title}</span>
                <span className="agenda__tag">{t.label}</span>
              </div>
              <p className="agenda__meta">{it.meta}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CommList() {
  return (
    <ul className="rows">
      {MESSAGES.map((m, i) => (
        <li className="row" key={i}>
          <span className="row__icon">
            <m.icon />
          </span>
          <div className="row__text">
            <span className="row__name">{m.name}</span>
            <span className="row__desc">{m.desc}</span>
          </div>
          <span className={`tag-level tag-level--${m.level}`}>
            {LEVEL_LABEL[m.level]}
          </span>
        </li>
      ))}
    </ul>
  );
}

function DocList() {
  return (
    <ul className="rows">
      {DOCUMENTS.map((d, i) => (
        <li className="row" key={i}>
          <span className="row__icon">
            <FileIcon />
          </span>
          <div className="row__text">
            <span className="row__name">{d.title}</span>
            <span className="row__desc">{d.meta}</span>
          </div>
          <span className={`chip chip--${statusClass(d.status)}`}>
            {d.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EventList() {
  return (
    <ul className="events">
      {EVENTS.map((e, i) => (
        <li className="event" key={i}>
          <span className="event__date">
            <CalendarIcon /> {e.date}
          </span>
          <span className="event__title">{e.title}</span>
          <span className="event__meta">{e.meta}</span>
        </li>
      ))}
    </ul>
  );
}

function NoteList() {
  return (
    <ul className="rows">
      {NOTES.map((n, i) => (
        <li className="row" key={i}>
          <span className="row__icon">
            <ReceiptIcon />
          </span>
          <div className="row__text">
            <span className="row__name">{n.title}</span>
            <span className="row__desc">{n.date}</span>
          </div>
          <span className="note__amount">{n.amount} FCFA</span>
          <span className={`chip chip--${statusClass(n.status)}`}>
            {n.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------------------------------------------------
   Modal « Planifier un rendez-vous » (ajout à l'agenda)
   -------------------------------------------------------------------------- */
function PlanModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: Omit<AgendaItem, "id">) => void;
}) {
  const [objet, setObjet] = useState("");
  const [type, setType] = useState<AgendaType>("reunion");
  const [heure, setHeure] = useState("");
  const [lieu, setLieu] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!objet.trim()) {
      setError("Indiquez l'objet du rendez-vous.");
      return;
    }
    if (!heure) {
      setError("Choisissez une heure.");
      return;
    }
    onAdd({
      title: objet.trim(),
      type,
      time: heure,
      meta: lieu.trim() || typeOf(type).label,
    });
  };

  return (
    <div
      className="plan__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="plan__panel">
        <header className="plan__head">
          <h2 id="plan-title" className="plan__title">
            Planifier un rendez-vous
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
            <span className="plan__label">Objet du rendez-vous</span>
            <input
              className="plan__control"
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              placeholder="Ex : RDV client, réunion équipe..."
              autoFocus
            />
          </label>

          <div className="plan__cols">
            <label className="plan__field">
              <span className="plan__label">Type</span>
              <span className="plan__select">
                <select
                  className="plan__control"
                  value={type}
                  onChange={(e) => setType(e.target.value as AgendaType)}
                >
                  {AGENDA_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </span>
            </label>

            <label className="plan__field">
              <span className="plan__label">Heure</span>
              <input
                className="plan__control"
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
              />
            </label>
          </div>

          <label className="plan__field">
            <span className="plan__label">Lieu / détails</span>
            <input
              className="plan__control"
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              placeholder="Ex : Bureau direction · 30 min · 4 participants"
            />
          </label>

          {error && <p className="plan__error">{error}</p>}

          <div className="plan__foot">
            <button
              type="button"
              className="d-btn d-btn--ghost"
              onClick={onClose}
            >
              Annuler
            </button>
            <button type="submit" className="d-btn d-btn--primary">
              Ajouter à l'agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Tableau de bord Assistanat
   -------------------------------------------------------------------------- */
export default function AssistantDashboard({
  onLogout,
}: {
  onLogout?: () => void;
}) {
  const [view, setView] = useState<ViewId>("overview");
  const [dark, setDark] = useState(false);
  const [agenda, setAgenda] = useState<AgendaItem[]>(SEED_AGENDA);
  const [planOpen, setPlanOpen] = useState(false);
  const nextId = useRef(SEED_AGENDA.length + 1);

  const meta = VIEW_META[view];

  const planBtn = (
    <button
      className="d-btn d-btn--primary"
      type="button"
      onClick={() => setPlanOpen(true)}
    >
      <PlusIcon /> Planifier
    </button>
  );

  const addToAgenda = (item: Omit<AgendaItem, "id">) => {
    setAgenda((prev) =>
      [...prev, { ...item, id: nextId.current++ }].sort((a, b) =>
        a.time.localeCompare(b.time)
      )
    );
    setPlanOpen(false);
    setView("agenda");
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
            <span className="dash__brand-sub">Espace Assistanat</span>
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
                  className={`dash__nav-item${
                    view === it.id ? " is-active" : ""
                  }`}
                  onClick={() => setView(it.id)}
                >
                  <it.icon /> {it.label}
                </button>
              ))}
            </div>
          ))}

          <div className="dash__nav-group">
            <p className="dash__nav-label">Outils</p>
            <RappelsMenu scope="assistanat" className="dash__nav-item" />
          </div>
        </nav>

        <div className="dash__foot">
          <div className="dash__user">
            <span className="dash__user-avatar">AM</span>
            <span className="dash__user-text">
              <span className="dash__user-name">Aïda Méité</span>
              <span className="dash__user-role">Assistante de direction</span>
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
            <AlertesMenu scope="assistanat" className="dash__icon-btn" variant="icon" />
            <span className="dash__avatar">AM</span>
          </div>
        </header>

        <main className="dash__content">
          {view === "overview" && (
            <>
              <div className="dash__stats">
                <div className="d-stat">
                  <p className="d-stat__label">Rendez-vous aujourd'hui</p>
                  <p className="d-stat__value">{agenda.length}</p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Réunions cette semaine</p>
                  <p className="d-stat__value">8</p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Messages à traiter</p>
                  <p className="d-stat__value">
                    12 <span className="d-stat__pill">2 urgents</span>
                  </p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Notes de frais en attente</p>
                  <p className="d-stat__value">
                    320 000 <span className="d-stat__unit">FCFA · 6 notes</span>
                  </p>
                </div>
              </div>

              <div className="dash__grid">
                <Panel
                  title="Agenda du jour"
                  sub="Jeudi 19 juin 2026"
                  action={planBtn}
                >
                  <AgendaList items={agenda} />
                </Panel>
                <Panel
                  title="Communication & filtrage"
                  sub="Appels, e-mails et courriers — triés par priorité"
                >
                  <CommList />
                </Panel>
              </div>

              <div className="dash__grid">
                <Panel
                  title="Documents à préparer"
                  sub="Comptes rendus · notes · présentations · rapports"
                >
                  <DocList />
                </Panel>
                <Panel
                  title="Événements à organiser"
                  sub="Réunions, visites et formations à venir"
                >
                  <EventList />
                </Panel>
              </div>
            </>
          )}

          {view === "agenda" && (
            <Panel
              title="Agenda du jour"
              sub="Jeudi 19 juin 2026"
              action={planBtn}
            >
              <AgendaList items={agenda} />
            </Panel>
          )}

          {view === "communication" && (
            <Panel
              title="Communication & filtrage"
              sub="Appels, e-mails et courriers — triés par priorité"
            >
              <CommList />
            </Panel>
          )}

          {view === "documents" && (
            <Panel
              title="Documents à préparer"
              sub="Comptes rendus · notes · présentations · rapports"
            >
              <DocList />
            </Panel>
          )}

          {view === "notes" && (
            <Panel
              title="Notes de frais"
              sub="6 notes · 320 000 FCFA en attente"
            >
              <NoteList />
            </Panel>
          )}

          {view === "evenements" && (
            <Panel
              title="Événements à organiser"
              sub="Réunions, visites et formations à venir"
            >
              <EventList />
            </Panel>
          )}
        </main>
      </div>

      {planOpen && (
        <PlanModal onClose={() => setPlanOpen(false)} onAdd={addToAgenda} />
      )}
    </div>
  );
}
