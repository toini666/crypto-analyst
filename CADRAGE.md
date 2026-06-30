# Cadrage du projet — Crypto Analyst

> Document de cadrage initial, compilé le 2026-06-11 à partir de trois sources :
> 1. **Recherche socratique** — réflexion de fond sur ce qui rend une analyse crypto pertinente et qualitative
> 2. **État de l'art** — recherches web exhaustives sur les outils, frameworks et données existants
> 3. **Héritage** — les deux prompts d'analyse fournis dans `resources/` (framework "Toini")

---

## Table des matières

1. [Vision et objectif du produit](#1-vision-et-objectif-du-produit)
2. [Réflexion de fond : qu'est-ce qu'une analyse crypto de qualité ?](#2-réflexion-de-fond--quest-ce-quune-analyse-crypto-de-qualité-)
3. [État de l'art](#3-état-de-lart)
4. [Analyse des prompts existants (héritage Toini)](#4-analyse-des-prompts-existants-héritage-toini)
5. [Framework méthodologique cible](#5-framework-méthodologique-cible)
6. [Sources de données et APIs](#6-sources-de-données-et-apis)
7. [Implications pour l'implémentation](#7-implications-pour-limplémentation)
8. [Risques et limites](#8-risques-et-limites)
9. [Questions ouvertes avant implémentation](#9-questions-ouvertes-avant-implémentation)
10. [Sources](#10-sources)

---

## 1. Vision et objectif du produit

Construire un **outil d'analyse exhaustive et détaillée de cryptomonnaies** : on lui donne un token, il produit une due diligence structurée, sourcée, notée et reproductible — l'équivalent d'un analyste senior qui appliquerait *toujours la même méthodologie*, avec des données fraîches et vérifiables.

Le constat de départ : les prompts Perplexity historiques (`resources/`) produisaient de bonnes analyses mais souffraient des limites d'un prompt "one-shot" — données non garanties, chiffres parfois hallucinés, pas de persistance, pas de comparabilité entre analyses, pas de suivi dans le temps. Le but du projet est d'industrialiser cette méthodologie.

**Ce que l'outil doit produire** (proposition issue de la synthèse, à valider) :
- Un **rapport d'analyse** par token : executive summary lisible en < 3 min + sections approfondies
- Un **score global /100** décomposé par pilier, avec justification chiffrée de chaque note
- Une liste explicite de **red flags** (dont certains éliminatoires)
- Une **thèse d'investissement falsifiable** : déclencheurs positifs/négatifs concrets et datables
- À terme : historique des analyses, watchlist, re-analyse périodique, comparaison entre tokens

---

## 2. Réflexion de fond : qu'est-ce qu'une analyse crypto de qualité ?

### 2.1 Ce que cherche vraiment un investisseur

Une analyse n'a de valeur que si elle réduit l'**asymétrie d'information** entre l'investisseur et le marché. Concrètement, l'investisseur cherche des réponses à cinq questions, dans cet ordre :

1. **Est-ce légitime ?** — Pas un scam, pas un honeypot, pas un rug pull en préparation.
2. **Est-ce viable ?** — Équipe réelle, produit qui fonctionne, trésorerie suffisante ("runway beats rhetoric" : si la survie du projet dépend de la vente de son propre token, c'est une bombe à retardement).
3. **Est-ce adopté ?** — Usage organique réel (utilisateurs qui paient des frais) vs capital mercenaire attiré par des incentives.
4. **Le token capture-t-il cette valeur ?** — Le point le plus souvent négligé (voir 2.4).
5. **Est-ce le bon prix / le bon moment ?** — Valorisation relative, position dans le cycle, catalyseurs.

Cette hiérarchie est une **pyramide** : chaque niveau ne vaut la peine d'être analysé que si le niveau inférieur est validé. Analyser la valorisation d'un honeypot est une perte de temps ; c'est pourtant ce que fait une grille de scoring à moyenne pondérée appliquée aveuglément.

### 2.2 Projet ≠ token : le test de la capture de valeur

**L'insight central de toute la réflexion** : un excellent projet peut être un très mauvais investissement, et inversement.

- Un protocole peut avoir une TVL en croissance, des revenus réels, une équipe brillante… et un token purement "de gouvernance" qui ne capture rien de ce succès, dilué par 80 % de supply encore à débloquer au profit des VCs.
- À l'inverse, un projet techniquement banal peut avoir une tokenomics si bien conçue (offre limitée, burn, partage de revenus, demande structurelle) que le token surperforme.

Une analyse de qualité évalue donc **trois objets distincts** :
1. **Le projet** (problème, solution, équipe, exécution, adoption)
2. **Le token** (offre, distribution, émission, utilité, mécanismes de demande)
3. **La jonction entre les deux** : le test de capture de valeur — *"si le projet réussit, qu'est-ce qui force mécaniquement la valeur vers le détenteur du token ?"* Si la réponse est "rien" ou "la spéculation", le score tokenomics doit être sévèrement plafonné. Sans capture de valeur, le token n'est qu'une unité de compte flottante, pas un actif.

Deux sous-tests utiles :
- **Test de nécessité du token** : le protocole fonctionnerait-il aussi bien sans token ? (Si oui → le token est un instrument de financement, pas un actif productif.)
- **Test de nécessité de la blockchain** : le problème a-t-il besoin d'une blockchain ? (Si non → projet Web2 déguisé, moat fragile.)

### 2.3 L'asymétrie du risque : éliminer avant de classer

70 à 80 % des nouveaux tokens ne maintiennent ni volume ni activité de développement au-delà de leur première année. Le downside typique d'un mauvais choix est -90 à -100 % ; l'upside d'un bon choix est rarement symétrique en probabilité.

Conséquence méthodologique : **une analyse de qualité est d'abord un filtre d'élimination, ensuite seulement un outil de classement**. La détection de red flags a plus de valeur espérée que la détection d'upside. C'est pourquoi le framework cible (§5) fait **peser les red flags directement sur le score** : chaque signal abaisse le pilier d'où il vient, de sorte qu'une moyenne pondérée ne peut plus masquer un défaut fatal (90/100 en "social" ne compense pas un contrat non vérifié avec mint caché) — et un signal de scam contrat objectif borne le verdict à « à surveiller ».

### 2.4 Les huit propriétés d'une analyse de qualité

| # | Propriété | Définition opérationnelle |
|---|-----------|---------------------------|
| 1 | **Sourcée et datée** | Chaque chiffre est traçable vers une source nommée, avec horodatage. La crypto bouge vite : une donnée sans date est une donnée morte. |
| 2 | **Comparative** | Une métrique isolée est du bruit. 50 M$ de TVL : bien ou mal ? Sans benchmark sectoriel (concurrents, médiane de la catégorie), impossible à dire. |
| 3 | **Adaptée au secteur** | La TVL ne dit rien d'un meme coin ; le staking ratio est central pour un L1 ; les revenus de frais pour la DeFi ; les nœuds actifs pour le DePIN. Les métriques doivent suivre le narratif. |
| 4 | **Falsifiable** | La thèse définit ses propres conditions d'invalidation : déclencheurs négatifs concrets ("retard mainnet > 6 mois", "unlock non communiqué"). Une thèse infalsifiable est une opinion. |
| 5 | **Honnête sur l'incertitude** | Donnée manquante = signalée comme manquante, jamais devinée. Niveau de confiance explicite par section. |
| 6 | **Reproductible** | La même méthodologie appliquée à deux tokens (ou au même token à deux dates) produit des scores comparables. C'est ce qui distingue un *outil* d'une succession de prompts. |
| 7 | **Actionnable** | Conclusion en thèse claire ("à privilégier / à surveiller / à éviter") + catalyseurs + profil risque/rendement. Pas une dissertation. |
| 8 | **Lisible par divulgation progressive** | Executive summary < 3 min, puis drill-down par section pour qui veut creuser. (Principe déjà présent dans les prompts Toini, à conserver absolument.) |

### 2.5 Ce qui détruit la valeur d'une analyse

Le miroir des propriétés ci-dessus, observé dans les outils IA existants et les analyses amateurs :
- **Chiffres hallucinés ou périmés** présentés avec assurance — le défaut n°1 des analyses LLM "one-shot" ;
- **Moyennes qui lissent les défauts fatals** ;
- **Biais narratif** : confondre mindshare (légitime à mesurer) et validation de la thèse (le hype n'est pas un fondamental — il est un *amplificateur* réflexif, dans les deux sens) ;
- **Métriques vanité** : nombre de followers achetables, TVL gonflée par des incentives, volume wash-tradé — d'où l'importance de croiser volume/MC, croissance organique vs campagnes, et qualité de l'engagement ;
- **Absence de "so what"** : des tableaux de métriques sans interprétation ni décision.

---

## 3. État de l'art

### 3.1 Plateformes de données (les "matières premières")

| Plateforme | Spécialité | Accès |
|---|---|---|
| **CoinGecko** | Données de marché (13 000+ tokens) : prix, MC, FDV, volume, ATH, supply | API gratuite ~50 appels/min ; MCP officiel sans clé ; plans payants dès ~129 $/mois |
| **DeFiLlama** | TVL (350+ chains, 5 000+ protocoles), fees/revenues, stablecoins, **unlocks**, raises | API gratuite sans authentification ; Pro à 300 $/mois pour gros volumes ; MCP officiel |
| **Dune Analytics** | Requêtes SQL custom sur données on-chain, dashboards communautaires | Tier gratuit, requêtes payantes au-delà |
| **Token Terminal** | Fondamentaux financiers standardisés (revenus, P/F, P/S) | Majoritairement payant |
| **Glassnode** | On-chain macro (MVRV, SOPR, flux exchanges), séries temporelles haute fidélité | Freemium, orienté BTC/ETH/majors |
| **Santiment** | On-chain + social + **activité développeurs**, 2 000+ assets | API GraphQL, freemium |
| **LunarCrush** | Sentiment social, Galaxy Score, 4 000+ cryptos | API REST payante (clé Bearer simple) |
| **Tokenomist** (ex-TokenUnlocks) | Vesting, cliffs, calendrier d'unlocks, 500+ tokens | Freemium |
| **CryptoRank** | Unlocks, vesting, distribution, levées de fonds | Freemium |
| **Nansen / Arkham** | Wallets labellisés, "smart money", flux | Payant (Nansen), gratuit partiel (Arkham) |
| **CoinGlass** | Dérivés (funding, OI, liquidations) | Freemium |

**Constat clé** : un stack de données **gratuit et légalement exploitable** couvre déjà l'essentiel du framework : CoinGecko (marché) + DeFiLlama (TVL, fees, unlocks) + Dune (custom) + GitHub API (dev) + GoPlus/Honeypot.is (sécurité contrat). Les données sociales de qualité (LunarCrush, Santiment) sont le principal poste payant.

### 3.2 Plateformes de recherche et frameworks institutionnels

- **Messari** : 200+ rapports de due diligence standardisés, scoring de risque multidimensionnel, "AI Deep Research" cité et audit-grade. La référence du genre — et le bon étalon de qualité pour notre rapport cible.
- **Framework EY de token due diligence** : six piliers de risque — *réputationnel/stratégique, technique, financier, légal/compliance, cybersécurité, auditabilité*. Confirme que la **sécurité et l'auditabilité sont des dimensions à part entière**, absentes du framework Toini historique.
- **CFA Institute** : guide de valorisation des cryptoassets pour professionnels — légitime les méthodes du §5.2 (NVT, MVRV, multiples de revenus, DCF adapté).
- Le marché ayant dépassé 4 000 Md$ de capitalisation totale en 2025, l'analyse fondamentale est devenue la norme chez les participants sophistiqués — notre outil s'inscrit dans ce mouvement.

### 3.3 Outils IA concurrents (et ce qu'ils nous apprennent)

| Outil | Approche | Leçon pour nous |
|---|---|---|
| **CoinStats AI Agent** | Multi-agents parallèles (news, social, on-chain, exchanges), rapport en ~4 min | L'architecture multi-sources parallèle est l'état de l'art |
| **Messari AI** | Deep research entièrement cité, "audit-grade" | Le sourçage systématique est le standard de crédibilité |
| **Token Metrics** | Ratings IA + détection de narratifs émergents | La détection de narratif est une feature différenciante |
| **ChainGPT, Nansen AI** | Chat + recherche on-chain en langage naturel | L'interface conversationnelle est attendue, mais ne remplace pas un rapport structuré |

**Le gap identifié** — aucun outil existant ne combine :
1. une **méthodologie personnelle, transparente et versionnée** (la nôtre, pas une boîte noire propriétaire) ;
2. des **chiffres calculés de façon déterministe** depuis les APIs (zéro hallucination sur les nombres) ;
3. la **reproductibilité et l'historisation** (re-scorer le même token chaque mois, comparer) ;
4. un coût marginal quasi nul (stack de données gratuit + LLM pour la synthèse qualitative uniquement).

C'est le positionnement naturel de ce projet : **un moteur de due diligence personnel, méthodique et auditable** — pas un n-ième chatbot crypto.

### 3.4 Outils sécurité / anti-scam (le socle du "niveau 0")

Stack gratuit de détection éprouvé : **GoPlus** et **Honeypot.is** (simulation d'achat/vente, détection honeypot), **TokenSniffer** (Ethereum), **RugCheck** (Solana), **Bubblemaps** (clusters de wallets liés), **CertiK Skynet** (score sécurité : audits, résolution des findings, risques de centralisation — admin keys, pause, mint —, distribution des holders).

Red flags contractuels canoniques : contrat non vérifié, proxy upgradeable sans timelock, fonctions cachées (mint, blacklist, setFee, pause), liquidité non lockée ou lockée < 6 mois, 1-2 wallets contrôlant une part majeure de l'offre, mécanique de vente restreinte.

### 3.5 Méthodes de valorisation reconnues

- **NVT** (Network Value / Transactions) : le "P/E des blockchains" — la valeur du réseau est-elle soutenue par l'activité réelle ?
- **MVRV** (Market Value / Realized Value) : sur/sous-évaluation vs coût de base moyen des détenteurs ;
- **Multiples de revenus** : P/F (price/fees), P/S (price/sales annualisées) — comparables intra-secteur, pertinents pour la DeFi à cash-flows ;
- **DCF adapté** : actualisation des flux (frais, staking rewards) pour les protocoles à revenus — le plus exigeant, réservé aux projets matures ;
- **Comparables** : MC et FDV vs concurrents directs du même narratif — la méthode la plus robuste pour les petites caps sans revenus ;
- **Position vs ATH / retracements Fibonacci** : héritée de Toini, utile comme repère de timing, pas comme mesure de valeur.

---

## 4. Analyse des prompts existants (héritage Toini)

### 4.1 Forces à conserver (validées par l'état de l'art)

1. **Format standardisé par section** : *résumé une ligne → analyse → score /100 → red flags*. Excellent pattern, aligné sur les meilleures pratiques de Messari.
2. **Divulgation progressive** : rapport < 3 min + proposition d'approfondissement. À garder tel quel.
3. **Métriques adaptées au narratif** (étape 4.2 de Toini) : staking pour L1, holders pour memes, volumes perp/stablecoins pour DeFi. C'est exactement la propriété n°3 du §2.4.
4. **Seuils quantitatifs concrets** : Volume/MC ≥ 10 % (idéal > 50 %), inflation annuelle ≤ 20 %, TVL/MC > 10:1 pour la DeFi, zones Fibonacci 0,618/0,786/0,886. Ces seuils sont opérationnalisables en code — un atout énorme pour le passage à l'outil.
5. **Déclencheurs positifs/négatifs** : rend la thèse falsifiable (propriété n°4).
6. **Distinction utilité réelle vs gouvernance seule** du token, incitations à l'achat vs à la détention.
7. **Pipeline en phases ordonnées** (découverte → traction sociale → filtrage → approfondissement on-chain) : structure directement transposable en pipeline logiciel.
8. **Sources nommées par étape** : CoinGecko prioritaire pour marché/ATH, DeFiLlama pour TVL, etc.

### 4.2 Limites à corriger

| Limite | Correction proposée |
|---|---|
| **Pas de pilier sécurité** (audits, admin keys, honeypot, concentration) — la dimension cybersécurité/auditabilité d'EY est absente | Ajouter un pilier Sécurité + une phase de screening éliminatoire en amont (niveau 0 de la pyramide) |
| **Moyenne pondérée pure** : un défaut fatal peut être masqué par les autres scores | Système de **pénalités de pilier + garde-fou contrat** (§5.3) |
| **Pondération uniforme 5×20 %** : "Technique" pèse autant que les fondamentaux dans une analyse... fondamentale | Pondérations différenciées + adaptées au profil (§5.1) |
| **Aucune gestion de la fraîcheur/confiance des données** : un prompt ne garantit rien sur la qualité des chiffres | Données récupérées par API, horodatées, avec niveau de confiance par section |
| **Pas de persistance ni de comparabilité** : chaque analyse est jetable | Historisation des scores et rapports (feature produit) |
| **Valorisation limitée** au Fibonacci et aux ratios TVL/MC | Intégrer multiples de revenus, comparables sectoriels, NVT/MVRV quand disponibles |
| **Pas de dimension légale/réglementaire** (pilier EY) | Au minimum : statut réglementaire notable, risque de qualification en security, exposition géographique |
| **"Moins de 3 minutes" non mesurable dans un prompt** | Contrainte de longueur programmable dans l'outil |

---

## 5. Framework méthodologique cible

Synthèse des trois sources : pyramide socratique (§2) × piliers EY (§3.2) × héritage Toini (§4).

### 5.0 Phase 0 — Screening éliminatoire (avant tout scoring)

Checklist binaire exécutée en premier ; un signal négatif pénalise le pilier concerné (et, pour un signal contrat objectif, borne le verdict à « à surveiller ») :

- [ ] Contrat vérifié sur l'explorateur de référence
- [ ] Pas de honeypot (simulation GoPlus / Honeypot.is)
- [ ] Pas de fonction de mint/blacklist/pause non gouvernée, pas de proxy upgradeable sans timelock
- [ ] Liquidité suffisante et lockée (ou token coté sur exchanges majeurs)
- [ ] Top 10 holders hors contrats/treasury < seuil (~30-40 % selon le secteur)
- [ ] Équipe identifiable OU track record vérifiable (anonymat = malus, pas veto)

### 5.1 Les six piliers et pondérations

| Pilier | Poids | Contenu | Héritage |
|---|---|---|---|
| **1. Fondamentaux** | 20 % | Problème/solution, nécessité blockchain, équipe, investisseurs, partenariats, exécution roadmap, runway/trésorerie | Toini §1 + EY réputationnel/stratégique |
| **2. Tokenomics & capture de valeur** | 25 % | Supply, inflation, unlocks, distribution, utilité, test de capture de valeur, incitations achat/détention | Toini §4.3-4.4, renforcé §2.2 |
| **3. Traction & adoption on-chain** | 20 % | TVL/MC, revenus organiques vs incentivés, holders, métriques du narratif, croissance | Toini §4.1-4.2 |
| **4. Marché & valorisation** | 15 % | Multiples de revenus (P/S) + valorisation vs comparables. Position vs ATH et Volume/MC restent **affichés** mais ne sont plus scorés (court terme/bruité, v2.0.0) | Toini §3 + méthodes §3.5 |
| **5. Social & mindshare** | 10 % | Tendances 7j/30j, qualité d'engagement (pas vanité), activité GitHub, classements sociaux | Toini §2 |
| **6. Sécurité & risques** | 10 % | Audits et résolution des findings, centralisation technique, risques légaux/réglementaires | EY technique/cyber/audit — **nouveau** |

Le poids du pilier Tokenomics passe à 25 % : c'est le pilier le plus prédictif du rendement *du token* (par opposition au succès du projet), conformément à l'insight central §2.2. Le social descend à 10 % : signal d'amplification, pas fondamental.

*Évolution possible : pondérations par profil (degen / équilibré / long terme) ou par narratif.*

### 5.2 Métriques par pilier (extrait opérationnel)

Chaque métrique = valeur actuelle + évolution 30j + benchmark sectoriel + source + horodatage.

- **Marché** (CoinGecko) : prix, MC, FDV, ratio MC/FDV, volume 24h, Volume/MC, ATH + drawdown, supply circulante/totale/max
- **DeFi** (DeFiLlama) : TVL, TVL/MC, fees 24h/30j, revenue, croissance TVL vs prix (divergence = signal d'accumulation, cf. Toini 4.1)
- **Unlocks** (DeFiLlama/Tokenomist/CryptoRank) : % circulant, prochains cliffs, inflation à 12 mois (seuil Toini ≤ 20 %), répartition équipe/VC/communauté
- **Sécurité** (GoPlus, CertiK, explorateurs) : statut audit, findings non résolus, flags contrat, concentration holders, lock liquidité
- **Social/Dev** (LunarCrush/Santiment, GitHub API) : Galaxy Score ou équivalent, croissance followers 7j/30j, commits & contributeurs 90j, sentiment
- **Valorisation** : multiples vs 2-3 comparables du même narratif, NVT/MVRV si disponibles, retracement Fibonacci depuis ATH

### 5.3 Scoring : pénalités de red flags par pilier

> **Mise à jour v2.0.0 (30/06/2026)** : les plafonds durs initiaux (red flag
> critique → 20, majeur → 55) écrasaient systématiquement les scores (un seul
> majeur collait à 55). Ils sont remplacés par des **pénalités imputées au pilier
> d'origine** du red flag — un défaut n'est plus masqué par la moyenne (il abaisse
> directement son pilier), sans pour autant « tomber d'office » à un palier.

```
score_pilier = moyenne pondérée des composants
             − pénalité des red flags du pilier
               (critical −40, major −14, minor −3 ; cumul en √n ; plancher 0)
score_global = Σ (score_pilier × poids)            — aucun plafond ni plancher
PUIS, seule exception de type « plafond » :
  - red flag CRITICAL « contrat » objectif (honeypot, contrat non vérifié,
    taxe extrême — HIDDEN_MINT exclu : faux positif fréquent sur tokens
    bridgés/NTT) → score plafonné à 69 : verdict « à surveiller » au minimum,
    jamais « à privilégier ».
  - données critiques manquantes → niveau de confiance dégradé, jamais compensé
```

Verdict final inchangé (Toini) : **À privilégier (≥ 70) / À surveiller (40-69) / À éviter (< 40)** — bornes à calibrer.

### 5.4 Taxonomie des red flags (3 niveaux)

- **Critiques (forte pénalité de pilier + garde-fou contrat)** : honeypot, contrat non vérifié, mint/blacklist caché, taxe extrême, wash trading manifeste. Les trois signaux « contrat » objectifs (honeypot, non vérifié, taxe extrême) bornent en plus le verdict à « à surveiller ».
- **Majeurs (pénalité de pilier modérée)** : cliff d'unlock massif < 90j, top 10 holders > 40 %, inflation > 20 %/an, équipe anonyme sans track record, revenus 100 % incentivés, retards roadmap répétés, exposition réglementaire aiguë
- **Mineurs (faible pénalité)** : engagement social en déclin, GitHub peu actif, prix très loin sous l'ATH, dépendance à un seul exchange/market maker

### 5.5 Format du livrable (conservé de Toini, enrichi)

1. **Executive Summary** (≤ 200 mots) : description 2 lignes, tableau des 6 scores, verdict, 3 forces / 3 faiblesses, catalyseur clé
2. **Sections détaillées** au format standardisé : *résumé 1 ligne → analyse → score justifié → red flags*
3. **Benchmark concurrentiel** (tableau comparables)
4. **Thèse falsifiable** : 4-5 déclencheurs positifs, 4-5 négatifs, horizon, multiple potentiel, risque
5. **Annexe données** : toutes les métriques brutes, sources et horodatages (auditabilité)
6. **Niveau de confiance** par section + liste des données manquantes

---

## 6. Sources de données et APIs

Stack recommandé par couche, du gratuit vers le payant :

| Couche | Source primaire | Accès | Fallback |
|---|---|---|---|
| Marché (prix, MC, FDV, ATH, volume) | **CoinGecko API** | Gratuit 50 req/min, MCP officiel sans clé | CoinMarketCap |
| DeFi (TVL, fees, revenue, stablecoins) | **DeFiLlama API** | Gratuit, sans auth, MCP officiel | Token Terminal (payant) |
| Unlocks / vesting | **DeFiLlama** (section unlocks) | Gratuit | Tokenomist, CryptoRank |
| Sécurité contrat | **GoPlus API** + Honeypot.is | Gratuit | CertiK Skynet, TokenSniffer, RugCheck (Solana) |
| Dev activity | **GitHub API** | Gratuit | Santiment dev metrics |
| Social / sentiment | **LunarCrush API** | Payant (clé simple) | Santiment (GraphQL, freemium), scraping X limité |
| On-chain custom | **Dune API** | Freemium | Requêtes RPC directes |
| Contexte qualitatif (équipe, roadmap, news) | Recherche web LLM + docs projet | — | Messari (freemium) |

Points d'attention : la couche sociale est le maillon le plus cher et le moins critique (10 % du score) — elle peut être dégradée gracieusement en MVP. L'écosystème **MCP** (CoinGecko et DeFiLlama officiels, agrégateurs comme Hive SDK avec 376+ tools) rend l'option "agent LLM outillé" très accessible.

---

## 7. Implications pour l'implémentation

### 7.1 Principes de conception (dérivés directement du §2)

1. **Les chiffres ne passent jamais par le LLM** : toute métrique est récupérée par API et calculée de façon déterministe. Le LLM ne fait que la synthèse qualitative (équipe, narratif, interprétation) et la rédaction — avec citations.
2. **Méthodologie versionnée** : la grille de scoring (piliers, poids, seuils, pénalités, garde-fous) est de la *configuration*, pas du code en dur — auditable, modifiable, historisée. Un rapport référence la version de méthodologie utilisée.
3. **Tout est horodaté et sourcé** : un rapport est un snapshot reproductible.
4. **Dégradation gracieuse** : source indisponible → section marquée "données manquantes" avec impact sur le niveau de confiance, jamais d'invention.
5. **Adaptation au narratif** : le profil de métriques (DeFi / L1 / meme / DePIN / RWA / IA) est sélectionné en début d'analyse et conditionne les métriques du pilier 3.

### 7.2 Options d'architecture

| Option | Description | Verdict |
|---|---|---|
| A. Agent LLM + MCP | Claude + MCP CoinGecko/DeFiLlama, le LLM orchestre tout | Rapide à prototyper, mais chiffres traversant le LLM = risque d'erreur, faible reproductibilité |
| B. Pipeline classique | Fetchers API → calculs → templates de rapport, sans LLM | Chiffres parfaits, mais perd la synthèse qualitative qui fait la valeur du rapport |
| **C. Hybride (recommandé)** | **Couche données déterministe** (fetch, calculs, scoring, red flags) **+ couche LLM** pour les sections qualitatives et la rédaction finale, contrainte par les données injectées | Le meilleur des deux : zéro hallucination sur les nombres, qualité rédactionnelle, reproductibilité |

### 7.3 Périmètre MVP suggéré

1. **Entrée** : un identifiant de token (id CoinGecko)
2. **Pipeline** : screening Phase 0 → fetch marché + DeFi + unlocks + sécurité + GitHub → calcul des métriques et scores piliers 1-4 et 6 → recherche web LLM pour le qualitatif (équipe, roadmap, news, comparables) → rédaction du rapport
3. **Sortie** : rapport Markdown complet (format §5.5) + JSON des données brutes
4. **Hors MVP** : pilier social payant (LunarCrush), watchlist, re-analyse périodique, UI — d'abord un moteur en CLI qui produit d'excellents rapports

---

## 8. Risques et limites

- **Fraîcheur ≠ vérité** : même les APIs ont des données erronées (supplies mal déclarées, TVL double-comptée). Croiser CoinGecko/DeFiLlama quand c'est possible et signaler les divergences.
- **Métriques manipulables** : volume (wash trading), TVL (incentives mercenaires), followers (bots). Le framework croise les signaux mais ne peut pas tout détecter — l'honnêteté sur les limites fait partie du rapport.
- **Couverture inégale** : les petites caps (la cible la plus intéressante du filtre Toini 10-100 M$) sont précisément celles où les données sont les plus pauvres. Le niveau de confiance par section gère cela.
- **Coûts** : le stack MVP est quasi gratuit ; les coûts arrivent avec le social (LunarCrush) et le scaling (rate limits CoinGecko). À surveiller, pas bloquant.
- **Réglementaire / responsabilité** : l'outil produit de la recherche, pas du conseil en investissement. Disclaimer systématique dans les rapports.
- **Le LLM reste un risque résiduel** sur les sections qualitatives (équipe, news) : exiger des citations et limiter ses degrés de liberté.

---

## 9. Questions ouvertes avant implémentation

1. **Usage** : outil personnel CLI, ou ambition d'app web (voire multi-utilisateurs) à terme ? → détermine le niveau d'ingénierie initial
2. **Stack technique** : préférence de langage ? (Python est naturel pour ce type de pipeline data + LLM ; TypeScript viable aussi)
3. **Le pilier "Marché & valorisation"** doit-il garder une composante de timing technique (Fibonacci, structures) ou se limiter à la valorisation relative ? (Héritage Toini vs pureté fondamentale)
4. **Budget données** : OK pour ~0 € en MVP (sans social payant), ou budget mensuel envisagé dès le départ ?
5. **Découverte vs analyse** : le MVP analyse un token donné. La phase "screening de candidats" de Toini (filtres MC, momentum, mindshare pour *trouver* des tokens) est-elle une feature cible ?
6. **Pondérations** : valider les poids proposés (§5.1) et les seuils de veto (§5.3), ou les calibrer ensemble sur 2-3 tokens tests ?

---

## 10. Sources

### Frameworks de due diligence
- [EY — Token due diligence: a structured approach to digital asset risk](https://www.ey.com/en_us/insights/financial-services/token-due-diligence-a-structured-approach-to-digital-asset-risk) ([PDF](https://www.ey.com/content/dam/ey-unified-site/ey-com/en-us/insights/financial-services/documents/ey-token-due-diligence-a-structured-approach-to-evaluate-digital-asset-risk.pdf))
- [CFA Institute — Valuation of Cryptoassets: A Guide for Investment Professionals](https://rpc.cfainstitute.org/sites/default/files/-/media/documents/article/industry-research/valuation-of--cryptoassets.pdf)
- [CoinDesk — Crypto due diligence has changed (2026)](https://www.coindesk.com/coindesk-indices/2026/06/03/crypto-for-advisors-the-crypto-due-diligence-questions-you-forgot-to-ask)
- [VaasBlock — Crypto Due Diligence in 2026](https://www.vaasblock.com/news/dyor-2026/)
- [Bitget Academy — Cryptocurrency Investment Guide 2026](https://www.bitget.com/academy/12560603880382)
- [FinanceFeeds — Fundamental Crypto Analysis](https://financefeeds.com/fundamental-crypto-analysis/)

### Tokenomics
- [Tokenomics.com — Tokenomics Audit: The Complete Guide](https://tokenomics.com/articles/tokenomics-audit)
- [CaptainAltcoin — Tokenomics Explained](https://captainaltcoin.com/tokenomics-explained-how-to-evaluate-any-crypto-project/)
- [Fidelity Digital Assets — From Supply to Incentives](https://www.fidelitydigitalassets.com/research-and-insights/supply-incentives-turning-tokenomics-strategy)
- [Nansen — What Is Tokenomics Analysis?](https://nansen.ai/post/what-is-tokenomics-analysis-guide-to-crypto-valuation)
- [Bitdeer — Tokenomics Evaluation: Inflation, Vesting, Long-Term Value](https://www.bitdeer.com/learn/tokenomics-evaluation-inflation-vesting-and-long-term-value)

### Valorisation
- [Amberdata — Digital Asset Valuation Models](https://blog.amberdata.io/digital-asset-valuation-models-a-framework-for-traditional-portfolio-managers)
- [Sygnum — Exploring valuation techniques for cryptocurrencies](https://www.sygnum.com/research/crypto-primers/beyond-surface-level-analysis-exploring-valuation-techniques-for-cryptocurrencies/)
- [Tradecraft Capital — Crypto Fundamental Analysis: 9 Metrics & Ratios](https://www.tradecraft.capital/crypto-fundamental-analysis%E2%80%8A-%E2%80%8A9-metrics-indicators-ratios-part-ii/)

### Plateformes et outils
- [Coin Bureau — Best Crypto Analysis Tools in 2026](https://coinbureau.com/review/crypto-research-tools)
- [Fensory — Messari Alternatives 2026](https://fensory.com/insights/compare/messari-alternatives)
- [Nansen — Top Crypto Analytics Platforms Used by VCs](https://www.nansen.ai/post/top-crypto-analytics-platforms-used-by-vcs-for-strategic-insights-due-diligence)
- [CoinGecko — Best Cryptocurrency APIs of 2026](https://www.coingecko.com/learn/best-cryptocurrency-apis)
- [RFP.wiki — DefiLlama vs CoinGecko (2026)](https://www.rfp.wiki/crypto/digital-assets-nfts/crypto-data-analytics-market-risk/defillama/coingecko)
- [Medium — Top 5 Cryptocurrency Data APIs Comparison](https://medium.com/coinmonks/top-5-cryptocurrency-data-apis-comprehensive-comparison-2025-626450b7ff7b)
- [Tokenomist (ex-TokenUnlocks)](https://tokenomist.ai/) · [CryptoRank Token Unlocks](https://cryptorank.io/token-unlock)
- [LunarCrush API](https://lunarcrush.com/products/lunarcrush-api/) · [Santiment API](https://api.santiment.net/)
- [Token Terminal](https://tokenterminal.com/)

### Sécurité / anti-scam
- [CertiK — Skynet Score Methodology](https://skynet.certik.com/skynet-score-methodology)
- [DEXTools — How to Spot a Rug Pull 2026: 12-Point Checklist](https://www.dextools.io/tutorials/how-to-spot-a-rug-pull-2026-checklist)
- [Phemex — How to Spot a Crypto Rug Pull: 5 Red Flags](https://phemex.com/academy/how-to-spot-crypto-rug-pull-red-flags)
- [Arkham — On-Chain Analysis Guide (2026)](https://info.arkm.com/research/on-chain-analysis-guide)

### Concurrence IA & écosystème MCP
- [BeInCrypto — Top Crypto AI Agents in 2026](https://beincrypto.com/top-picks/top-crypto-ai-agents/)
- [KuCoin — AI Agents vs LLMs in Crypto Analysis (2026)](https://www.kucoin.com/blog/ai-agents-vs-llms-crypto-analysis-market-2026)
- [Messari](https://messari.io/) · [ChainGPT](https://www.chaingpt.org/)
- [CoinGecko MCP Server](https://docs.coingecko.com/docs/mcp-server) · [DeFiLlama MCP](https://defillama.com/mcp)
- [Hive SDK — 376+ crypto tools pour agents IA](https://github.com/hive-intel/hive-sdk)

### Héritage interne
- `resources/PerplexityBackup_analysecrypto.txt` — méthodologie Toini complète (4 phases, seuils, outils)
- `resources/PerplexityBackup_fonda.md` — version optimisée (structure de rapport, scoring 5×20 %)
