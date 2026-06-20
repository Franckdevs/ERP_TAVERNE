# Suivi du projet — ERP Taverne

> Journal de tout ce qui est réalisé sur le projet.
> **Règle : ce fichier est mis à jour à chaque ajout / modification.**

ERP de gestion d'entreprise (Habitat & Mobilier), pensé pour le marché
ivoirien (montants en FCFA). Cinq métiers, chacun son espace dédié, avec une
supervision centrale pour la direction.

---

## 🧱 Stack technique

| Couche | Technologie |
|---|---|
| Frontend | **React 18 + TypeScript** (Vite) — SPA autonome |
| Backend (à venir) | **NestJS** (API REST) |
| Hébergement front | **Vercel** (statique) |
| Couleur principale | Brun **Saddlebrown `#8B4513`** |

---

## 📁 Structure

```
c:\ERP_TARVERNE\
├── SUIVI.md                     # ce fichier (journal du projet)
└── FRONT_TAVERNE_ERP/           # frontend React + TS (Vite)
    ├── public/
    │   └── taverne.svg          # favicon
    ├── src/
    │   ├── components/
    │   │   └── icons.tsx         # icônes SVG (style Lucide, sans dépendance)
    │   ├── pages/
    │   │   ├── HomePage.tsx      # landing page + mockup tableau de bord
    │   │   ├── HomePage.css
    │   │   ├── AssistantDashboard.tsx  # tableau de bord Espace Assistanat
    │   │   └── AssistantDashboard.css
    │   ├── styles/
    │   │   └── globals.css       # palette (variables) + reset
    │   ├── App.tsx
    │   ├── main.tsx              # point d'entrée
    │   └── vite-env.d.ts
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig*.json
    ├── vercel.json              # config déploiement (SPA rewrite)
    ├── .env.example             # VITE_API_URL (URL de l'API NestJS)
    └── package.json
```

---

## 🗓️ Historique des modifications

### 2026-06-19 — Mise en place du front
- Création du projet **React + TypeScript (Vite)** dans `FRONT_TAVERNE_ERP/`.
- Configuration : `package.json`, `vite.config.ts`, `tsconfig*.json`, `.gitignore`.
- `globals.css` : palette brun Saddlebrown `#8B4513`
  - clair : `--primary: oklch(0.45 0.12 47)`
  - sombre (initial) : `--primary: oklch(0.65 0.12 55)`
- Favicon `taverne.svg`, `README.md`.
- Préparation **déploiement Vercel** : `vercel.json` (rewrite SPA) + `.env.example`
  (`VITE_API_URL` pour l'API NestJS, à séparer du front).
- Correction orthographe **TARVERNE → Taverne** partout (dossier inclus :
  `FRONT_TARVERNE_ERP` → `FRONT_TAVERNE_ERP`).

### 2026-06-20 — Landing page d'après la maquette
- Reconstruction complète de la page d'accueil fidèle à la maquette :
  - **Navbar** sticky (logo maison + « Taverne », liens, boutons).
  - **Hero** : pastille, titre « Toute votre entreprise, une seule plateforme. »,
    sous-titre, 2 boutons.
  - **Mockup « Tableau de bord · Direction »** : 3 stats, graphique SVG
    « Évolution des ventes », pastilles projets/factures.
  - **Section Applications** (5 cartes) : Comptabilité, Assistanat, Conseil client,
    Gestion de stock, Gestion du personnel.
  - **Avantages**, **bloc CTA** foncé, **footer**.
  - `icons.tsx` : 11 icônes SVG sans dépendance.
- **Mode clair forcé** : suppression de la surcharge `prefers-color-scheme: dark`
  (la maquette est en version claire, fond crème `#FBF9F6`).
- **Réduction globale de la taille** : `html { font-size: 87.5% }` (16 → 14px)
  → polices, boutons, espacements et largeurs réduits proportionnellement.
- **Animations du mockup** (CSS pur, désactivées si `prefers-reduced-motion`) :
  tracé de la courbe, révélation de l'aire, point final qui pulse, cartes/pastilles
  en cascade, léger flottement de l'ensemble.
- **Cartes Applications élargies** : conteneur `--wide` (90rem), padding et
  espacement augmentés ; responsive 5 → 3 → 2 → 1 colonnes.
- **Sécurité** : ajout d'un 4ᵉ avantage « Sécurité conforme » (icône bouclier) —
  système conçu selon les normes de sécurité informatique (chiffrement,
  sauvegardes, accès protégés, traçabilité).
- **Lisibilité du mockup** : libellé de stat « CA · mois » remplacé par
  « Chiffre d'affaires · mois » (abréviation CA explicitée).
- **Localisation** : pays cible corrigé Sénégal → **Côte d'Ivoire** (footer +
  avantage « Pensé pour le local », « entreprises ivoiriennes »). FCFA conservé.
