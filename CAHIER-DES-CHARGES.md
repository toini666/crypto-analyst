# Crypto Analyst — Cahier des charges fonctionnel

> Document de référence destiné à un designer / agent externe chargé de proposer une direction visuelle alternative. Il décrit **ce que fait l'application, ce qu'elle affiche et pourquoi**, sans aucune information sur le design actuel (ni couleurs, ni typographie, ni composants visuels, ni motion). Toute proposition de design doit couvrir l'intégralité des contenus et états décrits ici.

---

## 1. Vue d'ensemble

**Crypto Analyst** est un moteur personnel de due diligence de cryptomonnaies. L'utilisateur saisit le nom et le ticker d'un token (ex. « Aave » / « AAVE ») ; un pipeline automatisé collecte des données depuis des sources publiques (CoinGecko, DeFiLlama, GoPlus, GitHub), calcule des métriques et des scores de façon **déterministe**, fait rédiger les sections qualitatives par un LLM local, puis produit un **rapport de due diligence noté sur 100**, décomposé en 6 piliers, avec une liste de red flags et un verdict d'investissement.

Proposition de valeur (par différence avec les outils IA existants) :

1. **Aucun chiffre n'est généré par une IA** : toute métrique vient d'une API, est calculée par du code, et est sourcée + horodatée. Zéro hallucination sur les nombres.
2. **Méthodologie transparente et versionnée** : la grille de scoring (piliers, poids, seuils, pénalités, garde-fous) est une configuration explicite ; chaque rapport référence la version de méthodologie utilisée, ce qui rend les analyses comparables dans le temps.
3. **Reproductibilité et historisation** : chaque analyse est persistée ; on peut ré-analyser le même token plus tard et comparer.
4. **Honnêteté sur l'incertitude** : une donnée manquante est affichée « n/d », jamais devinée ; chaque pilier affiche son taux de couverture de données ; le rapport porte un niveau de confiance global.

Ce n'est **pas** un outil de trading ni d'analyse technique court terme : pas de graphiques de prix temps réel, pas de signaux d'achat, pas de momentum. C'est un instrument de recherche fondamentale qui aide à décider froidement si un token mérite attention et capital.

---

## 2. Utilisateur et contexte d'usage

- **Mono-utilisateur** : un investisseur crypto particulier exigeant. Pas de comptes, pas de partage, pas de social.
- L'application tourne **en local sur sa machine** (app web Next.js + base **SQLite locale**, `better-sqlite3`). Il l'utilise typiquement le soir, sur un seul écran, pour des sessions de lecture longue.
- Son flux : il lance une analyse → attend 5 à 15 minutes (il peut quitter la page, le pipeline continue en tâche de fond) → lit le rapport → revient plus tard consulter ou comparer des analyses passées.
- Langue de l'interface et des rapports : **français** (formats de dates et nombres fr-FR).
- L'exigence centrale côté lecture : **comprendre l'essentiel en moins de 3 minutes** (verdict, score, points saillants), puis pouvoir creuser chaque section en profondeur — divulgation progressive.

---

## 3. Concepts métier (vocabulaire du domaine)

Ces concepts structurent tout l'affichage. Un design alternatif doit tous les représenter.

### 3.1 Analyse

L'objet central. Une analyse appartient à un token (nom, ticker, identifiant CoinGecko, logo) et possède :

- un **statut** : `en attente` → `en cours` → `terminée` ou `échouée` ;
- une **progression** (0–100 %) et une **étape courante** pendant l'exécution ;
- une fois terminée : un **score global /100**, un **verdict**, un **niveau de confiance**, les **scores des 6 piliers**, la liste des **red flags**, les **métriques brutes** et le **rapport complet** (Markdown) ;
- des métadonnées : date/heure de création, **version de méthodologie** utilisée ;
- en cas d'échec : un message d'erreur technique.

### 3.2 Les 6 piliers et leurs composants

Le score global est la moyenne pondérée de 6 piliers. Chaque pilier est lui-même composé de sous-scores (« composants »), chacun d'origine **quantitative** (calculé par le code depuis les APIs) ou **qualitative** (rédigé et noté par le LLM, avec sources citées).

