# Provenance Blockchain (HASH) — Analyse de due diligence

> Générée le 2026-06-19 · Méthodologie v2.0.0 · Confiance des données : **moyenne** · Id CoinGecko : `hash-2`

## Executive Summary

**Provenance Blockchain** — Provenance Blockchain est une blockchain L1 (un réseau de base, indépendant) bâtie avec le Cosmos SDK et lancée en 2018, dédiée exclusivement à la « tokenisation » d'actifs financiers réels — c'est-à-dire leur représentation sous forme de jetons (prêts immobiliers HELOC, crédit structuré, assurance-vie). Son écosystème est presque entièrement opéré par Figure Technologies, la société qui l'a créée et qui en est à la fois le principal utilisateur, développeur et détenteur de jetons.

*Narratif : RWA*

### Verdict : 🔴 À éviter — Score global : **35/100**

> ⚠️ **Red flags** : −14 pts imputés aux piliers concernés (score avant red flags : 49/100).

| Pilier | Poids | Score | Red flags | Couverture données |
|---|---|---|---|---|
| **Fondamentaux** | 20 % | 39/100 | −19 pts | 100 % |
| **Tokenomics & capture de valeur** | 25 % | 16/100 | −24 pts | 100 % |
| **Traction & adoption on-chain** | 20 % | 48/100 | −14 pts | 55 % |
| **Marché & valorisation** | 15 % | 46/100 | — | 70 % |
| **Social & mindshare** | 10 % | 19/100 | −3 pts | 55 % |
| **Sécurité & risques** | 10 % | 51/100 | −4 pts | 35 % |

**Forces principales :**
- TVL de $1,3Md (les fonds déposés) sur une blockchain L1 dédiée aux actifs réels — parmi les plus élevés du secteur — avec une infrastructure réglementée (SEC, FINRA, et un ATS, c'est-à-dire une plateforme d'échange agréée), gage d'une crédibilité institutionnelle rare et différenciante
- Blockchain en service depuis 2018, au développement actif (version v1.29.0 en juin 2026, 1 841 commits) et avec un cas d'usage financier réel et documenté — soit 7 ans d'avance technique sur la plupart des concurrents RWA
- Secteur des actifs réels (RWA) en forte croissance (>$20Md en mai 2026, projections $50Md+), où Provenance se positionne comme une infrastructure de référence grâce au soutien de Figure et à son agrément ATS

**Faiblesses principales :**
- Dépendance fatale à Figure Technologies : 100% du TVL, 25-65% de l'offre de HASH, et un rôle opérationnel exclusif — ce n'est pas un protocole décentralisé, mais une infrastructure privée dont le jeton public est peu liquide
- Double pression à la dilution : une inflation probablement >20%/an (17% des jetons en staking contre 60% requis) et 43% de l'offre maximale pas encore en circulation, sans calendrier de déblocage (« unlock ») transparent — une pression vendeuse structurelle continue
- Capture de valeur quasi nulle pour les détenteurs de HASH : la « combustion » (burn) de jetons est inactive ($4 755/j de volume), le staking rapporte 0% et la gouvernance est verrouillée par la concentration — c'est Figure qui capte la valeur économique, pas les détenteurs du jeton

**Thèse d'investissement** : HASH est un pari de conviction sur Figure Technologies comme moteur de la tokenisation d'actifs réels (RWA) à grande échelle, sur sa propre blockchain, dans un marché porteur (>$20Md, accélération réglementaire). La thèse s'invalide si aucune adoption par des tiers indépendants de Figure ne se concrétise au-delà d'Infineo d'ici fin 2027, si les accusations du vendeur à découvert Morpheus Research sur l'usage réel de la blockchain sont confirmées par un régulateur, ou si l'inflation structurelle de l'émission (~17% de jetons en staking contre 60% requis) n'est pas corrigée par une refonte de la tokénomique (les règles économiques du jeton).

## Red Flags

