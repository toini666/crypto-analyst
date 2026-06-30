# Centrifuge (CFG) — Analyse de due diligence

> Générée le 2026-06-22 · Méthodologie v2.0.0 · Confiance des données : **élevée** · Id CoinGecko : `centrifuge-2`

## Executive Summary

**Centrifuge** — Centrifuge est la plateforme de référence pour la « tokenisation » (transformation d'un actif en jeton numérique échangeable sur la blockchain) d'actifs du monde réel (RWA, pour Real World Assets) : elle permet à des institutions financières de créer, gérer et distribuer directement sur la blockchain (« on-chain ») des fonds tokenisés (par exemple des CLO, un type de produit de dette structurée, du crédit privé ou des indices). Après avoir migré de la blockchain Polkadot vers un protocole compatible Ethereum et fonctionnant sur plusieurs blockchains à la fois (« multichain ») en juillet 2025 (version V3), elle affiche $1,63 Md de TVL (Total Value Locked, soit la valeur totale des actifs déposés dans le protocole) en juin 2026, avec Janus Henderson, Apollo et S&P Dow Jones comme partenaires.

*Narratif : RWA*

### Verdict : 🟡 À surveiller — Score global : **56/100**

> ⚠️ **Red flags** : −9 pts imputés aux piliers concernés (score avant red flags : 65/100).

| Pilier | Poids | Score | Red flags | Couverture données |
|---|---|---|---|---|
| **Fondamentaux** | 20 % | 76/100 | −4 pts | 100 % |
| **Tokenomics & capture de valeur** | 25 % | 30/100 | −18 pts | 100 % |
| **Traction & adoption on-chain** | 20 % | 72/100 | −3 pts | 30 % |
| **Marché & valorisation** | 15 % | 66/100 | — | 70 % |
| **Social & mindshare** | 10 % | 50/100 | −3 pts | 100 % |
| **Sécurité & risques** | 10 % | 44/100 | −23 pts | 100 % |

**Forces principales :**
- Une valeur totale déposée dans le protocole (TVL) de $1,63 Md, avec des partenaires institutionnels de tout premier plan (Janus Henderson, Apollo, S&P Dow Jones, Ethena, Coinbase) : une adoption réelle et non spéculative, qui démontre concrètement que le concept fonctionne (le « proof-of-concept » commercial est établi)
- Une équipe dirigeante au parcours exceptionnel dans la finance traditionnelle (« TradFi », par opposition à la finance crypto) : ancien directeur des opérations (COO) pour l'Europe chez Goldman Sachs, ancien de SAP/Taulia, et un directeur juridique dédié (Chief Legal Officer, à ne pas confondre avec les CLO de crédit mentionnés plus haut) — cela confère une crédibilité institutionnelle rare, qui se traduit directement dans les partenariats noués
- Une infrastructure de version V3 qui fonctionne sur plusieurs blockchains et peut accueillir tout type d'actif (« multi-actifs »), positionnée comme une couche technique neutre de tokenisation (présente sur 8 chaînes, ouverte à tout type d'actif réglementé) : un avantage technique durable face à la concurrence (un « moat », littéralement une douve protectrice) et un effet de réseau — la plateforme devient plus utile à mesure qu'elle attire des utilisateurs — encore en construction

**Faiblesses principales :**
- Il n'existe aucun mécanisme direct permettant aux détenteurs du jeton CFG d'en tirer une valeur économique : le jeton ne donne qu'un droit de vote (il est « governance-only »), sur un protocole dont les opérations sont désormais contrôlées par la Centrifuge Network Foundation (CNF) depuis la proposition de gouvernance CP171 — ce qui crée une déconnexion durable entre le succès du protocole et la valeur du jeton, tant qu'aucune décision de gouvernance ne change la donne
- La valeur déposée dans le protocole (TVL) est excessivement concentrée sur un seul grand apporteur de fonds (Grove, environ $1 Md ou plus, soit environ 60% du total), et la base d'investisseurs particuliers (« retail ») est extrêmement réduite (10 601 détenteurs, et un ratio volume d'échange quotidien / capitalisation boursière de seulement 4,8%) : une fragilité structurelle que des chiffres de TVL impressionnants ont tendance à masquer
- Le jeton CFG se négocie avec une décote persistante et, en réalité, justifiée par rapport à ses comparables : sa capitalisation boursière ne représente que 0,05 fois sa TVL, contre environ 0,35 fois pour Ondo. Sans catalyseur sur les règles économiques du jeton (la « tokenomics »), le marché continuera, à juste titre, de valoriser l'absence de mécanisme de capture de valeur pour le détenteur

