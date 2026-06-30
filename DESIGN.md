# Design

## Theme

Dark, unique (pas de mode clair) : l'outil s'utilise le soir, lumière ambiante faible, lecture longue. Direction « terminal » (reprise du projet Claude Design) : surfaces near-black, la personnalité vit dans l'**ambre**, la sérif éditoriale et les couleurs de verdict — jamais dans des fonds teintés. Les tokens sont définis en hex dans `src/app/globals.css` (`@theme`) et propagés à tout l'UI par les utilitaires Tailwind.

## Palette

| Token Tailwind | Valeur | Usage |
|---|---|---|
| `--color-bg` | `#0B0D11` | fond de page |
| `--color-surface` | `#11141A` | cartes, panneaux |
| `--color-sunken` | `#070809` | inputs, zones en creux, fonds de barres |
| `--color-surface-2` | `#1A1E26` | éléments interactifs élevés |
| `--color-border` | `#1F242E` | bordures 1px |
| `--color-ink` | `#E8EAEE` | texte principal |
| `--color-muted` | `#9AA3B2` | texte secondaire (≥ 4.5:1 sur bg) |
| `--color-faint` | `#5C6470` | méta, timestamps |
| `--color-primary` | `#D9A13B` | ambre : actions, liens, sélection, onglet actif |
| `--color-primary-ink` | `#0B0D11` | texte sur fond primary |
| `--color-primary-soft` | `rgba(217,161,59,.28)` | fond d'onglet actif, anneau de focus |
| `--color-accent` | `#D9A13B` | « à surveiller », warnings (= ambre) |
| `--color-success` | `#57C98B` | « à privilégier », succès |
| `--color-danger` | `#E2574B` | « à éviter », red flags critiques, erreurs |
| `--color-danger-ink` | `#0B0D11` | texte sur fond danger |

Stratégie : **Restrained** — neutres + ambre comme unique couleur d'action. Les couleurs de verdict (success/accent/danger) sont sémantiques (scores, badges, red flags). Seuils de couleur de score : ≥ 70 success · 40–69 accent · < 40 danger (`scoreColor`, `src/lib/format.ts`).

## Typography

| Famille | Rôle |
|---|---|
| **Newsreader** (sérif, next/font) | Titres du rapport ; italique pour les verdicts. Jamais dans les labels/boutons. |
| **IBM Plex Sans** | UI : navigation, titres de pages, labels, boutons, corps. |
| **IBM Plex Mono** | Chiffres, tickers, métriques, montants, logs du pipeline — toujours `tabular-nums`. |

Échelle fixe (rem), ratio ~1.2 : 0.75 / 0.8125 / 0.875 / 1 / 1.25 / 1.5 / 1.875 / 2.25. Rapport : corps de lecture 1.0625rem, max 72ch.

## Icons

`lucide-react` exclusivement, style outline : 16 px (`size-4`), `strokeWidth={1.75}`, toujours `aria-hidden` (le label est porté par le texte adjacent ou un `aria-label` sur le bouton). Pas de SVG inline ni de glyphes Unicode en guise d'icônes (la jauge ScoreDial, dessin de données, reste du SVG maison).

## Components

