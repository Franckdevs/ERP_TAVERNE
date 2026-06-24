import { useState } from "react";
import { ANNEE_COURANTE, formatFCFA } from "../data";
import { CheckIcon } from "../icons";

/* ==========================================================================
   Paramètres généraux — espace Comptabilité
   Réglages locaux (mock, aucun backend) : identité, exercice, caisse,
   préférences d'affichage. Tout est conservé en mémoire de session.
   ========================================================================== */

type Reglages = {
  raisonSociale: string;
  responsable: string;
  telephone: string;
  email: string;
  adresse: string;
  exercice: number;
  devise: string;
  moisCloture: number;
  soldeOuverture: number;
  seuilAlerte: number;
  formatDate: string;
  modeSombreDefaut: boolean;
  alertesEmail: boolean;
  validationDoubleSaisie: boolean;
};

const DEFAUT: Reglages = {
  raisonSociale: "La Taverne — Architecture d'intérieur",
  responsable: "Bamba Ange Sarah",
  telephone: "+225 07 68 36 76 09",
  email: "infos@lataverne.ci",
  adresse: "Cocody, Djorobité 1 — Abidjan, Côte d'Ivoire",
  exercice: ANNEE_COURANTE,
  devise: "FCFA",
  moisCloture: 12,
  soldeOuverture: 0,
  seuilAlerte: 50000,
  formatDate: "JJ/MM/AAAA",
  modeSombreDefaut: false,
  alertesEmail: true,
  validationDoubleSaisie: false,
};

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function ParametresView() {
  const [form, setForm] = useState<Reglages>(DEFAUT);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Reglages>(key: K, value: Reglages[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };
  const onReset = () => {
    setForm(DEFAUT);
    setSaved(false);
  };

  return (
    <form className="cc-stack" onSubmit={onSave}>
      {saved && (
        <p className="cc-saved" role="status">
          <CheckIcon /> Paramètres enregistrés.
        </p>
      )}

      {/* --- Identité de l'entreprise --- */}
      <section className="cc-card cc-panel">
        <header className="cc-panel__head cc-panel__head--bar">
          <h2 className="cc-panel__title cc-panel__title--sm">Identité de l'entreprise</h2>
        </header>
        <div className="cc-form">
          <div className="cc-form__cols">
            <label className="cc-field">
              <span>Raison sociale</span>
              <input className="cc-control" value={form.raisonSociale} onChange={(e) => set("raisonSociale", e.target.value)} />
            </label>
            <label className="cc-field">
              <span>Responsable comptable</span>
              <input className="cc-control" value={form.responsable} onChange={(e) => set("responsable", e.target.value)} />
            </label>
            <label className="cc-field">
              <span>Téléphone</span>
              <input className="cc-control" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} />
            </label>
            <label className="cc-field">
              <span>Email</span>
              <input type="email" className="cc-control" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </label>
          </div>
          <label className="cc-field">
            <span>Adresse</span>
            <input className="cc-control" value={form.adresse} onChange={(e) => set("adresse", e.target.value)} />
          </label>
        </div>
      </section>

      {/* --- Exercice & devise --- */}
      <section className="cc-card cc-panel">
        <header className="cc-panel__head cc-panel__head--bar">
          <h2 className="cc-panel__title cc-panel__title--sm">Exercice & devise</h2>
        </header>
        <div className="cc-form">
          <div className="cc-form__cols">
            <label className="cc-field">
              <span>Année d'exercice</span>
              <select className="cc-control" value={form.exercice} onChange={(e) => set("exercice", Number(e.target.value))}>
                {[ANNEE_COURANTE - 2, ANNEE_COURANTE - 1, ANNEE_COURANTE, ANNEE_COURANTE + 1].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>
            <label className="cc-field">
              <span>Devise</span>
              <select className="cc-control" value={form.devise} onChange={(e) => set("devise", e.target.value)}>
                <option value="FCFA">FCFA (Franc CFA)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (Dollar US)</option>
              </select>
            </label>
            <label className="cc-field">
              <span>Mois de clôture</span>
              <select className="cc-control" value={form.moisCloture} onChange={(e) => set("moisCloture", Number(e.target.value))}>
                {MOIS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </label>
            <label className="cc-field">
              <span>Format de date</span>
              <select className="cc-control" value={form.formatDate} onChange={(e) => set("formatDate", e.target.value)}>
                <option value="JJ/MM/AAAA">JJ/MM/AAAA</option>
                <option value="AAAA-MM-JJ">AAAA-MM-JJ</option>
                <option value="JJ-MM-AAAA">JJ-MM-AAAA</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* --- Caisse --- */}
      <section className="cc-card cc-panel">
        <header className="cc-panel__head cc-panel__head--bar">
          <h2 className="cc-panel__title cc-panel__title--sm">Caisse</h2>
        </header>
        <div className="cc-form">
          <div className="cc-form__cols">
            <label className="cc-field">
              <span>Solde d'ouverture ({form.devise})</span>
              <input type="number" min={0} className="cc-control" value={form.soldeOuverture} onChange={(e) => set("soldeOuverture", Number(e.target.value))} />
            </label>
            <label className="cc-field">
              <span>Seuil d'alerte caisse basse ({form.devise})</span>
              <input type="number" min={0} className="cc-control" value={form.seuilAlerte} onChange={(e) => set("seuilAlerte", Number(e.target.value))} />
            </label>
          </div>
          <p className="cc-toolbar__hint">
            Une alerte s'affichera lorsque le solde de caisse passera sous {formatFCFA(form.seuilAlerte)}.
          </p>
        </div>
      </section>

      {/* --- Préférences --- */}
      <section className="cc-card cc-panel">
        <header className="cc-panel__head cc-panel__head--bar">
          <h2 className="cc-panel__title cc-panel__title--sm">Préférences</h2>
        </header>
        <div className="cc-set">
          <Toggle
            label="Mode sombre par défaut"
            hint="Ouvrir l'espace Comptabilité en thème sombre."
            checked={form.modeSombreDefaut}
            onChange={(v) => set("modeSombreDefaut", v)}
          />
          <Toggle
            label="Alertes par email"
            hint="Recevoir les alertes de caisse basse et de clôture par email."
            checked={form.alertesEmail}
            onChange={(v) => set("alertesEmail", v)}
          />
          <Toggle
            label="Double validation des saisies"
            hint="Exiger une confirmation avant d'enregistrer une écriture du brouillard."
            checked={form.validationDoubleSaisie}
            onChange={(v) => set("validationDoubleSaisie", v)}
          />
        </div>
      </section>

      <section className="cc-card cc-toolbar">
        <p className="cc-toolbar__hint">Les modifications s'appliquent à votre session.</p>
        <div className="cc-toolbar__actions">
          <button type="button" className="cc-btn cc-btn--ghost" onClick={onReset}>Réinitialiser</button>
          <button type="submit" className="cc-btn cc-btn--primary">Enregistrer</button>
        </div>
      </section>
    </form>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="cc-set__row">
      <span className="cc-set__text">
        <span className="cc-set__label">{label}</span>
        <span className="cc-set__hint">{hint}</span>
      </span>
      <label className="cc-switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
        <span className="cc-switch__track" />
      </label>
    </div>
  );
}