- **Modal « Choisissez votre espace »** : liste des 5 espaces passée d'un
  empilement vertical à une **grille 3 colonnes** (cartes verticales compactes,
  icône en haut) pour réduire la hauteur du modal. Panneau élargi (`44rem`)
  uniquement à l'étape de choix via `sm__panel--wide` (l'étape connexion reste à
  `30rem`). Repli responsive : 3 → 2 → 1 colonne.
- **Afficher / masquer le mot de passe** : bouton œil (`EyeIcon` / œil barré)
  dans les champs mot de passe du modal (connexion + nouveau mot de passe).
- **Processus « Mot de passe oublié » complet** (UI, prêt à brancher sur l'API
  NestJS) : connexion → email → code à 6 chiffres → nouveau mot de passe →
  confirmation. Indicateur d'étapes, validations (code 6 chiffres, ≥ 8
  caractères, correspondance), messages d'erreur, « Renvoyer le code », retour à
  la connexion. Points d'ancrage `TODO: POST /auth/...` dans `SpaceModal.tsx`.
- **Section « Employé du mois »** ajoutée sur la page d'accueil (entre Avantages
  et CTA, `id="equipe"`) : carte deux volets — profil sur fond brun foncé
  (badge trophée, avatar « BS », nom/poste/atelier, 5 étoiles, « Juin 2026 ») et
  volet citation + 3 stats (12 ans, 38 projets, 100 %). Nouvelles icônes
  `TrophyIcon`, `StarIcon` (pleine), `QuoteIcon`. Responsive : empilement < 860px.