- **SiteHeader** : header persistant + navigation principale (`src/components/SiteHeader.tsx`). Logo → landing, onglets pilule « Analyses » / « Portefeuille » (actif = `usePathname`, fond `primary-soft` + texte ambre), badge « Méthodologie » à droite.
- **AnalysisCard** : ligne de dossier (pas une carte décorative) — ticker mono, nom, score, badge verdict, date ; états hover/focus/running.
- **VerdictBadge** : pilule sémantique (privilégier/surveiller/éviter) — fond saturé, texte near-white.
- **ScoreDial** : jauge SVG circulaire du score global, balayage animé GSAP, couleur du verdict.
- **ScoreBar** : barre de score horizontale avec repères aux seuils 40/70 ; remplissage animé (stagger) dans la vue d'ensemble, statique ailleurs.
- **Disclosure** : section dépliable contrôlée (bouton + région `aria-controls`), hauteur animée GSAP, `prefers-reduced-motion` = bascule instantanée.
- **PipelineStepper** : étapes verticales avec états (à venir / en cours / ok / warn / erreur), flux d'événements mono en dessous.
- **ReportView** (`src/components/ReportView.tsx`) : vue rapport structurée — construite depuis les données (`pillar_scores`, `metrics`, `red_flags`, `raw_data.qualitative`), **sans rendu Markdown** (le `.md` reste téléchargeable). Du verdict en un coup d'œil à la preuve : hero (ScoreDial + verdict + bannière de pénalité red flags / garde-fou « contrat » + red flags) → vue d'ensemble des 6 piliers (grille de cartes) → chiffres clés → l'essentiel (description, thèse, forces/faiblesses — bordures pleines + fond teinté + icône Lucide, **jamais de bande latérale**) → red flags (état vide soigné ou table de sévérité, jamais adoucie) → `PillarDetail` → déclencheurs → `RawDataAnnex`.
- **PillarDetail** : « le détail des 6 piliers » — une ligne `Disclosure` par pilier (replié = repère scannable ; déplié = composants, constats déterministes / analyses qualitatives sourcées, table comparables). Contrôle « tout déplier / replier ».
- **RawDataAnnex** : annexe « données brutes » repliée par défaut — grille de métriques par source, horodatage, `n/d` explicite (jamais estimé), disclaimer.
- **Portefeuille** (`src/app/portfolio/page.tsx`) : colonne saisie (lignes éditables `$`, total, ajout avec select narratif) + résultat — `HealthSummary` (verdict + score /100), grille de `CriteriaCard` (un critère Tier A par carte : statut + verdict 1 ligne + red flag Lucide `Flag` ou RAS), `Répartition` (switcher Barres / Anneau conic-gradient / Treemap), diversification sectorielle, `RiskCard`, points forts (`Check`), à vérifier (`ClipboardList`), suggestions. Couleurs de secteur = palette stable de 8 teintes.
- **ConfirmDialog** : `<dialog>` natif (top layer, focus trap, Échap) pour toute action destructive — jamais de `window.confirm`. Surface + bordure du système, backdrop `oklch(0 0 0 / 0.6)`, entrée 200 ms (`@starting-style`), bouton de confirmation `danger`/`danger-ink` libellé verbe + objet, annulation focusée par défaut.

## Motion (GSAP)

- Page de progression : la seule chorégraphie riche — étapes qui s'allument, log qui défile, pourcentage compté (`gsap.to` + textContent snap).
- ScoreDial : balayage d'arc 0→score, ease `power3.out`, 0.9 s, une seule fois.
- Vue rapport : entrée des sections (fade + y 12 px, stagger) et remplissage des barres de la vue d'ensemble (scaleX origin-left, stagger) à l'arrivée des données.
- Disclosure (détail des piliers, annexe) : hauteur animée à l'ouverture/fermeture (`power2`, ~0,3 s), `gsap.killTweensOf` sur toggles rapides.
- Listes : entrée fade+y(8px) stagger 40 ms à l'arrivée des données.
- Tout le reste : transitions CSS 150-250 ms, `ease-out`.
- `prefers-reduced-motion` : remplacement par opacité instantanée (gsap.matchMedia).

## Layout

App shell centrée `max-w-[1240px]`, header fin persistant (`SiteHeader`) avec navigation à trois destinations : **landing** (`/`), **Analyses** (`/analyses` + `/analyses/[id]`), **Portefeuille** (`/portfolio`). Pas de sidebar. La landing et le portefeuille respirent en pleine largeur ; la **vue rapport complétée** respire aussi en pleine largeur (`max-w-[1240px]`) pour ses grilles scannables (piliers, chiffres clés, annexe), tout en gardant la prose à une mesure lisible (~68-72ch). Les vues progression / échec restent en colonne étroite (`max-w-5xl`). Densité élevée dans les tables, respiration large autour du verdict. Chaque page porte son propre `<main>` (le layout ne fournit que le header).
