/* Identifiants de vue de l'espace Comptabilité (navigation interne) */
export type ComptaView =
  | "dashboard"
  | "brouillard"
  | "libelles"
  | "categories"
  | "projets"
  | "postes"
  | "recap"
  | "repartition"
  | "parametres";

export type Navigate = (view: ComptaView) => void;