- **Repositionnement en plateforme de coopération & suivi temps réel** : la
  landing insiste désormais sur le **travail collaboratif** et le **suivi des
  tâches / actions en temps réel**, pas seulement la gestion.
  - **Hero** revu : pastille « Plateforme collaborative · Suivi en temps réel »,
    titre « Travaillez ensemble, suivez tout en temps réel. », sous-titre orienté
    coopération + **bandeau de confiance** (`hero__trust` : temps réel / suivi des
    tâches / travail d'équipe).
  - **Section « Coopération & suivi en temps réel »** (`id="collaboration"`) :
    6 fonctionnalités (tâches assignées, actions temps réel, tableau
    d'avancement, notifications, échanges intégrés, données synchronisées) à côté
    d'un **mockup « Fil d'activité · en direct »** (`ActivityFeed`) — flux
    d'actions horodatées des 5 métiers, pastille « En direct » pulsante, barre de
    progression « Tâches du jour 14/18 », apparition en cascade.
  - **Section « Comment ça marche »** (`id="fonctionnement"`, bandeau beige) :
    3 étapes (se connecter → agir & se coordonner → superviser) avec connecteurs.
  - `icons.tsx` : +11 icônes (activité, cloche, tâches, message, éclair, synchro,
    horloge, kanban, tendance, check) pour ces sections.
  - Lien de navigation « **Coopération** » ajouté dans la navbar.
- **Tableau de bord « Espace Assistanat »** créé (`AssistantDashboard.tsx/.css`) :
  - **Sidebar** brun foncé avec menu **groupé** (Pilotage / Organisation /
    Communication / Administratif), carte utilisateur (« Aïda Mbengue ») et
    bouton Déconnexion.
  - **Topbar** : titre/sous-titre par vue, recherche, **bascule mode sombre**
    (fonctionnelle — réécrit les variables de couleur sur `.dash--dark`),
    cloche avec pastille, avatar.
  - **Vue d'ensemble** : 4 stats (rendez-vous du jour dynamique, réunions,
    messages + « 2 urgents », notes de frais), **Agenda du jour** (timeline
    colorée par type), **Communication & filtrage** (priorités Urgent/Normal/
    Secondaire), **Documents à préparer**, **Événements à organiser**.
  - **Vues dédiées** par entrée de menu (agenda, communication, documents,
    notes de frais, événements).
  - **Modal « Planifier un rendez-vous »** fonctionnel : objet, **type** (Réunion,
    Rendez-vous, Appel, Déplacement + catégories Tâche & Échéance), heure, lieu ;
    validation + ajout trié à l'agenda (état React).
  - Icônes du dashboard définies **localement** (search, lune/soleil, plus,
    téléphone, fichier, logout, grille, épingle, reçu, chevron) — `icons.tsx`
    non modifié.
  - **Routage par hash** (`App.tsx`) : `#/assistanat` → dashboard ; la connexion
    à un espace (`SpaceModal`) redirige vers `#/<espace>`. Déconnexion → landing.
- **Correctif modal connexion déformé** : le fond/bordure/ombre/animation du
  panneau n'étaient que sur `.sm__panel--wide` → à l'étape connexion le panneau
  était transparent (on voyait la page derrière). Remis sur la base `.sm__panel` ;
  `.sm__panel--wide` ne fait plus qu'élargir (`max-width: 44rem`).
- **Tableau de bord « Espace Conseil client » (CRM & Clients)** créé
  (`ConseilDashboard.tsx` + `ConseilDashboard.css`) — réutilise la **coquille
  `dash`** d'`AssistantDashboard.css` (sidebar, topbar, modal, boutons, chips) et
  n'ajoute que le spécifique CRM.
  - **Sidebar** : marque « Espace Conseil client », entrée unique **CRM &
    Clients**, utilisateur « Omar Seck · Conseiller commercial », déconnexion.
  - **Topbar** : « CRM & Clients » / « Prospects, pipeline et clients actifs »,
    recherche, **bascule mode sombre**, cloche, avatar « OS ».
  - **4 KPI** : Portefeuille clients (48), Objectif commercial · mois (72 %, barre
    de progression `crm-progress`, 36/50 M FCFA), Opportunités ouvertes (9 ·
    118 M FCFA), Satisfaction client (94 %, +2 pts en vert).
  - **Onglets** `Pipeline commercial` / `Liste clients` + bouton **Nouveau client**.
  - **Pipeline (kanban)** 6 colonnes colorées : Prospect, Qualification, Devis
    envoyé, Négociation, Gagné, Perdu — cartes (client, montant FCFA, descriptif)
    à liseré de couleur, compteur par colonne, scroll horizontal responsive.
  - **Liste clients (table)** : avatar à initiales, contact, ville, projets,
    CA total — survol de ligne.
  - **Demandes & réclamations** : liste typée (Réclamation / Demande) avec icône
    contextuelle et statut (En cours / À traiter / Résolu via `chip--*`).
  - **Modal « Nouveau client »** (nom, contact, ville) — réutilise les classes
    `plan__*` ; ajoute le client en tête de liste (état React) et bascule sur
    l'onglet Liste clients.
  - **Routage** : `App.tsx` gère désormais `#/conseil` → ce dashboard ; la
    `SpaceModal` y redirige déjà à la connexion à l'espace « Conseil client ».
- **Package d'icônes unifié** : adoption de **`lucide-react`** + dossier central
  **`src/icons/`** (`index.ts`) qui ré-exporte les icônes pour tout le projet
  (point d'import unique). Les anciens SVG manuels (`src/components/icons.tsx`)
  restent utilisés par la landing en attendant migration.
- **Tableau de bord « Administrateur central »** créé dans un dossier dédié
  **`src/dashboard-admin/`** avec **un sous-dossier par élément** :
  - `components/Sidebar/` — marque « Taverne · Administration centrale »,
    navigation groupée (Principal / Applications / Système), carte utilisateur
    « Admin Direction » + déconnexion.
  - `components/Topbar/` — titre/sous-titre, recherche, bouton thème, cloche à
    pastille, avatar « AD ».
  - `components/StatCards/` — 8 cartes (CA, projets, clients, employés, factures,
    devis, commandes, dépenses) avec badge de tendance (vert/neutre).
  - `components/SalesChart/` — courbe « Évolution des ventes » (SVG, tracé animé,
    bascule année 2026/2025).
  - `components/ExpensesDonut/` — anneau « Répartition des dépenses » (segments
    SVG + légende, centre « 22,3M FCFA · mois »).
  - `components/ProjectsTracking/` — suivi des projets (statut + barre de
    progression).
  - `components/TeamsProductivity/` — productivité des équipes (barres verticales).
  - `data.ts` — données de démo centralisées (**contexte ivoirien** : Cocody,
    SIFCA, Riviera, Plateau, Kouassi, Koné…).
  - `DashboardAdmin.tsx` assemble le tout (layout sidebar + topbar + grilles).
  - **Routage** : `App.tsx` → `#/admin` rend le dashboard ; la `SpaceModal`
    redirige l'espace « Administrateur central » vers `#/admin`. Déconnexion →
    landing.

- **Confirmation de déconnexion (tous les espaces)** : nouveau composant
  `src/components/LogoutConfirm.tsx` (+ `.css`) — modal « Voulez-vous vraiment
  vous déconnecter ? » (Annuler / Se déconnecter), fermeture Échap + clic
  extérieur. Centralisé dans `App.tsx` : `onLogout` ouvre désormais le modal pour
  **tous** les dashboards (admin, assistanat, conseil) ; la confirmation seule
  réinitialise le hash (→ landing). Tout nouvel espace branché avec
  `onLogout={askLogout}` en hérite automatiquement.
- **Tableau de bord « Espace Personnel » (Ressources Humaines)** créé
  (`PersonnelDashboard.tsx` + `PersonnelDashboard.css`) — réutilise la coquille
  `dash` et le **pattern multi-vues** de l'Assistant pour bien **séparer les
  éléments** ; utilisateur « Bineta Sarr · Responsable RH ».
  - **Menu groupé** : Pilotage (Vue d'ensemble), Personnel (Employés, Présence),
    Gestion (Congés, Contrats), Rémunération (Paie).
  - **4 KPI** permanents : Effectif total (42), Présents aujourd'hui (vert),
    En congé (ambre), Masse salariale · mois (14,2 M FCFA) — dérivés de l'état.
  - **Employés** : table (nom + avatar, poste, département, contrat coloré,
    salaire, statut de présence) + **filtre par département** + modal
    **« Nouvel employé »** (nom, poste, département, contrat, salaire).
  - **Présence** : résumé en pastilles (Présents / Télétravail / En congé /
    Absents) + détail par employé.
  - **Congés** : 3 stats + liste des demandes avec **boutons Approuver / Refuser**
    fonctionnels (état React) et statuts colorés (En attente / Approuvé / Refusé).
  - **Contrats** : barres de **répartition CDI / CDD / Stage / Intérim** + table.
  - **Paie** : masse salariale, salaire moyen, bulletins à éditer + historique
    des bulletins (Payé / En préparation) + bouton « Générer les bulletins ».
  - **Routage** : `App.tsx` → `#/personnel` ; la `SpaceModal` y redirige déjà à la
    connexion à l'espace « Gestion du personnel ». Déconnexion via `LogoutConfirm`.
- **Tableau de bord « Espace Stock » (Magasinier)** créé dans un dossier dédié
  **`src/dashboard-stock/`**, structure **modulaire** (un sous-dossier par
  composant, comme `dashboard-admin`) — fidèle à la maquette « Stock & Inventaire ».
  Utilisateur « Modou Kane · Magasinier · MK ».
  - `data.ts` — données mockées (FCFA, contexte ivoirien) : 16 **articles**
    (réf., produit, catégorie, quantité, seuil, prix unit.), 4 **catégories**
    (Matière première / Produit fini / Consommable / Quincaillerie, préfixes
    MP/PF/CS/QC), **mouvements** (entrées/sorties), **fournisseurs**, KPI
    d'en-tête, navigation et méta des vues ; logique `etatArticle`
    (OK / Faible / Rupture selon quantité vs seuil) + formats FCFA.
  - `components/Sidebar/` — marque « Taverne · Espace Stock », navigation (Stock,
    Mouvements, Alertes, Fournisseurs), carte utilisateur + déconnexion. Classes
    **préfixées `stk-sb`** pour éviter toute collision CSS avec `dashboard-admin`
    (qui utilise `.sb`/`.tb` globaux).
  - `components/Topbar/` — titre/sous-titre par vue, recherche **fonctionnelle**,
    **bascule mode sombre** (Soleil/Lune), cloche à pastille, avatar « MK »
    (classes `stk-tb`).
  - `components/StatCards/` — 4 KPI fidèles à la maquette (Références 486, Valeur
    du stock 63,4 M FCFA, Stock faible 12, Ruptures 4) avec valeur colorée par
    accent (brun / ambre / rouge).
  - `components/Inventory/` — tableau **Inventaire** (Réf./Produit/Catégorie/
    Quantité/Seuil/État), **badges d'état** OK/Faible/Rupture, **filtres par
    catégorie** (puces), bouton **Nouvel article**, état vide géré.
  - `components/NewItemModal/` — modal d'ajout (catégorie, référence auto-préfixée,
    produit, quantité, seuil, prix unit.) avec validation ; ajoute l'article en
    tête de l'inventaire (état React).
  - `StockDashboard.tsx` assemble la coquille **`stk`** (sidebar + topbar +
    contenu) + **mode sombre** (réécriture de variables sur `.stk--dark`) et les
    **vues secondaires** : Mouvements (table entrées/sorties), Alertes (articles
    sous le seuil, tri rupture→faible, colonne « manque »), Fournisseurs (grille
    de cartes).
  - **Routage** : `App.tsx` → `#/stock` ; la `SpaceModal` y redirige déjà à la
    connexion à l'espace « Gestion de stock ». Déconnexion via `LogoutConfirm`.
  - **Icônes** : ajout au barrel `src/icons/` de `Boxes, Coins, AlertTriangle,
    PackageX, PackagePlus, ArrowLeftRight, Truck, Warehouse, Filter, Plus, X`.
- **Espace collaboration (messagerie + alertes) — commun à tous les dashboards** :
  nouveau dossier `src/collab/` rendu globalement via un **dock flottant**
  (`CollabDock`) ajouté dans `App.tsx` (visible dès qu'une route dashboard est
  active, masqué sur la landing). Aucun dashboard existant modifié.
  - **Messagerie type WhatsApp** (`Messenger.tsx/.css`) : liste de discussions
    (Direction + 5 métiers — avatars colorés, statut en ligne, badges non lus) →
    conversation (bulles envoyées/reçues, accusés de lecture, horodatage).
    **Envoi** : texte, **photo/image**, **vidéo**, **vocal** (enregistrement
    simulé + waveform), **document** — via menu pièces jointes ; bascule
    micro/envoi selon la saisie. État React (prêt à brancher sur l'API).
  - **Alertes / notifications** (`Notifications.tsx/.css`) : alertes typées
    (stock bas, facture, message, RDV, objectif, nouveau client) avec
    icône/couleur, badge non lus, « Tout marquer comme lu », bascule lu/non lu.
  - `CollabDock` : 2 boutons flottants (Alertes 🔔 + Messages 💬) avec badges,
    un seul panneau ouvert à la fois.
  - Icônes via **`lucide-react`** ; données de démo dans `collab/collabData.ts`.
- **Tableau de bord « Espace Comptabilité » (Brouillard de caisse)** créé dans un
  dossier dédié **`src/dashboard-comptabilite/`** — reproduit l'application réelle
  *Comptabilité Bamba Ange Sarah / La Taverne* (d'après les captures du site
  déployé) avec **données 100 % fictives** (aucune base / API). Classes préfixées
  **`cc`** ; **même design system** que les autres espaces (sidebar brun foncé,
  topbar translucide + recherche + **bascule mode sombre**, cartes claires,
  variables réécrites sur `.cc--dark`). Utilisateur « Bamba Ange Sarah · Comptabilité ».
  - `data.ts` — modèle & seeds mockés : transactions du brouillard (date, référence,
    entrée/dépense, **appro caisse**, projet, catégorie/sous-catégorie), 7
    **catégories** (Paiement Ouvriers, Transport, Achat, Rechargement CIE, Achat
    Internet, Frais de Transaction, Autre) + sous-catégories, **postes**, **libellés**,
    **projets**, et le **récap annuel 2026** (chiffres repris des captures :
    entrées 49 843 255 / dépenses 49 453 326 / net +389 929 FCFA, solde Juin 825).
    Logique : `computeSoldes` (solde **courant cumulatif**), `statsBrouillard`,
    règle **« SOLDE REPORTÉ »** exclue des totaux, formats `fr-FR` + FCFA.
  - `charts.tsx` — graphiques **SVG sans dépendance** : `Donut`, `GroupedBars`
    (Entrées vs Dépenses), `AreaCurve` (évolution du solde), `MiniBar` ;
    `icons.tsx` — jeu d'icônes SVG **local** (au trait, `currentColor`).
  - **Sidebar à menus déroulants** : entrée directe *Dashboard* + 3 **groupes
    repliables** (dropdowns) — **Caisse** (Brouillard, Libellés, Catégories),
    **Projets** (Projets, Postes), **Rapports** (Récapitulatif, Répartition) ;
    le groupe de la vue active s'ouvre automatiquement.
  - **Vue Dashboard** (fidèle aux captures) : filtre **Période** (Du/Au), 4 **KPI**
    à liseré coloré (Solde actuel, Total entrées/dépenses, Résultat net), graphiques
    Entrées/Dépenses + Évolution du solde, **Répartition des dépenses** (donut +
    barres %), **Bilan par mois** (table + recherche + pagination) et liste
    **Transactions** (recherche + 🚩 appro caisse).
  - **Vue Brouillard** (cœur) : table **Date / Référence / Entrée / Dépense / Solde**
    avec ligne d'ouverture + **solde cumulatif**, **édition inline**, ajout (modal
    avec autocomplétion des libellés + catégorie/sous-catégorie + projet + appro
    caisse), **suppression confirmée**, stats, onglet **Dépenses par catégories**,
    boutons Export/Template/Import (démo).
  - **Vue Répartition** : pills de filtre par catégorie, stats globales, donut +
    cartes **dépliables** (sous-catégories), export (démo).
  - **Vue Récapitulatif** : 3 KPI annuels, insights (meilleur mois / déficitaires),
    table 12 mois avec **mini-barres** Entrées/Dépenses + ligne TOTAL.
  - **Vue Projets** : cartes (budget/dépensé/restant, barre colorée brun<80/ambre/
    rouge>100, badges ouvriers) + **détail** (en-tête brun, table unifiée
    transactions projet 📄 + brouillard liées 📓, TOTAL).
  - **Référentiels** : **Catégories** (accordéon + emoji + CRUD sous-catégories),
    **Libellés** & **Postes** (CRUD générique : ajout, édition inline, suppression
    confirmée, recherche, pagination).
  - **Routage** : `App.tsx` → `#/comptabilite` ; la `SpaceModal` y redirige déjà à la
    connexion à l'espace « Comptabilité ». Déconnexion via `LogoutConfirm`.

- **Mise en ligne GitHub** : dépôt initialisé à la racine (`c:\ERP_TARVERNE`),
  `README.md` + `.gitignore` racine (ignore `node_modules/`, `dist/`, `.env`).
  Premier commit `first commit` (85 fichiers, **sans `node_modules`**) poussé sur
  **https://github.com/Franckdevs/ERP_TAVERNE** (branche `main`).

---

## ▶️ Commandes

```powershell
cd C:\ERP_TARVERNE\FRONT_TAVERNE_ERP
npm install      # installer les dépendances
npm run dev      # serveur de dev — http://localhost:5173
npm run build    # build de production (dist/)
npm run preview  # prévisualiser le build
```

---

## ☁️ Déploiement (Vercel)

- Root Directory : `FRONT_TAVERNE_ERP`
- Framework détecté : Vite — build `npm run build`, sortie `dist`
- Variable d'env : `VITE_API_URL` (URL de l'API NestJS)
- Le backend NestJS s'héberge **ailleurs** (Render/Railway/Fly.io) + CORS à activer.

---

## ✅ À faire / prochaines étapes

- [ ] Routing **React Router** (remplacer le routage par hash provisoire d'`App.tsx`).
      Les 6 espaces sont désormais créés (admin, comptabilité, assistanat, conseil,
      personnel, stock).
- [ ] Client API (`fetch` basé sur `VITE_API_URL`).
- [ ] Backend NestJS (API REST) + authentification par rôle.
- [ ] (Optionnel) Mode sombre via un bouton de bascule manuel.
