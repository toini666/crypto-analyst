# Product

## Register

product

## Users

Antoine, investisseur crypto particulier exigeant. Utilise l'outil seul, le soir, sur un seul écran, dans une pièce peu éclairée. Son job : décider si un token mérite son attention et son argent. Il lance une analyse, attend quelques minutes, puis lit un rapport dense de due diligence. Il revient ensuite comparer des analyses passées.

## Product Purpose

Moteur personnel de due diligence crypto : on donne un nom + ticker, un pipeline déterministe (CoinGecko, DeFiLlama, GoPlus, GitHub, puis Claude Code headless pour le qualitatif) produit un rapport noté sur 6 piliers avec des red flags qui pénalisent leur pilier d'origine (et un garde-fou « contrat »). Le succès : Antoine fait confiance aux chiffres (toujours sourcés, jamais hallucinés) et lit l'essentiel en moins de 3 minutes. Méthodologie complète dans CADRAGE.md.

## Brand Personality

Rigoureux, calme, tranchant. L'ambiance d'une salle de lecture d'analyste tard le soir : un dossier d'archive ouvert sous une lampe, encre bleu nuit, un seul trait de cobalt pour les verdicts. Pas un terminal de trading qui clignote : un instrument de recherche qui aide à décider froidement.

## Anti-references

- Le « crypto dashboard degen » : néon vert/violet sur noir, glow, sparklines qui clignotent, gamification.
- Le terminal Bloomberg pastiche (données denses sans hiérarchie).
- Le SaaS générique cream/beige à cartes identiques et hero-metrics.
- Tout ce qui ressemble à un site de shitcoin : compteurs, fusées, FOMO.

## Design Principles

1. **Le chiffre est sacré** : toute donnée affichée est sourcée et datée ; l'incertitude (données manquantes, confiance) est montrée, jamais masquée.
2. **Lecture avant décoration** : le rapport est le produit ; la typographie de lecture longue prime sur l'ornement.
3. **Le verdict en un coup d'œil, la preuve en dessous** : divulgation progressive — score/verdict immédiats, drill-down par pilier ensuite.
4. **Le mouvement signifie l'état** : la progression du pipeline est la seule chorégraphie riche ; ailleurs, 150-250 ms, états avant tout.
5. **Sévérité visible** : les red flags ne sont jamais esthétiquement adoucis ; leur pénalité sur le score (et le garde-fou « contrat » qui plafonne à 69) doit se voir.

## Accessibility & Inclusion

WCAG AA : contraste corps ≥ 4.5:1, focus visible partout, `prefers-reduced-motion` respecté (crossfade au lieu des animations GSAP), navigation clavier complète sur les actions (lancer, ouvrir, supprimer). Chiffres en tabular-nums pour la lecture comparative.
