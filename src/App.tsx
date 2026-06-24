import AppProviders from "@/app/providers/AppProviders";
import AppRouter from "@/app/router/AppRouter";

/* Racine de composition : fournisseurs globaux + routeur.
   Le routage et la liste des espaces vivent désormais dans le REGISTRE de
   modules (src/core/module/registry.ts) — voir src/app/router/AppRouter.tsx.
   Pour ajouter un espace : créer modules/<x>/module.manifest.ts + l'enregistrer. */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