| Sévérité | Signal | Détail | Source |
|---|---|---|---|
| 🟧 Majeur | Contrôle de fait par Figure Technologies : elle cumule les rôles d'opérateur, de principal utilisateur et de détenteur estimé à 25-65% de l'offre de HASH (Figure revendique 25%, Morpheus Research allègue 65% avec les affiliés) | — | Analyse qualitative (sourcée) |
| 🟧 Majeur | Mécanisme de combustion (burn) quasi inerte ($4 755/jour de volume) ; staking à 0% de rendement ; Figure Technologies capte la valeur économique du réseau au détriment des détenteurs de HASH | — | Analyse qualitative (sourcée) |
| 🟧 Majeur | Inflation probablement >20%/an : seulement ~17% de l'offre en staking alors que le modèle exige 60% pour atteindre le plancher de 1% — dilution continue par l'émission | — | Analyse qualitative (sourcée) |
| 🟧 Majeur | 43% de l'offre maximale pas encore en circulation ; position de Figure Asset Corp (25-57,7% du total selon les sources) sans conditions de blocage publiques ni calendrier de déblocage | — | Analyse qualitative (sourcée) |
| 🟧 Majeur | 100% du TVL et 100% des émissions RWA concentrés sur Figure Markets/Figure Technologies — adoption par des tiers quasi inexistante (un seul acteur : Infineo, ~$191M) | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Tour de table (Series B) de $2,65M (nov. 2024) très modeste pour une L1 ; dépendance budgétaire et opérationnelle à Figure Technologies | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Accusations de Morpheus Research (2025) sur le degré réel d'intégration de la blockchain dans la production de prêts de Figure — réfutées par Figure mais pas définitivement écartées par un régulateur | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Plusieurs produits annexes (Figure Pay, Adnales, OPEN Exchange, YLDS) abandonnés ou à l'arrêt — une exécution erratique en dehors du cœur de métier (les prêts HELOC) | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Pas de cotation au comptant sur Binance/Coinbase et un volume de $4 755/j malgré un rang dans le top 100 de CoinGecko — une illiquidité structurelle qui bloque toute dynamique communautaire organique | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Aucun audit de sécurité public trouvé pour le code propre à Provenance ; concentration des validateurs (10 comptes = 78% du staking selon Morpheus) non réfutée par Figure | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Risque légal résiduel : les accusations d'arbitrage réglementaire sur la classification « open-end » des prêts de Figure pourraient attirer des enquêtes de la SEC ou du CFPB | — | Analyse qualitative (sourcée) |

## Analyse détaillée par pilier

### Fondamentaux — 39/100 *(poids 20 % · red flags −19 pts (base 58/100))*

#### Problème, solution & nécessité blockchain — 64/100

**Résumé** : Un problème réel et bien ciblé dans la finance traditionnelle, avec une preuve de concept documentée, mais dont la réalité de la mise en œuvre sur la blockchain est activement contestée.

Provenance s'attaque aux lourdeurs de l'infrastructure financière traditionnelle (« legacy ») : coûts élevés de titrisation, manque de transparence, règlement lent. La chaîne propose des modules spécialisés pour enregistrer les actifs, tenir le registre DART (qui remplace le système MERS), échanger et régler les opérations. Le cas d'usage documenté (titrisation de prêts HELOC) affiche 117 points de base d'économies de coûts (un « point de base » = un centième de pour cent, source : HFA Research). La chaîne traite des actifs financiers depuis 2018 et dispose d'agréments réglementaires (ATS, FINRA). Le marché visé est réel : la tokenisation des actifs réels a dépassé 20Md$ en mai 2026. Cependant, le vendeur à découvert Morpheus Research a publié en 2025 des accusations détaillées : selon les déclarations de Figure à la SEC, son système de production de prêts « ne reposerait pas sur la blockchain » et utiliserait des processus documentaires classiques. Figure a réfuté en expliquant que DART est un registre actif de droits, et non un simple double numérique post-création, et a cité $2,9Md de volume sur sa marketplace au 1ᵉʳ trimestre 2026. Cette controverse, non tranchée à ce jour, limite la confiance dans la thèse d'une adoption purement blockchain.

*Sources : <https://www.morpheus-research.com/figure/> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis> · <https://www.investing.com/news/stock-market-news/figure-technologies-faces-blockchain-fraud-allegations-as-short-seller-claims-misrepresentation-93CH-4618887> · <https://www.provenance.io/blog/>*

#### Équipe, investisseurs & financement — 53/100

**Résumé** : Des vétérans de la finance adossés à Figure Technologies, mais un conflit d'intérêts structurel qui plafonne la crédibilité.

