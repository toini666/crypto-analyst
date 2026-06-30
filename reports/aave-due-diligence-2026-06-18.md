# Aave (AAVE) — Analyse de due diligence

> Générée le 2026-06-18 · Méthodologie v2.0.0 · Confiance des données : **élevée** · Id CoinGecko : `aave`

## Executive Summary

**Aave** — Aave est le premier protocole mondial de prêt décentralisé ($12.67B de TVL, soit les fonds déposés), qui permet d'emprunter et de prêter 20+ cryptoactifs sur 14+ blockchains, sans intermédiaire. Il étend son écosystème avec GHO (son stablecoin maison, un jeton indexé sur le dollar), Umbrella (un dispositif de sécurité), Horizon (le crédit pour institutions, adossé à des actifs réels tokenisés — RWA) et Aave V4 (sa nouvelle architecture « Hub-and-Spoke », déployée sur Ethereum en 2026).

*Narratif : DeFi*

### Verdict : ✅ À privilégier — Score global : **72/100**

> ⚠️ **Red flags** : −2 pts imputés aux piliers concernés (score avant red flags : 74/100).

| Pilier | Poids | Score | Red flags | Couverture données |
|---|---|---|---|---|
| **Fondamentaux** | 20 % | 71/100 | −5 pts | 100 % |
| **Tokenomics & capture de valeur** | 25 % | 84/100 | — | 100 % |
| **Traction & adoption on-chain** | 20 % | 74/100 | — | 100 % |
| **Marché & valorisation** | 15 % | 69/100 | — | 100 % |
| **Social & mindshare** | 10 % | 43/100 | — | 100 % |
| **Sécurité & risques** | 10 % | 69/100 | −14 pts | 100 % |

**Forces principales :**
- Position dominante et défensive : ~65% du marché du prêt en DeFi, $12.67B de TVL sur 14+ blockchains, avec un effet de réseau sur la liquidité difficile à reproduire à court terme
- Économie du jeton radicalement améliorée : un rachat actif (« buyback ») de $50M/an depuis avril 2025, plus 100% des revenus produits reversés à la DAO (voté en avril 2026), créent pour AAVE un mécanisme de capture de valeur inédit
- Sécurité et conformité de premier plan : un programme d'audit de la V4 à $1.5M sur 345 jours sans faille critique, l'enquête de la SEC (gendarme boursier américain) close (déc. 2025) et un enregistrement auprès de la FCA (régulateur britannique, mai 2026) — un positionnement institutionnel crédible

**Faiblesses principales :**
- Tension structurelle entre Aave Labs et la DAO : la crise de gouvernance (déc. 2025 – avr. 2026) et le départ de l'ACI (Aave Chan Initiative) révèlent des frictions de décision qui peuvent ralentir l'adaptation face à des concurrents plus agiles comme Morpho
- Faiblesse dans la gestion du risque sur les garanties (« collatéral ») de tiers : le piratage de KelpDAO (avr. 2026, $124-230M de créances irrécouvrables — « bad debt ») met au jour un risque de paramétrage structurel sur les actifs inter-chaînes, pas encore totalement réglé par le nouveau cadre en préparation
- Récit peu porteur en 2026 : le prêt en DeFi n'attire plus l'attention spéculative (l'IA, les RWA et les L2 dominent), ce qui plafonne la revalorisation du jeton malgré des fondamentaux solides et une amélioration de l'économie du jeton pas encore prise en compte par le marché

**Thèse d'investissement** : Aave est la valeur sûre (« blue-chip ») du prêt en finance décentralisée (lending DeFi), avec une position dominante et défensive (~65% de part du TVL, soit $12.67B), une économie du jeton profondément revue en 2025-2026 (un programme de rachat — « buyback » — de $50M/an, et 100% des revenus produits reversés à la DAO, l'organisation qui gouverne le protocole) et un vrai potentiel institutionnel via Horizon et la V4. La thèse s'invalide si Morpho ou un concurrent « modulaire » capte durablement plus de 40% du TVL du lending, ou si un nouveau piratage majeur sur les actifs inter-chaînes (« cross-chain ») provoque une fuite de liquidité au-delà de 25% du TVL actuel.

## Red Flags

