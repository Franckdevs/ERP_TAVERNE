import { useState, type CSSProperties } from "react";
import "./HomePage.css";
import SpaceModal from "../components/SpaceModal";
import {
  ActivityIcon,
  ArrowRightIcon,
  BellIcon,
  BoxIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  EyeIcon,
  GlobeIcon,
  HouseIcon,
  KanbanIcon,
  ListChecksIcon,
  LockIcon,
  MessageIcon,
  QuoteIcon,
  RefreshIcon,
  ShieldIcon,
  StarIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from "../components/icons";

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jui",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const apps = [
  {
    icon: CreditCardIcon,
    title: "Comptabilité",
    desc: "Devis, factures, trésorerie et paie.",
  },
  {
    icon: CalendarIcon,
    title: "Assistanat",
    desc: "Agenda, courriers et tâches administratives.",
  },
  {
    icon: UserIcon,
    title: "Conseil client",
    desc: "Prospects, pipeline et suivi commercial.",
  },
  {
    icon: BoxIcon,
    title: "Gestion de stock",
    desc: "Inventaire, alertes et approvisionnement.",
  },
  {
    icon: UsersIcon,
    title: "Gestion du personnel",
    desc: "Employés, présence, congés et contrats.",
  },
];

const advantages = [
  {
    icon: LockIcon,
    title: "Un accès par rôle",
    desc: "Chaque collaborateur se connecte à son application et ne voit que ce qui le concerne — interface claire et sans distraction.",
  },
  {
    icon: EyeIcon,
    title: "Supervision centrale",
    desc: "La direction dispose d'un tableau de bord consolidé qui réunit les données des cinq applications en temps réel.",
  },
  {
    icon: GlobeIcon,
    title: "Pensé pour le local",
    desc: "Montants en FCFA, gestion adaptée aux entreprises ivoiriennes, hébergement fiable et données sécurisées.",
  },
  {
    icon: ShieldIcon,
    title: "Sécurité conforme",
    desc: "Système conçu selon les normes de sécurité informatique : données chiffrées, sauvegardes régulières, accès protégés et traçabilité des actions.",
  },
];

/* Fonctionnalités de coopération & de suivi en temps réel */
const collab = [
  {
    icon: ListChecksIcon,
    title: "Tâches assignées",
    desc: "Créez, attribuez et clôturez des tâches. Chacun sait qui fait quoi et pour quand.",
  },
  {
    icon: ZapIcon,
    title: "Actions en temps réel",
    desc: "Une facture, un mouvement de stock ou un rendez-vous saisi s'affiche aussitôt pour toute l'équipe.",
  },
  {
    icon: KanbanIcon,
    title: "Tableau d'avancement",
    desc: "Suivez vos dossiers en colonnes — À faire, En cours, Terminé — d'un seul coup d'œil.",
  },
  {
    icon: BellIcon,
    title: "Notifications ciblées",
    desc: "Soyez prévenu dès qu'une tâche vous concerne, qu'un seuil de stock est atteint ou qu'une échéance approche.",
  },
  {
    icon: MessageIcon,
    title: "Échanges intégrés",
    desc: "Commentez directement une tâche, un devis ou un client. Toute la discussion reste au bon endroit.",
  },
  {
    icon: RefreshIcon,
    title: "Données synchronisées",
    desc: "Une seule source de vérité partagée entre les cinq applications, toujours à jour.",
  },
];

