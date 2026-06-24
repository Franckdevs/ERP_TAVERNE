import { createLucideIcon } from "lucide-react";

/* ===========================================================================
   Icône « FCFA » maison (style lucide, au trait, currentColor) : une pièce de
   monnaie portant un « F » (franc). À utiliser partout où l'on évoque la
   monnaie, à la place du symbole dollar ($) — contexte ivoirien (FCFA).
   --------------------------------------------------------------------------- */
export const Fcfa = createLucideIcon("Fcfa", [
  ["circle", { cx: "12", cy: "12", r: "9", key: "coin" }],
  ["path", { d: "M9.5 16V8h4.5", key: "f-stem-top" }],
  ["path", { d: "M9.5 12h3.5", key: "f-mid" }],
]);

export default Fcfa;
