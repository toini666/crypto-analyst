# Babylon (BABY) — Analyse de due diligence

> Générée le 2026-06-29 · Méthodologie v2.0.0 · Confiance des données : **moyenne** · Id CoinGecko : `babylon`

## Executive Summary

**Babylon** — Babylon est le premier protocole permettant de mettre en jeu des Bitcoin de façon native (on parle de « staking »), afin que leurs détenteurs sécurisent ainsi des blockchains fonctionnant selon le mode Proof-of-Stake (un mode de validation où l'on engage des fonds en garantie du bon fonctionnement du réseau) — sans passer par un pont entre blockchains (souvent risqué), sans transformer leurs BTC en une version « enveloppée » émise par un tiers (le « wrapping »), et sans jamais abandonner le contrôle de leurs fonds (leur « garde »). Cela fonctionne grâce à des scripts cryptographiques exécutés directement sur la blockchain Bitcoin. BABY est le jeton natif de Babylon Genesis, une blockchain de premier niveau (« L1 ») construite avec le framework Cosmos-SDK, qui sert de couche de coordination et de contrôle pour l'ensemble de l'écosystème BTCfi (la finance décentralisée construite autour du Bitcoin).

*Narratif : infra*

### Verdict : 🟡 À surveiller — Score global : **60/100**

> ⚠️ **Red flags** : −4 pts imputés aux piliers concernés (score avant red flags : 64/100).

| Pilier | Poids | Score | Red flags | Couverture données |
|---|---|---|---|---|
| **Fondamentaux** | 20 % | 83/100 | — | 100 % |
| **Tokenomics & capture de valeur** | 25 % | 29/100 | −14 pts | 100 % |
| **Traction & adoption on-chain** | 20 % | 72/100 | — | 70 % |
| **Marché & valorisation** | 15 % | 64/100 | −3 pts | 70 % |
| **Social & mindshare** | 10 % | 57/100 | — | 55 % |
| **Sécurité & risques** | 10 % | 60/100 | −3 pts | 35 % |

**Forces principales :**
- Une position quasi monopolistique sur le staking Bitcoin natif, sans pont ni jeton enveloppé : une barrière à l'entrée cryptographique très solide, une avance opérationnelle de 13 mois sur d'éventuels concurrents, et un ratio TVL/MC (la valeur totale déposée dans le protocole comparée à sa capitalisation boursière) de 62x, qui confirme une demande bien réelle.
- Une équipe et des investisseurs de tout premier plan : David Tse (professeur à Stanford), Fisher Yu, et 103 millions de dollars levés auprès de Paradigm, a16z et Polychain — avec un réinvestissement d'a16z après le lancement, signe d'une conviction sur le long terme.
- Des partenariats stratégiques qui valident le produit : Aave (utilisation du BTC natif comme garantie de prêt), Sui Network (premier réseau client opérationnel — ce que Babylon appelle un Bitcoin Supercharged Network, ou BSN), Osmosis (intégration votée) — autant de preuves que des acteurs majeurs de la finance décentralisée (DeFi) reconnaissent déjà l'utilité du produit (ce qu'on appelle l'adéquation produit-marché, ou PMF).

**Faiblesses principales :**
- Un calendrier de déblocage de jetons (« vesting ») déjà très chargé : environ 136 millions de BABY sont libérés chaque mois pour les initiés depuis mai 2026, et ce sera le cas pendant encore 35 mois, sans mécanisme de destruction (« burn ») ou de rachat de jetons pour compenser — une pression vendeuse structurelle qui existe indépendamment du prix.
- Aucun revenu mesurable généré par le protocole à ce jour (les frais et les revenus sur 30 jours ne sont pas renseignés) : le jeton BABY n'est pas encore soutenu par des résultats économiques concrets, ce qui rend toute valorisation purement spéculative et conditionnée au lancement des coffres-forts (« vaults »).
- Une dépendance forte au prix du Bitcoin : si le marché du Bitcoin baisse, la valeur en dollars déposée dans le protocole (TVL), l'intérêt du public pour la finance autour du Bitcoin (BTCfi) et l'attrait des rendements de staking en BABY diminuent automatiquement, sans que l'équipe du projet puisse y faire grand-chose.

**Thèse d'investissement** : Babylon est le premier et le seul protocole de staking Bitcoin natif à avoir atteint une échelle institutionnelle (plus de 3 milliards de dollars de TVL — la valeur totale des actifs déposés dans le protocole), porté par des fondateurs issus du monde académique et par les meilleurs investisseurs en capital-risque (VC) du secteur. Il s'attaque à un marché de plus de 2 000 milliards de dollars de BTC dormants (qui ne rapportent rien à leurs détenteurs), avec une approche cryptographique différenciée, sans pont ni jeton enveloppé. Cette thèse d'investissement serait invalidée si les Trustless Bitcoin Vaults (coffres-forts Bitcoin sans intermédiaire de confiance) ne sont pas livrés en réseau principal (« mainnet ») avant fin 2026 avec un audit de sécurité complet, si la valeur totale déposée (TVL) en BTC tombe durablement sous 1 milliard de dollars, ou si la pression vendeuse mensuelle des initiés du projet (environ 136 millions de BABY par mois) fait baisser le cours avant que le protocole ne génère des revenus mesurables permettant de justifier la valeur du jeton par ses fondamentaux.

## Red Flags

| Sévérité | Signal | Détail | Source |
|---|---|---|---|
| 🟧 Majeur | Un déblocage mensuel massif de jetons est en cours depuis mai 2026 : environ 136 millions de BABY par mois (investisseurs + équipe + conseillers), soit environ 43 % d'inflation annualisée supplémentaire sur la masse en circulation, et cela durera encore 35 mois. | — | Analyse qualitative (sourcée) |
| 🟨 Mineur | Prix > 90 % sous l'ATH | -92 % depuis l'ATH | CoinGecko |
| 🟨 Mineur | Une vulnérabilité du mécanisme « BLS vote extension », découverte en décembre 2025 (avec un risque potentiel de perturbation du consensus), a été corrigée dans la version 4.2.0 sans avoir été exploitée — elle signale néanmoins la complexité du code avant le déploiement des coffres-forts (vaults). | — | Analyse qualitative (sourcée) |

## Analyse détaillée par pilier

### Fondamentaux — 83/100 *(poids 20 %)*

#### Problème, solution & nécessité blockchain — 88/100

**Résumé** : Un problème réel et massif — plus de 2 000 milliards de dollars de BTC dormants — résolu par une approche cryptographique native qui ne sacrifie jamais le contrôle des fonds par leur propriétaire (la « garde »).

Le Bitcoin représente la plus grande réserve de capital cryptographique au monde, mais il reste largement improductif : il ne peut pas servir à sécuriser des réseaux tiers sans recourir à des ponts entre blockchains (risque de piratage) ou à des versions « enveloppées » comme le wBTC (risque de devoir faire confiance à un tiers centralisé, ce qu'on appelle un risque de contrepartie). Babylon résout ce problème à la racine grâce à des scripts utilisant le mécanisme UTXO (l'unité de compte de base du Bitcoin) avec verrouillage temporel, combinés à un mécanisme de pénalité (« slashing ») exécuté directement sur la blockchain Bitcoin, sans jamais faire sortir les fonds de cette chaîne principale. Les détenteurs de BTC mettent leurs jetons en jeu depuis leur propre portefeuille et restent maîtres de leurs fonds à tout moment. La première étape du projet (le staking natif qui sécurise Babylon Genesis) est validée par un pic d'environ 57 000 BTC mis en jeu, soit environ 5,6 milliards de dollars de valeur déposée (TVL), ce qui démontre une réelle adéquation entre le produit et une demande du marché. La deuxième étape élargit cette proposition : les Trustless Bitcoin Vaults (coffres-forts sans intermédiaire de confiance) permettront d'utiliser le BTC natif comme garantie dans des protocoles de prêt comme Aave, grâce à des techniques cryptographiques appelées « garbled circuits » et à des preuves à divulgation nulle de connaissance (« ZK ») — la première approche connue, dans ce domaine, qui ne nécessite de faire confiance à aucun intermédiaire. Le marché potentiel est considérable : activer seulement 1 % des 2 000 milliards de dollars de BTC en circulation représenterait 20 milliards de dollars de garanties mobilisables. Le caractère unique de cette approche (aucun concurrent comparable sur le Bitcoin natif) crée une barrière à l'entrée durable.

*Sources : <https://babylonlabs.io/> · <https://phemex.com/academy/what-is-babylon-baby-bitcoin-staking-protocol> · <https://defillama.com/protocol/babylon-protocol> · <https://cryptobriefing.com/babylon-staked-bitcoin-aave-btc-lending/> · <https://docs.babylonlabs.io/assets/files/coinspect_babylon_phase_2_audit_2025_03.pdf>*

#### Équipe, investisseurs & financement — 85/100

**Résumé** : Des fondateurs issus du monde académique et reconnus, soutenus par une large palette d'investisseurs en capital-risque de premier plan, pour un total de 103 millions de dollars levés en trois tours de financement successifs.

Babylon Labs a été co-fondée par David Tse, professeur à Stanford spécialisé en théorie de l'information (un domaine à l'origine de travaux fondateurs sur la sécurité des réseaux), ainsi que par Fisher Yu et Mingchao Yu. Le parcours académique de David Tse apporte une crédibilité technique rare dans l'univers crypto : la conception des scripts qui permettent de pénaliser les comportements malveillants (« slashing », c'est-à-dire la confiscation d'une partie des fonds mis en jeu) repose directement sur des travaux de recherche formels. Le financement total atteint 103 millions de dollars en trois tranches : 18 millions de dollars lors d'une première levée de fonds (tour de série A), 70 millions de dollars menés par Paradigm en mai 2024, et 15 millions de dollars supplémentaires apportés par a16z Crypto en janvier 2026, spécifiquement destinés aux Trustless Bitcoin Vaults. Le tour de table comprend aussi Polychain Capital, Binance Labs, Hack VC, Galaxy Digital, OKX Ventures, HashKey Capital, Bullish et P2P.org. La qualité et la diversité de ces investisseurs (aucune dépendance à un seul fonds), ainsi que le réinvestissement récent d'a16z après le lancement du réseau principal, renforcent l'idée d'une conviction sur le long terme. En interne, l'organisation comprend un directeur juridique (Chief Legal Officer) et un directeur de la stratégie (Chief Strategy Officer), ce qui témoigne d'une structure professionnelle allant au-delà du seul développement technique. La présence active des fondateurs lors de conférences publiques (Tokyo, ETH Denver) et l'organisation d'appels trimestriels ouverts au public traduisent une bonne gouvernance en matière de communication.