/* Étapes « Comment ça marche » */
const steps = [
  {
    num: "01",
    title: "Chacun se connecte à son espace",
    desc: "Chaque collaborateur ouvre son application dédiée selon son rôle et retrouve ses tâches du jour.",
  },
  {
    num: "02",
    title: "Les équipes agissent et se coordonnent",
    desc: "Devis, stock, rendez-vous, paie : chaque action met à jour la plateforme en temps réel pour les autres services.",
  },
  {
    num: "03",
    title: "La direction supervise l'ensemble",
    desc: "Un tableau de bord consolidé réunit l'activité des cinq métiers et le suivi des tâches en direct.",
  },
];

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const openAuth = () => setAuthOpen(true);

  return (
    <div className="lp">
      {/* --- Navigation --- */}
      <header className="lp__nav">
        <div className="lp__container lp__nav-inner">
          <a className="lp__brand" href="#">
            <span className="lp__brand-mark">
              <HouseIcon />
            </span>
            Taverne
          </a>

          <nav className="lp__nav-links">
            <a href="#applications">Applications</a>
            <a href="#collaboration">Coopération</a>
            <a href="#avantages">Avantages</a>
            <a href="#apropos">À propos</a>
          </nav>

          <div className="lp__nav-actions">
            <button className="btn btn--ghost" type="button" onClick={openAuth}>
              Se connecter
            </button>
            <button
              className="btn btn--primary"
              type="button"
              onClick={openAuth}
            >
              Accéder à mon espace
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* --- Hero --- */}
        <section className="hero">
          <div className="lp__container hero__grid">
            <div className="hero__copy">
              <span className="pill">
                Plateforme collaborative · Suivi en temps réel
              </span>
              <h1 className="hero__title">
                Travaillez ensemble,
                <br />
                <span>suivez tout en temps réel.</span>
              </h1>
              <p className="hero__subtitle">
                Taverne réunit vos cinq métiers sur une seule plateforme de
                coopération : chaque équipe agit dans son espace, les tâches et
                les actions se synchronisent à l'instant, et la direction garde
                une vue d'ensemble en direct.
              </p>
              <div className="hero__actions">
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={openAuth}
                >
                  Accéder à mon espace <ArrowRightIcon />
                </button>
                <button className="btn btn--light" type="button">
                  Voir les applications
                </button>
              </div>

              <ul className="hero__trust">
                <li>
                  <ZapIcon /> Actions en temps réel
                </li>
                <li>
                  <ListChecksIcon /> Suivi des tâches
                </li>
                <li>
                  <UsersIcon /> Travail d'équipe
                </li>
              </ul>
            </div>

            <Dashboard />
          </div>
        </section>

        {/* --- Applications --- */}
        <section className="section section--beige" id="applications">
          <div className="lp__container lp__container--wide">
            <div className="section__head">
              <p className="eyebrow">Cinq applications, un seul système</p>
              <h2 className="section__title">Chaque métier, son espace dédié</h2>
              <p className="section__subtitle">
                Vos collaborateurs se connectent à leur application et
                retrouvent leur propre tableau de bord.
              </p>
            </div>

            <div className="apps">
              {apps.map(({ icon: Icon, title, desc }) => (
                <article className="app-card" key={title}>
                  <span className="app-card__icon">
                    <Icon />
                  </span>
                  <h3 className="app-card__title">{title}</h3>
                  <p className="app-card__desc">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- Coopération & suivi en temps réel --- */}
        <section className="section" id="collaboration">
          <div className="lp__container">
            <div className="section__head">
              <p className="eyebrow">Coopération &amp; suivi en temps réel</p>
              <h2 className="section__title">Une équipe, un seul rythme</h2>
              <p className="section__subtitle">
                Au-delà de la gestion, Taverne fait travailler vos services
                ensemble : tâches, actions et informations circulent en direct
                entre les métiers — sans e-mails perdus ni fichiers en double.
              </p>
            </div>

            <div className="collab">
              <ActivityFeed />

              <ul className="collab__features">
                {collab.map(({ icon: Icon, title, desc }) => (
                  <li className="collab__feature" key={title}>
                    <span className="collab__feature-icon">
                      <Icon />
                    </span>
                    <div>
                      <h3 className="collab__feature-title">{title}</h3>
                      <p className="collab__feature-desc">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- Comment ça marche --- */}
        <section className="section section--beige" id="fonctionnement">
          <div className="lp__container">
            <div className="section__head">
              <p className="eyebrow">Comment ça marche</p>
              <h2 className="section__title">
                De la saisie au pilotage, en trois temps
              </h2>
              <p className="section__subtitle">
                Un fonctionnement simple où chaque rôle trouve sa place, du
                terrain à la direction.
              </p>
            </div>

            <div className="steps">
              {steps.map(({ num, title, desc }) => (
                <article className="step" key={num}>
                  <span className="step__num">{num}</span>
                  <h3 className="step__title">{title}</h3>
                  <p className="step__desc">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- Avantages --- */}
        <section className="section" id="avantages">
          <div className="lp__container advantages">
            {advantages.map(({ icon: Icon, title, desc }) => (
              <article className="advantage" key={title}>
                <span className="advantage__icon">
                  <Icon />
                </span>
                <h3 className="advantage__title">{title}</h3>
                <p className="advantage__desc">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* --- Employé du mois --- */}
        <section className="section section--beige" id="equipe">
          <div className="lp__container">
            <div className="section__head">
              <p className="eyebrow">Notre équipe</p>
              <h2 className="section__title">Celles et ceux qui font Taverne</h2>
              <p className="section__subtitle">
                Chaque mois, nous mettons à l'honneur un collaborateur dont le
                travail fait la différence.
              </p>
            </div>

            <article className="emp">
              <div className="emp__profile">
                <p className="emp__badge">
                  <TrophyIcon /> Employé du mois
                </p>

                <div className="emp__person">
                  <span className="emp__avatar">BS</span>
                  <div className="emp__id">
                    <h3 className="emp__name">Boubacar Sylla</h3>
                    <p className="emp__role">Chef menuisier</p>
                    <p className="emp__team">Atelier menuiserie</p>
                  </div>
                </div>

                <div className="emp__rating">
                  <span className="emp__stars" aria-label="5 étoiles sur 5">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </span>
                  <span className="emp__period">Juin 2026</span>
                </div>
              </div>

              <div className="emp__content">
                <QuoteIcon className="emp__quote-icon" />
                <blockquote className="emp__quote">
                  Chaque meuble qui sort de l'atelier porte le nom de Taverne.
                  La qualité, c'est notre signature — et ça commence par le
                  détail.
                </blockquote>

                <div className="emp__stats">
                  <div className="emp__stat">
                    <div className="emp__stat-value">12 ans</div>
                    <div className="emp__stat-label">
                      d'ancienneté dans l'atelier
                    </div>
                  </div>
                  <div className="emp__stat">
                    <div className="emp__stat-value">38</div>
                    <div className="emp__stat-label">
                      projets livrés cette année
                    </div>
                  </div>
                  <div className="emp__stat">
                    <div className="emp__stat-value">100%</div>
                    <div className="emp__stat-label">
                      commandes dans les délais
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="section" id="apropos" style={{ paddingTop: 0 }}>
          <div className="lp__container">
            <div className="cta">
              <h2 className="cta__title">La plateforme de gestion de Taverne</h2>
              <p className="cta__text">
                Connectez-vous à votre application et retrouvez votre tableau de
                bord. Un seul système pour réunir toutes les équipes de
                l'entreprise.
              </p>
              <div className="cta__actions">
                <button
                  className="btn btn--cream"
                  type="button"
                  onClick={openAuth}
                >
                  Accéder à mon espace <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="lp__footer">
        <div className="lp__container lp__footer-inner">
          <span>© {new Date().getFullYear()} ERP Taverne</span>
          <span>Gestion d'entreprise · Côte d'Ivoire · FCFA</span>
        </div>
      </footer>

      <SpaceModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

/* --------------------------------------------------------------------------
   Mockup « Tableau de bord · Direction » du hero
   -------------------------------------------------------------------------- */
function Dashboard() {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock__bar">
        <div className="mock__dots">
          <span />
          <span />
          <span />
        </div>
        <span className="mock__bar-title">Tableau de bord · Direction</span>
      </div>

      <div className="mock__body">
        <div className="mock__stats">
          <div className="stat">
            <div className="stat__label">Chiffre d'affaires · mois</div>
            <div className="stat__value">48,7 M</div>
          </div>
          <div className="stat">
            <div className="stat__label">Clients</div>
            <div className="stat__value">284</div>
          </div>
          <div className="stat">
            <div className="stat__label">Employés</div>
            <div className="stat__value">42</div>
          </div>
        </div>

        <div className="chart">
          <div className="chart__head">
            <div>
              <div className="chart__title">Évolution des ventes</div>
              <div className="chart__sub">12 derniers mois · millions FCFA</div>
            </div>
            <div>
              <div className="chart__value">49 M</div>
              <div className="chart__delta">▲ 12,4 %</div>
            </div>
          </div>

          <svg className="chart__svg" viewBox="0 0 520 170" role="img">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a85c1f" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a85c1f" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* lignes de repère */}
            {[40, 80, 120].map((y) => (
              <line
                key={y}
                x1="10"
                y1={y}
                x2="510"
                y2={y}
                stroke="#e7dccd"
                strokeWidth="1"
              />
            ))}

            {/* aire sous la courbe */}
            <path
              className="chart__area"
              d="M20 138 C 60 134, 80 118, 110 124 C 140 130, 165 102, 195 108 C 225 114, 250 88, 280 94 C 310 100, 335 74, 365 80 C 395 86, 420 56, 450 56 C 470 56, 486 44, 500 40 L 500 150 L 20 150 Z"
              fill="url(#area)"
            />
            {/* courbe (tracée à l'animation) */}
            <path
              className="chart__line"
              pathLength={1}
              d="M20 138 C 60 134, 80 118, 110 124 C 140 130, 165 102, 195 108 C 225 114, 250 88, 280 94 C 310 100, 335 74, 365 80 C 395 86, 420 56, 450 56 C 470 56, 486 44, 500 40"
              fill="none"
              stroke="#a85c1f"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* halo pulsant + point final */}
            <circle
              className="chart__pulse"
              cx="500"
              cy="40"
              r="5"
              fill="none"
              stroke="#8b4513"
              strokeWidth="2"
            />
            <circle
              className="chart__dot"
              cx="500"
              cy="40"
              r="5"
              fill="#8b4513"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>

          <div className="chart__months">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="mock__pills">
          <div
            className="mock-pill"
            style={{ "--dot": "#5a9e5a" } as CSSProperties}
          >
            17 projets actifs
          </div>
          <div
            className="mock-pill"
            style={{ "--dot": "#c79a3a" } as CSSProperties}
          >
            23 factures en attente
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Mockup « Fil d'activité · en direct » de la section Coopération
   -------------------------------------------------------------------------- */
const feed = [
  {
    icon: CreditCardIcon,
    who: "Comptabilité",
    action: "Facture #1042 validée",
    time: "à l'instant",
    dot: "#5a9e5a",
  },
  {
    icon: BoxIcon,
    who: "Gestion de stock",
    action: "Seuil bas : chêne massif (8 u.)",
    time: "il y a 2 min",
    dot: "#c79a3a",
  },
  {
    icon: UserIcon,
    who: "Conseil client",
    action: "Nouveau prospect ajouté",
    time: "il y a 5 min",
    dot: "#8b4513",
  },
  {
    icon: CalendarIcon,
    who: "Assistanat",
    action: "RDV de livraison planifié",
    time: "il y a 8 min",
    dot: "#a85c1f",
  },
];

function ActivityFeed() {
  return (
    <div className="feed" aria-hidden="true">
      <div className="feed__bar">
        <span className="feed__bar-title">
          <ActivityIcon /> Fil d'activité
        </span>
        <span className="feed__live">
          <span className="feed__live-dot" /> En direct
        </span>
      </div>

      <ul className="feed__list">
        {feed.map((f) => (
          <li className="feed__item" key={f.action}>
            <span
              className="feed__item-icon"
              style={{ "--dot": f.dot } as CSSProperties}
            >
              <f.icon />
            </span>
            <div className="feed__item-body">
              <span className="feed__who">{f.who}</span>
              <span className="feed__action">{f.action}</span>
            </div>
            <span className="feed__time">
              <ClockIcon /> {f.time}
            </span>
          </li>
        ))}
      </ul>

      <div className="feed__foot">
        <div className="feed__task">
          <span className="feed__task-check">
            <CheckIcon />
          </span>
          <span className="feed__task-label">Tâches du jour</span>
          <span className="feed__task-count">14 / 18</span>
        </div>
        <div className="feed__progress">
          <span style={{ width: "78%" }} />
        </div>
        <p className="feed__trend">
          <TrendingUpIcon /> +6 tâches clôturées depuis ce matin
        </p>
      </div>
    </div>
  );
}
