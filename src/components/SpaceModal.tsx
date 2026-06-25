import { useEffect, useState, type FormEvent } from "react";
import "./SpaceModal.css";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoxIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChevronRightIcon,
  CreditCardIcon,
  CrownIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "./icons";

/* --------------------------------------------------------------------------
   Espaces disponibles + administrateur central
   -------------------------------------------------------------------------- */
type Space = {
  id: string;
  icon: typeof CreditCardIcon;
  title: string;
  desc: string;
};

const SPACES: Space[] = [
  {
    id: "comptabilite",
    icon: CreditCardIcon,
    title: "Comptabilité",
    desc: "Devis, factures, trésorerie",
  },
  {
    id: "assistanat",
    icon: CalendarIcon,
    title: "Assistanat",
    desc: "Agenda, communication, documents",
  },
  {
    id: "conseil",
    icon: UserIcon,
    title: "Conseil client",
    desc: "Prospects et pipeline commercial",
  },
  {
    id: "commercial",
    icon: BriefcaseIcon,
    title: "Chargé commercial",
    desc: "Ventes, objectifs et devis",
  },
  {
    id: "stock",
    icon: BoxIcon,
    title: "Gestion de stock",
    desc: "Inventaire, alertes et appro.",
  },
  {
    id: "personnel",
    icon: UsersIcon,
    title: "Gestion du personnel",
    desc: "Employés, présence, congés",
  },
];

const ADMIN_SPACE: Space = {
  id: "admin",
  icon: CrownIcon,
  title: "Administrateur central",
  desc: "Accès à toutes les applications",
};

/* Étapes du processus « mot de passe oublié » */
type Mode = "login" | "forgot-email" | "forgot-code" | "forgot-reset" | "forgot-done";

