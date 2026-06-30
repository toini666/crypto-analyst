# Nervos Network (CKB) — Analyse de due diligence

> Générée le 2026-06-22 · Méthodologie v2.0.0 · Confiance des données : **moyenne** · Id CoinGecko : `nervos-network`

## Executive Summary

**Nervos Network** — Nervos Network est un protocole blockchain à deux couches. Sa couche de base — appelée Layer 1, ou L1, la fondation qui sécurise et enregistre toutes les transactions — porte le nom de CKB (Common Knowledge Base) : c'est une blockchain fonctionnant en preuve de travail (PoW, un mécanisme où des « mineurs » valident les transactions en résolvant des calculs complexes), construite sur un modèle UTXO étendu (un mode de comptabilité, utilisé aussi par Bitcoin, qui suit des unités de valeur individuelles plutôt qu'un simple solde de compte), et optimisée pour la sécurité et la résistance à la censure. Depuis 2023, le projet se repositionne comme infrastructure pour le BTCFi (la finance décentralisée construite autour de Bitcoin), en s'appuyant sur le protocole RGB++ pour rendre Bitcoin nativement « programmable » (capable d'exécuter des règles automatisées), et sur le Fiber Network, un réseau de paiement compatible avec le Lightning Network (le système qui permet des paiements Bitcoin rapides et peu coûteux en dehors de la blockchain principale).

*Narratif : L1*

### Verdict : 🟡 À surveiller — Score global : **45/100**

> ⚠️ **Red flags** : −7 pts imputés aux piliers concernés (score avant red flags : 52/100).

| Pilier | Poids | Score | Red flags | Couverture données |
|---|---|---|---|---|
| **Fondamentaux** | 20 % | 60/100 | −3 pts | 100 % |
| **Tokenomics & capture de valeur** | 25 % | 71/100 | −3 pts | 100 % |
| **Traction & adoption on-chain** | 20 % | 18/100 | −14 pts | 30 % |
| **Marché & valorisation** | 15 % | 34/100 | −3 pts | 70 % |
| **Social & mindshare** | 10 % | 43/100 | −3 pts | 100 % |
| **Sécurité & risques** | 10 % | 27/100 | −17 pts | 35 % |

