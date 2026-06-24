import { useEffect, useState } from "react";

/* ===========================================================================
   Gestion des alertes — store partagé (localStorage + synchro intra-onglet).

   Une « alerte » est planifiée avec un intitulé, une date/heure et une
   priorité (Maximale / Moyenne / Basse). Lorsque la date arrive, l'alerte
   est « déclenchée » : elle s'affiche partout sur le tableau de bord
   (bannière flottante) et alimente le compteur de la cloche.

   Le store est conservé dans le localStorage, séparé par espace (`scope`).
   Un petit pub/sub maintient la cloche et la bannière synchronisées dans le
   même onglet ; l'événement `storage` couvre les autres onglets.
   --------------------------------------------------------------------------- */

export type Priorite = "max" | "moyenne" | "basse";

export type Alerte = {
  id: string;
  titre: string;
  date: string; // AAAA-MM-JJ
  heure: string; // HH:MM
  priorite: Priorite;
  vu: boolean; // acquittée → masquée de la bannière
};

export const PRIORITES: { id: Priorite; label: string; court: string }[] = [
  { id: "max", label: "Maximale", court: "Max" },
  { id: "moyenne", label: "Moyenne", court: "Moyenne" },
  { id: "basse", label: "Basse", court: "Basse" },
];

export const rangPriorite: Record<Priorite, number> = { max: 0, moyenne: 1, basse: 2 };

const KEY = (scope: string) => `taverne:alertes:${scope}`;

/* --- pub/sub intra-onglet -------------------------------------------------- */
const abonnes = new Map<string, Set<() => void>>();
function notifier(scope: string) {
  abonnes.get(scope)?.forEach((fn) => fn());
}
function abonner(scope: string, fn: () => void) {
  let set = abonnes.get(scope);
  if (!set) {
    set = new Set();
    abonnes.set(scope, set);
  }
  set.add(fn);
  return () => set!.delete(fn);
}

function charger(scope: string): Alerte[] {
  try {
    const brut = localStorage.getItem(KEY(scope));
    if (!brut) return [];
    const data = JSON.parse(brut);
    return Array.isArray(data) ? (data as Alerte[]) : [];
  } catch {
    return [];
  }
}

function ecrire(scope: string, alertes: Alerte[]) {
  try {
    localStorage.setItem(KEY(scope), JSON.stringify(alertes));
  } catch {
    /* quota / mode privé — ignoré */
  }
  notifier(scope);
}

export const nouvelId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `a${Date.now()}${Math.floor(Math.random() * 1e4)}`;

/** Date du jour au format AAAA-MM-JJ (heure locale). */
export function aujourdhui(): string {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

/** Horodatage (ms) d'une alerte, ou NaN si invalide. */
export const horodatage = (a: Alerte) =>
  new Date(`${a.date}T${a.heure || "00:00"}`).getTime();

/** L'alerte est-elle déclenchée à l'instant `now` (date atteinte) ? */
export function estDeclenchee(a: Alerte, now: number): boolean {
  const t = horodatage(a);
  return !Number.isNaN(t) && t <= now;
}

/** Libellé relatif lisible (Aujourd'hui / Demain / Hier / date complète). */
export function libelleDate(a: Alerte): string {
  const d = new Date(`${a.date}T${a.heure || "00:00"}`);
  if (Number.isNaN(d.getTime())) return a.date;
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const cible = new Date(a.date + "T00:00");
  const jours = Math.round((cible.getTime() - base.getTime()) / 86_400_000);
  if (jours === 0) return "Aujourd'hui";
  if (jours === 1) return "Demain";
  if (jours === -1) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: cible.getFullYear() === base.getFullYear() ? undefined : "numeric",
  });
}

/** Hook store : lit/écrit les alertes d'un espace et reste synchronisé. */
export function useAlertes(scope: string) {
  const [alertes, setAlertes] = useState<Alerte[]>(() => charger(scope));

  useEffect(() => {
    setAlertes(charger(scope));
    const off = abonner(scope, () => setAlertes(charger(scope)));
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY(scope)) setAlertes(charger(scope));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      off();
      window.removeEventListener("storage", onStorage);
    };
  }, [scope]);

  // Source de vérité : le localStorage. On recalcule depuis le disque, on écrit,
  // puis `notifier` repousse l'état à tous les abonnés (dont ce composant).
  const muter = (maj: (prev: Alerte[]) => Alerte[]) => ecrire(scope, maj(charger(scope)));

  const ajouter = (a: Omit<Alerte, "id" | "vu">) =>
    muter((prev) => [...prev, { ...a, id: nouvelId(), vu: false }]);
  const supprimer = (id: string) => muter((prev) => prev.filter((a) => a.id !== id));
  const acquitter = (id: string) =>
    muter((prev) => prev.map((a) => (a.id === id ? { ...a, vu: true } : a)));
  const reactiver = (id: string) =>
    muter((prev) => prev.map((a) => (a.id === id ? { ...a, vu: false } : a)));

  return { alertes, ajouter, supprimer, acquitter, reactiver };
}

/** Horloge partagée : re-rend périodiquement pour déclencher les alertes échues. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