**Thèse d'investissement** : Centrifuge est, sur le plan opérationnel, le protocole d'infrastructure RWA le mieux placé : il affiche $1,63 Md de TVL et des partenaires institutionnels de tout premier plan. Mais son jeton (token) CFG souffre d'un décalage structurel entre la réussite du protocole et ce que cette réussite rapporte concrètement à celui qui détient le jeton (le « holder ») — un décalage que seule une décision de gouvernance (par exemple un partage des revenus avec les détenteurs, appelé « fee-sharing », ou un rachat de jetons, ou « buyback ») peut corriger. La thèse optimiste (« bull ») est donc conditionnelle et tout-ou-rien : si l'organisation qui gouverne le protocole de façon décentralisée (la DAO, où les détenteurs de jetons votent les décisions) met en place un mécanisme de distribution des revenus du protocole ET que la valeur déposée par les institutions continue de croître vers $3-5 Md, alors CFG présente un écart de valorisation majeur par rapport à ses comparables (0,05x sa TVL, contre 0,35x pour Ondo). Mais dans le scénario inverse, si les règles économiques du jeton (la « tokenomics ») restent inchangées, la réussite du protocole continuera de ne pas profiter au jeton.

## Red Flags

| Sévérité | Signal | Détail | Source |
|---|---|---|---|
| 🟧 Majeur | Top 10 holders > 40 % de l'offre | Top 10 holders (hors contrats) : 45.8 % de l'offre | GoPlus |
| 🟧 Majeur | Il n'existe aucun mécanisme de capture directe de valeur : les $5,15 M de revenus annuels du protocole s'accumulent dans le Treasury DAO sans distribution automatique ni destruction de jetons (« burn ») au bénéfice des détenteurs de CFG | — | Analyse qualitative (sourcée) |
| 🟧 Majeur | Depuis CP171 (novembre 2025), la fonction de création de jetons (« mint ») du CFG est contrôlée par la CNF (une entité en dehors de la blockchain) et non plus directement par la DAO sur la blockchain — un risque de centralisation de cette fonction, documenté mais peu mis en avant | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | L'exécution des contrats liés aux RWA dépend encore de cadres juridiques classiques, en dehors de la blockchain (« off-chain ») : 3 litiges ayant nécessité une intervention légale ont été identifiés en 2025, selon Delphi Digital | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Les revenus du protocole ($5,15 M en rythme annualisé) ne représentent que 0,31% de la TVL gérée — un ratio anormalement bas qui suggère une tarification très compétitive proposée aux institutions | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Depuis la proposition CP171 (novembre 2025), c'est la Centrifuge Network Foundation (CNF) qui gère la gouvernance opérationnelle — les droits de vote des détenteurs de CFG restent théoriques sur les décisions courantes | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | 299 M CFG (environ $69,5 M) restent encore à libérer (« vester ») sur la période 2026-2030, ce qui représente 44% de dilution potentielle additionnelle à cours constant — une pression vendeuse structurelle qui s'étale sur le long terme | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | La TVL est excessivement concentrée sur Grove Finance (plus de $1 Md à lui seul, soit environ 60% de la TVL totale) : un désengagement de cet acteur provoquerait un choc de première ampleur sur la TVL | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Le nombre d'abonnés sur X/Twitter n'est pas renseigné, et Telegram ne compte que 11 000 abonnés pour $1,63 Md de TVL : une base communautaire d'investisseurs particuliers insuffisante pour soutenir une valorisation élevée du jeton | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Le risque réglementaire lié à la SEC américaine et au cadre européen MiCA reste non résolu, s'agissant de la classification des jetons représentant des actifs réels tokenisés (RWA) en tant que valeurs mobilières | — | Analyse qualitative (sourcée) |

## Analyse détaillée par pilier

### Fondamentaux — 76/100 *(poids 20 % · red flags −4 pts (base 80/100))*

#### Problème, solution & nécessité blockchain — 78/100

**Résumé** : Un problème massif et bien documenté : relier les $16 000 Md d'actifs financiers traditionnels à la liquidité de la finance décentralisée (DeFi, des services financiers qui fonctionnent directement sur la blockchain, sans intermédiaire classique) grâce à une infrastructure de tokenisation capable de gérer plusieurs types d'actifs et plusieurs blockchains.