*Sources : <https://www.coindesk.com/business/2024/05/30/bitcoin-staking-project-babylon-raises-70m-led-by-paradigm> · <https://www.theblock.co/post/384636/a16z-crypto-buys-15-million-in-baby-tokens-to-fund-babylons-buildout-of-new-btcvaults> · <https://tracxn.com/d/companies/babylon-labs/__SuoZpld3foROZb15hriwpp58sPjjOwM8h9kSHrT6ZsE/founders-and-board-of-directors> · <https://babylonlabs.io/blog/inaugural-quarterly-founders-call-april-august-2025> · <https://chainwire.org/2025/04/17/event-recap-babylon-labs-and-prof-david-tse-spotlight-bitcoin-staking-in-tokyo/>*

#### Exécution de la roadmap — 72/100

**Résumé** : Les grandes étapes ont été tenues jusqu'ici (lancement du réseau principal Genesis en avril 2025), mais la livraison en réseau principal des Trustless Bitcoin Vaults reste l'étape clé encore attendue pour le second semestre 2026.

Babylon Genesis (la blockchain de premier niveau construite avec Cosmos-SDK) a été lancée le 10 avril 2025 comme prévu, avec une distribution gratuite (« airdrop ») de 600 millions de BABY. L'intégration avec Aave pour utiliser le BTC natif comme garantie a été annoncée, et un premier essai réussi en réseau principal a validé le concept au quatrième trimestre 2025. En janvier 2026, a16z a investi 15 millions de dollars spécifiquement pour accélérer les Trustless Bitcoin Vaults, ce qui traduit une forte conviction extérieure sur cette prochaine étape. La feuille de route 2026, baptisée « Vault First » (les coffres-forts d'abord), est clairement définie : version test alpha (février 2026), version test bêta avec des interfaces de programmation stables (mars-avril 2026), puis lancement en réseau principal sur Ethereum en priorité, avant une expansion à d'autres blockchains. Le choix stratégique de repousser l'arrivée de réseaux clients tiers et d'une compatibilité avec la machine virtuelle d'Ethereum (EVM) sur Babylon Genesis montre une discipline d'exécution rare, centrée sur l'ingénierie. L'activité sur GitHub (la plateforme où le code est développé et partagé) confirme un développement actif : le dernier ajout de code (« commit ») date d'il y a 0 jour, c'est-à-dire aujourd'hui même, avec 13 contributeurs actifs. Les risques d'exécution restent réels : les Trustless Bitcoin Vaults utilisent des « garbled circuits » et des preuves ZK, des technologies complexes susceptibles de prendre du retard ; l'intégration avec Aave V4 dépend aussi du calendrier propre à Aave. L'objectif de 100 milliards de dollars de BTC activés reste très ambitieux au regard des délais annoncés.

