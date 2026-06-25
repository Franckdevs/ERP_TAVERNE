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

### 2026-06-23 — Menu « Rappels » commun à tous les espaces
- **Composant réutilisable `src/rappels/RappelsMenu.tsx` (+ `.css`)** : un seul
  composant **autonome** qui rend lui-même son **bouton de menu** (stylé pour
  épouser la sidebar hôte via les props `className`/`iconClassName`) et, au clic,
  ouvre une **modale** (rendue dans `<body>` via `createPortal`) pour créer un
  **rappel** avec un **intitulé**, une **date** et une **heure**.
  - Liste triée par date+heure, **case « fait »** (barré), **suppression**,
    badge **« En retard »** sur les rappels échus non faits, libellés relatifs
    (*Aujourd'hui / Demain / Hier*), **compteur** de rappels à venir dans le menu.
  - **Persistance `localStorage`**, clé **distincte par espace** (`scope`) :
    `taverne:rappels:<scope>`. Fermeture par **Échap** / clic extérieur, blocage
    du défilement à l'ouverture. Thème brun Taverne (préfixe CSS `rpl-`),
    indépendant du mode sombre des dashboards.
- **Intégré aux 6 espaces** sans toucher à leur routage — une simple insertion
  dans la sidebar, stylée aux classes de chaque hôte :
  - **Admin** (`dashboard-admin/.../Sidebar.tsx`) — groupe « Outils », `sb__item`.
  - **Stock** (`dashboard-stock/.../Sidebar.tsx`) — `stk-sb__item`.
  - **Comptabilité** (`ComptabiliteDashboard.tsx`) — `cc-sb__item`.
  - **Assistanat / Conseil client / Personnel** (`pages/*Dashboard.tsx`) — groupe
    « Outils », `dash__nav-item`.
- **Icônes** ajoutées au barrel `src/icons/` : `AlarmClock`, `CalendarClock`,
  `Clock`, `Check`, `Trash2`.
- Vérifié : **build Vite OK** (1843 modules).

### 2026-06-23 — Comptabilité : menu « Paramètres généraux »
- Nouveau **menu autonome** dans la sidebar de l'espace Comptabilité (sous les
  groupes et le menu Rappels), vue `parametres` (`ComptaView`).
- **`src/dashboard-comptabilite/views/ParametresView.tsx`** : page de réglages
  (mock, état de session, aucun backend) en 4 sections —
  **Identité de l'entreprise**, **Exercice & devise** (année, devise, mois de
  clôture, format de date), **Caisse** (solde d'ouverture, seuil d'alerte caisse
  basse), **Préférences** (mode sombre par défaut, alertes email, double
  validation des saisies) ; boutons **Enregistrer** / **Réinitialiser** + bandeau
  de confirmation.
- Câblage `ComptabiliteDashboard.tsx` (import + bouton sidebar + `META` +
  rendu), icône **`SettingsIcon`** (engrenage) dans `icons.tsx`, styles
  **interrupteurs `cc-switch`** + bandeau **`cc-saved`** dans le CSS. Câble enfin
  le `"parametres"` déjà présent dans `types.ts`.
- Vérifié : **`tsc --noEmit` OK**.

### 2026-06-23 — Volet « Alertes » (cloche) + bannière tableau de bord
- Nouveau module réutilisable **`src/alertes/`** : on planifie une alerte avec un
  **intitulé**, une **date**, une **heure** et une **priorité** (Maximale /
  Moyenne / Basse). Quand la date arrive, l'alerte est **déclenchée** et
  apparaît **partout sur le tableau de bord**.
  - **`useAlertes.ts`** — store `localStorage` par espace (`taverne:alertes:<scope>`)
    avec **pub/sub intra-onglet** (cloche ↔ bannière synchronisées) + écoute
    `storage` (multi-onglets) ; horloge `useNow` (tick 30 s) pour déclencher les
    alertes échues sans rechargement.
  - **`AlertesMenu.tsx`** — bouton **cloche** (compteur d'alertes en cours, coloré
    selon la priorité la plus haute) + **modale** de gestion (création, priorité
    segmentée, liste triée, **acquitter** / **réactiver** / **supprimer**).
  - **`AlertesBanner.tsx`** — pile de **toasts flottants** (portail `<body>`,
    position fixe) affichant les alertes déclenchées non acquittées, triées par
    priorité ; bouton **« J'ai vu »** (acquitte) et fermeture.
  - **`Alertes.css`** — préfixe `alt-`, code couleur priorité (rouge / ambre /
    bleu), modale brun Taverne, toasts colorés ; indépendant du mode sombre.
