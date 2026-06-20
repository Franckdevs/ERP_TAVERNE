# FRONT_TAVERNE_ERP

Frontend de l'ERP Taverne — **React + TypeScript** (Vite).
SPA autonome destinée à consommer l'API du backend **NestJS**.

## Couleur principale

Brun **Saddlebrown `#8B4513`**.

- Mode clair : `--primary: oklch(0.45 0.12 47)`
- Mode sombre : `--primary: oklch(0.65 0.12 55)` (version plus claire / chaude)

Les variables sont définies dans [`src/styles/globals.css`](src/styles/globals.css).

## Démarrage

```bash
npm install      # installe les dépendances
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build
```

## Structure

```
FRONT_TAVERNE_ERP/
├── public/                 # ressources statiques (favicon…)
├── src/
│   ├── pages/              # pages de l'application
│   │   ├── HomePage.tsx    # page d'accueil
│   │   └── HomePage.css
│   ├── styles/
│   │   └── globals.css     # variables de thème + reset
│   ├── App.tsx
│   └── main.tsx            # point d'entrée
├── index.html
└── vite.config.ts
```