Provenance Blockchain a été créée en 2018 par Figure Technologies, dont Mike Cagney (co-fondateur de SoFi, écarté à la suite d'accusations de harcèlement) est président exécutif. Anthony Moro dirige aujourd'hui la Provenance Blockchain Foundation, après plusieurs changements de direction (Morgan McKenney nommée en 2022, June Ou par intérim en août 2024). En janvier 2026, la communauté a voté pour confier le rôle opérationnel de la Foundation à Figure Technology Solutions, consolidant de fait le contrôle de Figure. Le financement total atteint ~35M$ (PitchBook/Crunchbase), avec un dernier tour de table (Series B) de seulement 2,65M$ en novembre 2024 — un montant très modeste pour une L1 qui se présente parmi les leaders du RWA. Parmi les investisseurs notables : ParaFi Capital, ThirdStream Partners et Conversion Capital. La concentration de HASH entre les mains de Figure/Cagney (entre 25% revendiqués par Figure et 65% allégués par Morpheus Research, en incluant les affiliés et le fondateur) constitue un risque de gouvernance structurel non résolu. L'équipe a de vraies compétences financières, mais le modèle brouille irrémédiablement la frontière entre l'intérêt du protocole et l'intérêt commercial de Figure.

*Sources : <https://pitchbook.com/profiles/company/277217-20> · <https://www.crunchbase.com/organization/provenance-blockchain-foundation> · <https://www.prnewswire.com/news-releases/provenance-blockchain-foundation-announces-banking-executive-morgan-mckenney-as-ceo-301492872.html> · <https://www.barchart.com/story/news/36432332/figure-technology-solutions-announces-community-approved-update-to-provenance-blockchain-foundation-structure> · <https://www.morpheus-research.com/figure/> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis>*

#### Exécution de la roadmap — 57/100

**Résumé** : La chaîne est opérationnelle et activement développée, mais l'historique des produits annexes (hors cœur de métier) révèle une exécution erratique.

Sur le plan technique, Provenance affiche une activité réelle et récente : le dépôt GitHub officiel (github.com/provenance-io/provenance) compte 1 841 commits, 116 étoiles, 75 forks, et la dernière version est la v1.29.0 datée du 8 juin 2026 — moins de deux semaines avant cette analyse. Les métriques automatiques (1 contributeur, 0 étoile) pointaient vers un mauvais dépôt. Des points réguliers avec la communauté (mises à jour trimestrielles de l'écosystème, « town hall » d'août 2025, point en direct de décembre 2025) témoignent d'un suivi actif. Le TVL a bondi de +570% de novembre 2025 à février 2026 (sommet historique à $1,2Md). En revanche, le bilan des produits annexes de Figure est mitigé : Figure Pay (licence bancaire abandonnée), Figure Equity/Adnales (un concurrent de Carta, disparu), OPEN Exchange (86% des actions Figure ont quitté la blockchain en deux mois), le stablecoin YLDS (contrôlé à 99% par Figure, à l'usage quasi nul). L'absence d'une feuille de route publique détaillée, avec des jalons datés, limite l'évaluation indépendante de l'exécution.

*Sources : <https://github.com/provenance-io/provenance> · <https://www.morpheus-research.com/figure/> · <https://phemex.com/news/article/provenance-blockchain-tvl-reaches-record-12-billion-59595> · <https://thedefiant.io/news/blockchains/provenance-blockchain-tvl-hits-all-time-high-of-usd1-2-billion> · <https://www.tradingview.com/news/coinmarketcal:b068c76a2094b:0-provenance-blockchain-hash-live-ecosystem-update-30-dec-2025/>*

### Tokenomics & capture de valeur — 16/100 *(poids 25 % · red flags −24 pts (base 40/100))*

#### Dilution (MC/FDV, offre circulante) — 60/100

**Constat (déterministe)** : MC/FDV = 0.57 (offre circulante : 54 %)

#### Utilité du token & capture de valeur — 33/100

**Résumé** : Un mécanisme de capture de valeur défini sur le papier mais quasi inerte en pratique : c'est Figure Technologies qui capte l'essentiel de la valeur économique créée.