- **Câblé à l'espace Comptabilité** : la cloche de la topbar
  (`ComptabiliteDashboard.tsx`) est remplacée par `<AlertesMenu scope="comptabilite">`
  et `<AlertesBanner scope="comptabilite">` est monté à la racine du dashboard
  (icône `BellIcon` locale retirée des imports).
- Vérifié : **`tsc --noEmit` OK** + **build Vite OK** (1848 modules).

### 2026-06-23 — Alignement avec l'entreprise réelle (lataverne.ci)
- D'après le site **https://lataverne.ci/**, La Taverne est une entreprise
  d'**architecture d'intérieur / aménagement & rénovation** (et non « Habitat &
  Mobilier ») — Cocody, Djorobité 1, Abidjan · infos@lataverne.ci ·
  +225 07 68 36 76 09.
- **Carte « Employé du mois »** (`HomePage.tsx`) : Bamba Ange Sarah →
  **Chef comptable / Espace Comptabilité** (citation + stats réécrites côté compta).
- **Valeurs par défaut des Paramètres généraux** (`ParametresView.tsx`) :
  raison sociale, téléphone, email et adresse mis aux **vraies coordonnées**.
- **Landing** (`HomePage.tsx`) : sous-titre du hero retiré, puis **section
  « Employé du mois » (`#equipe`) entièrement supprimée** (imports `TrophyIcon` /
  `StarIcon` / `QuoteIcon` retirés). *CSS `.emp*` conservé dans `HomePage.css`
  (mort, à nettoyer éventuellement).*

### 2026-06-23 — Nouveau tableau de bord « Chargé commercial »
- **6ᵉ espace** ajouté au sélecteur (`SpaceModal.tsx`, grille 3×2) : *Chargé
  commercial — « Ventes, objectifs et devis »* (icône **`BriefcaseIcon`** ajoutée
  au barrel `components/icons.tsx`). Route **`#/commercial`** câblée dans `App.tsx`.
- **`src/pages/CommercialDashboard.tsx` (+ `.css`)** — réutilise la coquille
  `dash` (AssistantDashboard.css) + utilitaires `crm-*` (ConseilDashboard.css) :
  - **4 KPI** (CA réalisé, objectif mensuel avec barre, devis en cours,
    commandes signées) ;
  - **Objectifs commerciaux** (barres de progression calculées) ;
  - **Devis & commandes récents** (table + chips de statut, **modale Nouveau
    devis** pour en ajouter) ;
  - **Activité commerciale récente** (appels / visites / relances / signatures) ;
  - **Top clients du mois** (classement avec barres relatives).
- Intègre **Rappels** + **Alertes** (cloche topbar + menu sidebar + bannière),
  `scope="commercial"`.
- Vérifié : **`tsc --noEmit` OK** + **build Vite OK** (1850 modules).

### 2026-06-24 — Volet « Chargé commercial » dans le fil d'activité (landing)
- **`HomePage.tsx`** — ajout d'une entrée *Chargé commercial* (« Devis envoyé —
  Hôtel Tiama », icône **`BriefcaseIcon`**, pastille `#9c6b3f`, « il y a 3 min »)
  dans le mockup **« Fil d'activité · En direct »** (composant `ActivityFeed`),
  insérée en ordre chronologique entre *Gestion de stock* et *Conseil client*.
  Le fil reflète désormais les 5 métiers visibles sur la landing.