*Sources : <https://babylonlabs.io/blog/a-vault-first-roadmap-catalysing-bitcoin-defi> · <https://babylonlabs.io/blog/babylon-quarterly-founders-call-q4-2025-recap> · <https://www.theblock.co/post/384636/a16z-crypto-buys-15-million-in-baby-tokens-to-fund-babylons-buildout-of-new-btcvaults> · <https://babylonlabs.io/blog/inaugural-quarterly-founders-call-april-august-2025>*

### Tokenomics & capture de valeur — 29/100 *(poids 25 % · red flags −14 pts (base 43/100))*

#### Dilution (MC/FDV, offre circulante) — 40/100

**Constat (déterministe)** : MC/FDV = 0.34 (offre circulante : 34 %)

#### Utilité du token & capture de valeur — 52/100

**Résumé** : BABY bénéficie de mécanismes de capture de valeur réels (frais de transaction et obligation de double mise en jeu), mais l'absence de revenus mesurables pour le protocole fragilise la thèse à court terme.

BABY remplit trois fonctions : c'est le jeton utilisé pour payer les frais de transaction et les contrats intelligents (« smart contracts ») sur Babylon Genesis, il sert à la gouvernance on-chain (le vote des détenteurs sur les paramètres du protocole), et il est une composante du modèle de « double mise en jeu » (dual-staking), où les validateurs doivent mettre en jeu du BABY en complément du BTC qui leur est délégué. Ce dernier mécanisme est le plus structurant : il crée une demande obligatoire de BABY, proportionnelle à la croissance du réseau et au volume de BTC mis en jeu. La gouvernance seule aurait valu une note inférieure ou égale à 40, mais la combinaison entre frais de transaction et double mise en jeu obligatoire justifie une note supérieure à la moyenne. Cependant, les indicateurs confirment qu'à ce jour le protocole ne génère aucun revenu (les frais et les revenus sur 30 jours ne sont pas renseignés), ce qui signale une phase de démarrage sans monétisation active. L'inflation de 5,5 % par an dilue les détenteurs actuels (réduit la part que représentent leurs jetons) sans que des revenus suffisants ne viennent compenser. En revanche, le test de capture de valeur à venir est positif : si les Trustless Bitcoin Vaults atteignent leurs objectifs, les frais perçus sur des milliards de dollars de garanties en BTC devraient générer des flux substantiels vers BABY. Mais cette perspective reste conditionnée à un lancement réussi des coffres-forts et à la mise en place d'un mécanisme reversant les frais aux détenteurs de jetons, qui n'a pas encore été confirmé publiquement.