/* -------------------------------------------------------------------------- */
type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SpaceModal({ open, onClose }: Props) {
  const [space, setSpace] = useState<Space | null>(null);
  const [mode, setMode] = useState<Mode>("login");

  // Champs du flux « mot de passe oublié »
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");

  /* Fermeture clavier + verrouillage du défilement de fond */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  /* On repart de la sélection à chaque ouverture */
  useEffect(() => {
    if (open) setSpace(null);
  }, [open]);

  /* On revient toujours à l'écran de connexion quand l'espace change */
  useEffect(() => {
    setMode("login");
    setError("");
    setCode("");
    setNewPwd("");
    setConfirmPwd("");
  }, [space]);

  if (!open) return null;

  /* --- Soumissions (points d'ancrage prêts pour l'API NestJS) ------------- */
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST {VITE_API_URL}/auth/login { space, email, password }
    onClose();
    // Redirection vers l'espace choisi (seul « assistanat » a un dashboard
    // pour l'instant ; les autres retombent sur la landing — voir App.tsx).
    if (space) window.location.hash = `#/${space.id}`;
  };

  const handleSendCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // TODO: POST {VITE_API_URL}/auth/forgot-password { email }
    setMode("forgot-code");
  };

  const handleVerifyCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("Entrez le code à 6 chiffres reçu par email.");
      return;
    }
    setError("");
    // TODO: POST {VITE_API_URL}/auth/verify-code { email, code }
    setMode("forgot-reset");
  };

  const handleResetPwd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPwd.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    // TODO: POST {VITE_API_URL}/auth/reset-password { email, code, newPwd }
    setMode("forgot-done");
  };

  const backFromStep = () => {
    if (mode === "login") {
      setSpace(null);
    } else {
      setMode("login");
      setError("");
    }
  };

  return (
    <div
      className="sm__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sm-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`sm__panel${space === null ? " sm__panel--wide" : ""}`}>
        <button
          type="button"
          className="sm__close"
          aria-label="Fermer"
          onClick={onClose}
        >
          <XIcon />
        </button>

        {space === null ? (
          /* --- Étape 1 : choix de l'espace ------------------------------- */
          <div className="sm__step">
            <img className="sm__logo" src="/logo-taverne.png" alt="Taverne — Un intérieur à votre image" />
            <h2 id="sm-title" className="sm__title">
              Choisissez votre espace
            </h2>
            <p className="sm__subtitle">
              Sélectionnez le service auquel vous accédez.
            </p>

            <ul className="sm__list">
              {SPACES.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="sm__space"
                    onClick={() => setSpace(s)}
                  >
                    <span className="sm__space-icon">
                      <s.icon />
                    </span>
                    <span className="sm__space-text">
                      <span className="sm__space-title">{s.title}</span>
                      <span className="sm__space-desc">{s.desc}</span>
                    </span>
                    <ChevronRightIcon className="sm__space-chevron" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="sm__divider">
              <span>OU</span>
            </div>

            <button
              type="button"
              className="sm__space sm__space--admin"
              onClick={() => setSpace(ADMIN_SPACE)}
            >
              <span className="sm__space-icon">
                <CrownIcon />
              </span>
              <span className="sm__space-text">
                <span className="sm__space-title">{ADMIN_SPACE.title}</span>
                <span className="sm__space-desc">{ADMIN_SPACE.desc}</span>
              </span>
              <ChevronRightIcon className="sm__space-chevron" />
            </button>
          </div>
        ) : (
          /* --- Étape 2 : connexion / mot de passe oublié ----------------- */
          <div className="sm__step">
            <button type="button" className="sm__back" onClick={backFromStep}>
              <ArrowLeftIcon /> {mode === "login" ? space.title : "Connexion"}
            </button>

            {/* ----- Connexion ----- */}
            {mode === "login" && (
              <>
                <h2 id="sm-title" className="sm__title">
                  Connexion à votre espace
                </h2>
                <p className="sm__subtitle">
                  Accédez au tableau de bord de votre application.
                </p>

                <form className="sm__form" onSubmit={handleLogin}>
                  <label className="sm__field">
                    <span className="sm__label">
                      Adresse e-mail professionnelle
                    </span>
                    <span className="sm__input">
                      <MailIcon />
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="prenom.nom@taverne.ci"
                        required
                      />
                    </span>
                  </label>

                  <label className="sm__field">
                    <span className="sm__label-row">
                      <span className="sm__label">Mot de passe</span>
                      <button
                        type="button"
                        className="sm__forgot"
                        onClick={() => {
                          setError("");
                          setMode("forgot-email");
                        }}
                      >
                        Oublié ?
                      </button>
                    </span>
                    <PasswordInput
                      name="password"
                      autoComplete="current-password"
                    />
                  </label>

                  <label className="sm__check">
                    <input type="checkbox" name="remember" />
                    <span>Rester connecté sur cet appareil</span>
                  </label>

                  <button type="submit" className="sm__submit">
                    Se connecter <ArrowRightIcon />
                  </button>
                </form>

                <p className="sm__secure">
                  <ShieldIcon /> Connexion sécurisée · réservée aux
                  collaborateurs Taverne
                </p>
              </>
            )}

            {/* ----- Oublié : 1. email ----- */}
            {mode === "forgot-email" && (
              <>
                <h2 id="sm-title" className="sm__title">
                  Mot de passe oublié
                </h2>
                <p className="sm__subtitle">
                  Saisissez votre email : nous vous enverrons un code de
                  réinitialisation.
                </p>
                <ForgotSteps current={0} />

                <form className="sm__form" onSubmit={handleSendCode}>
                  <label className="sm__field">
                    <span className="sm__label">
                      Adresse e-mail professionnelle
                    </span>
                    <span className="sm__input">
                      <MailIcon />
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="prenom.nom@taverne.ci"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </span>
                  </label>

                  {error && <p className="sm__error">{error}</p>}

                  <button type="submit" className="sm__submit">
                    Envoyer le code <ArrowRightIcon />
                  </button>
                </form>

                <BackLink onClick={() => setMode("login")} />
              </>
            )}

            {/* ----- Oublié : 2. code ----- */}
            {mode === "forgot-code" && (
              <>
                <h2 id="sm-title" className="sm__title">
                  Vérification
                </h2>
                <p className="sm__subtitle">
                  Entrez le code à 6 chiffres envoyé à{" "}
                  <strong>{email || "votre email"}</strong>.
                </p>
                <ForgotSteps current={1} />

                <form className="sm__form" onSubmit={handleVerifyCode}>
                  <label className="sm__field">
                    <span className="sm__label">Code de vérification</span>
                    <span className="sm__input">
                      <LockIcon />
                      <input
                        className="sm__code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="••••••"
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        required
                      />
                    </span>
                  </label>

                  {error && <p className="sm__error">{error}</p>}

                  <button type="submit" className="sm__submit">
                    Vérifier <ArrowRightIcon />
                  </button>
                </form>

                <p className="sm__alt">
                  Code non reçu ?{" "}
                  <button
                    type="button"
                    className="sm__forgot"
                    onClick={() => setError("")}
                  >
                    Renvoyer le code
                  </button>
                </p>
                <BackLink onClick={() => setMode("login")} />
              </>
            )}

            {/* ----- Oublié : 3. nouveau mot de passe ----- */}
            {mode === "forgot-reset" && (
              <>
                <h2 id="sm-title" className="sm__title">
                  Nouveau mot de passe
                </h2>
                <p className="sm__subtitle">
                  Choisissez un mot de passe d'au moins 8 caractères.
                </p>
                <ForgotSteps current={2} />

                <form className="sm__form" onSubmit={handleResetPwd}>
                  <label className="sm__field">
                    <span className="sm__label">Nouveau mot de passe</span>
                    <PasswordInput
                      autoComplete="new-password"
                      value={newPwd}
                      onChange={setNewPwd}
                    />
                  </label>

                  <label className="sm__field">
                    <span className="sm__label">Confirmer le mot de passe</span>
                    <PasswordInput
                      autoComplete="new-password"
                      value={confirmPwd}
                      onChange={setConfirmPwd}
                    />
                  </label>

                  {error && <p className="sm__error">{error}</p>}

                  <button type="submit" className="sm__submit">
                    Réinitialiser <ArrowRightIcon />
                  </button>
                </form>

                <BackLink onClick={() => setMode("login")} />
              </>
            )}

            {/* ----- Oublié : 4. confirmation ----- */}
            {mode === "forgot-done" && (
              <div className="sm__done">
                <span className="sm__done-icon">
                  <CheckIcon />
                </span>
                <h2 id="sm-title" className="sm__title">
                  Mot de passe réinitialisé
                </h2>
                <p className="sm__subtitle">
                  Vous pouvez maintenant vous connecter avec votre nouveau mot de
                  passe.
                </p>
                <button
                  type="button"
                  className="sm__submit"
                  onClick={() => setMode("login")}
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sous-composants                                                            */
/* -------------------------------------------------------------------------- */

/* Champ mot de passe avec bouton afficher / masquer */
function PasswordInput({
  name,
  autoComplete,
  value,
  onChange,
  placeholder = "••••••••",
}: {
  name?: string;
  autoComplete: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <span className="sm__input">
      <LockIcon />
      <input
        type={show ? "text" : "password"}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required
      />
      <button
        type="button"
        className="sm__eye"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={show}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </span>
  );
}

/* Indicateur des 3 étapes du flux « mot de passe oublié » */
function ForgotSteps({ current }: { current: number }) {
  return (
    <div className="sm__steps" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`sm__step-dot ${i <= current ? "is-active" : ""}`}
        />
      ))}
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="sm__back sm__back--footer"
      onClick={onClick}
    >
      <ArrowLeftIcon /> Retour à la connexion
    </button>
  );
}

/* Œil barré (état « masquer ») — inline pour rester autonome */
function EyeOffIcon() {
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
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

/* Coche de succès — inline */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={30}
      height={30}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