Le jeton HASH joue quatre rôles formels : (1) payer les frais (« gas ») de chaque transaction sur la chaîne ; (2) le « staking » chez les validateurs (avec une période de déblocage, « debonding », de 21 jours) ; (3) la gouvernance ; (4) un mécanisme de combustion (« burn ») via le HASH Marketplace — 40% des frais du réseau et 100% des frais de règlement sont mis aux enchères, l'offre gagnante étant définitivement détruite. En théorie, plus le réseau croît, plus l'offre se contracte. En pratique, avec un volume sur 24h de 4 755$ pour une capitalisation de 540M$, la combustion est économiquement nulle. Le rendement du staking est rapporté à 0,00%/an (StakingRewards.com, juin 2026), le programme de récompenses ayant été réorienté vers des « airdrops » (distributions gratuites) conditionnés au rang HASH. La répartition des frais (93% aux validateurs, 7% à la Foundation) profite mécaniquement à Figure, qui domine l'activité du réseau. L'analyse optimiste (HFA Research) le reconnaît elle-même : Figure Technologies capte l'essentiel des profits économiques, reproduisant le schéma déjà observé sur dYdX, UNI et Lido. La gouvernance reste accessible mais verrouillée par la concentration de l'offre. Au test de capture de valeur : si Provenance réussit, ce sont Figure et ses actionnaires — pas les détenteurs de HASH — qui en profitent en priorité.

*Sources : <https://provenance.io/whitepaper-tokenomics> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis> · <https://www.stakingrewards.com/asset/provenance-blockchain> · <https://docs.provenance.io/learn/the-hash-token>*

#### Unlocks & inflation à venir — 27/100

**Résumé** : Inflation potentiellement très élevée vu le faible taux de staking, et un important volume de jetons en attente (« overhang ») non documenté : une double pression à la dilution, structurelle.

Aucun calendrier de déblocage (« vesting ») avec dates et paliers n'est accessible publiquement (page Tokenomist en erreur 404, CryptoRank fermé). Sur Provenance, la dilution vient surtout de l'émission, pas de paliers de déblocage : le modèle prévoit une inflation variable entre 1% et 52,5% selon la part de l'offre totale mise en staking. Le plancher à 1% d'inflation suppose que 60% de l'offre soit en staking. Or, avec seulement ~17% de l'offre totale actuellement en staking (ATOMScan/StakingRewards), l'inflation est mécaniquement bien supérieure à 20%/an — un signal d'alerte majeur selon les critères de cette analyse. Le taux exact ne peut être calculé sans la courbe complète, mais la direction est sans ambiguïté. Par ailleurs, le ratio MC/FDV de 0,572 implique qu'environ 43% de l'offre maximale (~45,7 milliards de HASH) n'est pas encore en circulation. La structure de détention reste opaque : Figure Asset Corp détiendrait entre 25% (Figure) et 57,7% (HFA Research, données historiques) du jeton. Aucune condition de blocage ou de libération de ces positions n'est documentée publiquement. Cette double pression — inflation élevée continue + masse de jetons en attente non planifiée — constitue un vent contraire structurel pour le prix du jeton.

*Sources : <https://provenance.io/whitepaper-tokenomics> · <https://www.stakingrewards.com/asset/provenance-blockchain> · <https://atomscan.com/provenance> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis> · <https://cryptorank.io/ico/provenance-blockchain>*

### Traction & adoption on-chain — 48/100 *(poids 20 % · red flags −14 pts (base 62/100))*

#### Ratio TVL/Market Cap — 72/100

**Constat (déterministe)** : TVL/MC = 2.41 (TVL $1303.6M)

#### Tendance TVL 30j — n/d

**Constat (déterministe)** : Historique TVL indisponible

#### Frais & revenus du protocole — n/d

**Constat (déterministe)** : Pas de revenus mesurables

#### Adoption (selon narratif) — 54/100

**Résumé** : Un TVL de $1,3 Md bien réel, mais « mono-locataire » à 100% (un seul utilisateur), avec une adoption par des tiers embryonnaire et une liquidité alarmante qui invalide l'effet de réseau.

