import { useMemo, useState } from "react";
import type {
  ComponentType,
  FormEvent,
  ReactNode,
  SVGProps,
} from "react";
import "./AssistantDashboard.css"; // coquille « dash » partagée
import "./PersonnelDashboard.css"; // styles propres aux RH
import { HouseIcon, XIcon } from "../components/icons";
import AlertesMenu from "../alertes/AlertesMenu";
import PeriodFilter from "../components/period/PeriodFilter";
import {
  periodFactor,
  periodLabel,
  EMPTY_PERIOD,
  type Period,
} from "../components/period/periodSeries";
import RappelsMenu from "../rappels/RappelsMenu";

/* --------------------------------------------------------------------------
   Icônes locales (au trait, basées sur currentColor)
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
const LayoutGridIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
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
const UserCheckIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </I>
);
const PlaneIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.9 4.2-2.2 2.2H4l-1 1 3 1.5L8.5 20l1-1v-2.2l2.2-2.2 4.2 3.9a.5.5 0 0 0 .8-.5z" />
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
const WalletIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </I>
);

/* --------------------------------------------------------------------------
   Données RH (jeu de démonstration — à brancher sur l'API NestJS)
   -------------------------------------------------------------------------- */
type Presence = "Présent" | "En congé" | "Absent" | "Télétravail";
type Contract = "CDI" | "CDD" | "Stage" | "Intérim";

type Employee = {
  name: string;
  role: string;
  dept: string;
  contract: Contract;
  salary: string; // FCFA, formaté
  presence: Presence;
};

const SEED_EMPLOYEES: Employee[] = [
  { name: "Boubacar Sylla", role: "Chef menuisier", dept: "Atelier", contract: "CDI", salary: "450 000", presence: "Présent" },
  { name: "Mariam Touré", role: "Ébéniste", dept: "Atelier", contract: "CDI", salary: "380 000", presence: "Présent" },
  { name: "Ousmane Coulibaly", role: "Métreur", dept: "Chantier", contract: "CDI", salary: "320 000", presence: "En congé" },
  { name: "Aïssatou Diallo", role: "Décoratrice", dept: "Décoration", contract: "CDD", salary: "300 000", presence: "Présent" },
  { name: "Yao Konan", role: "Poseur", dept: "Chantier", contract: "CDI", salary: "280 000", presence: "Présent" },
  { name: "Fatou Koné", role: "Comptable", dept: "Administration", contract: "CDI", salary: "350 000", presence: "Présent" },
  { name: "Mamadou Bamba", role: "Commercial", dept: "Commercial", contract: "CDI", salary: "340 000", presence: "Télétravail" },
  { name: "Awa Sarr", role: "Assistante de direction", dept: "Administration", contract: "CDD", salary: "250 000", presence: "Présent" },
  { name: "Ibrahima Diop", role: "Apprenti menuisier", dept: "Atelier", contract: "Stage", salary: "120 000", presence: "Absent" },
  { name: "Khady Guèye", role: "Peintre", dept: "Chantier", contract: "Intérim", salary: "220 000", presence: "Présent" },
];

const DEPTS = ["Atelier", "Chantier", "Décoration", "Administration", "Commercial"];
const CONTRACTS: Contract[] = ["CDI", "CDD", "Stage", "Intérim"];

type LeaveStatus = "En attente" | "Approuvé" | "Refusé";
type Leave = {
  id: number;
  name: string;
  type: string;
  range: string;
  days: number;
  status: LeaveStatus;
};

const SEED_LEAVES: Leave[] = [
  { id: 1, name: "Ousmane Coulibaly", type: "Congé annuel", range: "18 → 25 juin", days: 5, status: "En attente" },
  { id: 2, name: "Yao Konan", type: "Congé annuel", range: "1 → 10 juil.", days: 8, status: "En attente" },
  { id: 3, name: "Aïssatou Diallo", type: "Congé maladie", range: "20 → 21 juin", days: 2, status: "Approuvé" },
  { id: 4, name: "Fatou Koné", type: "Congé maternité", range: "1 juil. → 30 sept.", days: 65, status: "Approuvé" },
  { id: 5, name: "Mamadou Bamba", type: "Récupération", range: "23 juin", days: 1, status: "Refusé" },
];