Le marché visé est la tokenisation d'actifs réels — un segment qui a triplé en 2025 pour atteindre $19 Md de TVL au niveau mondial, et qui devrait dépasser $100 Md fin 2026 (source : blog de Centrifuge). La version V3 de Centrifuge, lancée en juillet 2025, constitue une refonte complète : un protocole compatible Ethereum et fonctionnant sur plusieurs blockchains (Ethereum, Base, Arbitrum, Avalanche, BNB Chain, Solana et Stellar), qui permet de créer des coffres numériques tokenisés pouvant s'interconnecter avec d'autres protocoles (« composables »). La solution se différencie de ses pairs : contrairement à Ondo (limité aux bons du Trésor américain, les « Treasuries ») ou à Goldfinch (crédit dans les marchés émergents), Centrifuge vise une infrastructure universelle capable de tokeniser tout actif financier réglementé. La validation commerciale est tangible : JAAA (un produit de dette structurée noté AAA de Janus Henderson, avec plus de $1 Md déployés par Grove — « l'un des plus grands engagements en crédit tokenisé à ce jour »), SPXA (le premier fonds répliquant le S&P 500 tokenisé, sous licence de S&P Dow Jones Indices), ACRDX (Apollo Diversified Credit, $50 M) et JTRSY (noté AA+, porté par Particula, plus de $400 M). La principale limite reste la dépendance à des cadres juridiques classiques (« off-chain », c'est-à-dire en dehors de la blockchain) pour faire respecter les contrats : trois litiges ayant nécessité une intervention juridique en 2025 montrent que le modèle n'en est pas encore au stade où « le code fait loi » (« code is law », c'est-à-dire où le contrat informatique suffirait à lui seul, sans recours à la justice classique).

*Sources : <https://centrifuge.io/blog/2026-real-world-asset-tokenization> · <https://www.coindesk.com/business/2025/11/12/rwa-specialist-centrifuge-debuts-tokenization-service-starting-with-daylight> · <https://centrifuge.io/blog/centrifuge-q2-2025-recap> · <https://centrifuge.io/blog/centrifuge-q3-2025-recap>*

#### Équipe, investisseurs & financement — 83/100

**Résumé** : Une équipe fondatrice exceptionnellement bien implantée dans la technologie financière traditionnelle (« fintech TradFi »), renforcée par des profils issus de Goldman Sachs et soutenue par des investisseurs de tout premier rang (« tier-1 ») comme Coinbase, Galaxy et ParaFi.

Centrifuge a été fondé en 2017 par Lucas Vogelsang (ancien directeur technique, ou CTO, de Taulia, une start-up de financement de la chaîne d'approvisionnement rachetée par SAP en 2022), Martin Quensel (co-fondateur de Taulia, aujourd'hui Président) et Bhaji Illuminati (directrice générale, ou CEO, depuis 2024, après avoir été directrice marketing, ou CMO). La direction est complétée par Anil Sood (directeur de la stratégie, ou CSO, co-fondateur d'Anemoy, passé par Goldman Sachs, Barclays et Knight Capital sur les fonds cotés en bourse — les ETF — institutionnels), Jeroen Offerijns (directeur technique, ou CTO), Eli Cohen (directeur juridique, ou CLO — un atout structurel clé pour un protocole RWA qui doit composer avec la réglementation), et Jürgen Blumberg, recruté en Q3 2025 (troisième trimestre 2025) comme directeur des opérations (COO), après avoir occupé ce même poste pour la zone Europe-Moyen-Orient-Afrique chez Goldman Sachs — un signal fort du virage institutionnel pris par l'entreprise. Le financement total dépasse $30 M sur plusieurs tours de levée de fonds depuis 2017, avec des investisseurs stratégiques : Coinbase Ventures, Galaxy Digital, Mosaic Ventures, ParaFi Capital, Greenfield, Isomer Capital et Republic Digital. La qualité du réseau de la finance traditionnelle intégré à l'équipe se traduit directement dans les partenariats conclus : Janus Henderson ($480 Md d'actifs sous gestion), Apollo, S&P Dow Jones Indices. Le changement de CEO en 2024 (de Lucas à Bhaji) s'est déroulé de façon ordonnée, Lucas ayant conservé un rôle stratégique au conseil d'administration. Seul bémol : une équipe de développement resserrée (7 contributeurs actifs sur le code source, hébergé sur GitHub) pour un protocole qui gère $1,63 Md de TVL.

*Sources : <https://centrifuge.io/blog/centrifuge-new-leadership-2025> · <https://www.rootdata.com/Projects/detail/Centrifuge?k=Mjg2> · <https://tracxn.com/d/companies/centrifuge/__aZAmmHVaoSZokiRQXMV43jAlx3sAMVN1mJoeBpf13ow/funding-and-investors> · <https://centrifuge.io/blog/centrifuge-q3-2025-recap>*

#### Exécution de la roadmap — 77/100

**Résumé** : Une exécution remarquable en 2025, avec la livraison de la version V3 dans les délais, une TVL atteignant $1,63 Md en juin 2026 (en hausse de +127% par rapport au trimestre précédent — une croissance « QoQ », pour quarter-over-quarter — au troisième trimestre 2025, soit Q3 2025) et un renforcement continu des partenariats avec des institutions de tout premier rang.

Centrifuge a exécuté sa feuille de route 2025 avec discipline. Parmi les étapes clés livrées : la migration vers la V3 (de Polkadot vers un protocole compatible Ethereum et multichain) achevée en juillet 2025 ; le franchissement du cap de $1 Md de TVL en août 2025 ; l'inscription du jeton sur Coinbase (« listing ») en septembre 2025, Coinbase ayant désigné Centrifuge comme son « Preferred Tokenization Infrastructure » (infrastructure de tokenisation privilégiée) ; le lancement de SPXA (S&P 500 tokenisé) et d'ACRDX (Apollo) au troisième trimestre 2025 (Q3 2025) ; et le déploiement de JAAA sur Solana avec $200 M apportés par Ethena. En 2026, l'Onchain Portfolio Manager (un outil de gestion de portefeuille directement sur la blockchain) et la finalisation de la V3 ont été livrés en avril. Les revenus annualisés au niveau du protocole atteignent $5,15 M (source : DeFi Llama, juin 2026), à comparer à des frais bruts annualisés de $56,7 M — la différence étant largement reversée aux investisseurs, ce qui reflète un modèle d'infrastructure à marges étroites. La trajectoire visant $15 M de revenus projetés fin 2026 impliquerait un quasi-triplement en 6 mois : un objectif ambitieux mais pas impossible, porté par une intégration croissante avec Aave Horizon. Le recrutement de Jürgen Blumberg (directeur des opérations, ancien directeur des opérations pour l'Europe-Moyen-Orient-Afrique chez Goldman Sachs) matérialise cette ambition institutionnelle. Point négatif : la période de migration de Polkadot vers Ethereum (12 à 18 mois de transition) a temporairement fragmenté la base d'utilisateurs et la liquidité.

*Sources : <https://defillama.com/protocol/centrifuge> · <https://centrifuge.io/blog/centrifuge-q3-2025-recap> · <https://centrifuge.io/blog/centrifuge-q2-2025-recap> · <https://thedefiant.io/news/tradfi-and-fintech/centrifuge-surpasses-usd1-billion-in-tvl-as-broader-rwa-heats-up>*

### Tokenomics & capture de valeur — 30/100 *(poids 25 % · red flags −18 pts (base 48/100))*

#### Dilution (MC/FDV, offre circulante) — 60/100

**Constat (déterministe)** : MC/FDV = 0.56 (offre circulante : 56 %)

#### Utilité du token & capture de valeur — 35/100

**Résumé** : CFG est avant tout un jeton de gouvernance (donnant un droit de vote, sans autre droit économique), avec une création de nouveaux jetons (« inflation ») de 3% par an dirigée vers la trésorerie commune gérée par la DAO (le « Treasury DAO »). Pour le détenteur, la valeur tirée de ce jeton reste indirecte, non automatique, et fragilisée par la délégation d'une partie de la gouvernance à la Centrifuge Network Foundation (CNF).

Le bilan est défavorable du point de vue de la capture de valeur. CFG donne accès à : (1) un droit de vote sur les propositions de protocole et sur l'utilisation de la trésorerie commune (le Treasury DAO) ; (2) une exposition indirecte à l'accumulation de cette trésorerie via la création de nouveaux jetons à hauteur de 3% par an (« inflation », soit environ 20,7 M jetons par an dirigés vers la trésorerie). Il n'existe ni mécanisme de destruction de jetons (« burn »), ni rendement de mise en jeu (« staking yield ») distribué aux détenteurs, ni partage automatique des frais en CFG. Les revenus du protocole ($5,15 M en rythme annualisé selon DeFi Llama) s'accumulent dans le Treasury DAO, dont les détenteurs de CFG peuvent en théorie voter l'utilisation — mais aucun programme de rachat ou de distribution automatique n'est documenté à ce jour. Un groupe consultatif dédié, le Treasury Advisory Group (TAG), explore des modèles de mise en jeu et de partage des revenus, ce qui confirme que ces mécanismes ne sont pas encore mis en place. Depuis la proposition CP171 (novembre 2025), la Centrifuge Network Foundation (CNF) a repris la gestion des opérations de gouvernance, réduisant encore l'influence directe des détenteurs de CFG sur les décisions courantes. La valeur économique considérable générée par le protocole — $1,63 Md de TVL, $56,7 M de frais bruts annualisés — ne se transmet donc pas mécaniquement au jeton CFG. Ce décalage est le principal handicap structurel empêchant le jeton de s'apprécier indépendamment du succès du protocole.

*Sources : <https://docs.centrifuge.io/getting-started/token-summary/> · <https://defillama.com/protocol/centrifuge> · <https://centrifuge.io/blog/cfg-token-migration-2025> · <https://www.stakingrewards.com/asset/centrifuge>*

#### Unlocks & inflation à venir — 57/100

**Résumé** : Une création de nouveaux jetons (« inflation ») documentée et modérée, à 3% par an, dirigée vers la trésorerie commune (Treasury) ; une libération progressive et planifiée des jetons (« vesting ») de façon linéaire, sans palier initial brutal (« cliff ») imminent — mais 44% de l'offre totale de jetons (« supply ») reste encore à libérer sur la période 2026-2030, ce qui constitue une pression vendeuse structurelle.

Les règles économiques du jeton CFG V3 (migré entre mai et décembre 2025) sont relativement lisibles. La création annuelle de nouveaux jetons à hauteur de 3% de l'offre totale (environ 20,7 M CFG par an, intégralement redirigés vers le Treasury DAO) représente une dilution annuelle — c'est-à-dire un effet de dépréciation pour les détenteurs existants — d'environ $4,8 M aux prix actuels : un montant modeste, prévisible, qui finance les opérations du protocole. La distribution restante (environ 44% de l'offre totale pas encore en circulation, soit environ 299 M jetons valorisés à $69,5 M aux prix actuels) se répartit ainsi : les incitations de la proposition CP149, en libération linéaire (« vesting ») jusqu'en avril 2029 ; l'équipe, en libération linéaire jusqu'en mai 2030 ; et la trésorerie de l'écosystème, partiellement bloquée (« locked »). Le prochain événement de déblocage de jetons (« unlock ») signalé par CryptoRank est prévu le 14 juillet 2026, représentant 1,33% de l'offre totale pour une valorisation de marché d'environ $17 M — gérable, mais à surveiller. Aucun palier de blocage initial inférieur à 90 jours (« cliff ») n'a été identifié, ce qui exclut un choc vendeur immédiat. En revanche, la pression vendeuse continue sur la période 2026-2030 est bien réelle. La fonction de création de jetons (« mint ») associée à cette inflation de 3% par an est une fonctionnalité documentée — mais le fait qu'elle soit contrôlée, depuis CP171, par la CNF plutôt que par la DAO elle-même mérite une vigilance particulière (voir la section sur les audits).

*Sources : <https://docs.centrifuge.io/getting-started/token-summary/> · <https://cryptorank.io/price/centrifuge/vesting> · <https://tokenomist.ai/centrifuge> · <https://centrifuge.io/blog/cfg-token-migration-2025>*

### Traction & adoption on-chain — 72/100 *(poids 20 % · red flags −3 pts (base 75/100))*

#### Ratio TVL/Market Cap — n/d

**Constat (déterministe)** : Pas de TVL applicable (protocole non-DeFi ou non suivi)

#### Tendance TVL 30j — n/d

**Constat (déterministe)** : Historique TVL indisponible

#### Frais & revenus du protocole — n/d

**Constat (déterministe)** : Pas de revenus mesurables

#### Adoption (selon narratif) — 75/100

**Résumé** : Une adoption institutionnelle hors-norme au regard d'une capitalisation boursière (« market cap ») de seulement $88 M : $1,63 Md de TVL, avec Janus Henderson, Apollo, S&P Dow Jones, Ethena et Coinbase comme partenaires — mais une base d'investisseurs particuliers très étroite et une concentration sur quelques grands apporteurs de fonds (« LP »).

Centrifuge affiche un profil d'adoption à deux vitesses. Côté institutionnel : une TVL de $1,63 Md (DeFi Llama, juin 2026), répartie entre Ethereum ($1,25 Md, soit 76%), Avalanche ($260 M, soit 16%) et Base ($59 M). JAAA (le produit de dette structurée noté AAA de Janus Henderson) totalise plus de $1 Md, dont $250 M déployés par Grove sur Avalanche seule. JTRSY (noté AA+, porté par Particula) dépasse $400 M. SPXA (S&P 500 tokenisé, en collaboration avec S&P Dow Jones Indices) et ACRDX (Apollo, $50 M) diversifient l'offre. Aave Horizon a choisi JAAA et JTRSY parmi ses cinq premiers partenaires, avec $100 M déposés dès la première semaine. Ethena a co-déployé $200 M sur JAAA sur Solana. Coinbase a investi stratégiquement dans Centrifuge et l'a désigné « Preferred Tokenization Infrastructure » (infrastructure de tokenisation privilégiée). La Tokenized Asset Coalition a décerné à Centrifuge les prix « Best Comeback » (meilleur retour) et « Largest Asset Allocation » (plus grande allocation d'actifs) pour 2025. Côté investisseurs particuliers (« retail »), en revanche : seulement 10 601 détenteurs du jeton CFG — un chiffre anémique pour un projet classé #291 — et un ratio volume d'échange quotidien / capitalisation boursière de 4,8%, confirmant un jeton peu échangé. La concentration de la TVL sur Grove à lui seul (environ 60%) constitue le principal risque pesant sur cette adoption.

*Sources : <https://defillama.com/protocol/centrifuge> · <https://centrifuge.io/blog/centrifuge-q3-2025-recap> · <https://cryptobriefing.com/centrifuge-ethena-jaaa-solana-200m/> · <https://www.tradingview.com/news/cointelegraph:43ff60972094b:0-centrifuge-tops-1b-tvl-as-institutions-drive-tokenized-rwa-boom-ceo/> · <https://centrifuge.io/blog/centrifuge-q2-2025-recap>*

### Marché & valorisation — 66/100 *(poids 15 %)*

#### Valorisation vs revenus (P/S) — n/d

**Constat (déterministe)** : Pas de revenus → multiple incalculable

#### Valorisation vs comparables — 66/100

**Résumé** : Le jeton de Centrifuge se négocie (« trade ») à 0,05 fois sa TVL, contre environ 0,35 fois pour Ondo Finance : c'est la décote du ratio TVL/capitalisation boursière (TVL/MC) la plus attractive du segment RWA, mais elle est structurellement justifiée par l'absence de mécanisme de capture de valeur pour le détenteur du jeton.

Le segment de la tokenisation de RWA compte trois comparables cotés pertinents. Ondo Finance (ONDO, $1,64 Md de capitalisation boursière / $3,38 Md de valorisation totale diluée, ou FDV — c'est-à-dire la valorisation si tous les jetons prévus étaient en circulation) est le leader du discours dominant sur ce segment : sa capitalisation boursière est 18,6 fois supérieure à celle de Centrifuge, avec un positionnement centré sur les bons du Trésor (« Treasuries ») et les actions tokenisées, et des mécanismes de valeur plus élaborés. Maple Finance (SYRUP, $162 M de capitalisation / $170 M de FDV) cible le crédit institutionnel natif de la crypto, avec un rendement de mise en jeu (« staking yield ») distribué aux détenteurs — sa valorisation est 1,8 fois supérieure à celle de Centrifuge pour une TVL nettement inférieure, mais avec une meilleure capture de valeur pour le jeton. Goldfinch (GFI, environ $44,6 M de capitalisation) opère dans le crédit aux marchés émergents et connaît un déclin structurel : sa part de marché dans le crédit privé est passée de 17,6% à 2,5%. Sur le ratio TVL/capitalisation boursière (TVL/MC), Centrifuge affiche un multiple de 18,5x ($1,63 Md de TVL pour $88 M de capitalisation) — nettement supérieur à celui d'Ondo (environ 2,4x). Cette décote profonde reflète, de façon rationnelle, l'absence de mécanisme de capture directe de valeur pour le détenteur de CFG. Si la DAO mettait en place un mécanisme de destruction de jetons ou de partage des revenus comparable à celui de Maple, une réévaluation du marché (« re-rating ») vers un ratio TVL/MC de 3 à 5 fois (soit $325-550 M de capitalisation) serait atteignable. Dans le scénario inverse, l'écart avec Ondo se creuserait si le discours dominant autour des bons du Trésor continue de capter l'essentiel des flux institutionnels.

| Projet | Market Cap | FDV | Commentaire |
|---|---|---|---|
| Ondo Finance (ONDO) | $1,64 Md | $3,38 Md | Leader du discours dominant sur les RWA et les bons du Trésor tokenisés, avec une capitalisation boursière 18,6 fois supérieure à celle de CFG, des mécanismes de capture de valeur pour le jeton plus élaborés, et une TVL supérieure à $4 Md |
| Maple Finance (SYRUP) | $162 M | $170 M | Crédit institutionnel natif de la crypto, avec un rendement de mise en jeu (« staking yield ») versé aux détenteurs ; capitalisation boursière environ 1,8 fois supérieure à celle de CFG, malgré une TVL inférieure |
| Goldfinch (GFI) | $44,6 M | n/d | Crédit aux marchés émergents, en déclin structurel (part de marché passée de 17,6% à 2,5%) ; capitalisation boursière équivalente à 0,5 fois celle de CFG |
| Centrifuge (CFG) | $88 M | $158 M | Ratio TVL/capitalisation boursière de 18,5x — le plus attractif du segment — mais une décote justifiée par l'absence de mécanisme de capture directe de valeur pour le jeton |

*Sources : <https://www.coingecko.com/en/coins/ondo> · <https://www.coingecko.com/en/coins/maple-finance> · <https://www.coingecko.com/en/coins/goldfinch> · <https://defillama.com/protocol/centrifuge>*

### Social & mindshare — 50/100 *(poids 10 % · red flags −3 pts (base 53/100))*

#### Activité développeurs (GitHub) — 65/100

**Constat (déterministe)** : 85 commits / 90j, 7 contributeurs

#### Mindshare & dynamique sociale — 43/100

**Résumé** : Une présence dans les conversations et l'attention du public (« mindshare ») fortement sous-développée pour un protocole gérant $1,63 Md de TVL : une visibilité croissante auprès des institutions, mais une audience d'investisseurs particuliers marginale, et des indicateurs sur les réseaux sociaux lacunaires.

La présence de Centrifuge dans l'attention du public est paradoxale : forte dans les cercles institutionnels (prix « Best Comeback » et « Largest Asset Allocation » de la Tokenized Asset Coalition pour 2025, couverture par The Defiant, CoinDesk, CryptoBriefing, Cointelegraph, Bloomberg Crypto), quasi inexistante auprès des investisseurs particuliers du monde crypto. Le nombre d'abonnés sur Twitter/X n'est pas disponible dans les données CoinGecko fournies — une situation inhabituellement lacunaire pour un projet classé #291, ce qui suggère une visibilité très limitée auprès du grand public. Telegram comptabilise plus de 11 000 abonnés (source CryptoRank) — un chiffre très faible pour $1,63 Md de TVL. L'inscription sur Coinbase (« listing », en septembre 2025) a généré une attention ponctuelle. Le discours autour des RWA est, en termes de flux institutionnels, le deuxième thème porteur après les fonds cotés (ETF) Bitcoin en 2025-2026, et Centrifuge est régulièrement cité dans les classements de référence (Bitcoin Foundation, MetaMask, CoinGape, MEXC). Néanmoins, Ondo Finance, BlackRock BUIDL et Securitize captent une part disproportionnée de l'attention du grand public. Le ratio volume d'échange quotidien / capitalisation boursière de 4,8% et les 10 601 détenteurs confirment un jeton détenu de façon passive et très peu échangé. L'activité de développement reste saine (85 contributions de code, ou « commits », en 90 jours, le dernier datant de moins de 24 heures), bien que l'équipe de développement soit réduite (7 contributeurs).

*Sources : <https://x.com/centrifuge> · <https://cryptorank.io/news/centrifuge> · <https://bitcoinfoundation.org/news/defi/top-rwa-crypto-projects-2026-ondo-maple-centrifuge/> · <https://www.cryptonewsnavigator.com/academy/article/centrifuge-rwa-infrastructure-tvl-institutional-pivot>*

### Sécurité & risques — 44/100 *(poids 10 % · red flags −23 pts (base 67/100))*

#### Sécurité du contrat (GoPlus) — 90/100

**Constat (déterministe)** : Taxes achat/vente : 0.0 % / 0.0 %

#### Concentration des holders — 30/100

**Constat (déterministe)** : Top 10 holders (hors contrats/locked) : 45.8 %

#### Audits & risques légaux — 59/100

**Résumé** : Des audits de sécurité par Trail of Bits et Sherlock, des tests automatisés continus de détection de failles (« fuzzing ») sur plus de $1 Md de TVL, et un directeur juridique dédié — des points positifs toutefois atténués par la centralisation de la gouvernance vers la CNF depuis CP171, et par un risque réglementaire persistant du côté de la SEC américaine et du cadre européen MiCA.

Sur le plan de la sécurité technique, le profil est acceptable : un audit par Trail of Bits (portant sur le nœud Substrate, le logiciel de l'ancienne infrastructure Polkadot, documenté dans le dépôt de code GitHub centrifuge/security), un audit par Sherlock (portant sur les contrats intelligents — « smart contracts », des programmes qui s'exécutent automatiquement sur la blockchain — de la V3, en 2025), des tests automatisés continus de détection de failles (« fuzzing ») via Recon (Echidna, Medusa, Foundry) sur plus de $1 Md de TVL, et un programme actif de récompense pour la détection de failles (« bug bounty »). Aucune faille majeure exploitée par un attaquant n'a été recensée dans les recherches. Le signalement de l'outil GoPlus selon lequel le jeton serait « mintable avec un propriétaire caché » correspond en réalité au mécanisme d'inflation documenté de 3% par an — et non à une arnaque où les fondateurs disparaîtraient avec les fonds (un « rug pull ») — mais le fait que ce mécanisme de création de jetons soit contrôlé, depuis CP171 (novembre 2025), par la Centrifuge Network Foundation (CNF, une entité en dehors de la blockchain) plutôt que par la DAO directement sur la blockchain constitue un risque réel de centralisation : la CNF peut en théorie créer de nouveaux jetons sans l'approbation de la DAO, cette dernière ne conservant que « la capacité de reprendre les opérations à terme ». Sur le plan légal, la présence d'un directeur juridique dédié (Eli Cohen) est un atout structurel rare. Les risques réglementaires non résolus incluent : (1) une classification potentielle par la SEC américaine des jetons RWA comme valeurs mobilières non enregistrées ; (2) la conformité avec le cadre réglementaire européen MiCA (pleinement applicable depuis décembre 2024), Centrifuge étant actif en Europe ; (3) les trois litiges en dehors de la blockchain (« off-chain ») survenus en 2025, qui révèlent les limites de l'exécution automatique des contrats (« enforcement on-chain ») pour les RWA.

*Sources : <https://github.com/centrifuge/security/blob/main/audits/node/Trail-of-Bits-Audit.pdf> · <https://docs.centrifuge.io/getting-started/token-summary/> · <https://centrifuge.io/blog/cfg-token-migration-2025> · <https://sherlock.xyz/post/top-10-best-smart-contract-auditing-companies-in-2026>*

## Déclencheurs de la thèse

**Catalyseurs positifs à surveiller :**
- [ ] La mise en place par la DAO d'un mécanisme de destruction de jetons (« burn », qui réduit l'offre en circulation) ou de distribution des revenus du protocole vers les détenteurs de CFG — un groupe consultatif dédié, le Treasury Advisory Group (TAG), explore déjà activement ce type de modèles. Ce serait un catalyseur de réévaluation immédiate par le marché (« re-rating »), potentiellement de 3 à 5 fois la valorisation actuelle
- [ ] Le franchissement du seuil de $2 Md de valeur déposée (TVL) grâce à de nouveaux déploiements institutionnels d'une ampleur comparable au milliard de dollars déjà apporté par Grove sur le produit JAAA, ce qui validerait la thèse d'une croissance organique en 2026
- [ ] Une clarification réglementaire de la part du gendarme financier américain (la SEC) sur le statut des jetons RWA, ou l'obtention d'une licence au titre du cadre réglementaire européen sur les crypto-actifs (MiCA) — cela lèverait le principal obstacle légal et ouvrirait l'accès aux marchés institutionnels américains et européens
- [ ] L'élargissement des intégrations « deRWA » (les RWA utilisés directement dans la finance décentralisée, ou DeFi, c'est-à-dire des services financiers fonctionnant directement sur la blockchain sans intermédiaire traditionnel), avec JAAA et JTRSY acceptés comme garantie (« collatéral ») sur Aave Horizon, Kamino, Lulo et Raydium — ce qui générerait une demande venant directement de cet écosystème pour les produits Centrifuge, et indirectement pour le jeton CFG
- [ ] L'atteinte de l'objectif de $15 M de revenus annualisés pour le protocole en 2026 (contre $5,15 M actuellement), ce qui démontrerait que le modèle économique peut monter en puissance (sa « scalabilité ») et justifierait une revalorisation des multiples appliqués au jeton

