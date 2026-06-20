# ERP_TAVERNE

ERP de gestion d'entreprise (Habitat & Mobilier), pensé pour le marché ivoirien
(montants en FCFA). Cinq métiers, chacun son espace dédié, avec une supervision
centrale pour la direction.

## Stack

- **Frontend** : React 18 + TypeScript (Vite) — à la racine de ce dépôt
- **Backend** (à venir) : NestJS (API REST)
- **Couleur principale** : brun Saddlebrown `#8B4513`

## Démarrer

```bash
npm install
npm run dev      # serveur de dev — http://localhost:5173
npm run build    # build de production (dist/)
npm run preview  # prévisualise le build
```

## Structure

```
.
├── public/                 # ressources statiques (favicon…)
├── src/
│   ├── pages/              # landing + dashboards par espace
│   ├── dashboard-admin/    # tableau de bord administrateur
│   ├── dashboard-stock/    # tableau de bord stock
│   ├── dashboard-comptabilite/
│   ├── collab/             # messagerie + alertes (dock global)
│   ├── components/         # composants partagés (modals, icônes…)
│   ├── icons/              # ré-exports lucide-react (centralisés)
│   ├── styles/globals.css  # palette + reset
│   ├── App.tsx             # routeur par hash
│   └── main.tsx
├── index.html
├── vite.config.ts
├── vercel.json             # déploiement (SPA rewrite)
└── SUIVI.md                # journal détaillé du projet
```

## Déploiement (Vercel)

Le dépôt est maintenant à la racine du projet : sur Vercel, **Root Directory =
racine** (par défaut). Framework détecté : Vite. Variable d'env `VITE_API_URL`
pour l'API NestJS.