| Sévérité | Signal | Détail | Source |
|---|---|---|---|
| 🟧 Majeur | Piratage de KelpDAO (avr. 2026) : $124-230M de créances irrécouvrables sur Aave via une garantie de tiers non sécurisée ; faille de processus dans l'ajout (« listing ») d'actifs inter-chaînes, nouveau cadre en cours mais non finalisé | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Fermeture de l'ACI (Marc Zeller) en 2026 : perte d'un acteur clé de la gouvernance, sans remplaçant clairement identifié | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Three Arrows Capital était un investisseur de la première heure (fonds effondré en 2022, sans aucun impact opérationnel résiduel) | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Crise de gouvernance (déc. 2025 – avr. 2026) tranchée en faveur des détenteurs, mais qui a causé des frictions et le départ de l'ACI | — | Analyse qualitative (sourcée) |

## Analyse détaillée par pilier

### Fondamentaux — 71/100 *(poids 20 % · red flags −5 pts (base 76/100))*

#### Problème, solution & nécessité blockchain — 82/100

**Résumé** : Aave a réglé le problème du prêt décentralisé « non-custodial » (où l'utilisateur garde le contrôle de ses fonds), avec une profondeur de liquidité inégalée, et se diversifie vers un stablecoin maison et le crédit institutionnel adossé aux actifs réels (RWA).

Le problème traité est fondamental en finance décentralisée : accéder au crédit crypto sans intermédiaire de confiance ni vérification d'identité (KYC), en toute transparence sur la blockchain. Aave V3 y répond avec une architecture multi-chaînes couvrant 14+ réseaux, des réserves de liquidité efficaces, des taux fixés par algorithme et des modes spécifiques (eMode, Isolation). L'innovation se poursuit sur trois fronts en parallèle : GHO, le stablecoin décentralisé maison émis sur la base des dépôts Aave, qui devient le centre de gravité économique du protocole avec Umbrella ; Horizon, un marché institutionnel lancé en août 2025 qui permet aux institutions (Franklin Templeton, Circle, Ripple) d'utiliser des actifs réels tokenisés comme garantie dans un cadre conforme, avec $550M+ de dépôts nets ; et Aave V4 (déployé sur Ethereum, voté en mars 2026), dont l'architecture « Hub-and-Spoke » unifie la liquidité inter-chaînes et isole mieux les risques. Le marché visé est réel et en forte croissance : le TVL cumulé du prêt en DeFi est estimé autour de $75-80B en avril 2026. La solution technique a fait ses preuves, avec $3.3T de dépôts cumulés au fil de l'histoire.

*Sources : <https://cryptoadventure.com/aave-aave-review-2026-lending-gho-safety-and-v4-roadmap/ (2026)> · <https://blockworks.com/news/umbrella-reshapes-aave-staking (2025)> · <https://www.mexc.co/news/285712 (déc. 2025)> · <https://eco.com/support/en/articles/15253994-aave-vs-morpho-vs-spark-vs-fluid-2026-lending-protocol-comparison (2026)>*

#### Équipe, investisseurs & financement — 72/100

**Résumé** : Équipe fondatrice expérimentée autour de Stani Kulechov, financement institutionnel solide, mais une gouvernance DAO sous tension après la crise de fin 2025 et le départ de l'ACI.

Stani Kulechov, fondateur finlandais et CEO d'Aave/Avara, est une figure centrale de la DeFi depuis ETHLend (2017) ; il a été cité parmi les personnalités les plus influentes (« Most Influential ») de CoinDesk en décembre 2025. Aave Labs a levé $29.5M en deux tours : une Series A de $4.5M (ParaFi, Framework Ventures) et une Series B de $25M (Standard Crypto, Blockchain.com, Blockchain Capital). En 2026, la DAO a accordé une subvention supplémentaire de $25M à Aave Labs dans le cadre de la proposition « Aave Will Win », remplaçant progressivement le financement par des fonds de capital-risque externes par celui de la DAO. L'entreprise a réalisé trois acquisitions de talents depuis 2022 : Sonar (2022), Family (2023) et Stable Finance (octobre 2025, une fintech de San Francisco orientée épargne en stablecoin). Marc Zeller, co-fondateur de l'Aave Chan Initiative (ACI), était un moteur essentiel de la gouvernance ; l'annonce de la dissolution de l'ACI début 2026, après des frictions avec Aave Labs sur le partage des revenus, réduit la diversité des acteurs de la gouvernance. Three Arrows Capital figurait parmi les premiers investisseurs du jeton LEND, mais ce lien n'a plus aucune portée opérationnelle depuis l'effondrement du fonds en 2022.

*Sources : <https://coinmarketcap.com/academy/people/stani-kulechov (consulté juin 2026)> · <https://www.coindesk.com/tech/2025/12/19/most-influential-stani-kulechov (déc. 2025)> · <https://decrypt.co/44653/aave-raises-25-million-to-bring-defi-to-institutions (oct. 2020)> · <https://www.theblock.co/post/397138/aave-dao-approves-25-million-aave-labs-funding-grant-in-binding-aave-will-win-vote (2026)> · <https://www.blockhead.co/2025/10/24/aave-labs-acquires-stable-finance-to-expand-consumer-defi-products (oct. 2025)> · <https://www.coindesk.com/tech/2026/03/29/inside-aave-s-governance-battle-as-defi-giant-prepares-for-upgrade (mars 2026)>*

#### Exécution de la roadmap — 74/100

**Résumé** : De vraies livraisons majeures (V4 déployée, Horizon à $550M+, Umbrella en service), mais la crise de gouvernance a ralenti l'exécution, et la métrique GitHub du dépôt du jeton sous-estime l'activité réelle.

L'exécution d'Aave Labs est substantielle sur les 18 derniers mois : Horizon lancé en août 2025 avec $550M+ de dépôts institutionnels en moins de six mois ; une sécurité V4 dotée d'un programme de $1.5M couvrant 345 jours de revues cumulées auprès de ChainSecurity, Trail of Bits, Blackthorn, Certora et de 900+ chercheurs publics (Sherlock), sans vulnérabilité critique ; la V4 approuvée par un vote de gouvernance en mars 2026 puis déployée sur Ethereum ; l'acquisition de Stable Finance (octobre 2025) renforçant la stratégie mobile/grand public. Le Master Plan 2026 s'articule autour de trois piliers clairs : V4, Horizon et l'application Aave visant le million d'utilisateurs. La métrique automatique de 1 commit GitHub sur 90 jours pour le dépôt principal du jeton est un artefact de suivi (c'est un dépôt de contrat figé) : les 43 contributeurs actifs et un commit enregistré le jour même confirment une vraie activité de développement sur les dépôts du protocole. Bémol, la crise de gouvernance de décembre 2025 à avril 2026 a entraîné plusieurs mois de friction décisionnelle et ralenti certains déploiements.