**Signaux d'invalidation :**
- [ ] Un retrait ou une réallocation des fonds déposés par Grove (environ $1 Md ou plus, soit environ 60% de la TVL) — ce qui ferait chuter la valeur totale déposée en dessous de $700 M et invaliderait la thèse d'une adoption institutionnelle solide et durable
- [ ] Une décision du régulateur américain (la SEC) classant les jetons RWA comme des valeurs mobilières non enregistrées — ce qui imposerait des restrictions d'accès aux investisseurs américains et remettrait en cause le modèle de distribution de JAAA, SPXA et ACRDX
- [ ] Le maintien, malgré la croissance de la TVL, de l'absence de mécanisme de capture de valeur pour le jeton CFG : si la DAO ne vote pas de partage des revenus (« fee-sharing ») d'ici fin 2026, la décote structurelle face à Ondo (qui se négocie 18,6 fois plus cher) pourrait encore se creuser
- [ ] Un incident de sécurité majeur touchant les coffres numériques (« vaults ») de la version V3 sur Ethereum — la première faille exploitée par un attaquant (« exploit ») depuis la migration porterait une atteinte irrémédiable à la confiance institutionnelle, qui constitue l'avantage compétitif central du projet
- [ ] L'émergence d'une infrastructure concurrente (BlackRock BUIDL, Coinbase Prime Tokenization, Securitize) qui capterait les nouveaux mandats institutionnels dans le RWA et marginaliserait Centrifuge dans la course pour devenir le standard de référence