| Pilier | Poids | Composants (poids interne, origine) |
|---|---|---|
| **Fondamentaux** | 20 % | Problème, solution & nécessité blockchain (35 %, qual) · Équipe, investisseurs & financement (40 %, qual) · Exécution de la roadmap (25 %, qual) |
| **Tokenomics & capture de valeur** | 25 % | Dilution MC/FDV (30 %, quant) · Utilité du token & capture de valeur (45 %, qual) · Unlocks & inflation à venir (25 %, qual) |
| **Traction & adoption on-chain** | 20 % | Ratio TVL/Market Cap (25 %, quant) · Tendance TVL 30 j (15 %, quant) · Frais & revenus du protocole (30 %, quant) · Adoption selon narratif (30 %, qual) |
| **Marché & valorisation** | 15 % | Valorisation vs revenus P/S (30 %, quant) · Valorisation vs comparables (70 %, qual). *(Le volume/liquidité, court terme et bruité, a été retiré du scoring en v2.0.0 — il reste affiché mais ne pèse plus.)* |
| **Social & mindshare** | 10 % | Activité développeurs GitHub (45 %, quant) · Mindshare & dynamique sociale (55 %, qual) |
| **Sécurité & risques** | 10 % | Sécurité du contrat (45 %, quant) · Concentration des holders (20 %, quant) · Audits & risques légaux (35 %, qual) |

Chaque pilier expose en plus une **couverture de données** (0–100 %) : la part du poids de ses composants effectivement scorée. Un composant sans donnée vaut `null` (affiché « n/d »), jamais 0. Quand la couverture d'un pilier est < 100 %, cette information doit être visible.

### 3.3 Red flags (3 niveaux de sévérité)

Signaux de risque détectés par le screening quantitatif ou l'analyse qualitative. Chaque red flag a une sévérité, un libellé, un détail optionnel et une source optionnelle :