*Sources : <https://www.mexc.co/en-NG/news/289644 (2026)> · <https://unchainedcrypto.com/aave-v4-clears-first-governance-vote-with-100-support-after-months-of-internal-conflict/ (mars 2026)> · <https://cointelegraph.com/news/aave-launches-v4-ethereum-after-onchain-vote-split-support (2026)> · <https://aave.com/blog/aave-v4-security-by-design (2026)> · <https://www.crowdfundinsider.com/2025/10/255006-aave-labs-announces-acquisition-of-stable-finance-to-accelerate-consumer-focused-defi-innovation (oct. 2025)> · <https://governance.aave.com/t/al-development-update-march-2026/24373 (mars 2026)>*

### Tokenomics & capture de valeur — 84/100 *(poids 25 %)*

#### Dilution (MC/FDV, offre circulante) — 95/100

**Constat (déterministe)** : MC/FDV = 0.95 (offre circulante : 95 %)

#### Utilité du token & capture de valeur — 74/100

**Résumé** : AAVE a franchi un cap décisif en 2025-2026 : rachats actifs (« buybacks »), 100% des revenus produits reversés à la DAO et un staking productif via Umbrella créent une vraie capture de valeur, au-delà de la seule gouvernance.

Au test de capture de valeur : si Aave réussit, que gagne concrètement le détenteur d'AAVE ? (1) Rachat actif (« buyback ») : la DAO rachète des AAVE sur le marché via un programme de $50M/an approuvé en août 2024 et lancé en avril 2025 — une pression acheteuse nette et structurelle. (2) Reversement des revenus : le vote « Aave Will Win » d'avril 2026 oriente 100% des revenus de tous les produits de marque Aave (application, offre institutionnelle, interfaces futures) vers la DAO, supprimant l'ancienne fuite de valeur vers Aave Labs. (3) Staking Umbrella : le système permet de mettre en jeu (« staker ») des aTokens et du stkGHO pour toucher des rendements (≈8.4% par an sur le stkGHO), en contrepartie d'une exposition au risque de couverture des déficits du protocole. (4) Anti-GHO : un jeton non transférable gagné par ceux qui stakent de l'AAVE, qui permet de rembourser des dettes GHO ou d'être converti en stkGHO éligible au programme Merit. La gouvernance reste centrale, mais n'est plus le seul mécanisme. Le risque résiduel : que les subventions de la DAO (ex. $25M à Aave Labs en 2026) diluent la valeur avant qu'elle n'atteigne les détenteurs.