*Sources : <https://docs.babylonlabs.io/guides/overview/babylon_genesis/baby_tokenomics/> · <https://babylonlabs.io/learn/what-is-the-baby-token> · <https://babylon.foundation/blogs/baby-tokenomics-guide> · <https://www.gate.com/learn/articles/baby-token-powering-babylon-s-modular-bitcoin-staking-ecosystem/8278>*

#### Unlocks & inflation à venir — 30/100

**Résumé** : Une pression vendeuse structurelle est déjà en cours : environ 136 millions de BABY sont libérés chaque mois depuis mai 2026 au profit des initiés, sur une masse en circulation de 3,73 milliards de jetons — soit une inflation annuelle de plus de 40 % sur cette masse en circulation.

L'analyse du calendrier de déblocage des jetons (« vesting ») révèle une dilution déjà significative et active. La période de blocage initial (« cliff ») des premiers investisseurs (30,5 % du total, soit 3,05 milliards de BABY) et des conseillers (3,5 %, soit 350 millions) s'est achevée le 10 mai 2026, avec un trente-sixième du montant libéré chaque mois jusqu'en avril 2029. La période de blocage de l'équipe (15 %, soit 1,5 milliard) suit le même schéma, après une période de blocage d'un an qui s'est terminée en avril 2026. Au total, ces trois catégories libèrent environ 136 millions de BABY par mois (environ 84,7 millions pour les investisseurs, 41,7 millions pour l'équipe et 9,7 millions pour les conseillers). Rapporté à la masse en circulation actuelle de 3,73 milliards de jetons, cela représente environ 3,6 % par mois, soit une dilution annualisée d'environ 43 % de cette masse en circulation. L'inflation propre au protocole, de 5,5 % par an sur un total de 10,85 milliards de jetons, ajoute environ 50 millions de jetons supplémentaires par mois. L'ensemble crée une pression vendeuse structurelle qui se poursuivra encore pendant 35 mois. Quelques éléments atténuent ce constat : la libération se fait de façon linéaire (et non en un seul bloc), le calendrier était public et annoncé à l'avance, et les investisseurs ne pouvaient pas mettre en jeu leurs jetons bloqués pendant la première année. Les catégories Écosystème et Recherche & Développement (18 % chacune) connaissent elles aussi des déblocages en cours depuis le lancement, avec 25 % libérés au départ puis le reste de façon linéaire sur 3 ans. L'absence de tout mécanisme de destruction de jetons (« burn ») ou de rachat aggrave la situation.

*Sources : <https://tokenomist.ai/babylon> · <https://docs.babylonlabs.io/guides/overview/babylon_genesis/baby_tokenomics/> · <https://cryptorank.io/price/babylon-chain/vesting> · <https://defillama.com/unlocks/babylon-protocol> · <https://babylon.foundation/blogs/baby-tokenomics-guide>*

### Traction & adoption on-chain — 72/100 *(poids 20 %)*

#### Ratio TVL/Market Cap — 95/100

**Constat (déterministe)** : TVL/MC = 62.23 (TVL $3047.6M)

#### Tendance TVL 30j — 30/100

**Constat (déterministe)** : TVL 30j : -19.1 %

#### Frais & revenus du protocole — n/d

**Constat (déterministe)** : Pas de revenus mesurables

#### Adoption (selon narratif) — 73/100

**Résumé** : Le leader incontesté du staking Bitcoin natif, avec environ 3 milliards de dollars de valeur déposée (TVL), des partenaires de premier plan (Aave, Sui, Osmosis) et un ratio TVL/MC de 62x qui confirme une demande bien réelle.

Babylon est le plus grand protocole de staking Bitcoin natif au monde : il a atteint un pic de valeur déposée (TVL) de 5,6 milliards de dollars (environ 57 000 BTC), avant de reculer à environ 3 milliards de dollars en juin 2026 (-19 % sur 30 jours, en lien avec la correction du cours du BTC et un retrait général de liquidités sur le marché). Ce recul ne remet pas en cause la thèse d'investissement : 3 milliards de dollars de TVL reste un résultat exceptionnel pour un protocole lancé en avril 2025. L'écosystème des Bitcoin Supercharged Networks (BSN, les réseaux clients qui utilisent la sécurité du Bitcoin via Babylon) continue de s'élargir activement : Sui Network est désormais officiellement opérationnel en tant que BSN, Osmosis a voté l'intégration de la première phase (devenant la première blockchain externe à utiliser la sécurité du Bitcoin via le protocole de communication inter-blockchains IBC), et BOB ainsi que XPLA sont en cours d'intégration. Le partenariat avec Aave pour utiliser le BTC natif comme garantie constitue une validation institutionnelle majeure. Le ratio TVL/MC de 62x révèle un décalage frappant : le marché valorise le jeton à moins de 2 % de la valeur qu'il sécurise. La principale limite reste l'absence de données sur le nombre de détenteurs et sur le nombre d'abonnés Twitter dans les indicateurs disponibles, ainsi que des frais de protocole toujours nuls, ce qui indique que la monétisation de cet usage bien réel n'a pas encore commencé.

*Sources : <https://defillama.com/protocol/babylon-protocol> · <https://www.cryptotimes.io/2025/04/16/sui-network-expands-to-bitcoin-defi-btcfi-with-babylon-integration/> · <https://cryptobriefing.com/babylon-staked-bitcoin-aave-btc-lending/> · <https://babylonlabs.io/blog/bi-weekly-babylon-genesis-report-1-24-april> · <https://en.cryptonomist.ch/2026/05/15/babylon-bitcoin-staking-4-billion-tvl/>*

### Marché & valorisation — 64/100 *(poids 15 % · red flags −3 pts (base 67/100))*

#### Valorisation vs revenus (P/S) — n/d

**Constat (déterministe)** : Pas de revenus → multiple incalculable

#### Valorisation vs comparables — 67/100

**Résumé** : Babylon se négocie avec une forte décote par rapport à EigenLayer sur la base du ratio entre sa valorisation totale diluée (FDV — la valorisation théorique si tous les jetons prévus étaient déjà en circulation) et la valeur déposée dans le protocole (TVL), grâce à une position quasi monopolistique sur le segment du Bitcoin natif, mais sur un marché plus étroit.

Le marché du « restaking » (la remise en jeu d'actifs déjà mis en jeu, afin de sécuriser d'autres réseaux) et de la sécurité partagée compte deux familles d'acteurs : les protocoles construits sur Ethereum (EigenLayer, Symbiotic, Karak) et Babylon, seul sur le segment du Bitcoin natif. EigenLayer (jeton EIGEN) domine avec environ 15,2 milliards de dollars de valeur déposée (TVL) et une capitalisation boursière d'environ 145 millions de dollars (valorisation totale diluée, ou FDV, d'environ 386 millions de dollars), soit un ratio FDV/TVL d'environ 2,5 %. Babylon affiche une valorisation totale diluée de 142 millions de dollars pour une valeur déposée de 3,05 milliards de dollars, soit un ratio FDV/TVL d'environ 4,7 % — légèrement plus élevé que celui d'EigenLayer, ce qui peut sembler surprenant mais s'explique par le potentiel d'extension vers la finance autour du Bitcoin (BTCfi) que représentent les coffres-forts (vaults). Si Babylon atteignait le même niveau de valorisation qu'EigenLayer (un ratio FDV/TVL de 2,5 %), sa valorisation totale diluée implicite serait d'environ 75 millions de dollars pour 3 milliards de dollars de valeur déposée — un niveau inférieur à la valorisation actuelle, ce qui suggère que le marché intègre déjà une partie de la croissance future attendue des coffres-forts. Le principal atout de Babylon par rapport à ses comparables est l'absence totale de concurrent direct sur le Bitcoin natif (Symbiotic et Karak opèrent sur des jetons de la norme ERC-20, propre à Ethereum), ce qui justifie une prime liée à sa position quasi monopolistique. EigenLayer conserve l'avantage d'un écosystème de services validés activement (AVS) plus mature, d'une liquidité supérieure et de la position dominante d'Ethereum.

| Projet | Market Cap | FDV | Commentaire |
|---|---|---|---|
| EigenLayer (EIGEN) | ~145 M$ | ~386 M$ | Le leader du restaking sur Ethereum, avec une valeur déposée (TVL) de 15,2 milliards de dollars et un écosystème de services validés activement (AVS, comme EigenDA) déjà mature ; ratio valorisation totale diluée / valeur déposée (FDV/TVL) d'environ 2,5 % — la référence principale du secteur. |
| Symbiotic | pas de token public | n/a | Un protocole de restaking sur Ethereum ouvert à tout type d'actif, avec une valeur déposée d'environ 897 millions de dollars, sans jeton encore mis en circulation — une menace potentielle si un jeton venait à être lancé. |
| Karak | n/a | n/a | Un protocole de restaking multi-actifs, avec une valeur déposée d'environ 102 millions de dollars, sur un segment plus restreint, et sans jeton public connu à ce jour. |
| Babylon (BABY) | ~49 M$ | ~142 M$ | Le seul protocole de staking Bitcoin natif, avec une valeur déposée d'environ 3 milliards de dollars et un ratio FDV/TVL d'environ 4,7 % — une position quasi monopolistique sur sa niche, avec une prime de valorisation liée aux Trustless Bitcoin Vaults attendus. |

*Sources : <https://coinmarketcap.com/cmc-ai/eigencloud/latest-updates/> · <https://www.coinbase.com/price/eigen> · <https://www.coingabbar.com/en/crypto-blogs-details/symbiotic-restaking-eigenlayer-rival> · <https://medium.com/@CryptoBlooom/the-restaking-revolution-a-comparative-look-at-eigenlayer-and-babylon-20c051526a78> · <https://www.gate.com/learn/articles/comparison-between-babylon-protocol-and-eigenlayer/2868>*

### Social & mindshare — 57/100 *(poids 10 %)*

#### Activité développeurs (GitHub) — n/d

**Constat (déterministe)** : Activité GitHub indisponible

#### Mindshare & dynamique sociale — 57/100

**Résumé** : Le récit de « l'EigenLayer du Bitcoin » est bien installé et bénéficie d'une couverture médiatique de premier plan, mais une chute de -92 % depuis le plus haut historique et une dilution continue pèsent sur le moral de la communauté.

Babylon bénéficie d'un positionnement narratif distinctif — « le staking Bitcoin natif sans pont » — qui trouve un écho fort dans les cercles dédiés à la finance autour du Bitcoin (BTCfi) et génère une couverture médiatique organique dans la presse crypto de premier plan (The Block, CoinDesk, CoinTelegraph, Messari, Nansen Research). Les fondateurs restent activement visibles : David Tse a donné une conférence à Tokyo (avril 2025), le projet était présent à ETH Denver, et des appels trimestriels publics donnent lieu à des comptes-rendus détaillés. L'investissement d'a16z en janvier 2026 a provoqué un pic d'attention médiatique. Le sentiment sur Twitter semble globalement positif selon les sources disponibles, certains analystes citant le décalage entre la valeur déposée et la capitalisation boursière comme un argument haussier. Les indicateurs manquent toutefois de précision (le nombre d'abonnés Twitter n'est pas disponible). La chute de -92 % depuis le plus haut historique d'avril 2025 (0,166 $) constitue un frein psychologique important pour les nouveaux investisseurs et traduit un marché secondaire peu liquide ou survendu. Le nombre très faible d'étoiles sur GitHub (9, un indicateur de popularité parmi les développeurs) suggère une visibilité limitée auprès des développeurs, largement compensée par 13 contributeurs actifs et des mises à jour de code quotidiennes. Le récit autour du BTCfi reste secondaire par rapport à celui de la finance décentralisée sur Ethereum en termes d'attention globale, mais il progresse de façon structurelle.

*Sources : <https://research.nansen.ai/articles/babylon-genesis-post-tge-an-undervalued-play-on-bt-cfi> · <https://coinmarketcap.com/cmc-ai/babylon/latest-updates/> · <https://www.benzinga.com/markets/cryptocurrency/25/02/44021650/bitcoin-staking-industry-could-reach-10b-by-end-of-2025-says-babylon-labs-co-founder-david-tse> · <https://babylonlabs.io/blog/babylon-quarterly-founders-call-q4-2025-recap>*

### Sécurité & risques — 60/100 *(poids 10 % · red flags −3 pts (base 63/100))*

#### Sécurité du contrat (GoPlus) — n/d

**Constat (déterministe)** : Contrat non analysable (token natif ou chain non couverte)

#### Concentration des holders — n/d

**Constat (déterministe)** : Distribution des holders indisponible

#### Audits & risques légaux — 63/100

**Résumé** : Deux audits réalisés par des sociétés tierces reconnues (Coinspect, Oak Security), un programme de récompense pour la détection de failles (« bug bounty ») allant jusqu'à 500 000 $ sur la plateforme Immunefi, mais une faille touchant le mécanisme de consensus a été découverte après le lancement du réseau principal et corrigée en décembre 2025.

Babylon dispose d'un programme actif de récompense pour la détection de failles (« bug bounty ») sur la plateforme Immunefi (lancé en septembre 2024, avec des récompenses pouvant atteindre 500 000 $ pour les vulnérabilités critiques de la blockchain, pour un budget total de 3 millions de dollars) — un signal positif de maturité en matière de sécurité. Les audits officiels documentés incluent celui de Coinspect (8 semaines, débuté en décembre 2024, portant sur les dépôts principaux de la phase 2 de Babylon) et celui d'Oak Security GmbH sur Genesis v2 (juin 2025), ce qui représente une couverture sérieuse. CertiK Skynet attribue une note de 88.69/AA, mais précise ne pas avoir directement audité le code. En décembre 2025, une vulnérabilité a été découverte par un contributeur utilisant un pseudonyme (GruppyLaurie55348) dans le mécanisme appelé « BLS vote extension » : un validateur malveillant pouvait omettre un champ technique (le hachage du bloc) pour influencer le consensus, ce qui pouvait potentiellement provoquer des plantages lors des transitions de période (« epoch »). Aucune exploitation réelle n'a été confirmée, et le correctif a été déployé dans la version 4.2.0. Ce traitement rapide, via une procédure de divulgation responsable, est positif. Point de vigilance : les Trustless Bitcoin Vaults (qui utilisent des « garbled circuits » et des preuves ZK) n'ont pas encore reçu d'audit de leur nouvelle architecture cryptographique — une étape critique avant tout déploiement en réseau principal. Aucune action légale ou réglementaire n'a été identifiée à ce jour.

*Sources : <https://immunefi.com/bug-bounty/babylon-labs/information/> · <https://skynet.certik.com/projects/babylon> · <https://cointelegraph.com/news/babylon-code-vulnerability-block-production> · <https://cryptonews.com/news/flaw-found-in-bitcoin-staking-protocol-babylon-could-disrupt-consensus/> · <https://docs.babylonlabs.io/assets/files/coinspect_babylon_phase_2_audit_2025_03.pdf> · <https://docs.dev.babylonlabs.io/assets/files/oak_security_gmbh_genesis_v2_audit-2025_06.pdf>*

## Déclencheurs de la thèse

**Catalyseurs positifs à surveiller :**
- [ ] Le lancement en réseau principal des Trustless Bitcoin Vaults (coffres-forts Bitcoin sans intermédiaire de confiance) sur Ethereum, attendu au second semestre 2026 : cela ouvrirait un marché de garanties en BTC natif vers Aave et la finance décentralisée sur Ethereum, susceptible de générer des frais pour BABY.
- [ ] L'intégration avec Aave V4 (attendue mi-2026) : elle permettrait d'emprunter des stablecoins (jetons indexés sur une monnaie stable comme le dollar) en mettant du BTC natif en garantie, sans intermédiaire — le premier cas d'usage institutionnel concret pour ces coffres-forts.
- [ ] L'expansion des Bitcoin Supercharged Networks (BSN, les réseaux clients qui utilisent la sécurité du Bitcoin via Babylon) : chaque nouveau réseau (Osmosis, BOB, XPLA…) augmente la demande de BTC mis en jeu et renforce la position de Babylon comme couche de sécurité universelle pour le Bitcoin.
- [ ] Un catalyseur lié à l'évolution générale du marché du Bitcoin : si le cours du BTC monte, la valeur en dollars déposée dans le protocole (TVL) augmente mécaniquement, ce qui devrait revaloriser le jeton BABY qui sécurise ces dépôts — avec un effet de levier marqué, puisque le ratio TVL/MC (valeur déposée rapportée à la capitalisation boursière) est de 62x.
- [ ] Une décision de gouvernance (le vote des détenteurs de jetons sur les règles du protocole) qui mettrait en place un mécanisme reversant aux détenteurs une partie des frais générés par les coffres-forts (par reversement direct ou par destruction de jetons) : cela transformerait BABY en actif générateur de revenus, valorisable selon des indicateurs financiers classiques comme le ratio cours/bénéfice.

**Signaux d'invalidation :**
- [ ] Un piratage ou un bug critique dans les Trustless Bitcoin Vaults avant que leur architecture cryptographique (preuves à divulgation nulle de connaissance dites « ZK », et « garbled circuits », des techniques permettant d'effectuer des calculs sans révéler les données) n'ait été entièrement auditée : cela détruirait la confiance des acteurs institutionnels et ferait chuter la valeur déposée dans le protocole.
- [ ] Une pression vendeuse des initiés (environ 136 millions de BABY par mois depuis mai 2026, et ce pendant encore 35 mois) qui ne serait pas absorbée par une demande d'achat suffisante : cela pourrait créer une spirale baissière qui s'auto-entretient, indépendamment des fondamentaux du projet.
- [ ] L'apparition d'un protocole concurrent sur le Bitcoin natif, utilisant des technologies comme OP_CAT ou BitVM 2.0, qui rendrait l'approche actuelle de Babylon (fondée sur des scripts) moins différenciante, voire dépassée.
- [ ] Un recul durable de la valeur déposée en BTC sous 1 milliard de dollars (en cas de baisse prolongée du cours du BTC ou de départ de réseaux clients majeurs) : cela affaiblirait la justification d'une valorisation élevée pour le jeton BABY.
- [ ] Une action réglementaire (de la SEC, de la CFTC ou d'une autorité équivalente) qualifiant le staking de BTC natif ou les coffres-forts (vaults) de services financiers non enregistrés dans des juridictions clés comme les États-Unis ou l'Union européenne.

## Annexe — Données brutes

| Métrique | Valeur | Source |
|---|---|---|
| Prix | $0.0131 | CoinGecko |
| Market Cap | $48.97 M | CoinGecko |
| FDV | $142.41 M | CoinGecko |
| MC/FDV | 0.34 | CoinGecko |
| Rang Market Cap | 441 | CoinGecko |
| Volume 24h | $12.75 M | CoinGecko |
| Volume/MC | 26.0 % | CoinGecko |
| ATH | $0.1661 (2025-04-12) | CoinGecko |
| Drawdown vs ATH | -92.1 % | CoinGecko |
| Offre circulante | 3 731 897 540,98 (34 % du max) | CoinGecko |
| Variation prix 30j | -10.9 % | CoinGecko |
| TVL | $3.05 Md | DeFiLlama |
| TVL/MC | 62.23 | DeFiLlama |
| Tendance TVL 30j | -19.1 % | DeFiLlama |
| Frais 30j | n/d | DeFiLlama |
| Revenus 30j | n/d | DeFiLlama |
| P/S annualisé | n/d | CoinGecko+DeFiLlama |
| Holders | n/d | GoPlus |
| Top 10 holders | n/d | GoPlus |
| Taxes achat/vente | n/d / n/d | GoPlus |
| Commits GitHub 90j | n/d | GitHub |
| Contributeurs GitHub | 13 | GitHub |
| Followers Twitter/X | n/d | CoinGecko |

*Données récupérées le 30/06/2026 20:12:13 via CoinGecko API, DeFiLlama API, GitHub API.*

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