### 2026-06-24 — Messagerie : retrait appel/vidéo + affichage page complète
- **`Messenger.tsx/.css`** — boutons **Appel** et **Appel vidéo** retirés de
  l'en-tête de conversation (import `Phone` + CSS `.msg__head-actions` d'origine
  nettoyés ; `Video` conservé car utilisé par le menu pièces jointes).
- **Affichage en page complète** ajouté au volet messagerie :
  - bouton **plein écran / réduire** (`Maximize2` / `Minimize2`) dans les en-têtes ;
  - en mode plein écran, **deux volets côte à côte** (liste des discussions +
    conversation) avec **état vide** quand aucune discussion n'est choisie ;
  - mode dock inchangé (un seul volet à la fois) ; bascule pilotée par
    `CollabDock` (état `msgsFull`, conteneur **`.dock__full`** plein écran).
  - Responsive : sous 720 px, le plein écran repasse à **un seul volet** (liste
    OU conversation) avec bouton retour ; surbrillance `thread.is-active`.
- Vérifié : **`tsc --noEmit` OK pour `collab/`** (2 erreurs préexistantes hors
  périmètre dans `modules/accounting` & `shared/ui/Card`) + **build Vite OK**.

### 2026-06-24 — Fondations « ERP enterprise-grade » (Phase 1 d'architecture)
> Mise en place d'une architecture **scalable, modulaire et plugin-based**, de
> façon **additive** (les 6 dashboards existants ne sont **pas déplacés** ni
> cassés). Les 2 erreurs `tsc` signalées plus haut (`modules/accounting`,
> `shared/ui/Card`) sont **résolues** par cette étape.
- **Dépendances** : ajout de **`zustand`** (client state) et
  **`@tanstack/react-query`** (server state) ; **`@types/node`** (devDep) pour la
  config Vite.
- **Couches** introduites (sens de dépendance unique `app → modules → shared → core`) :
  - **`core/`** — infrastructure agnostique : `config/env.ts` (env typé,
    `VITE_API_URL` / `VITE_USE_MOCKS`), `types/result.ts` (`Result`/`Paginated`/
    `ApiError`), `api/http-client.ts` (wrapper `fetch` + JWT + erreurs normalisées),
    `api/query-client.ts`, **`auth/`** (token en mémoire, store **Zustand** +
    `useAuth`, **RBAC** `hasPermission`), **`module/`** (contrat `ModuleManifest`
    + **registre** `MODULES`).
  - **`shared/`** — réutilisable : `lib/format.ts` (FCFA + dates fr-FR),
    `hooks/` (`useDisclosure`, `useLocalStorage`), `styles/tokens.css` (échelles
    espacement/rayon/élévation/z-index + couleurs sémantiques), **Design System**
    `ui/` en **CSS Modules** (`Button`, `Card`, `Badge`, `Modal` — scoping, fini
    les préfixes manuels).
  - **`modules/`** — **1 manifeste par pôle** (`admin`, `accounting`, `assistant`,
    `crm`, `commercial`, `inventory`, `hr`) qui **charge en lazy** le dashboard
    existant (aucun fichier déplacé). **Pilote Repository Pattern** complet sur
    `accounting/api/` : interface `AccountingRepository` + impl. **mock** et
    **http** (NestJS) + **factory** (`VITE_USE_MOCKS`) + hook
    `useTransactions` (React Query). → bascule vers la vraie API = **1 variable**.
  - **`app/`** — `providers/AppProviders.tsx` (`QueryClientProvider`),
    `router/AppRouter.tsx` (**React Router v7 — `HashRouter`**, routes générées
    **depuis le registre**, `Suspense` + **code splitting par module**),
    `router/guards/ProtectedRoute.tsx` (RBAC, permissif via utilisateur de démo).
