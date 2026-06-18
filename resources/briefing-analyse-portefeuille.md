---
type: briefing
titre: "Briefing — Analyseur de portefeuille crypto (diagnostic snapshot)"
usage: "Brief de cadrage à transmettre à l'agent qui implémente l'analyseur de portefeuille dans l'app externe"
source: "Synthèse de la KB academie-wiki (MOC portfolio.md + money-management.md + notes atomiques)"
created: 2026-06-18
---

# Briefing — Analyseur de portefeuille crypto

> **Pour qui** : l'agent qui implémente l'analyseur dans l'app externe.
> **Quoi** : entrée = liste de cryptos + pondérations (poids dans le portefeuille). Sortie = un diagnostic « ce qui va / ce qui ne va pas ».
> **Esprit** : on diagnostique une **photo** du portefeuille. Pas un conseil d'achat/vente personnalisé. Voix Toini : décisif, on écarte le bruit, on **dit ce qui ne va pas**, vouvoiement.

---

## 0. Cadrage critique — à lire avant de coder

### 0.1 L'entrée ne contient (a priori) que la **poche crypto**

« Liste des cryptos + pondérations » = la **sleeve crypto uniquement**. Conséquence directe : tout un pan de la doctrine KB **ne peut pas être évalué** sans données supplémentaires.

- ❌ « crypto < 10 % du patrimoine » → exige le patrimoine total.
- ❌ « garder ~20 % de cash » / « 50 % cash en début de bull » → exige la poche cash.
- ❌ « vraie diversification = plusieurs classes d'actifs » → exige actions/obligations/or/immo.

➡️ **Question ouverte à trancher avec Antoine** (ne pas la deviner) :
> *L'entrée porte-t-elle uniquement les pondérations intra-crypto, ou inclut-elle aussi cash + patrimoine global ?*

