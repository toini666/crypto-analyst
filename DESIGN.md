# Design

## Theme

Dark, unique (pas de mode clair) : l'outil s'utilise le soir, lumière ambiante faible, lecture longue. Surface near-black neutre (chroma 0) ; la personnalité vit dans le cobalt, la sérif éditoriale et les couleurs de verdict — jamais dans des fonds teintés.

## Palette (OKLCH)

| Rôle | Valeur | Usage |
|---|---|---|
| `--bg` | `oklch(0.11 0 0)` | fond de page |
| `--surface` | `oklch(0.155 0 0)` | cartes, panneaux |
| `--surface-2` | `oklch(0.19 0 0)` | éléments interactifs au repos, bordures épaisses |
| `--border` | `oklch(0.26 0 0)` | bordures 1px |
| `--ink` | `oklch(0.93 0.005 230)` | texte principal (≥ 7:1 sur bg) |
| `--muted` | `oklch(0.70 0.008 230)` | texte secondaire (≥ 4.5:1 sur bg) |
| `--faint` | `oklch(0.55 0.008 230)` | méta, timestamps (grands corps uniquement) |
| `--primary` | `oklch(0.70 0.12 230)` | cobalt : actions, liens, sélection, info |
| `--primary-ink` | `oklch(0.13 0.03 230)` | texte sur fond primary |
| `--accent` | `oklch(0.78 0.14 75)` | ambre : « à surveiller », warnings |
| `--success` | `oklch(0.72 0.17 150)` | « à privilégier », succès |
| `--danger` | `oklch(0.64 0.19 25)` | « à éviter », red flags critiques, erreurs |

Stratégie : **Restrained** — neutres purs + cobalt ≤ 10 % de la surface. Les couleurs de verdict (success/accent/danger) sont sémantiques, réservées aux scores, badges et red flags.

## Typography

| Famille | Rôle |
|---|---|
| **Newsreader** (sérif, next/font) | Titres du rapport et titres de pages ; italique pour les verdicts. Jamais dans les labels/boutons. |
| **Geist Sans** | UI : navigation, labels, boutons, corps. |
| **Geist Mono** | Chiffres, tickers, métriques, logs du pipeline — toujours `font-variant-numeric: tabular-nums`. |

Échelle fixe (rem), ratio ~1.2 : 0.75 / 0.8125 / 0.875 / 1 / 1.25 / 1.5 / 1.875 / 2.25. Rapport : corps de lecture 1.0625rem Newsreader-adjacent (Geist), max 72ch.

## Components

- **AnalysisCard** : ligne de dossier (pas une carte décorative) — ticker mono, nom, score, badge verdict, date ; états hover/focus/running.
- **VerdictBadge** : pilule sémantique (privilégier/surveiller/éviter) — fond saturé, texte near-white.
- **ScoreDial** : jauge SVG circulaire du score global, balayage animé GSAP, couleur du verdict.
- **PillarBars** : 6 barres horizontales (score + couverture de données), remplissage animé stagger.
- **PipelineStepper** : étapes verticales avec états (à venir / en cours / ok / warn / erreur), flux d'événements mono en dessous.
- **RedFlagsPanel** : table de sévérité, jamais adoucie (critique = danger plein).
- **Report** : rendu Markdown éditorial (Newsreader pour h1-h3, tables denses Geist Mono).

## Motion (GSAP)

- Page de progression : la seule chorégraphie riche — étapes qui s'allument, log qui défile, pourcentage compté (`gsap.to` + textContent snap).
- ScoreDial : balayage d'arc 0→score, ease `power3.out`, 0.9 s, une seule fois.
- PillarBars : stagger 60 ms, scaleX origin-left.
- Listes : entrée fade+y(8px) stagger 40 ms à l'arrivée des données.
- Tout le reste : transitions CSS 150-250 ms, `ease-out`.
- `prefers-reduced-motion` : remplacement par opacité instantanée (gsap.matchMedia).

## Layout

App shell mono-colonne centrée (max-w-5xl) : pas de sidebar, l'outil n'a que deux écrans (liste, analyse). Header fin persistant avec le nom de l'outil et l'action « Nouvelle analyse ». Densité élevée dans les tables, respiration large autour du verdict.