- **Critique** (ex. honeypot, contrat non vérifié, fonction de mint cachée, taxe > 10 %) ;
- **Majeur** (ex. top 10 holders > 40 % de l'offre, MC/FDV < 0,25, privilèges propriétaire dangereux) ;
- **Mineur** (ex. GitHub inactif depuis 90 jours, prix > 90 % sous l'ATH).

**Exigence produit forte** : la sévérité ne doit jamais être adoucie visuellement. Un red flag critique est une information de premier plan.

### 3.4 Pénalités de red flags & garde-fou contrat (méthodologie v2.0.0)

C'est la spécificité méthodologique de l'outil : une moyenne pondérée peut masquer un défaut fatal. Plutôt que des plafonds durs (« chutes d'office » à 20/55, supprimés en v2.0.0), chaque red flag **pénalise le score du pilier d'où il vient** (critical −40, major −14, minor −3 ; cumul en √n ; plancher 0), pénalité répercutée au global par la pondération. Aucun plancher.

Le rapport expose donc, par pilier : le **score avant pénalité** (`scoreBeforeFlags`), la **pénalité** (`flagPenalty`) et le score final ; au global, le total des points retirés (`redFlagPenalty`, écart avant/après).

**Seule exception de type plafond — garde-fou « contrat »** : un red flag *critical contrat objectif* (honeypot, contrat non vérifié, taxe extrême — `HIDDEN_MINT` exclu) ramène le score juste sous le seuil « privilégier » (= **69**, `contractCriticalCap`) → verdict « à surveiller » au minimum, jamais « à privilégier ». L'application l'affiche dans un encart visible. C'est une information capitale qui doit sauter aux yeux dans toute proposition de design.

### 3.5 Verdict

Dérivé du score global final : **À privilégier** (≥ 70) · **À surveiller** (40–69) · **À éviter** (< 40). Les trois verdicts portent une sémantique positif / vigilance / négatif qui doit être immédiatement lisible. La même sémantique en trois zones s'applique partout où un score /100 est affiché (pilier, composant, global).

### 3.6 Niveau de confiance

Qualité globale des données de l'analyse, dérivée de la couverture : **confiance élevée** (≥ 80 % de couverture), **moyenne** (≥ 50 %), **faible** (< 50 %). Affiché à côté du verdict.

### 3.7 Version de méthodologie

Chaîne sémantique (ex. « v2.0.0 ») affichée sur chaque analyse (liste et rapport). Deux analyses ne sont strictement comparables que si leur version de méthodologie est identique — d'où son affichage systématique.

---

## 4. Le pipeline d'analyse (fonctionnement et restitution temps réel)

Une analyse s'exécute en **10 étapes ordonnées**, chacune associée à un jalon de progression :

| # | Étape | Progression atteinte |
|---|---|---|
| 1 | Identification du token | 5 % |
| 2 | Données de marché (CoinGecko) | 15 % |
| 3 | Données DeFi (DeFiLlama) | 25 % |
| 4 | Sécurité du contrat (GoPlus) | 35 % |
| 5 | Activité développeurs (GitHub) | 45 % |
| 6 | Calcul des métriques | 52 % |
| 7 | Scoring quantitatif & red flags | 58 % |
| 8 | Analyse qualitative (Claude) | 90 % |
| 9 | Scoring final & pénalités | 95 % |
| 10 | Génération du rapport | 100 % |

Points fonctionnels importants :

- L'étape 8 (analyse qualitative) est **de loin la plus longue** (plusieurs minutes — le saut de 58 % à 90 % le reflète). Le design de la progression doit rester rassurant pendant cette longue étape.
- Le pipeline tourne **en tâche de fond, détaché du navigateur** : l'utilisateur peut fermer la page, la progression continue. Ce message doit être communiqué pendant l'exécution.
- Toute l'UI se met à jour **sans rechargement** par **polling des routes API** (le Realtime de Supabase a été remplacé après la bascule en SQLite local) : la liste des analyses et la page de progression se rafraîchissent toutes seules.
- Pendant l'exécution, le pipeline émet un **journal d'événements** : lignes horodatées avec un niveau (`info`, `warn`, `error`, `succès`) et un message technique (ex. « TVL récupérée : 12,4 Md$ », « holders indisponibles sur cette chaîne »). Ce journal est affiché en direct et conservé (consultable aussi sur une analyse échouée).
- Durée totale annoncée à l'utilisateur : **5 à 15 minutes**.
- En cas d'erreur bloquante, l'analyse passe en statut **échouée** avec un message d'erreur ; l'utilisateur peut alors relancer (nouvelle analyse du même token) ou supprimer.

---

## 5. Écrans et contenus

L'application a exactement **deux écrans** (plus une vue « introuvable »). Application web, desktop d'abord, mais responsive.

### 5.1 Écran 1 — Tableau de bord (`/`)

Double rôle : **lancer une analyse** et **consulter l'historique**.

**A. Lancement d'une analyse**

- Formulaire à deux champs texte : **Nom du projet** (ex. « Aave ») et **Ticker** (ex. « AAVE »). Les deux sont requis.
- Action de soumission « Lancer l'analyse », avec état d'attente pendant la création (« Lancement… »), désactivée si champs vides.
- En cas d'échec de création : message d'erreur affiché sous le formulaire.
- Une note contextuelle informe l'utilisateur de ce qui va se passer : pipeline déterministe CoinGecko → DeFiLlama → GoPlus → GitHub → analyse qualitative locale, durée 5–15 minutes.
- Après lancement réussi : **redirection immédiate** vers la page de l'analyse (vue progression).

**B. Liste des analyses**

- Toutes les analyses, triées de la plus récente à la plus ancienne, avec un **compteur total**.
- Mise à jour **en temps réel** : une analyse en cours voit sa progression avancer dans la liste ; une analyse qui se termine bascule en affichage verdict sans rechargement.
- Chaque entrée affiche :
  - le **logo du token** (image CoinGecko) ou, à défaut, un substitut basé sur les deux premières lettres du ticker ;
  - le **nom du token** et le **ticker** ;
  - la **date/heure de création** et la **version de méthodologie** ;
  - un bloc d'état qui dépend du statut :
    - *terminée* : le **verdict** + le **score global** (sémantique trois zones) ;
    - *échouée* : mention « Échec » ;
    - *en cours / en attente* : indicateur d'activité + **libellé de l'étape courante** + **pourcentage de progression**.
- Chaque entrée est cliquable (navigue vers la page de l'analyse) et propose une action **Supprimer**.
- **Suppression** : action destructive, toujours précédée d'une **confirmation intégrée à l'application** (jamais de dialogue natif du navigateur), qui rappelle le nom du token et précise que l'analyse et son rapport seront définitivement supprimés. États gérés : en cours (« Suppression… »), erreur (message affiché dans la confirmation), annulation.
- **État vide** (aucune analyse) : message d'accueil expliquant quoi faire (« Indiquez le nom et le ticker d'un projet : le pipeline collecte les données, calcule les scores des 6 piliers et rédige le rapport de due diligence »).
- **État de chargement initial** : la liste a un état d'attente avant l'arrivée des données.

### 5.2 Écran 2 — Page d'une analyse (`/analyses/[id]`)

Une seule route, **trois vues selon le statut**, plus la navigation retour vers la liste (« Toutes les analyses »). Mise à jour temps réel : la vue bascule d'elle-même de « en cours » à « rapport » quand le pipeline se termine.

#### Vue « en cours »

- En-tête : nom du token + ticker, et le message « Analyse en cours — vous pouvez quitter cette page, le pipeline continue ».
- **Progression globale** : pourcentage affiché en grand + représentation de progression (avec sémantique d'accessibilité progressbar).
- **Suivi des 10 étapes** : liste ordonnée des étapes du pipeline avec, pour chacune, son état — *faite*, *en cours* (mise en évidence), *à venir*, *échouée*. C'est le seul endroit de l'application où une mise en scène riche de l'état est souhaitée : la progression du pipeline est la chorégraphie centrale du produit.
- **Journal du pipeline** : flux des événements en direct (heure + message, différencié par niveau info/avertissement/erreur/succès), défilement automatique vers la dernière entrée, zone scrollable, annonce des nouvelles entrées aux lecteurs d'écran. État initial : « En attente du démarrage du runner… ».

#### Vue « échec »

- En-tête : nom du token + ticker.
- Bloc d'erreur : « L'analyse a échoué » + le **message d'erreur technique** exact.
- Deux actions : **Relancer l'analyse** (crée une nouvelle analyse du même token et y navigue) et **Supprimer** (même confirmation que sur la liste, retour au tableau de bord après suppression).
- Le **suivi des étapes et le journal** restent affichés (diagnostic : on voit à quelle étape ça a cassé et les derniers événements).

#### Vue « rapport » (analyse terminée)

Organisée selon le principe : **le verdict en un coup d'œil, la preuve en dessous**.

**A. Synthèse de verdict** (tout doit être perceptible sans défiler) :

- **Score global /100** — l'information n°1 de l'écran ;
- logo, nom du token, ticker ;
- **verdict** (À privilégier / À surveiller / À éviter) ;
- **niveau de confiance** des données ;
- date/heure de l'analyse + version de méthodologie ;
- si des red flags pèsent sur le score : encart « Red flags : −<N> pts imputés aux piliers (score avant red flags : <M>) » ; et, si le **garde-fou contrat** s'applique : encart bien visible « Red flag critique contrat — verdict limité à « à surveiller », score plafonné à 69 » ;
- s'il y a des red flags : **compteurs par sévérité** (ex. « 1 red flag critique · 3 red flags majeurs · 2 red flags mineurs ») ;
- **les 6 piliers** : pour chacun, libellé, poids (%), score /100 (sémantique trois zones, « n/d » si indisponible) et, si < 100 %, la **couverture de données** ;
- action **« Télécharger le rapport (.md) »** : exporte le rapport Markdown brut (nom de fichier `<ticker>-due-diligence-<date>.md`).

**B. Le rapport complet**, **vue structurée construite depuis les données de l'analyse** (`pillar_scores`, `metrics`, `red_flags`, `raw_data.qualitative`) — le `.md` reste téléchargeable mais n'est plus le support de rendu. C'est un document long (plusieurs milliers de mots) destiné à la **lecture approfondie** ; la typographie de lecture longue est le cœur du produit. Sa structure exacte :

1. **Titre** : « <Nom> (<TICKER>) — Analyse de due diligence » + ligne de métadonnées (date de génération, version méthodologie, confiance, id CoinGecko).
2. **Executive Summary** : description du projet en 2 lignes + narratif (catégorie : DeFi, L1, meme…) ; verdict + score global ; rappel de la pénalité de red flags et du garde-fou contrat éventuels ; **tableau des 6 piliers** (poids, score, red flags imputés, couverture) ; **3 forces / 3 faiblesses** ; **thèse d'investissement** en un paragraphe.
3. **Red Flags** : tableau complet trié par sévérité décroissante (sévérité, signal, détail, source) — ou mention explicite « aucun red flag détecté ».
4. **Analyse détaillée par pilier** : pour chacun des 6 piliers (titre + score + poids), chaque composant avec son score :
   - composant *quantitatif* → « Constat (déterministe) » : justification chiffrée produite par le code (ex. « P/S annualisé = 12 : valorisation modérée vs revenus ») ;
   - composant *qualitatif* → résumé d'une ligne + analyse rédigée de plusieurs paragraphes + **sources citées** (URLs) ;
   - le composant « Valorisation vs comparables » contient en plus un **tableau comparatif** (projet, market cap, FDV, commentaire) vs 2-3 concurrents.
5. **Déclencheurs de la thèse** (thèse falsifiable) : deux check-lists — **catalyseurs positifs à surveiller** et **signaux d'invalidation** (4-5 éléments chacune).
6. **Annexe — Données brutes** : tableau exhaustif de ~23 métriques avec leur source (voir §6) + mention de la date/heure de récupération des données.
7. **Disclaimer** : recherche personnelle, pas un conseil en investissement.

### 5.3 Vue « analyse introuvable »

Si l'id n'existe pas (ou plus) : message « Cette analyse n'existe pas (ou plus) » + lien de retour à la liste.

---

## 6. Données et métriques affichées

Métriques quantitatives collectées et affichées (annexe du rapport, et matière des constats déterministes). Chaque valeur est accompagnée de sa **source** ; toute valeur indisponible s'affiche « **n/d** » :

| Domaine | Métriques | Source |
|---|---|---|
| Marché | Prix, Market Cap, FDV, ratio MC/FDV, rang market cap, volume 24 h, ratio Volume/MC, ATH + date, drawdown vs ATH, offre circulante / totale / max, % circulant, variation prix 30 j | CoinGecko |
| DeFi | TVL, ratio TVL/MC, tendance TVL 30 j, frais 30 j, revenus 30 j, revenus annualisés, ratio P/S | DeFiLlama |
| Sécurité | Nombre de holders, % top 10 holders, taxe d'achat, taxe de vente, flags de contrat (honeypot, open source, mint, privilèges propriétaire) | GoPlus |
| Développement | Commits 90 j, contributeurs, stars, jours depuis le dernier commit | GitHub |
| Social | Followers Twitter/X | CoinGecko |

Conventions d'affichage des données :

- Montants abrégés : `$12,34 Md` / `$45,67 M` / `$89,1 k` ; petits prix avec 4 décimales.
- Pourcentages avec une décimale ; nombres au format fr-FR (séparateurs d'espace).
- Les chiffres destinés à être comparés en colonne doivent être typographiquement alignables.
- Tout affichage de score /100 suit la sémantique trois zones (≥ 70 positif, 40–69 vigilance, < 40 négatif ; « n/d » neutre).

---

## 7. Cas d'usage (parcours complets)

1. **Analyser un nouveau token** : saisir nom + ticker → lancer → suivre la progression (ou partir) → lire le rapport. Le parcours nominal.
2. **Lecture rapide (< 3 min)** : ouvrir une analyse terminée → verdict, score, red flags, scores de piliers, forces/faiblesses → décision « ça mérite ou non que je creuse ».
3. **Lecture approfondie** : descendre dans le rapport complet, pilier par pilier, vérifier les sources citées et l'annexe de données brutes.
4. **Revue de l'historique** : parcourir la liste, comparer mentalement les scores/verdicts de plusieurs tokens, rouvrir d'anciens rapports. (Une vraie fonction de comparaison côte à côte — même token dans le temps, tokens entre eux — est prévue, pas encore construite.)
5. **Suivre une analyse en cours** : revenir sur le tableau de bord et voir la progression en direct ; ouvrir l'analyse pour le détail étape par étape et le journal.
6. **Diagnostiquer un échec** : ouvrir l'analyse échouée, lire l'erreur et le journal, relancer ou supprimer.
7. **Exporter** : télécharger le rapport Markdown pour archivage ou lecture ailleurs.
8. **Nettoyer** : supprimer des analyses obsolètes (avec confirmation — un rapport coûte ~12 minutes à régénérer).

---

## 8. Exigences transverses (non négociables)

1. **Le chiffre est sacré** : toute donnée affichée est sourcée et datée ; l'incertitude (données manquantes, couverture partielle, niveau de confiance) est montrée, jamais masquée ni lissée.
2. **Divulgation progressive** : verdict et score immédiatement perceptibles, preuve et détail accessibles en dessous ; l'essentiel se lit en moins de 3 minutes.
3. **La sévérité est visible** : les red flags ne sont jamais esthétiquement adoucis ; leur pénalité sur le score (et le garde-fou « contrat » qui plafonne à 69) doit se voir instantanément.
4. **Le rapport est le produit** : la lisibilité de la lecture longue (document dense, tableaux, citations de sources) prime sur tout ornement.
5. **L'état du système est toujours clair** : chaque vue gère explicitement chargement, vide, en cours, succès, échec ; le temps réel ne doit jamais produire d'état ambigu.
6. **Accessibilité WCAG AA** : contrastes suffisants, focus visible, navigation clavier complète sur toutes les actions (lancer, ouvrir, supprimer, confirmer), `prefers-reduced-motion` respecté, sémantique ARIA sur la progression et le journal.
7. **Pas de dialogues natifs du navigateur** (confirm/alert) : toute confirmation est une interface de l'application.
8. **Ton du contenu** : l'application produit de la recherche, pas du conseil ; aucun mécanisme d'excitation (compteurs, gamification, urgence, FOMO) n'a sa place.

---

## 9. Évolutions prévues (à anticiper dans le design, pas à produire)

- **Désambiguïsation des tickers** : quand nom + ticker correspondent à plusieurs tokens, l'application proposera un choix entre candidats (nom, ticker, market cap, logo) avant de lancer le pipeline.
- **Comparaison d'analyses** : même token dans le temps (évolution du score entre versions de méthodologie) et tokens entre eux.
- **Actions sur le rapport** : supprimer et relancer directement depuis la vue rapport (aujourd'hui disponibles uniquement depuis la liste et la vue échec).
- **Couverture de données par pilier** encore plus explicite (aucune absence de donnée silencieuse).

---

## 10. Contraintes techniques utiles au design

- Next.js (App Router) + React, rendu client pour les deux écrans ; styles via Tailwind CSS.
- Données servies par une base **SQLite locale** (`better-sqlite3`, WAL) ; le navigateur lit via les routes API (`GET`) et **rafraîchit par polling** (la liste comme le détail se mettent à jour sans rechargement, sans subscriptions).
- Le rapport est **construit comme une vue structurée** depuis les données de l'analyse (pas de rendu Markdown) ; un **export Markdown** reste stocké et téléchargeable. Le design style donc des composants structurés, pas du contenu Markdown générique.
- Logos de tokens : URLs d'images externes (CoinGecko), parfois absentes (prévoir le fallback).
- Pas d'authentification, pas de multi-tenant, pas de mode hors ligne particulier.