const BULLETINS: { month: string; total: string; status: "Payé" | "En préparation" }[] = [
  { month: "Juin 2026", total: "14 200 000", status: "En préparation" },
  { month: "Mai 2026", total: "13 950 000", status: "Payé" },
  { month: "Avril 2026", total: "13 800 000", status: "Payé" },
  { month: "Mars 2026", total: "13 600 000", status: "Payé" },
];

/* --- Pastilles de statut ------------------------------------------------- */
const PRESENCE_CLASS: Record<Presence, string> = {
  Présent: "present",
  "En congé": "conge",
  Absent: "absent",
  "Télétravail": "remote",
};
const LEAVE_CLASS: Record<LeaveStatus, string> = {
  "En attente": "attente",
  Approuvé: "approuve",
  Refusé: "refuse",
};

function initials(name: string) {
  return name
    .replace(/^(M\.|Mme|Dr)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* --------------------------------------------------------------------------
   Navigation (menu groupé) + en-têtes par vue
   -------------------------------------------------------------------------- */
type ViewId =
  | "overview"
  | "employes"
  | "presence"
  | "conges"
  | "contrats"
  | "paie";

const NAV: {
  group: string;
  items: { id: ViewId; label: string; icon: ComponentType<IconProps> }[];
}[] = [
  {
    group: "Pilotage",
    items: [{ id: "overview", label: "Vue d'ensemble", icon: LayoutGridIcon }],
  },
  {
    group: "Personnel",
    items: [
      { id: "employes", label: "Employés", icon: UsersIcon },
      { id: "presence", label: "Présence", icon: UserCheckIcon },
    ],
  },
  {
    group: "Gestion",
    items: [
      { id: "conges", label: "Congés", icon: PlaneIcon },
      { id: "contrats", label: "Contrats", icon: FileTextIcon },
    ],
  },
  {
    group: "Rémunération",
    items: [{ id: "paie", label: "Paie", icon: WalletIcon }],
  },
];

const VIEW_META: Record<ViewId, { title: string; sub: string }> = {
  overview: {
    title: "Ressources Humaines",
    sub: "Employés, présence, congés et paie",
  },
  employes: {
    title: "Employés",
    sub: "Effectif, postes, contrats et rémunération",
  },
  presence: {
    title: "Présence du jour",
    sub: "Pointage et suivi des présences en temps réel",
  },
  conges: {
    title: "Congés & absences",
    sub: "Demandes à traiter, validations et soldes",
  },
  contrats: {
    title: "Contrats",
    sub: "Répartition CDI, CDD, stages et intérim",
  },
  paie: {
    title: "Paie",
    sub: "Masse salariale, bulletins et historique",
  },
};

/* --------------------------------------------------------------------------
   Tableau de bord RH
   -------------------------------------------------------------------------- */
export default function PersonnelDashboard({
  onLogout,
}: {
  onLogout?: () => void;
}) {
  const [view, setView] = useState<ViewId>("overview");
  const [dark, setDark] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [leaves, setLeaves] = useState<Leave[]>(SEED_LEAVES);
  const [deptFilter, setDeptFilter] = useState("Tous");
  const [modalOpen, setModalOpen] = useState(false);
  const [contractPeriod, setContractPeriod] = useState<Period>(EMPTY_PERIOD);

  const meta = VIEW_META[view];

  /* --- Indicateurs dérivés ---------------------------------------------- */
  const stats = useMemo(() => {
    const present = employees.filter((e) => e.presence === "Présent").length;
    const remote = employees.filter((e) => e.presence === "Télétravail").length;
    const conge = employees.filter((e) => e.presence === "En congé").length;
    const absent = employees.filter((e) => e.presence === "Absent").length;
    return { present, remote, conge, absent, total: employees.length };
  }, [employees]);

  const pendingLeaves = leaves.filter((l) => l.status === "En attente").length;

  const filteredEmployees =
    deptFilter === "Tous"
      ? employees
      : employees.filter((e) => e.dept === deptFilter);

  const addEmployee = (e: Employee) => {
    setEmployees((prev) => [e, ...prev]);
    setModalOpen(false);
    setView("employes");
  };

  const setLeaveStatus = (id: number, status: LeaveStatus) =>
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));

  const addBtn = (
    <button
      type="button"
      className="d-btn d-btn--primary"
      onClick={() => setModalOpen(true)}
    >
      <PlusIcon /> Nouvel employé
    </button>
  );

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
            <span className="dash__brand-sub">Espace Personnel</span>
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
            <RappelsMenu scope="personnel" className="dash__nav-item" />
          </div>
        </nav>

        <div className="dash__foot">
          <div className="dash__user">
            <span className="dash__user-avatar">BS</span>
            <span className="dash__user-text">
              <span className="dash__user-name">Bineta Sarr</span>
              <span className="dash__user-role">Responsable RH</span>
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
              placeholder="Rechercher un employé, un poste..."
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
            <AlertesMenu scope="personnel" className="dash__icon-btn" variant="icon" />
            <span className="dash__avatar">BS</span>
          </div>
        </header>

        <main className="dash__content">
          {/* --- KPI (toujours visibles) --- */}
          <div className="dash__stats">
            <div className="d-stat">
              <p className="d-stat__label">Effectif total</p>
              <p className="d-stat__value">{stats.total}</p>
            </div>
            <div className="d-stat">
              <p className="d-stat__label">Présents aujourd'hui</p>
              <p className="d-stat__value rh-val--green">
                {stats.present + stats.remote}
              </p>
            </div>
            <div className="d-stat">
              <p className="d-stat__label">En congé</p>
              <p className="d-stat__value rh-val--amber">{stats.conge}</p>
            </div>
            <div className="d-stat">
              <p className="d-stat__label">Masse salariale · mois</p>
              <p className="d-stat__value">
                14,2 M <span className="d-stat__unit">FCFA</span>
              </p>
            </div>
          </div>

          {/* --- VUE D'ENSEMBLE --- */}
          {view === "overview" && (
            <>
              <Panel
                title="Employés"
                sub={`${employees.length} collaborateurs`}
                action={addBtn}
              >
                <EmployeeTable items={employees.slice(0, 6)} />
                <button
                  type="button"
                  className="rh-more"
                  onClick={() => setView("employes")}
                >
                  Voir tout l'effectif →
                </button>
              </Panel>

              <div className="dash__grid">
                <Panel
                  title="Présence du jour"
                  sub="Mise à jour en temps réel"
                >
                  <PresenceSummary stats={stats} />
                </Panel>
                <Panel
                  title="Demandes de congés"
                  sub={`${pendingLeaves} en attente de validation`}
                  action={
                    <button
                      type="button"
                      className="d-btn d-btn--ghost"
                      onClick={() => setView("conges")}
                    >
                      Gérer
                    </button>
                  }
                >
                  <LeaveList
                    items={leaves.slice(0, 4)}
                    onApprove={(id) => setLeaveStatus(id, "Approuvé")}
                    onReject={(id) => setLeaveStatus(id, "Refusé")}
                  />
                </Panel>
              </div>
            </>
          )}

          {/* --- EMPLOYÉS --- */}
          {view === "employes" && (
            <Panel
              title="Employés"
              sub={`${filteredEmployees.length} affiché(s) · ${employees.length} au total`}
              action={
                <div className="rh-toolbar">
                  <span className="rh-filter">
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                    >
                      <option value="Tous">Tous les départements</option>
                      {DEPTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </span>
                  {addBtn}
                </div>
              }
            >
              <EmployeeTable items={filteredEmployees} />
            </Panel>
          )}

          {/* --- PRÉSENCE --- */}
          {view === "presence" && (
            <>
              <Panel title="Présence du jour" sub="Pointage en temps réel">
                <PresenceSummary stats={stats} />
              </Panel>
              <Panel title="Détail par employé" sub="Jeudi 19 juin 2026">
                <ul className="rows">
                  {employees.map((e) => (
                    <li className="row" key={e.name}>
                      <span className="rh-avatar">{initials(e.name)}</span>
                      <div className="row__text">
                        <span className="row__name">{e.name}</span>
                        <span className="row__desc">
                          {e.role} · {e.dept}
                        </span>
                      </div>
                      <span
                        className={`rh-status rh-status--${
                          PRESENCE_CLASS[e.presence]
                        }`}
                      >
                        {e.presence}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          )}

          {/* --- CONGÉS --- */}
          {view === "conges" && (
            <>
              <div className="dash__stats rh-stats--3">
                <div className="d-stat">
                  <p className="d-stat__label">En attente</p>
                  <p className="d-stat__value rh-val--amber">{pendingLeaves}</p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Approuvés ce mois</p>
                  <p className="d-stat__value rh-val--green">
                    {leaves.filter((l) => l.status === "Approuvé").length}
                  </p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Jours de congés posés</p>
                  <p className="d-stat__value">
                    {leaves
                      .filter((l) => l.status !== "Refusé")
                      .reduce((s, l) => s + l.days, 0)}
                  </p>
                </div>
              </div>

              <Panel
                title="Demandes de congés"
                sub="Validez ou refusez les demandes en attente"
              >
                <LeaveList
                  items={leaves}
                  onApprove={(id) => setLeaveStatus(id, "Approuvé")}
                  onReject={(id) => setLeaveStatus(id, "Refusé")}
                />
              </Panel>
            </>
          )}

          {/* --- CONTRATS --- */}
          {view === "contrats" && (
            <>
              <Panel
                title="Répartition des contrats"
                sub={
                  contractPeriod.month == null
                    ? `${employees.length} contrats actifs`
                    : `Contrats actifs · ${periodLabel(contractPeriod, 2026)}`
                }
                action={
                  <PeriodFilter
                    value={contractPeriod}
                    onChange={setContractPeriod}
                    year={2026}
                    size="sm"
                  />
                }
              >
                <ContractBars employees={employees} period={contractPeriod} />
              </Panel>
              <Panel title="Détail des contrats" sub="Par employé">
                <EmployeeTable items={employees} variant="contracts" />
              </Panel>
            </>
          )}

          {/* --- PAIE --- */}
          {view === "paie" && (
            <>
              <div className="dash__stats rh-stats--3">
                <div className="d-stat">
                  <p className="d-stat__label">Masse salariale · juin</p>
                  <p className="d-stat__value">
                    14,2 M <span className="d-stat__unit">FCFA</span>
                  </p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Salaire moyen</p>
                  <p className="d-stat__value">
                    338 K <span className="d-stat__unit">FCFA</span>
                  </p>
                </div>
                <div className="d-stat">
                  <p className="d-stat__label">Bulletins à éditer</p>
                  <p className="d-stat__value rh-val--amber">{employees.length}</p>
                </div>
              </div>

              <Panel
                title="Bulletins de paie"
                sub="Historique et préparation du mois en cours"
                action={
                  <button type="button" className="d-btn d-btn--primary">
                    <FileTextIcon /> Générer les bulletins
                  </button>
                }
              >
                <ul className="rows">
                  {BULLETINS.map((b) => (
                    <li className="row" key={b.month}>
                      <span className="row__icon">
                        <WalletIcon />
                      </span>
                      <div className="row__text">
                        <span className="row__name">{b.month}</span>
                        <span className="row__desc">{employees.length} bulletins</span>
                      </div>
                      <span className="rh-amount">{b.total} FCFA</span>
                      <span
                        className={`chip chip--${
                          b.status === "Payé" ? "done" : "todo"
                        }`}
                      >
                        {b.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          )}
        </main>
      </div>

      {modalOpen && (
        <NewEmployeeModal
          onClose={() => setModalOpen(false)}
          onAdd={addEmployee}
        />
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Briques d'affichage
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

function EmployeeTable({
  items,
  variant = "full",
}: {
  items: Employee[];
  variant?: "full" | "contracts";
}) {
  return (
    <div className="rh-table-wrap">
      <table className="rh-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Poste</th>
            <th>Département</th>
            <th>Contrat</th>
            {variant === "full" ? (
              <>
                <th className="rh-num">Salaire</th>
                <th>Statut</th>
              </>
            ) : (
              <th className="rh-num">Salaire</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.name}>
              <td>
                <span className="rh-cell-name">
                  <span className="rh-avatar">{initials(e.name)}</span>
                  <span className="rh-name">{e.name}</span>
                </span>
              </td>
              <td>{e.role}</td>
              <td className="rh-muted">{e.dept}</td>
              <td>
                <span className={`rh-contract rh-contract--${e.contract.toLowerCase()}`}>
                  {e.contract}
                </span>
              </td>
              {variant === "full" ? (
                <>
                  <td className="rh-num rh-salary">{e.salary} FCFA</td>
                  <td>
                    <span
                      className={`rh-status rh-status--${
                        PRESENCE_CLASS[e.presence]
                      }`}
                    >
                      {e.presence}
                    </span>
                  </td>
                </>
              ) : (
                <td className="rh-num rh-salary">{e.salary} FCFA</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PresenceSummary({
  stats,
}: {
  stats: { present: number; remote: number; conge: number; absent: number; total: number };
}) {
  const rows: { label: string; value: number; cls: string }[] = [
    { label: "Présents", value: stats.present, cls: "present" },
    { label: "Télétravail", value: stats.remote, cls: "remote" },
    { label: "En congé", value: stats.conge, cls: "conge" },
    { label: "Absents", value: stats.absent, cls: "absent" },
  ];
  return (
    <ul className="rh-presence">
      {rows.map((r) => (
        <li className="rh-presence__row" key={r.label}>
          <span className={`rh-dot rh-dot--${r.cls}`} />
          <span className="rh-presence__label">{r.label}</span>
          <span className="rh-presence__value">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

function LeaveList({
  items,
  onApprove,
  onReject,
}: {
  items: Leave[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  if (!items.length)
    return <p className="panel__empty">Aucune demande de congé.</p>;
  return (
    <ul className="rows">
      {items.map((l) => (
        <li className="row" key={l.id}>
          <span className="rh-avatar">{initials(l.name)}</span>
          <div className="row__text">
            <span className="row__name">{l.name}</span>
            <span className="row__desc">
              {l.type} · {l.range} · {l.days} j
            </span>
          </div>
          {l.status === "En attente" ? (
            <span className="rh-leave-actions">
              <button
                type="button"
                className="rh-act rh-act--ok"
                onClick={() => onApprove(l.id)}
              >
                Approuver
              </button>
              <button
                type="button"
                className="rh-act rh-act--no"
                onClick={() => onReject(l.id)}
              >
                Refuser
              </button>
            </span>
          ) : (
            <span className={`rh-status rh-status--${LEAVE_CLASS[l.status]}`}>
              {l.status}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function ContractBars({
  employees,
  period,
}: {
  employees: Employee[];
  period: Period;
}) {
  /* effectif par type de contrat, repondéré selon le mois / jour choisi */
  const counts = CONTRACTS.map((c, i) => {
    const base = employees.filter((e) => e.contract === c).length;
    return Math.max(0, Math.round(base * periodFactor(i, period)));
  });
  const total = counts.reduce((s, n) => s + n, 0) || 1;
  return (
    <ul className="rh-bars">
      {CONTRACTS.map((c, i) => {
        const n = counts[i];
        const pct = Math.round((n / total) * 100);
        return (
          <li className="rh-bar" key={c}>
            <div className="rh-bar__head">
              <span className={`rh-contract rh-contract--${c.toLowerCase()}`}>
                {c}
              </span>
              <span className="rh-bar__value">
                {n} · {pct}%
              </span>
            </div>
            <div className="rh-bar__track">
              <span
                className={`rh-bar__fill rh-bar__fill--${c.toLowerCase()}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------------------------------------------------------------
   Modal « Nouvel employé »
   -------------------------------------------------------------------------- */
function NewEmployeeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (e: Employee) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState(DEPTS[0]);
  const [contract, setContract] = useState<Contract>("CDI");
  const [salary, setSalary] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Indiquez le nom de l'employé.");
      return;
    }
    if (!role.trim()) {
      setError("Indiquez le poste.");
      return;
    }
    onAdd({
      name: name.trim(),
      role: role.trim(),
      dept,
      contract,
      salary: salary.trim() ? salary.trim() : "—",
      presence: "Présent",
    });
  };

  return (
    <div
      className="plan__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ne-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="plan__panel">
        <header className="plan__head">
          <h2 id="ne-title" className="plan__title">
            Nouvel employé
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
            <span className="plan__label">Nom complet</span>
            <input
              className="plan__control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Awa Diallo"
              autoFocus
            />
          </label>

          <div className="plan__cols">
            <label className="plan__field">
              <span className="plan__label">Poste</span>
              <input
                className="plan__control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex : Menuisier"
              />
            </label>
            <label className="plan__field">
              <span className="plan__label">Département</span>
              <select
                className="plan__control"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                {DEPTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="plan__cols">
            <label className="plan__field">
              <span className="plan__label">Contrat</span>
              <select
                className="plan__control"
                value={contract}
                onChange={(e) => setContract(e.target.value as Contract)}
              >
                {CONTRACTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="plan__field">
              <span className="plan__label">Salaire (FCFA)</span>
              <input
                className="plan__control"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Ex : 300 000"
              />
            </label>
          </div>

          {error && <p className="plan__error">{error}</p>}

          <div className="plan__foot">
            <button type="button" className="d-btn d-btn--ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="d-btn d-btn--primary">
              Ajouter l'employé
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}