*Sources : <https://www.cryptoninjas.net/news/aave-and-aavenomics-token-buybacks-safety-nets-and-revenue-redistribution/ (2024)> · <https://mint-ventures.medium.com/exploring-the-updated-aavenomics-buybacks-profit-distribution-and-safety-module-shift-bcf14abb17fa (2024)> · <https://www.coindesk.com/tech/2026/04/13/aave-passes-landmark-vote-ending-months-long-fight-over-who-controls-protocol-revenue (avr. 2026)> · <https://www.ainvest.com/news/aave-unveils-aavenomics-6m-anti-gho-rewards-1m-weekly-buyback-2504/ (2025)> · <https://coincub.com/price-prediction/aave/ (2026)>*

#### Unlocks & inflation à venir — 87/100

**Résumé** : Offre presque entièrement émise (94.87% d'un maximum plafonné — « hard cap » — à 16M de jetons), inflation résiduelle inférieure à 6%, et des rachats actifs qui rendent AAVE net-déflationnaire.

AAVE présente l'un des profils d'offre les plus favorables parmi les grands jetons DeFi. L'offre en circulation représente 94.87% du maximum, fixé à 16 millions de jetons (un plafond « hard cap » immuable), laissant environ 820 000 jetons encore à débloquer d'ici 2027 — soit moins de 5.5% de dilution résiduelle maximale, étalée progressivement sur plus de 12 mois. La distribution initiale est bien documentée : 81.25% pour la conversion LEND→AAVE et 18.75% pour la réserve de l'écosystème. Les conditions qui déclencheraient un signal d'alerte majeur selon la grille d'analyse (un déblocage brutal — « cliff » — à moins de 90 jours ET une inflation supérieure à 20%/an) ne sont pas réunies : l'inflation résiduelle est inférieure à 6%/an et aucun « cliff » massif imminent n'est repéré sur Tokenomist ou DeFiLlama. Mieux : le programme de rachat de la DAO ($50M/an) crée une pression acheteuse nette structurellement supérieure à la dilution résiduelle théorique, ce qui rend AAVE net-déflationnaire en pratique. Le ratio MC/FDV de 0.9487 confirme l'absence quasi totale de pression vendeuse liée à des déblocages privés non encore libérés.

*Sources : <https://tokenomist.ai/aave (consulté juin 2026)> · <https://defillama.com/unlocks/aave (consulté juin 2026)> · <https://aave.com/docs/ecosystem/aave (documentation officielle)> · <https://www.ainvest.com/news/aave-unveils-aavenomics-6m-anti-gho-rewards-1m-weekly-buyback-2504/ (2025)>*

### Traction & adoption on-chain — 74/100 *(poids 20 %)*

#### Ratio TVL/Market Cap — 95/100

**Constat (déterministe)** : TVL/MC = 11.31 (TVL $12670.8M)

#### Tendance TVL 30j — 45/100

**Constat (déterministe)** : TVL 30j : -8.7 %

#### Frais & revenus du protocole — 62/100

**Constat (déterministe)** : Revenus 30j : $5.28M (P/S annualisé ≈ 17)

#### Adoption (selon narratif) — 82/100

**Résumé** : Leader incontesté du prêt en DeFi avec ~65% de part de marché et $12.67B de TVL sur 14+ blockchains, mais le piratage de KelpDAO (avr. 2026) a généré $124-230M de créances irrécouvrables (« bad debt ») et révèle une faiblesse dans la gestion du risque sur les garanties de tiers.

Aave contrôle environ deux tiers du marché du prêt en DeFi en TVL selon DeFiLlama, avec $12.67B de valeur verrouillée sur 14+ blockchains. Les chiffres cumulés publiés fin 2025 font état de $3.3T de dépôts cumulés et de prêts approchant $1T depuis le lancement, ce qui confirme un usage économique réel et non spéculatif. Le protocole génère $41.2M de frais sur 30 jours (métriques déterministes). Horizon, lancé en août 2025, a attiré Circle, Ripple, Franklin Templeton et VanEck avec $550M+ de dépôts en moins de six mois — preuve d'une traction institutionnelle naissante crédible. La base de détenteurs (196 933) et une concentration modérée (top 10 = 11.8%) témoignent d'une distribution saine. En revanche, en avril 2026, le piratage de KelpDAO a généré entre $124M et $230M de créances irrécouvrables sur Aave, via un collatéral rsETH créé frauduleusement sur un pont (« bridge ») LayerZero tiers mal configuré. Cet événement a temporairement stressé le TVL (baisse de 8.67% sur 30j selon les métriques déterministes) et mis en évidence une vulnérabilité systémique dans le processus d'ajout d'actifs inter-chaînes. Un nouveau cadre de risque proposé par LlamaRisk est en cours d'adoption.

*Sources : <https://coinlaw.io/aave-statistics/ (2026)> · <https://www.mexc.co/en-NG/news/289644 (2026)> · <https://eco.com/support/en/articles/15253994-aave-vs-morpho-vs-spark-vs-fluid-2026-lending-protocol-comparison (2026)> · <https://www.coindesk.com/tech/2026/04/20/aave-could-face-up-to-usd230-million-in-losses-after-kelp-dao-bridge-exploit-triggers-defi-chaos (avr. 2026)> · <https://unchainedcrypto.com/aave-proposes-binding-new-risk-framework-following-the-292-million-kelpdao-exploit/ (2026)>*

### Marché & valorisation — 69/100 *(poids 15 %)*

#### Valorisation vs revenus (P/S) — 62/100

**Constat (déterministe)** : P/S annualisé = 17.4

#### Valorisation vs comparables — 72/100

**Résumé** : Aave se valorise à 17.4x ses revenus annualisés (« P/S »), une prime de leader justifiée, mais Morpho — qui capte $10B+ de TVL pour une valorisation supérieure — comprime la thèse de revalorisation.

Le marché du prêt en DeFi est dominé par Aave ($12.67B de TVL, métriques déterministes), suivi de Morpho ($10B+ de TVL selon des sources web de juin 2026) et de Spark/Sky. Compound a perdu l'essentiel de sa position et se valorise désormais autour de ~$175M de capitalisation pour $179M de FDV (valorisation pleinement diluée), une fraction d'Aave. Fluid/Instadapp reste de niche avec ~$102M de FDV. La valorisation d'Aave à $1.12B de capitalisation pour $12.67B de TVL donne un ratio capitalisation/TVL d'environ 0.089 — signe de maturité du protocole. Le ratio P/S de 17.4x (revenu annualisé ~$64M selon les métriques déterministes) est modéré pour un leader de catégorie, mais s'expose à une compression si la croissance du TVL ralentit. L'anomalie frappante : Morpho (~$1.25B de capitalisation / ~$1.94B de FDV) dépasse Aave en valorisation malgré un TVL inférieur d'environ 20% — un écart qui reflète la prime de croissance accordée par le marché à l'architecture modulaire de Morpho (des « vaults » sans permission, attrayants pour les intégrateurs institutionnels) et le récent risque de gouvernance d'Aave. Dans ce contexte, Aave apparaît plutôt décotée face à son principal challenger.

| Projet | Market Cap | FDV | Commentaire |
|---|---|---|---|
| Morpho (MORPHO) | ~$1.25B | ~$1.94B | Challenger en forte croissance ($10B+ de TVL), architecture modulaire qui séduit les institutionnels ; valorisé avec une prime par rapport à Aave malgré un TVL inférieur |
| Compound (COMP) | ~$175M | ~$179M | Protocole fondateur du prêt en DeFi, en déclin structurel ; il a perdu l'essentiel de ses parts de marché au profit d'Aave et de Morpho |
| Fluid/Instadapp (FLUID) | n.d. | ~$102M | Protocole innovant qui combine prêt et échange décentralisé (DEX) dans une seule position ; de niche mais en croissance, avec une faible liquidité du jeton |

*Sources : <https://www.coingecko.com/en/coins/morpho (consulté juin 2026)> · <https://www.coingecko.com/en/coins/compound (consulté juin 2026)> · <https://cryptorank.io/price/instadapp (consulté juin 2026)> · <https://eco.com/support/en/articles/15253994-aave-vs-morpho-vs-spark-vs-fluid-2026-lending-protocol-comparison (2026)> · <https://archlending.com/blog/morpho-vs-aave/ (2026)>*

### Social & mindshare — 43/100 *(poids 10 %)*

#### Activité développeurs (GitHub) — 22/100

**Constat (déterministe)** : 1 commits / 90j, 43 contributeurs

#### Mindshare & dynamique sociale — 60/100

**Résumé** : Institution reconnue de la DeFi, mais peu portée par un récit « chaud » en 2026 ; le piratage de KelpDAO et la crise de gouvernance ont temporairement dégradé le sentiment.

Aave jouit d'un statut d'institution incontournable de la DeFi : la marque est universellement reconnue, Stani Kulechov figure au classement CoinDesk « Most Influential » 2025, et le Master Plan 2026 a généré une couverture médiatique substantielle dans les grands médias crypto. Cependant, le projet ne porte pas le récit dominant de 2026 : l'IA, les RWA et certains L2 captent l'essentiel de l'attention spéculative, tandis que le prêt en DeFi, bien que fondamental, suscite peu de FOMO (la peur de rater l'occasion). La note « Medium » d'attention (« mindshare ») sur Sharpe AI reflète cette réalité. Grayscale a identifié AAVE parmi les actifs les plus sous-évalués du marché en 2026, un signal positif qui suggère que la revalorisation liée à l'amélioration de l'économie du jeton (buyback + partage des revenus) n'a pas encore été intégrée par le marché. Le piratage de KelpDAO d'avril 2026 a généré une couverture négative significative (CoinDesk, Unchained, The Defiant), fragilisant temporairement le sentiment. À l'inverse, l'enregistrement FCA (mai 2026) est un signal de maturité réglementaire positif, peu capté par le grand public mais potentiellement porteur d'adoption institutionnelle.