Provenance affiche un TVL de 1,304 Md$ (DeFiLlama, juin 2026), avec un ratio TVL/MC de 2,4x — des chiffres impressionnants en apparence. Mais la totalité de ce TVL provient de Figure Markets (la plateforme de dépôt et de trading de Figure) : DeFiLlama ne recense qu'un seul protocole actif sur Provenance. Sur rwa.xyz, le réseau affiche 2 actifs réels tokenisés, 182 détenteurs, et un volume de transferts RWA sur 30 jours en chute de 75%. La valeur « notionnelle » représentée de 18,94Md$ (rwa.xyz) — c'est-à-dire la valeur de référence des actifs sous-jacents, et non de la liquidité réellement déployée — est très différente du TVL de DeFiLlama. Le seul acteur tiers significatif est Infineo (assurance-vie, ~191M$ de TVL, 4 mois d'existence), unique validation d'une adoption indépendante. Figure produirait pour ~2,9Md$ de prêts HELOC par trimestre (+113% sur un an au 1ᵉʳ trimestre 2026), mais cette activité génère un flux de frais réseau quasi invisible dans les métriques de HASH. La thèse d'adoption dépend entièrement de la capacité de Provenance à attirer des émetteurs RWA indépendants de Figure — un seul exemple à ce jour.

*Sources : <https://defillama.com/chain/provenance> · <https://app.rwa.xyz/networks/provenance> · <https://phemex.com/news/article/provenance-blockchain-tvl-reaches-record-12-billion-59595> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis> · <https://thedefiant.io/news/blockchains/provenance-blockchain-tvl-hits-all-time-high-of-usd1-2-billion>*

### Marché & valorisation — 46/100 *(poids 15 %)*

#### Valorisation vs revenus (P/S) — n/d

**Constat (déterministe)** : Pas de revenus → multiple incalculable

#### Valorisation vs comparables — 46/100

**Résumé** : Valorisation intermédiaire dans le secteur RWA, mais la pire liquidité du panel et une prime de valorisation injustifiée tant qu'une adoption par des tiers n'est pas démontrée.

Dans l'univers des protocoles RWA, Provenance occupe une position médiane en capitalisation ($540M), mais singulière par son architecture : une L1 souveraine et dédiée, là où Ondo et Centrifuge sont des protocoles multi-chaînes. Ondo Finance (~$1,85Md de capitalisation) domine la tokenisation des bons du Trésor américains, avec une liquidité profonde, une adoption institutionnelle variée et une croissance organique démontrable. Centrifuge (~$119M de capitalisation) est le concurrent le plus direct sur le crédit privé, avec 8 ans d'historique et une meilleure décentralisation, mais un TVL 10x inférieur. MANTRA (OM) a subi un effondrement de gouvernance en 2025 — cas d'école des risques de concentration d'un jeton — et procède à un regroupement d'actions (un « split » de 1:4) en mars 2026. Sur le ratio capitalisation/TVL, HASH (0,41x) paraît sous-valorisé face à Ethereum ou Solana, mais la comparaison est faussée par le TVL « mono-locataire » : un TVL apporté par Figure peut disparaître si Figure diversifie ses activités ou change de chaîne. La prime de HASH sur CFG (Centrifuge) reflète davantage le récit que des fondamentaux de décentralisation ou de liquidité supérieurs.

| Projet | Market Cap | FDV | Commentaire |
|---|---|---|---|
| Ondo Finance (ONDO) | ~$1,85 Md | ~$2,42 Md | Leader de la tokenisation des bons du Trésor américains ; liquidité profonde ; adoption institutionnelle variée et indépendante |
| Centrifuge (CFG) | ~$119M | ~$160M | Pionnier du crédit privé tokenisé (8 ans, $1,5Md d'actifs réels) ; meilleure décentralisation que HASH ; TVL 10x inférieur |
| MANTRA (OM) | < $100M (post-restructuration) | N/D (split 1:4 en cours mars 2026) | Blockchain L1 dédiée au RWA, en crise de gouvernance en 2025 — cas d'école du risque de concentration d'un jeton, similaire à HASH |
| Provenance HASH | $540M | $944M | TVL de $1,3Md mais 100% « mono-locataire » (Figure Markets) ; volume de $4 755/j — liquidité quasi nulle |

*Sources : <https://www.coingecko.com/en/coins/centrifuge> · <https://coinstats.app/ai/a/fundamental-analysis-ondo-finance> · <https://coinmarketcap.com/cmc-ai/mantra/latest-updates/> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis> · <https://bitcoinfoundation.org/news/defi/top-rwa-crypto-projects-2026-ondo-maple-centrifuge/>*

### Social & mindshare — 19/100 *(poids 10 % · red flags −3 pts (base 22/100))*

#### Activité développeurs (GitHub) — n/d

**Constat (déterministe)** : Activité GitHub indisponible

#### Mindshare & dynamique sociale — 22/100

**Résumé** : Quasi absent du radar des particuliers et de la sphère crypto grand public, avec une notoriété limitée au cercle institutionnel de la fintech.

Les données d'abonnés Twitter/X sont indisponibles dans les sources accessibles. La communauté on-chain révèle une réalité criante : 182 détenteurs de RWA sur rwa.xyz, un volume de HASH de 4 755$/jour pour une capitalisation de 540M$. HASH n'est pas coté en direct au comptant sur Binance ou Coinbase, malgré une capitalisation dans le top 100 de CoinGecko — un paradoxe qui s'explique par un positionnement purement institutionnel et l'absence de « market making » organisé (des acteurs qui assurent la liquidité). Le pic de prix de septembre 2025 ($0,0601, sommet historique) et le récit RWA ont créé un bref épisode médiatique, effacé par une chute de -83%. La publication du rapport Morpheus Research en 2025 reste l'événement d'attention majeur récent — négatif. Le vote de gouvernance de janvier 2026 (Figure aux commandes) a été couvert par The Block et Nasdaq, mais sans effet sur l'attention du grand public. Une audience exclusivement institutionnelle explique, mais ne compense pas, l'absence de dynamique communautaire crypto organique. Sans cotation sur une grande plateforme et sans market maker, aucun rebond de l'attention n'est prévisible à court terme.

*Sources : <https://app.rwa.xyz/networks/provenance> · <https://www.morpheus-research.com/figure/> · <https://www.theblock.co/post/386526/figure-operational-role-provenance-blockchain-foundation-community-structure> · <https://www.nasdaq.com/press-release/figure-technology-solutions-announces-community-approved-update-provenance-blockchain> · <https://hfaresearch.substack.com/p/the-provenance-investment-thesis>*

### Sécurité & risques — 51/100 *(poids 10 % · red flags −4 pts (base 55/100))*

#### Sécurité du contrat (GoPlus) — n/d

**Constat (déterministe)** : Contrat non analysable (token natif ou chain non couverte)

#### Concentration des holders — n/d

**Constat (déterministe)** : Distribution des holders indisponible

#### Audits & risques légaux — 55/100

**Résumé** : Solide côté réglementaire grâce à l'infrastructure de Figure, mais aucun audit de sécurité public trouvé pour le code propre à Provenance Blockchain.

Aucun rapport d'audit de sécurité public (CertiK, Trail of Bits, Halborn, Quantstamp…) n'a été trouvé pour le code propre à Provenance Blockchain dans les sources accessibles. Cette lacune est en partie atténuée par le fait que la chaîne est bâtie sur le Cosmos SDK et CometBFT, des briques logicielles longuement testées et auditées par l'écosystème Cosmos depuis 2018. Le code est public et open-source (langage Go, v1.29.0, 1 841 commits). La concentration des validateurs est préoccupante : selon Morpheus Research, 10 comptes contrôlent 78% des jetons en staking, et 2 comptes pourraient en théorie bloquer le réseau. Sur le plan légal, Provenance bénéficie d'une couverture implicite via Figure Technologies : société cotée (introduite en Bourse « blockchain-native »), enregistrée auprès de la SEC, titulaire d'une licence de courtier (« broker-dealer ») FINRA, et opérateur d'un ATS agréé. Cet ancrage réglementaire est un avantage compétitif structurel dans le RWA institutionnel. Le risque légal résiduel concerne la classification des prêts « open-end » par Figure (que Morpheus Research qualifie d'arbitrage réglementaire) et d'éventuelles enquêtes découlant des accusations de présentation trompeuse. La dépendance réglementaire à Figure est à double tranchant : si Figure connaît des ennuis judiciaires, l'écosystème Provenance aussi.

*Sources : <https://github.com/provenance-io/provenance> · <https://developer.provenance.io/docs/> · <https://www.morpheus-research.com/figure/> · <https://www.cbinsights.com/company/provenance-blockchain/people> · <https://www.investing.com/news/stock-market-news/figure-technologies-faces-blockchain-fraud-allegations-as-short-seller-claims-misrepresentation-93CH-4618887>*

## Déclencheurs de la thèse

**Catalyseurs positifs à surveiller :**
- [ ] Cotation sur une grande plateforme d'échange (« Tier 1 » comme Binance au comptant, Coinbase) : cela réglerait la crise de liquidité chronique ($4 755/j) et entraînerait une revalorisation (« re-rating ») significative du jeton
- [ ] Arrivée d'un émetteur RWA majeur indépendant de Figure (grande banque, gérant d'actifs) : cela validerait l'idée d'une blockchain à plusieurs utilisateurs (« multi-tenant ») et briserait la dépendance à 100%
- [ ] Figure Technologies atteint $1Md de production de prêts HELOC par mois (objectif annoncé) : cela augmenterait mécaniquement les frais du réseau et activerait le mécanisme de combustion (burn) de HASH
- [ ] Mise en place effective du nouveau modèle économique du jeton, basé sur les frais (« fee-based »), annoncé par Mike Cagney (janvier 2026) : cela améliorerait la capture de valeur pour les détenteurs de HASH
- [ ] Accélération réglementaire favorable aux RWA aux États-Unis (cadre de tokenisation SEC/CFTC) : cela élargit le marché potentiel et légitime l'infrastructure de Provenance auprès des émetteurs institutionnels

**Signaux d'invalidation :**
- [ ] Une enquête de la SEC ou de la FINRA validant les accusations de Morpheus Research sur une présentation trompeuse (« misrepresentation ») de l'usage réel de la blockchain par Figure : cela déstabiliserait tout l'écosystème Provenance
- [ ] Une hausse des impayés sur les prêts HELOC de Figure (5,46% en 2025 contre 1,78% chez BofA) entraînant des pertes sur les titres adossés ou un rejet de ces créances par les marchés de capitaux
- [ ] Une absence persistante d'adoption par des tiers en 2026-2027 : cela confirmerait le caractère « mono-locataire » permanent (un seul utilisateur réel) et invaliderait définitivement la thèse d'effet de réseau d'une L1
- [ ] Une vente massive de HASH par Figure/Cagney (une tendance déjà visible : $64M d'actions Figure vendues depuis l'introduction en Bourse, sans aucun achat) : signe d'un manque de conviction des initiés sur la valeur du jeton
- [ ] Une gouvernance hostile ou une attaque du réseau exploitant la concentration (2 comptes suffiraient en théorie à bloquer le réseau, selon Morpheus), avec une inflation >20%/an maintenue comme pression vendeuse structurelle

## Annexe — Données brutes

| Métrique | Valeur | Source |
|---|---|---|
| Prix | $0.0099 | CoinGecko |
| Market Cap | $540.34 M | CoinGecko |
| FDV | $944.46 M | CoinGecko |
| MC/FDV | 0.57 | CoinGecko |
| Rang Market Cap | 96 | CoinGecko |
| Volume 24h | $4.8 k | CoinGecko |
| Volume/MC | 0.0 % | CoinGecko |
| ATH | $0.0601 (2025-09-14) | CoinGecko |
| Drawdown vs ATH | -83.5 % | CoinGecko |
| Offre circulante | 54 338 334 568 (54 % du max) | CoinGecko |
| Variation prix 30j | -5.2 % | CoinGecko |
| TVL | $1.30 Md | DeFiLlama |
| TVL/MC | 2.41 | DeFiLlama |
| Tendance TVL 30j | n/d | DeFiLlama |
| Frais 30j | n/d | DeFiLlama |
| Revenus 30j | n/d | DeFiLlama |
| P/S annualisé | n/d | CoinGecko+DeFiLlama |
| Holders | n/d | GoPlus |
| Top 10 holders | n/d | GoPlus |
| Taxes achat/vente | n/d / n/d | GoPlus |
| Commits GitHub 90j | n/d | GitHub |
| Contributeurs GitHub | 1 | GitHub |
| Followers Twitter/X | n/d | CoinGecko |

*Données récupérées le 30/06/2026 21:24:48 via CoinGecko API, DeFiLlama API, GitHub API.*

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