- **`App.tsx`** réduit à une **racine de composition** (`<AppProviders><AppRouter/>`) ;
  le routage par `hashchange` manuel est remplacé. **`SpaceModal` inchangé**
  (pose toujours `window.location.hash = "#/<espace>"`, lu par `HashRouter`).
- **Config** : alias **`@` → `src`** ajouté à `vite.config.ts` (miroir de
  `tsconfig`), **`manualChunks`** (`react`, `query`) ; `tsconfig.node.json` reçoit
  `types:["node"]` ; suppression des artefacts compilés parasites
  `vite.config.js`/`.d.ts` (déjà gitignorés) qui masquaient le `.ts`.
- **Résultat mesuré** : bundle d'entrée **376 Ko → 59 Ko**, chaque dashboard et
  chaque vendor (react/query) dans son **chunk lazy** séparé.
- Vérifié : **`npm run build` OK** (tsc strict `-b` **+** Vite) — pipeline complet
  au vert, **0 erreur TypeScript**.

### 2026-06-24 — Icône monnaie : dollar ($) → FCFA
- Nouvelle **icône maison `Fcfa`** (`src/icons/Fcfa.tsx`, via `createLucideIcon` →
  style lucide cohérent) : une **pièce avec un « F »** (franc), pour représenter la
  monnaie sans symbole dollar. Ré-exportée par le barrel `src/icons/`.
- **`DollarSign` retiré** du barrel et de la carte **« Dépenses · mois »**
  (`dashboard-admin/data.ts`) → remplacé par `Fcfa`. Plus aucun `$` dans le projet.
  *(Les autres KPI monnaie utilisaient déjà `Wallet`/`Coins`/`CreditCard`, sans
  symbole dollar — laissés tels quels.)*
- Vérifié : **`tsc --noEmit` OK** + **build Vite OK**.

### 2026-06-24 — Landing : ajout du « Chargé commercial »
- **Section Applications** (`HomePage.tsx`) : ajout d'une **6ᵉ carte** *Chargé
  commercial* (icône `BriefcaseIcon`, « Ventes, objectifs, devis et relances »),
  insérée entre *Conseil client* et *Gestion de stock*.
- Mises à jour du texte **« cinq » → « six »** : eyebrow *« Six applications, un
  seul système »*, avantages *« Supervision centrale »* / *« Données
  synchronisées »*, et mockup *« activité des six métiers »*.
- *(Le fil d'activité « En direct » et le sélecteur d'espace incluaient déjà le
  Chargé commercial.)* Vérifié : **build Vite OK**.

### 2026-06-24 — Espace commercial : tableau de bord multi-vues
- Le dashboard **Chargé commercial** passe d'**une seule page** à un **menu
  groupé** (pattern `dash` multi-vues, comme Assistanat/Personnel) :
  - **Pilotage** → *Vue d'ensemble* (KPI, objectifs, devis récents, activité,
    top clients — contenu existant conservé).
  - **Ventes** → *Pipeline* (kanban 5 étapes : Prospection → Qualification →
    Proposition → Négociation → Gagné, valeur pondérée par probabilité) ·
    *Devis & commandes* (table + **filtres par statut** + Nouveau devis).
  - **Clients** → *Clients & prospects* (table + filtre Client/Prospect, étiquette
    de type) · *Visites & RDV* (planning terrain de la semaine).
  - **Performance** → *Objectifs* (mensuels **+ annuels**) · *Relances*
    (liste triée par priorité avec bouton **Fait/Annuler**).
  - **Outils** → Rappels + Alertes (inchangés).
- Chaque vue affiche ses **sous-stats** contextuelles (`com-substats`). Nouvelles
  classes CSS dans `CommercialDashboard.css` : `com-pipe*` (kanban), `com-filter`
  (pills de filtre), `com-tag` (type client), `com-prio*` (priorité), `com-relance*`
  (liste de relances), `com-substat*`. Nouvelles icônes locales (Calendar, MapPin,
  Check, Clock).