*Sources : <https://sharpe.ai/mindshare (consulté juin 2026)> · <https://www.coindesk.com/tech/2025/12/19/most-influential-stani-kulechov (déc. 2025)> · <https://www.ccn.com/news/crypto/grayscale-aave-uni-hype-most-undervalued-crypto-assets-2026/ (2026)> · <https://coinmarketcap.com/cmc-ai/aave/latest-updates/ (consulté juin 2026)>*

### Sécurité & risques — 69/100 *(poids 10 % · red flags −14 pts (base 83/100))*

#### Sécurité du contrat (GoPlus) — 90/100

**Constat (déterministe)** : Taxes achat/vente : 0.0 % / 0.0 %

#### Concentration des holders — 90/100

**Constat (déterministe)** : Top 10 holders (hors contrats/locked) : 11.8 %

#### Audits & risques légaux — 70/100

**Résumé** : Programme d'audit de la V4 exceptionnel ($1.5M, 345 jours, zéro vulnérabilité critique) et enquête de la SEC close en décembre 2025, mais le piratage de KelpDAO (avr. 2026) expose une lacune structurelle dans la gestion du risque sur les garanties de tiers.

Sur le plan des audits techniques, Aave V4 a bénéficié du programme de sécurité le plus rigoureux de l'histoire du protocole : $1.5M de budget, 345 jours de revue cumulée sur 12 mois (mars 2025 – février 2026), quatre cabinets majeurs (ChainSecurity, Trail of Bits, Blackthorn, et Certora pour la vérification formelle), quatre chercheurs indépendants, puis un concours public Sherlock de six semaines (900+ participants, 950+ rapports soumis) sans aucune vulnérabilité critique ou élevée identifiée. La V3 reste auditée par OpenZeppelin, ConsenSys Diligence, CertiK, MixBytes et PeckShield. Sur le plan légal, la SEC a clos en décembre 2025 son enquête de quatre ans sans aucune action, levant le principal risque réglementaire américain. Les filiales d'Aave Labs ont obtenu l'enregistrement FCA au Royaume-Uni le 29 mai 2026. Malgré ces points exceptionnels, le piratage de KelpDAO d'avril 2026 a généré $124-230M de créances irrécouvrables sur Aave : l'attaquant a exploité un pont (« bridge ») LayerZero mal configuré pour créer 116 500 rsETH non couverts ($292M), utilisés comme garantie sur Aave. La faille n'est pas dans le code d'Aave V3, mais dans le processus d'ajout et de gestion du risque de paramétrage des actifs inter-chaînes. Un nouveau cadre de risque (LlamaRisk) est proposé en réponse, mais pas encore adopté.