**Forces principales :**
- Des fondateurs de calibre, issus du cœur du développement d'Ethereum (Jan Xie, contributeur aux travaux Casper et sharding, deux briques techniques majeures d'Ethereum), soutenus par des investisseurs de tout premier rang (Sequoia China, Polychain, Multicoin, Dragonfly), et un protocole de base (L1) jamais piraté en 7 ans
- Une architecture centrée sur le modèle UTXO et un protocole RGB++ techniquement supérieurs pour faire communiquer Bitcoin avec d'autres systèmes sans dépositaire central (« non-custodial » : sans intermédiaire qui détient les fonds à la place de l'utilisateur), face aux ponts inter-blockchains classiques
- Une tokenomics dotée d'un mécanisme de « rente d'état » (le NervosDAO — où les détenteurs déposent leurs tokens — et l'émission secondaire, la création continue de nouveaux tokens) qui impose une véritable captation de valeur économique, allant au-delà du simple droit de vote sur les décisions du protocole (gouvernance pure)

**Faiblesses principales :**
- Une adoption quasi nulle dans les faits : ~5 transactions RGB++ quotidiennes et 436 transactions totales au T1 2025 (premier trimestre 2025), malgré 400+ dApps (applications décentralisées) annoncées — une infrastructure sans trafic
- Le hack de Force Bridge en juin 2025 ($3,9M volés), combiné à un audit signé CertiK datant de 2020 et à l'absence de programme de récompense pour la détection de failles (« bug bounty ») — un profil de sécurité de l'écosystème dégradé
- Une équipe très réduite (~5 employés), aucune levée de fonds depuis 2019, et un fonctionnement hors du standard EVM : une triple barrière à l'exécution et à l'adoption par les développeurs, face à des rivaux comme Stacks et les réseaux Bitcoin de couche 2 (L2 — des réseaux secondaires construits au-dessus d'une blockchain principale pour la rendre plus rapide et moins coûteuse) compatibles EVM

**Thèse d'investissement** : CKB est un protocole de couche de base (L1) que cette analyse juge sous-évalué à $51M. Il dispose d'une architecture centrée sur le modèle UTXO techniquement cohérente pour le BTCFi, d'un soutien historique d'investisseurs de tout premier plan (Sequoia China, Polychain, Multicoin), et d'une tokenomics (les règles économiques qui régissent le token) qui capte une valeur réelle grâce à un mécanisme de « rente d'état » — les détenteurs sont récompensés pour immobiliser leurs tokens en échange de l'utilisation de l'espace de stockage de la blockchain. Autant d'atouts qui justifieraient une valorisation plus élevée si l'adoption se concrétise. La thèse est validée si les transactions RGB++ renouent avec une croissance soutenue (>50/jour) et si le Fiber Network génère une valeur totale verrouillée (TVL — le montant total des actifs déposés dans un protocole) mesurable en H2 2026 (second semestre 2026) ; elle est invalidée si l'usage de RGB++ reste anémique (~5 transactions/jour), ce qui confirmerait un écosystème de façade sans traction réelle, au profit de concurrents compatibles avec l'EVM (la machine virtuelle d'Ethereum, le standard technique utilisé par la plupart des blockchains rivales pour faire tourner leurs applications) mieux adoptés.

## Red Flags

| Sévérité | Signal | Détail | Source |
|---|---|---|---|
| 🟧 Majeur | RGB++ : ~5/jour de transactions au T2 2025 — un usage effectif anémique malgré 400+ dApps annoncées, signe d'une adoption qui ne s'inscrit pas dans la durée | — | Analyse qualitative (sourcée) |
| 🟧 Majeur | Le hack de Force Bridge en juin 2025 — $3,9M volés via la compromission de clés privées, des fonds ensuite blanchis via Tornado Cash | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Prix > 90 % sous l'ATH | -98 % depuis l'ATH | CoinGecko |
| 🟨 Mineur | Une équipe opérationnelle très réduite (~5 employés actifs selon Tracxn) pour un protocole de couche de base (L1) en concurrence intense | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Une émission secondaire perpétuelle, sans plafond final sur l'offre totale (« supply cap ») — une dilution résiduelle structurelle pour les détenteurs qui ne déposent pas leurs tokens dans le NervosDAO | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Une couverture médiatique 2025-2026 dominée par le hack de Force Bridge — une réputation auprès du grand public durablement dégradée | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Un audit CertiK datant d'avril 2020 (6+ ans) et l'absence de programme actif de récompense pour la détection de failles, malgré les évolutions majeures du protocole | — | Analyse qualitative (sourcée) |

## Analyse détaillée par pilier

### Fondamentaux — 60/100 *(poids 20 % · red flags −3 pts (base 63/100))*

#### Problème, solution & nécessité blockchain — 63/100

**Résumé** : Une architecture UTXO étendue élégante et un protocole RGB++ techniquement novateur, mais ce positionnement de « couche 2 Bitcoin » arrive dans un écosystème déjà saturé.

CKB répond au « trilemme » des blockchains (le compromis classique entre sécurité, décentralisation et capacité de traitement que toute blockchain doit arbitrer) en séparant la vérification (assurée par la couche de base, L1) du calcul (effectué sur des couches secondaires). Son « Cell Model » étend le modèle UTXO de Bitcoin pour permettre des scripts de validation personnalisés via CKB-VM (un environnement d'exécution basé sur l'architecture RISC-V), ce qui le rend plus facile à auditer qu'un EVM tout en restant « Turing-complet » (capable d'exécuter n'importe quel type de programme informatique). Le protocole RGB++ exploite une parenté technique entre les modèles UTXO de CKB et de Bitcoin pour permettre l'émission et le transfert d'actifs directement sur Bitcoin, avec une vérification de l'état sur CKB, sans passer par un pont géré par un tiers de confiance (pont « custodial ») — une approche techniquement supérieure aux ponts inter-blockchains classiques. Le Fiber Network (multi-actifs, compatible Lightning) complète cette offre BTCFi. Ces choix d'architecture sont cohérents et pensés sur le long terme, avec une attention constante portée à la sécurité et à la décentralisation. Toutefois, le virage vers le récit de « couche 2 Bitcoin » est intervenu tardivement (2023-2024), dans un espace déjà occupé par Stacks (sBTC), Rootstock (RSK), Lightning, BOB et Merlin Chain. CKB doit convaincre les développeurs d'adopter un modèle UTXO en dehors du standard EVM, ce qui crée une vraie barrière à l'adoption dans un marché où l'EVM s'est imposé comme la norme de fait. La proposition de valeur est authentique, mais son calendrier face à la concurrence est défavorable.

*Sources : <https://www.nervos.org/knowledge-base/Understanding_Bitcoin_layer2_(explainCKBot)> · <https://docs.nervos.org/docs/tech-explanation/rgbpp> · <https://bingx.com/en/learn/article/what-are-the-top-bitcoin-layer-2-networks-to-watch> · <https://www.nervos.org/knowledge-base/ultimate_guide_bitcoin_layer_two_part_1>*

#### Équipe, investisseurs & financement — 70/100

**Résumé** : Des fondateurs de calibre, issus du cœur du développement d'Ethereum, avec un soutien historique d'investisseurs de tout premier rang, mais une équipe opérationnelle aujourd'hui très réduite et une trésorerie peu transparente.

Jan Xie, cofondateur et architecte en chef, est l'un des rares développeurs chinois à avoir intégré l'équipe centrale d'Ethereum, où il a contribué aux travaux Casper et sharding (deux briques techniques majeures du développement d'Ethereum), aux côtés de Vitalik Buterin. Il a cofondé EthFans (la plus grande communauté Ethereum de Chine) et Cryptape (2016), un studio de recherche blockchain. Terry Tai (CEO), Kevin Wang et Daniel Lv complètent une équipe fondatrice dont la crédibilité technique est réelle. La levée de fonds de 28M$ (juillet 2018) a réuni une liste d'investisseurs de premier plan rarement vue pour un projet de cette époque : Sequoia Capital China, Polychain Capital, Multicoin Capital, Blockchain Capital, Dragonfly Capital, Wanxiang, Breyer Capital, FBG Capital et Matrix Partners China. La vente publique de tokens (ICO, pour « initial coin offering ») de 2019 a levé un montant supplémentaire estimé à ~72M$, avec la participation de HashKey Capital et CMB Bank. En revanche, la plateforme Tracxn ne recense aujourd'hui que 5 employés actifs — un effectif insuffisant pour un protocole de couche de base (L1) en concurrence avec des équipes bien mieux dotées. Aucune levée de fonds récente n'est documentée depuis 2019, ce qui interroge sur la trésorerie opérationnelle de la Nervos Foundation, même si la Community Catalyst, lancée en 2025, signale une délégation croissante à la communauté.

*Sources : <https://medium.com/nervosnetwork/nervos-welcomes-polychain-sequoia-capital-as-strategic-investors-faf040752f84> · <https://cointelegraph.com/news/nervos-network-blockchain-startup-secures-28-mln-from-sequoia-china-polychain-capital> · <https://tracxn.com/d/companies/nervos-network/__jdxzbi0GIHXsPSJkNwPRgAbUkX-9V9hkp_1PLg0Uohc> · <https://iq.wiki/wiki/jan-xie> · <https://medium.com/dragonfly-research/our-investment-in-nervos-27df40dac7c9>*

#### Exécution de la roadmap — 53/100

**Résumé** : Les livrables techniques sont au rendez-vous en 2025-2026, mais les indicateurs d'adoption restent en déclin persistant, ce qui contredit le récit du BTCFi.

L'équipe a tenu ses engagements techniques majeurs : lancement du Fiber Network en mainnet (le réseau principal, en production réelle, par opposition à un réseau de test) en février 2025, avec des canaux de paiement multi-actifs et des échanges instantanés entre actifs sans intermédiaire (« atomic swaps ») ; mise à jour majeure du protocole (« hard fork », qui change les règles du système) baptisée Meepo en juillet 2025, approuvée à 100% par les mineurs ; gouvernance de la DAO opérationnelle en mainnet à la mi-février 2026 ; et hackathon dédié à l'IA, « Claw & Order », en mars 2026. L'activité sur GitHub (la plateforme où le code est partagé publiquement) reste soutenue, avec 63 contributions de code (« commits ») en 90 jours, 67 contributeurs et un dernier commit il y a 3 jours — autant de signes d'un développement actif. Cependant, les indicateurs d'usage contredisent ce récit : les transactions RGB++ sont tombées à seulement 436 au T1 2025 (-78,6% par rapport au trimestre précédent), et la moyenne quotidienne de transactions Bitcoin via RGB++ n'atteignait qu'~5/jour au T2 2025. Les nouveaux dépôts dans le NervosDAO ont chuté de 37,9% par rapport au trimestre précédent au T1 2025. KuCoin a retiré CKB de son offre de trading sur marge en mai 2026. Ces données révèlent un net décalage entre une exécution technique solide et une traction réelle de l'écosystème encore faible — un schéma typique d'une adoption ponctuelle plutôt que durable.

*Sources : <https://messari.io/report/state-of-nervos-network-q1-2025> · <https://messari.io/report/state-of-nervos-q2-2025> · <https://www.nervos.org/journey> · <https://www.ainvest.com/news/nervos-network-ckb-price-prediction-2026-2030-strategic-upgrades-drive-breakout-2601/> · <https://www.kucoin.com/announcement/kucoin-margin-notice-260113>*

### Tokenomics & capture de valeur — 71/100 *(poids 25 % · red flags −3 pts (base 74/100))*

#### Dilution (MC/FDV, offre circulante) — 95/100

**Constat (déterministe)** : MC/FDV = 0.98 (offre circulante : 98 %)

#### Utilité du token & capture de valeur — 60/100

**Résumé** : Le mécanisme de « rente d'état » du Cell Model est techniquement supérieur à un simple droit de vote (gouvernance pure), mais il reste théorique tant que l'adoption ne suit pas.

CKB dispose d'un mécanisme de captation de valeur qui va bien au-delà du simple droit de vote, et qui mérite un examen sérieux. Premièrement, occuper de l'espace de stockage sur la blockchain exige de détenir des CKB (1 CKByte de tokens équivaut à 1 byte d'espace de stockage), ce qui crée une demande structurelle proportionnelle à la croissance des données enregistrées sur la chaîne. Deuxièmement, l'émission secondaire — la création continue de nouveaux tokens, fixée à 1,344 milliard de CKB/an — dilue mécaniquement (la part de chaque détenteur existant diminue quand de nouveaux tokens sont créés) ceux qui ne participent pas au NervosDAO : ce mécanisme fonctionne comme une taxe implicite sur l'espace de stockage inactif, tandis que les détenteurs ayant déposé leurs tokens dans le NervosDAO reçoivent leur part de cette émission, ce qui constitue un rendement réel. Troisièmement, les droits de vote (gouvernance), activés depuis février 2026, ajoutent une dimension participative. Ce design — appelé « digital real estate » (littéralement « immobilier numérique ») — crée une incitation économique réelle à détenir activement des tokens. Ce mécanisme ne délivre toutefois de la valeur que si l'espace de stockage de CKB est réellement occupé par une activité croissante. Or, avec ~5 transactions RGB++ quotidiennes, la demande effective d'espace de stockage reste anémique. La captation de valeur est conceptuellement solide, mais elle n'est pas encore validée empiriquement par l'adoption.

*Sources : <https://www.nervos.org/knowledge-base/tokenomics_of_nervos_network> · <https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md> · <https://tokenomist.ai/nervos-network> · <https://research.binance.com/en/projects/nervos-network>*

#### Unlocks & inflation à venir — 74/100

**Résumé** : Aucun déblocage de tokens (« unlock », la libération progressive de tokens initialement bloqués, par exemple ceux alloués à l'équipe ou aux investisseurs) à venir ; l'inflation totale est estimée à ~5-7%/an, atténuée par le NervosDAO pour les détenteurs actifs.

Tokenomist.ai (une plateforme qui suit les calendriers de déblocage de tokens) confirme que la totalité des tokens de Nervos Network est désormais en circulation libre : les calendriers de déblocage progressif (« vesting ») de l'équipe (15%, 4 ans depuis nov. 2019), des partenaires fondateurs (5%, 4 ans) et de l'écosystème (10%, 2 ans) sont tous arrivés à leur terme fin 2023. Le ratio MC/FDV — le rapport entre la capitalisation boursière actuelle (MC, market cap) et la capitalisation totale diluée (FDV, fully diluted valuation, c'est-à-dire la valorisation si l'ensemble des tokens prévus était déjà en circulation) — de 0,9836 confirme que la quasi-totalité des tokens est déjà en circulation, avec un risque de pression vendeuse future lié aux tokens pas encore en circulation (« overhang ») négligeable. L'inflation provient de deux sources : l'émission primaire, plafonnée à 33,6 milliards de CKB et divisée par deux tous les 4 ans (dernier halving en nov. 2023, prochain en nov. 2027), et l'émission secondaire, fixe et perpétuelle, de 1,344 milliard de CKB/an. Sur la supply (l'offre totale de tokens) actuelle de ~49 milliards, l'émission secondaire représente ~2,7%/an. En y ajoutant l'émission primaire post-halving estimée (~2,1 milliards/an), l'inflation totale se situe autour de 5-7%/an — bien en deçà du seuil d'alerte de 20%. Le mécanisme du NervosDAO protège de la dilution les détenteurs qui y déposent leurs CKB, en leur redistribuant une part de l'émission secondaire. L'absence de plafond final sur l'offre totale (« supply cap » — l'émission secondaire étant perpétuelle) est un choix de conception délibéré, destiné à financer les mineurs sur le très long terme, mais cela représente un risque résiduel de dilution pour les détenteurs qui ne participent pas au NervosDAO.

*Sources : <https://tokenomist.ai/nervos-network> · <https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md> · <https://tokentrack.co/tokens/nervos> · <https://www.nervos.org/ckbpage>*

### Traction & adoption on-chain — 18/100 *(poids 20 % · red flags −14 pts (base 32/100))*

#### Ratio TVL/Market Cap — n/d

**Constat (déterministe)** : Pas de TVL applicable (protocole non-DeFi ou non suivi)

#### Tendance TVL 30j — n/d

**Constat (déterministe)** : Historique TVL indisponible

#### Frais & revenus du protocole — n/d

**Constat (déterministe)** : Pas de revenus mesurables

#### Adoption (selon narratif) — 32/100

**Résumé** : 400+ dApps et 662K adresses mis en avant, mais ~5 transactions RGB++ par jour révèlent une adoption de façade, sans usage réel.

Les chiffres de surface paraissent encourageants : 662 000 adresses uniques cumulées sur RGB++ et plus de 400 dApps recensées à juillet 2025, portées par un pic historique (+487% par rapport au trimestre précédent, au T3 2024). Le Fiber Network est en production depuis février 2025, la gouvernance de la DAO est opérationnelle depuis février 2026, et Rosen Bridge a remplacé Force Bridge comme solution de pont inter-chaînes depuis janvier 2026. Ces étapes sont bien réelles. Mais les indicateurs d'usage effondrent ce récit : les transactions RGB++ sont tombées à 436 unités pour tout le T1 2025 (-78,6% par rapport au trimestre précédent), et la moyenne de transactions Bitcoin quotidiennes via RGB++ n'atteignait qu'~5/jour au T2 2025 — un niveau d'utilisation très faible pour un protocole censé révolutionner le BTCFi. Les nouveaux dépôts dans le NervosDAO ont chuté de 37,9% par rapport au trimestre précédent au T1 2025. Les données quantitatives disponibles confirment l'absence de TVL documentée (non disponible), un volume/MC à 4,2%, et un nombre de détenteurs non communiqué. L'écosystème ressemble à une infrastructure sans trafic : des routes bien construites, mais presque personne ne les emprunte. L'adoption réelle reste le principal risque de cette thèse d'investissement.

*Sources : <https://messari.io/report/state-of-nervos-network-q1-2025> · <https://messari.io/report/state-of-nervos-q2-2025> · <https://www.cryptonewsnavigator.com/academy/article/nervos-network-ckb-on-chain-accumulation-signals-rgbpp-2026> · <https://crypto.news/nervos-networks-ckb-up-56-amid-launch-of-rgb-client-for-bitcoin/>*

### Marché & valorisation — 34/100 *(poids 15 % · red flags −3 pts (base 37/100))*

#### Valorisation vs revenus (P/S) — n/d

**Constat (déterministe)** : Pas de revenus → multiple incalculable

#### Valorisation vs comparables — 37/100

**Résumé** : CKB ($51M) se négocie avec une décote de 6,5x par rapport à Stacks ($333M) pour un narratif BTCFi similaire, mais l'écart d'exécution et d'adoption entre les deux est bien réel.

Le comparable le plus direct de CKB est Stacks (STX), un protocole de couche 2 Bitcoin (L2) fondé sur le mécanisme « Proof of Transfer », les contrats intelligents Clarity et le système sBTC. Stacks affiche une capitalisation boursière d'~$333M (CoinGecko, juin 2026), soit 6,5x celle de CKB, avec un TVL sBTC de $437M au T1 2026, une intégration au Grayscale Trust (un fonds d'investissement coté en bourse), un support de Fireblocks (une plateforme de garde d'actifs numériques pour institutions) pour 2 400+ clients institutionnels, et un partenariat avec Circle (l'émetteur du stablecoin USDC) — autant de signaux d'adoption institutionnelle structurellement absents chez CKB. Rootstock (RSK), une chaîne parallèle (« sidechain ») Bitcoin compatible EVM avec ~$160M de TVL, n'a pas de token spéculatif propre (elle utilise le RBTC, indexé sur le BTC) et n'est donc pas directement comparable sur la valeur du token. Merlin Chain (MERL), une couche 2 Bitcoin compatible EVM lancée en 2024 avec une forte traction initiale, est également en compétition directe, mais les données de capitalisation boursière disponibles sont insuffisantes pour une comparaison fiable. CKB se distingue par une approche centrée sur le modèle UTXO, en dehors du standard EVM, techniquement supérieure pour l'interopérabilité avec Bitcoin, mais cette différenciation technique est difficile à monétiser face à l'avance institutionnelle de Stacks. Le ratio de valorisation CKB/STX, à ~0,15x, reflète cet écart d'exécution.

| Projet | Market Cap | FDV | Commentaire |
|---|---|---|---|
| Stacks (STX) | ~$333M | ~$333M | Un concurrent direct sur le segment Bitcoin de couche 2 (L2) — un TVL sBTC de $437M (T1 2026), une intégration au Grayscale Trust et un support institutionnel via Fireblocks : une avance décisive sur CKB |
| Rootstock (RSK/RBTC) | N/A (RBTC = BTC-peggé, sans token spéculatif) | N/A | Une chaîne parallèle (« sidechain ») Bitcoin compatible EVM, avec un TVL d'~$160M ; un concurrent sur l'usage, mais non comparable sur la valeur du token |
| Merlin Chain (MERL) | nd | nd | Une couche 2 Bitcoin compatible EVM lancée en 2024, avec une forte traction initiale ; les données de capitalisation boursière disponibles restent insuffisantes pour une comparaison fiable à ce jour |

*Sources : <https://www.coingecko.com/en/coins/stacks> · <https://coinmarketcap.com/currencies/stacks/> · <https://bingx.com/en/learn/article/what-are-the-top-bitcoin-layer-2-networks-to-watch> · <https://www.nervos.org/knowledge-base/ultimate_guide_bitcoin_layer_two_part_1>*

### Social & mindshare — 43/100 *(poids 10 % · red flags −3 pts (base 46/100))*

#### Activité développeurs (GitHub) — 65/100

**Constat (déterministe)** : 63 commits / 90j, 67 contributeurs

#### Mindshare & dynamique sociale — 30/100

**Résumé** : Une notoriété (« mindshare ») très faible : la couverture médiatique est dominée par le hack de Force Bridge, et la communauté technique, bien qu'active, reste invisible du grand public.

Les indicateurs de notoriété (« mindshare » : la part d'attention qu'un projet capte dans les discussions et les médias, par rapport à ses concurrents) sont quasi inexistants dans les données disponibles : le nombre d'abonnés Twitter n'a pas été collecté via l'API de CoinGecko (la source de données de marché utilisée), et le volume/MC à 4,2% témoigne d'une liquidité structurellement insuffisante. L'analyse qualitative confirme que ce projet reste hors des radars du grand public. La couverture médiatique en 2025-2026 est principalement liée au hack de Force Bridge (juin 2025, $3,9M — relayé par The Block, CryptoNews, The Defiant, Halborn), ce qui génère une notoriété à dominante négative. Les étapes positives (mainnet du Fiber Network, gouvernance de la DAO, hard fork Meepo) n'ont pas atteint les audiences grand public. CKCON25 (décembre 2025) et le hackathon dédié à l'IA (mars 2026) témoignent d'une communauté de développeurs engagée — via NervosNation sur Twitter ou les forums Talk.nervos — mais ce public reste une niche technique. Dans les discussions BTCFi de 2026, Stacks et le Lightning Network dominent la conversation, laissant CKB en position de suiveur jusque dans son propre récit. La Nervos Community Catalyst (micro-subventions, rencontres CKB Off-Chain, CKBoost) est une stratégie cohérente partant de la base, mais sans les moyens marketing nécessaires pour inverser cette dynamique.

*Sources : <https://www.coincarp.com/currencies/nervosckb/socials/> · <https://coinmarketcap.com/cmc-ai/nervos-network/latest-updates/> · <https://twitter.com/nervosnation> · <https://cryptorank.io/news/nervos> · <https://www.theblock.co/post/356535/hackers-drain-over-3-million-in-crypto-from-nervos-networks-force-cross-chain-bridge-say-security-analysts>*

### Sécurité & risques — 27/100 *(poids 10 % · red flags −17 pts (base 44/100))*

#### Sécurité du contrat (GoPlus) — n/d

**Constat (déterministe)** : Contrat non analysable (token natif ou chain non couverte)

#### Concentration des holders — n/d

**Constat (déterministe)** : Distribution des holders indisponible

#### Audits & risques légaux — 44/100

**Résumé** : Un protocole de base (L1) jamais piraté depuis 2019, mais un audit signé CertiK datant de 2020 (6 ans), l'absence de programme de récompense pour la détection de failles, et un hack de $3,9M sur Force Bridge en juin 2025.

Le protocole CKB affiche un bilan de sécurité propre côté couche de base (L1) : aucun piratage du protocole central en 7 ans d'opération en mainnet (depuis novembre 2019). L'audit signé CertiK affiche un score de sécurité « Skynet » (le système de notation propre à CertiK) de 86,15 (note A), sans aucune faille critique, majeure, moyenne ou mineure identifiée. Un audit complémentaire, réalisé par Least Authority (un cabinet spécialisé en cryptographie), couvre la couche protocolaire. Le recours à la preuve de travail (PoW) avec l'algorithme Eaglesong (résistant aux machines de minage spécialisées, dites ASIC) et au Cell Model basé sur RISC-V réduit la surface d'attaque. Toutefois, l'audit CertiK date d'avril 2020, soit plus de 6 ans sans nouvel audit formel — une lacune préoccupante pour un protocole en pleine évolution (Fiber Network, RGB++, hard fork Meepo). Aucun programme actif de récompense pour la détection de failles (« bug bounty ») n'est répertorié par CertiK. Le hack de Force Bridge, survenu le 2 juin 2025, constitue le signal d'alerte majeur de l'écosystème : $3,9M ont été volés (en ETH, USDC, USDT, DAI, WBTC) après la compromission des clés privées (les codes secrets qui donnent le contrôle des fonds) de Magickbase, l'opérateur communautaire du pont, les fonds étant ensuite blanchis via Tornado Cash et FixedFloat (des outils utilisés pour brouiller la traçabilité des fonds volés). Circonstance aggravante : l'annonce de la fermeture programmée du pont datait du 31 mai 2025, soit un jour avant les faits. KuCoin a retiré CKB de son offre de trading sur marge en mai 2026. Aucune procédure légale connue n'est associée au projet.

*Sources : <https://skynet.certik.com/projects/nervos> · <https://medium.com/nervosnetwork/nervos-ckb-security-audit-complete-1e7a7561cfb6> · <https://www.halborn.com/blog/post/explained-the-force-bridge-hack-june-2025> · <https://crypto.news/nervos-network-suffers-major-exploit-as-3-9m-in-crypto-is-stolen-from-force-bridge/> · <https://www.kucoin.com/announcement/kucoin-margin-notice-260113>*

## Déclencheurs de la thèse

**Catalyseurs positifs à surveiller :**
- [ ] Une reprise structurelle des transactions RGB++ en H2 2026, portée par une gouvernance active de la DAO (l'organisation où les détenteurs de tokens votent les décisions) et la maturité du Fiber Network — ce qui validerait le scénario BTCFi
- [ ] Le prochain halving (réduction de moitié programmée) de l'émission primaire de CKB (~novembre 2027), qui réduit mécaniquement la pression de vente exercée par les mineurs
- [ ] Une adoption institutionnelle du BTCFi qui rejaillirait sur la notoriété de CKB/RGB++ en tant qu'infrastructure Bitcoin native et sans dépositaire central
- [ ] L'intégration de nouvelles grandes plateformes d'échange, ou un retour du trading sur marge (emprunter des fonds pour amplifier ses positions) sur KuCoin, après une refonte du profil de risque consécutive à l'affaire Force Bridge
- [ ] Le lancement d'un programme de récompense pour la détection de failles (bug bounty) et d'un nouvel audit de sécurité majeur, qui restaurerait la confiance des développeurs institutionnels

**Signaux d'invalidation :**
- [ ] Le maintien des transactions RGB++ sous 10/jour malgré la DAO et le Fiber Network — une invalidation définitive du scénario d'adoption du BTCFi
- [ ] La découverte d'une faille dans le protocole CKB (L1) ou dans Rosen Bridge, profitant de l'absence de nouvel audit depuis 2020
- [ ] La domination de Stacks/sBTC ou d'un réseau Bitcoin de couche 2 (L2) compatible EVM sur les flux institutionnels du BTCFi, marginalisant le modèle UTXO non-EVM de CKB
- [ ] Un ratio volume d'échange/capitalisation boursière (volume/MC, un indicateur de la liquidité du marché) restant structurellement sous 5% sur 6+ mois — un signe de désaffection chronique des teneurs de marché (« market makers », les acteurs qui assurent la liquidité en plaçant en continu des ordres d'achat et de vente) et des particuliers
- [ ] Le départ de Jan Xie ou une contraction critique de l'équipe (actuellement ~5 personnes), dans un contexte de trésorerie opaque et sans levée de fonds récente

## Annexe — Données brutes

| Métrique | Valeur | Source |
|---|---|---|
| Prix | $0.0010 | CoinGecko |
| Market Cap | $51.33 M | CoinGecko |
| FDV | $52.19 M | CoinGecko |
| MC/FDV | 0.98 | CoinGecko |
| Rang Market Cap | 446 | CoinGecko |
| Volume 24h | $2.14 M | CoinGecko |
| Volume/MC | 4.2 % | CoinGecko |
| ATH | $0.0437 (2021-03-31) | CoinGecko |
| Drawdown vs ATH | -97.6 % | CoinGecko |
| Offre circulante | 48 997 252 671,303 (98 % du max) | CoinGecko |
| Variation prix 30j | -25.7 % | CoinGecko |
| TVL | n/d | DeFiLlama |
| TVL/MC | n/d | DeFiLlama |
| Tendance TVL 30j | n/d | DeFiLlama |
| Frais 30j | n/d | DeFiLlama |
| Revenus 30j | n/d | DeFiLlama |
| P/S annualisé | n/d | CoinGecko+DeFiLlama |
| Holders | n/d | GoPlus |
| Top 10 holders | n/d | GoPlus |
| Taxes achat/vente | n/d / n/d | GoPlus |
| Commits GitHub 90j | 63 | GitHub |
| Contributeurs GitHub | 67 | GitHub |
| Followers Twitter/X | n/d | CoinGecko |

*Données récupérées le 30/06/2026 20:45:48 via CoinGecko API, GitHub API.*

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