## Annexe — Données brutes

| Métrique | Valeur | Source |
|---|---|---|
| Prix | $0.2326 | CoinGecko |
| Market Cap | $88.39 M | CoinGecko |
| FDV | $158.01 M | CoinGecko |
| MC/FDV | 0.56 | CoinGecko |
| Rang Market Cap | 291 | CoinGecko |
| Volume 24h | $4.28 M | CoinGecko |
| Volume/MC | 4.8 % | CoinGecko |
| ATH | $0.4004 (2025-08-24) | CoinGecko |
| Drawdown vs ATH | -41.9 % | CoinGecko |
| Offre circulante | 380 384 016 (56 % du max) | CoinGecko |
| Variation prix 30j | -15.4 % | CoinGecko |
| TVL | n/d | DeFiLlama |
| TVL/MC | n/d | DeFiLlama |
| Tendance TVL 30j | n/d | DeFiLlama |
| Frais 30j | n/d | DeFiLlama |
| Revenus 30j | n/d | DeFiLlama |
| P/S annualisé | n/d | CoinGecko+DeFiLlama |
| Holders | 10 601 | GoPlus |
| Top 10 holders | 45.8 % | GoPlus |
| Taxes achat/vente | 0.0 % / 0.0 % | GoPlus |
| Commits GitHub 90j | 85 | GitHub |
| Contributeurs GitHub | 7 | GitHub |
| Followers Twitter/X | n/d | CoinGecko |

*Données récupérées le 30/06/2026 20:29:27 via CoinGecko API, GoPlus Security API, GitHub API.*

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