*Sources : <https://aave.com/blog/aave-v4-security-by-design (2026)> · <https://www.theblock.co/post/392410/aave-labs-outlines-layered-security-plan-for-v4-after-1-5-million-audit-program (2026)> · <https://en.cryptonomist.ch/2025/12/17/aave-protocol-sec-probe-ends/ (déc. 2025)> · <https://unchainedcrypto.com/sec-ends-four-year-probe-into-aave/ (déc. 2025)> · <https://www.coindesk.com/tech/2026/04/20/aave-could-face-up-to-usd230-million-in-losses-after-kelp-dao-bridge-exploit-triggers-defi-chaos (avr. 2026)> · <https://www.coindesk.com/business/2026/05/07/aave-to-overhaul-collateral-and-listing-standards-after-kelpdao-exploit (mai 2026)> · <https://cryptopotato.com/the-biggest-hack-of-2026-what-we-know-about-the-294m-kelpdao-exploit/ (avr. 2026)>*

## Déclencheurs de la thèse

**Catalyseurs positifs à surveiller :**
- [ ] Déploiement complet d'Aave V4 sur les principales blockchains (déjà en service sur Ethereum, expansion multi-chaînes au 2ᵉ semestre 2026), ouvrant l'ère de l'architecture « Hub-and-Spoke » et d'un accès unifié à la liquidité inter-chaînes
- [ ] Horizon franchissant le seuil de $1B de dépôts institutionnels grâce aux partenariats avec Franklin Templeton, Ripple et Circle, validant la stratégie RWA comme moteur de croissance structurelle
- [ ] Poursuite du programme de rachat (« buyback ») d'AAVE à $50M/an, combinée au reversement de 100% des revenus produits à la DAO, créant une pression acheteuse nette et une revalorisation (« re-rating ») de l'économie du jeton pas encore prise en compte par le marché
- [ ] Lancement de l'application mobile Aave visant le premier million d'utilisateurs grand public, appuyé par l'enregistrement FCA (mai 2026) qui ouvre le marché britannique réglementé
- [ ] Adoption du nouveau cadre de gestion du risque (LlamaRisk) après l'affaire KelpDAO, qui restaurerait la confiance des déposants institutionnels et limiterait les expositions futures aux actifs inter-chaînes de tiers