Tant que ce n'est pas tranché, l'implémenteur doit traiter ces règles comme **conditionnelles** (« si l'input fournit X, alors… ») et **ne pas les plier de force** sur des poids qui somment à 100 % intra-crypto. Une pondération crypto qui fait 100 % du *portefeuille crypto* n'est PAS un portefeuille « 100 % exposé sans cash ».

### 0.2 Trois tiers de critères selon ce qui est **calculable**

L'erreur à éviter : lister des critères que l'analyseur ne peut pas calculer avec ce qu'il a en entrée. Tout est rangé ci-dessous en 3 tiers :

| Tier | Données nécessaires | Rôle |
|---|---|---|
| **A** | tickers + poids (+ lookup bon marché : market cap, catégorie, narratif) | **Colonne vertébrale** de l'analyseur. Structure & pondérations. |
| **B** | + historique de prix par token | Métriques de risque quantitatives. Faisable si l'app tire les prix. |
| **C** | + TA/on-chain live **et** prix d'entrée de l'utilisateur | Couche « recommandations » (arbitrage, rebalancement, sortie). Largement **hors périmètre d'un snapshot**. |

**Diagnostic ≠ recommandations.** La demande (« ce qui va / ce qui ne va pas ») = diagnostic du Tier A (+ B). Le Tier C est une couche optionnelle, à étiqueter comme telle, qui ne doit **pas** noyer le cœur.

---

## 1. TIER A — Le cœur de l'analyseur (tickers + poids + lookup)

C'est ici que se joue 80 % de la valeur. Tous les seuils ci-dessous sont des **heuristiques Toini** (fourchettes, pas des lois) — à présenter comme tel dans la sortie.

### 1.1 Nombre de lignes

- **Idéal : 10–15 lignes.** Permet un suivi qualitatif réel (comprendre chaque projet, appliquer une discipline).
- **Plafond : 20–30 lignes.** Au-delà, le portefeuille **se comporte mécaniquement comme un indice** : autant prendre un ETF/indice crypto que gérer 50 lignes à la main.
- **> 50 lignes** : la surdiversification **ne surperforme pas** le marché (démontré statistiquement) et devient ingérable (alertes simultanées, suivi dégradé).
- Diagnostic type : `< 8` = possible sous-diversification / concentration à challenger ; `10–20` = sain ; `20–30` = limite haute ; `> 30` = drapeau « surdiversification ».

### 1.2 Taille minimale par ligne (micro-lignes = bruit)

- **Aucune ligne ne devrait être < 1 %.** Une ligne à 0,1 % doit faire **x100** pour peser sur la perf globale → coût de suivi > contribution.
- **Plancher opérationnel absolu : 0,5 %.** En dessous = bruit pur.
- **Cible de signification : 3–5 % par position** pour que chaque mouvement compte.
- Diagnostic type : compter les lignes < 1 % et < 0,5 %, les nommer, suggérer de les couper ou consolider.

### 1.3 Plafond par ligne (concentration)

- **Plafond générique prudent : 3 % par crypto** (version stricte, contrôle de volatilité). Plafond large toléré : **≤ 5 %**.
- **Modulé par capitalisation** : microcaps (hors top 200) **≤ 1 %** ; top 100 jusqu'à **3 %**. Une microcap **ne doit jamais peser autant qu'une large cap**.
- **Tokens d'exchange** (BNB, CRO, BGB…) : **≤ 3–5 %**, jamais 15–20 % (risque idiosyncratique : hack, réglementaire, désaffection). Le cashback ne justifie pas la surexposition.
- ⚠️ Nuance : ces plafonds = **exposition initiale**. Un dépassement dû à une **hausse** (ex. une ligne passée de 3 % à 10 %) n'est pas une erreur de construction mais un **signal de rééquilibrage** (Tier C). Si l'app ne connaît pas l'historique, le signaler comme « à vérifier : surpondération subie vs choisie ».
- BTC/ETH (blue chips) : le plafond « anti-concentration » des altcoins **ne s'y applique pas de la même façon** — une part élevée de BTC/ETH est un facteur de **résilience**, pas un défaut (voir 1.6).

### 1.4 Pondération asymétrique (pas d'équipartition)

- **Ne jamais équipondérer** aveuglément. Les convictions fortes (fondamentaux + price action solides) reçoivent **plus de 50 %** de l'allocation ; les paris fragiles, une part réduite.
- Exemple de cibles d'exposition **par tranche de cap** : ~20 % top 100, ~50 % top 200, ~30 % small caps (illustratif, pas dogme).
- Drapeau : un portefeuille parfaitement équiréparti sur 30 lignes hétérogènes = signal de manque de conviction / surdiversification.

### 1.5 Diversification par **narratif** (≠ multiplier les lignes)

- Architecture saine : **3–4 narratifs** (ex. L1, L2, DeFi, IA, RWA, DePIN), chacun avec un **leader établi + un challenger + (optionnel) une pépite** à faible poids.
- Variante : **4–6 narratifs**, max **4–5 tokens** par narratif.
- **Aucun narratif > 50 %** du portefeuille (surexposition sectorielle : si le narratif se démode, tout le portefeuille trinque).
- Second axe utile : équilibrer **cryptos « rescapées » d'un cycle** (résilience, first mover) vs **cryptos du cycle actuel** (potentiel + risque).
- Diagnostic Tier A : regrouper les tokens par narratif, calculer le poids par narratif, flaguer toute concentration > 50 % et tout narratif unique.

### 1.6 Catégories d'actifs & socle de qualité

- **5 catégories** aux risques/horizons radicalement différents : (1) **Bitcoin** (réserve de valeur), (2) **Ethereum** (infra smart contracts), (3) **stablecoins** (USDT/USDC/DAI), (4) **altcoins** (SOL, ADA, XRP…), (5) **memecoins** (DOGE, SHIB — valeur purement communautaire/spéculative).
- **Socle prudent = BTC, ETH (et SOL)** : face à l'impossibilité de prédire les survivants parmi 10 000+ tokens, un portefeuille sans aucun blue chip est plus fragile. Présence/absence d'un cœur établi = critère de diagnostic.
- **% memecoins / micro-caps spéculatives** : à mesurer et flaguer s'il est élevé (= profil très agressif, à assumer explicitement).
- **% stablecoins** : c'est la « poche sèche » intra-crypto (réactivité) — voir Tier conditionnel cash en 0.1.

### 1.7 Récap des seuils Tier A (table de référence implémenteur)

| Dimension | Vert (sain) | Orange (à surveiller) | Rouge (drapeau) |
|---|---|---|---|
| Nb de lignes | 10–20 | 8–10 ou 20–30 | < 8 ou > 30 |
| Poids min/ligne | ≥ 3 % | 1–3 % | < 1 % (et surtout < 0,5 %) |
| Poids max/ligne (alt) | ≤ 3 % | 3–5 % | > 5 % (hors blue chip) |
| Token d'exchange | ≤ 3 % | 3–5 % | > 5 % |
| Microcap (hors top 200) | ≤ 1 % | 1–2 % | > 2 % |
| Poids d'un narratif | ≤ 30 % | 30–50 % | > 50 % |
| Nb de narratifs | 3–6 | 2 | 1 |
| Socle BTC/ETH(/SOL) | présent | faible | absent |

> Ces chiffres sont des **repères pédagogiques Toini**, à formuler comme des fourchettes argumentées, pas comme un barème rigide.

---

## 2. TIER B — Métriques de risque (si l'app tire l'historique de prix)

À activer seulement si l'app récupère des prix historiques. Toutes citées telles quelles dans la KB (issues de TradingView Portfolio) :

- **Bêta** : sensibilité au marché de référence. Un portefeuille crypto a structurellement **β > 1**. Utile surtout pour un portefeuille mixte (actions/ETF/crypto).
- **Sharpe ratio** : (rendement annualisé − taux sans risque) / volatilité totale. **Mécaniquement faible en crypto** (vol élevée) — ne pas conclure « mauvaise stratégie », juste « risque élevé par unité de rendement ». Taux sans risque paramétrable (défaut 2 %).
- **Sortino ratio** : variante du Sharpe ne pénalisant **que la volatilité baissière**. Plus pertinent en crypto (les hausses violentes ne sont pas un « risque »). Distingue les portefeuilles qui « bougent dans le bon sens » de ceux qui subissent des drawdowns.
- **Performance relative vs Total Market** (depuis le dernier bottom) : filtre rapide. Un token qui sous-performe nettement le Total Market en phase haussière = candidat prioritaire à l'arbitrage ; un token qui a cassé son bottom de référence pendant que le marché montait = liste rouge.
- **Calibrage du risque attendu** : sur le top 10 crypto, la **perte nominale moyenne historique est ~−75 %** avant rebond. À utiliser pour contextualiser la volatilité attendue du portefeuille (« préparez-vous à voir −75 %, c'est structurel »).

---

## 3. TIER C — Couche recommandations (optionnelle, hors snapshot)

Nécessite TA/on-chain **live** + les **prix d'entrée** de l'utilisateur. À n'inclure que si l'app a ces données, et à **étiqueter clairement** comme « pistes d'action », distinct du diagnostic.

- **Grille de scoring à 5 critères** par position : (1) perf 2e jambe haussière vs marché, (2) maintien des « lots de cycle » (plus-bas structurels), (3) OBV croissant/décroissant, (4) inversion de théorie de Dow validée ou non, (5) métriques on-chain selon le narratif (TVL, TVL vs market cap, tokenomics). Chaque critère : OK / moyen / non-OK.
- **Classification 4 couleurs** : 🟢 Vert (solide, conserver/renforcer) · 🟠 Orange (mitigé, sécuriser) · 🔴 Rouge (plusieurs mauvaises cases, arbitrer) · ⚫ Noir (baissier structurel, sortir). Cadre = pré-décider pour éviter l'émotion.
- **Rebalancement tous les 2–3 mois** : question-clé par ligne → « est-ce que je rachèterais cette ligne, à ce poids, aujourd'hui ? ».
- **Scénario pessimiste** : valoriser le portefeuille si chaque token n'atteint que son **premier arrêt Fibonacci (0.382)** (≈ x3–x4, pas x10). Si ça suffit aux objectifs → plan robuste.
- **Tri assisté par IA** : regrouper par narratif, soumettre chaque groupe avec critères explicites (institutionnalisation, utilité du token, tokenomics, on-chain) ; l'IA accélère le tri mais **sous-pondère les small caps à fort potentiel** — garder un garde-fou humain.

---

## 4. Format de sortie recommandé

Réutiliser le **format maison** déjà éprouvé dans `analyse-fondamentale-crypto-system-prompt.md` (sibling : analyse *par token*). Transposé au portefeuille :

- **Verdict + score EN PREMIER** (ex. `ÉQUILIBRÉ ✅ / À CORRIGER 🟡 / RISQUÉ ❌` + score /100). Le lecteur connaît la conclusion en 10 s.
- **🚩 Red flags remontés en haut**, jamais enterrés en conclusion.
- **✅ Points forts** (3–5 puces).
- Puis une **section par dimension** (nb de lignes, pondérations, narratifs, catégories/socle, [métriques de risque]), chacune avec un **verdict 1 ligne + un red flag explicite ou « RAS »**. Cette discipline du red-flag-à-chaque-section évite les angles morts.
- **📌 Ce qu'il reste à vérifier** : données non disponibles dans l'input (patrimoine global, cash, prix d'entrée) + 1–2 questions à creuser.
- Lisible en **< 5 min**, ~1 page écran. Phrases courtes, zéro remplissage.
- **Pas de conseil financier personnalisé** : on fournit une analyse, la décision revient au lecteur (rappel sobre en fin).

Score : prévoir un barème explicite (ex. structure/nb de lignes 30 · pondérations & concentration 30 · diversification narratifs 20 · socle & catégories 20 ; ajuster avec Antoine).

---

## 5. Voix & non-négociables

- **Vouvoiement** partout.
- **Décisif** : un verdict tranché vaut mieux qu'un « ça dépend ». On **dit ce qui ne va pas**, on refuse la hype.
- **Plusieurs red flags qui s'accumulent** sur plusieurs dimensions = signal d'évitement fort, même si chacun semble mineur isolément.
- **Honnêteté sur les données** : tout chiffre vivant (market cap, catégorie, narratif) doit venir d'un lookup, jamais de la mémoire du modèle ; dater/sourcer ; assumer un trou (« non vérifiable ») plutôt que combler avec un souvenir périmé.
- **Adapter au profil** (idéalement) : la KB définit le profil investisseur sur **5 axes** (compétence AT/AF, temps dispo, profil de risque, horizon, objectifs concrets en € pas en multiples). Si l'app peut capter ne serait-ce que profil de risque + horizon, le diagnostic devrait s'y calibrer (un portefeuille « agressif assumé » n'est pas jugé comme un « prudent »).

---

## 6. Pièges spécifiques pour l'implémenteur

1. **Ne pas coder en dur les règles Tier B/C comme si l'input les portait.** Vérifier la disponibilité de la donnée avant d'activer un critère.
2. **Ne pas confondre « 100 % du portefeuille crypto » avec « 100 % exposé sans cash »** (cf. 0.1).
3. **Surpondération subie vs choisie** : sans prix d'entrée, une ligne à 12 % peut être une conviction OU une position qui a monté → signaler l'ambiguïté, ne pas trancher.
4. **Blue chips ≠ altcoins** pour les plafonds de concentration : une grosse part BTC/ETH est un **plus**.
5. **Fourchettes, pas lois** : présenter les seuils comme des repères argumentés (sinon l'outil paraît dogmatique et faux sur les cas limites).
6. **Diagnostic d'abord, reco ensuite** : ne pas noyer « ce qui va / ne va pas » sous des conseils d'arbitrage.

---

## 7. Sources KB (pour creuser)

MOC : `30-topics/portfolio.md` (332 notes), `30-topics/money-management.md` (265 notes).

Notes atomiques clés :
- Structure/nb lignes : `portefeuille-max-20-30-lignes-performance`, `surdiversification-ne-surperforme-pas`, `lignes-sous-1pct-portefeuille-bruit-pas-performance`, `reduction-portefeuille-20-cryptos-ponderation-asymetrique`
- Pondération/concentration : `ponderation-max-par-crypto-volatilite-portefeuille`, `allocation-max-par-actif-jamais-depasser`, `ponderation-par-capitalisation-risque-portefeuille`, `surponderation-single-token-exchange-risque-concentration`, `surexposition-narratif-unique-risque-concentration`
- Diversification/narratifs/catégories : `construction-portefeuille-narratifs-leader-challenger-pepite`, `categories-cryptos-btc-eth-stablecoins-altcoins-memecoins`, `concentration-btc-eth-sol-projets-etablis-strategie-prudente`, `diversification-classes-actifs-pas-seulement-secteurs`
- Patrimoine/cash (conditionnel) : `crypto-moins-10pct-patrimoine-global-controle`, `crypto-15pct-patrimoine-tremplin-pas-allocation-permanente`, `portefeuille-trois-poches-indices-picking-cash`, `exposition-100pct-sans-cash-supprime-capacite-reagir`, `allocation-court-terme-5-10-pourcent`, `portefeuille-quatre-saisons-dalio-resilience-crises`, `allocation-actifs-cycles-macro-dalio-quatre-phases`
- Métriques risque (Tier B) : `beta-portefeuille-sensibilite-marche-reference`, `sharpe-ratio-rendement-volatilite-portefeuille`, `sortino-ratio-volatilite-baisse-uniquement`, `performance-relative-total-market-filtre-portefeuille`, `perte-75pct-nominale-moyenne-top10-crypto`
- Scoring/reco (Tier C) : `grille-scoring-cinq-criteres-arbitrage-portefeuille`, `classification-quatre-couleurs-arbitrage-portefeuille`, `tableau-scoring-vert-orange-rouge-arbitrage-portefeuille`, `rebalancement-portefeuille-tous-deux-trois-mois`, `scenario-pessimiste-premiers-arrets-plan-b`, `ia-analyse-fondamentale-par-narratif-tri-portefeuille`
- Cadre/voix : `profil-investisseur-cinq-axes-definition`, `red-flags-explicites-chaque-section-analyse-crypto`
- Format de sortie de référence : `60-outputs/prompts-llm/analyse-fondamentale-crypto-system-prompt.md`