- Vérifié : **build Vite OK** (CommercialDashboard en chunk lazy 30 Ko).
  *NB : `tsc` signale 2 imports inutilisés (`PeriodFilter`, `periodSeries`) — c'est
  le filtre de période en cours de câblage côté utilisateur, hors de cette tâche.*

### 2026-06-24 — Filtre Mois / Jour fonctionnel sur les graphiques
- **Composant réutilisable `src/components/period/`** :
  - `PeriodFilter.tsx` (+ `.css`) — deux listes déroulantes **Mois** (Année + 12 mois)
    et **Jour** (activée dès qu'un mois est choisi, options adaptées à la longueur
    du mois). Couleurs en `currentColor` → s'adapte aux en-têtes clairs **et sombres**.
  - `periodSeries.ts` — helpers **déterministes** (hash sinusoïdal seedé, aucun
    `Math.random` → rendu stable) : `resolveSeries` (flux réparti sur le mois /
    niveau interpolé + libellés d'axe + jour mis en évidence), `periodFactor` /
    `scaleByPeriod` (repondération des distributions), `dailyFlow`, `dailyLevel`,
    `daysInMonth`, `periodLabel`.
- **Sémantique** : *Année* = vue 12 mois d'origine ; *Mois* = détail jour par jour
  (axe = numéros de jour) ; *Mois + Jour* = idem avec le jour ciblé mis en évidence.
  Les distributions (donut, barres) sont repondérées par période.
- **Graphiques câblés** :
  - **Admin** (`dashboard-admin`) : *Évolution des ventes* (courbe → détail
    journalier + point du jour), *Répartition des dépenses* (donut + total/unité
    recalculés, « FCFA · jour » si un jour est ciblé), *Productivité des équipes*.
  - **Comptabilité** (`DashboardView`) : *Entrées vs Dépenses* (histogramme),
    *Évolution du Solde* (aire, série de niveau), *Répartition des dépenses* (donut).
    `RepartitionView` : sélecteur **Mois** rendu fonctionnel + **Jour** ajouté
    (donut repondéré ; Juin sans jour = données de référence).
  - **Personnel** : *Répartition des contrats* (filtre en `action` du `Panel`,
    effectifs repondérés par type de contrat).
- **Commercial** : câblage du filtre **réalisé côté utilisateur** (restructuration
  multi-vues en cours) — non touché ici, import provisoire retiré.
- Vérifié : **`tsc --noEmit` OK** + **build Vite OK** (1931 modules, `PeriodFilter`
  en chunk dédié ~2,8 Ko).

---

## 🏛️ Architecture (depuis 2026-06-24)

```
src/
├── app/        # composition : providers + router (registre → routes lazy)
├── core/       # infra agnostique : config, api(http+query), auth(RBAC), module
├── shared/     # réutilisable : ui(Design System CSS Modules), hooks, lib, styles
├── modules/    # 1 manifeste plugin par pôle (lazy) + api(repository) — pilote: accounting
├── pages/ dashboard-*/ collab/ rappels/ alertes/   # existant (intact, chargé en lazy)
└── App.tsx main.tsx
```
- **Ajouter un espace** = créer `modules/<x>/module.manifest.ts` + l'enregistrer
  dans `core/module/registry.ts`. Le routeur et (à terme) la navigation se
  construisent tout seuls.
- **Patterns** : Feature-Based, Repository + Factory (mock↔HTTP), Service/DI léger,
  state **Zustand (client) + React Query (server)**, plugin registry.
- **Suites prévues (Phase 2/3)** : MSW (mocks réseau), vrai login JWT + guards
  effectifs, migration physique des dashboards vers `modules/` + consolidation des
  3 coquilles (`.dash`/`.cc-`/`.stk-`) sur le Design System, tests Vitest+RTL, i18n.

### 2026-06-24 — Admin : cartes KPI plus compactes
- **`dashboard-admin/components/StatCards/StatCards.css`** : cartes de stats
  réduites — padding `1.1/1.2/1.25rem` → `0.8/0.9rem`, rayon `1rem` → `0.8rem`,
  écart haut `1.1rem` → `0.6rem`, icône `2.5rem` → `2.1rem`, valeur `1.5rem` →
  `1.3rem`, libellé `0.82rem` → `0.78rem`, `gap` de grille `1rem` → `0.8rem`.
  Grille et points de rupture responsive inchangés.

### 2026-06-24 — Cloche de notifications (Alertes) active sur tous les espaces
- Jusqu'ici, seuls **Comptabilité** et **Commercial** disposaient de la cloche
  fonctionnelle (`AlertesMenu`) ; les cinq autres avaient un **bouton cloche
  statique** (décoratif). La cloche `AlertesMenu` (planification d'alertes +
  compteur + modale en portail) est désormais branchée **partout** :
  - **Admin** (`dashboard-admin/.../Topbar.tsx`, scope `admin`) — `<Bell>` statique
    + pastille `--dot` remplacés par `<AlertesMenu variant="icon" />`.
  - **Stock** (`dashboard-stock/.../Topbar.tsx`, scope `stock`).
  - **Assistanat** (scope `assistanat`), **Conseil** (scope `conseil`),
    **Personnel** (scope `personnel`) — boutons cloche statiques (`dash__icon-btn`
    + `dash__dot`) remplacés par `<AlertesMenu variant="icon" />`.
- Scopes alignés sur ceux des **Rappels** déjà en place (stockage séparé par espace).
  Imports `BellIcon` / `Bell` devenus inutiles retirés.
- Vérifié : **`tsc` OK** + **build Vite OK** (1931 modules).

### 2026-06-25 — Logo officiel La Taverne partout
- Logo client (`logo/Logo taverne fond marron Png  .png` — lockup lampe +
  « Taverne » + baseline « Un intérieur à votre image », fond marron) copié dans
  **`public/logo-taverne.png`** (servi en `/logo-taverne.png`).
- **Classe globale `.brand-logo`** (`styles/globals.css`) + variantes navbar /
  footer / modal (`.sm__logo`).
- Remplace l'ancien **carré `…-brand-mark` + mot « Taverne »** (le logo contient
  déjà le wordmark) — le **sous-titre par espace est conservé** :
  - **Landing** : navbar (`lp__brand`) + **pied de page** + **modal**
    « Choisissez votre espace » (`SpaceModal`).
  - **7 sidebars** : Comptabilité (`cc-sb__brand`), Admin (`sb__brand`),
    Stock (`stk-sb__brand`), Assistanat / Conseil / Commercial / Personnel
    (`dash__brand`).
- Imports d'icône devenus inutiles retirés (`HouseIcon` / `House`).
- *Favicon laissé sur `taverne.svg`* (le lockup large est illisible en 16 px).
- Vérifié : **`tsc --noEmit` OK** + **build Vite OK**.

---

## ▶️ Commandes

```powershell
cd C:\ERP_TARVERNE
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

- [x] Routing **React Router** (v7 `HashRouter`, routes générées depuis le
      registre de modules — voir section *Architecture*). 7 espaces (admin,
      comptabilité, assistanat, conseil, **commercial**, personnel, stock).
- [x] **Couche API abstraite** (`core/api/http-client.ts` + Repository pattern,
      pilote `accounting`). *Reste : généraliser aux autres modules.*
- [ ] Backend NestJS (API REST) + brancher `VITE_USE_MOCKS=false` + vrai login JWT.
- [ ] MSW (mocks réseau) + tests **Vitest + RTL**.
- [ ] Migration physique des dashboards vers `modules/` + Design System (consolider
      les coquilles `.dash`/`.cc-`/`.stk-`).
- [ ] (Optionnel) Mode sombre global via le store + bouton de bascule.