**Signaux d'invalidation :**
- [ ] Un piratage direct des smart contracts d'Aave V4 (malgré les audits) entraînant des pertes pour les utilisateurs supérieures à 5% du TVL et une fuite de liquidité durable vers les concurrents
- [ ] Morpho captant durablement plus de 40% du TVL du prêt en DeFi grâce à son architecture modulaire, comprimant les revenus d'Aave et faisant disparaître sa prime de leader
- [ ] Un décrochage de GHO par rapport au dollar (« perte de peg ») ou son insolvabilité (sous-garantie, attaque d'oracle ou perte de confiance), fragilisant toute l'architecture économique du jeton AAVE. (Un « oracle » fournit à la blockchain des prix venus de l'extérieur.)
- [ ] La réouverture d'une enquête réglementaire majeure (retour de la SEC, restriction MiCA au niveau de l'UE) ou une interdiction d'accès dans une juridiction clé, bloquant l'expansion institutionnelle via Horizon
- [ ] Une paralysie de la gouvernance après le départ de l'ACI : l'incapacité à atteindre le quorum sur des décisions critiques de gestion du risque sur les garanties, notamment pour l'ajout (« listing ») d'actifs inter-chaînes

## Annexe — Données brutes

| Métrique | Valeur | Source |
|---|---|---|
| Prix | $73.84 | CoinGecko |
| Market Cap | $1.12 Md | CoinGecko |
| FDV | $1.18 Md | CoinGecko |
| MC/FDV | 0.95 | CoinGecko |
| Rang Market Cap | 64 | CoinGecko |
| Volume 24h | $152.06 M | CoinGecko |
| Volume/MC | 13.6 % | CoinGecko |
| ATH | $661.69 (2021-05-18) | CoinGecko |
| Drawdown vs ATH | -88.8 % | CoinGecko |
| Offre circulante | 15 179 911,875 (95 % du max) | CoinGecko |
| Variation prix 30j | -16.0 % | CoinGecko |
| TVL | $12.67 Md | DeFiLlama |
| TVL/MC | 11.31 | DeFiLlama |
| Tendance TVL 30j | -8.7 % | DeFiLlama |
| Frais 30j | $41.21 M | DeFiLlama |
| Revenus 30j | $5.28 M | DeFiLlama |
| P/S annualisé | 17.4 | CoinGecko+DeFiLlama |
| Holders | 196 933 | GoPlus |
| Top 10 holders | 11.8 % | GoPlus |
| Taxes achat/vente | 0.0 % / 0.0 % | GoPlus |
| Commits GitHub 90j | 1 | GitHub |
| Contributeurs GitHub | 43 | GitHub |
| Followers Twitter/X | n/d | CoinGecko |

*Données récupérées le 30/06/2026 21:24:08 via CoinGecko API, DeFiLlama API, GoPlus Security API, GitHub API.*

## Lexique des indicateurs

*Repères pour lire les chiffres ci-dessus sans connaissance technique préalable.*

- **Market Cap** — Valorisation = prix × jetons en circulation. La taille du projet telle que le marché la valorise aujourd'hui.
- **FDV** — Fully Diluted Valuation : la valorisation que le projet aurait si TOUS les jetons prévus étaient déjà en circulation, au prix actuel.
- **MC/FDV** — Part de la valeur déjà en circulation (Market Cap ÷ FDV). Proche de 1 : presque tous les jetons sont émis. Proche de 0 : beaucoup restent à créer, donc une dilution à venir qui pèse sur le prix.
- **Volume/MC** — Volume échangé en 24 h rapporté à la valorisation. Mesure la liquidité : plus c'est élevé, plus on peut acheter ou vendre sans faire bouger le prix.
- **TVL** — Total Value Locked : montant total des fonds déposés par les utilisateurs dans le protocole. Un bon indicateur de l'usage réel.
- **TVL/MC** — Fonds déposés rapportés à la valorisation (TVL ÷ Market Cap). Au-dessus de 1, le marché valorise le projet moins cher que les fonds qu'il sécurise.
- **Revenus annualisés** — Revenus que le protocole encaisse réellement, projetés sur 12 mois — ce qu'il « gagne », à distinguer du prix du jeton.
- **P/S** — Price-to-Sales : valorisation rapportée aux revenus annuels. Plus c'est bas, moins le projet est cher au regard de ce qu'il encaisse.
- **ATH** — All-Time High : le plus haut prix jamais atteint par le jeton.
- **Drawdown vs ATH** — Écart entre le prix actuel et son plus haut historique. −80 % signifie que le prix a chuté de 80 % depuis son sommet.
- **% circulant** — Part des jetons déjà en circulation sur le maximum qui pourra un jour exister.
- **Top 10 holders** — Part de l'offre détenue par les 10 plus gros portefeuilles (hors contrats). Élevée : un petit groupe peut faire bouger le prix à lui seul.
- **Taxe achat/vente** — Pourcentage prélevé automatiquement par le contrat à chaque achat ou vente. Au-delà de quelques pourcents, c'est un signal d'alerte.

---

*Ce rapport est généré automatiquement à des fins de recherche personnelle. Il ne constitue pas un conseil en investissement. Les métriques peuvent contenir des erreurs de source ; vérifiez les données critiques avant toute décision.*