---
format: 1920x1080
message: "Une note sur 100 que vous pouvez défendre — sourcée, jamais inventée."
arc: Hook → Pain → Solution/Method → Proof (verdict) → Proof (pillars) → CTA
audience: investisseurs crypto particuliers exigeants, fatigués du contenu promotionnel
language: fr
music: "tense, minimal, cinematic-analytical — low steady pulse, dark ambient, restrained; NO hype, NO EDM, NO risers. The sound of investment research late at night."
silent: true  # no voiceover — kinetic typography carries the message; SCRIPT.md intentionally absent
---

# Crypto Analyst — promo 30 s

> No narration. Every line below under **On-screen** is the literal kinetic copy for that frame — it is the message. Numbers are REAL (from the live Solana analysis, score 62/100, methodology v2.0.0); never alter or invent a figure. Brand: rigorous, calm, incisive — an analyst's reading room, not a degen dashboard. Amber `#D9A13B` is the only accent; serif Newsreader italic appears only on the verdict moments (Frames 4 & 6).

## Video direction

> Written once; every frame inherits it. Per-frame Scene lines carry only the delta. No voiceover — "reveal on its cue" means reveal on the next on-screen piece in the copy order, never dump the canvas at t=0.

- **palette system** (from `frame.md`): ground = near-black `bg #0B0D11`; ONE accent only = amber `primary #D9A13B` (every eyebrow, numeral, bar fill, ring, CTA, emphasised word); headlines near-white `text #E8EAEE`; body muted `#9AA3B2`; meta/tertiary `#5C6470`; verdict semantics inline ONLY — `positive #57C98B` (a strong score), `negative #E2574B` (a red flag). Tinted cards = amber 4% fill / amber 20% 1.5px border / **no shadow**. No second accent; no full-screen gradients on dark (radial or solid + localized glow only — H.264 banding).
- **type by role** (from `frame.md`): headlines/display = IBM Plex Sans (−0.02em, near-white); **ALL numerals / metrics / counters = IBM Plex Mono, `tabular-nums`, amber**; chrome/eyebrows = IBM Plex Sans uppercase 0.08em amber; the ONE editorial register = **Newsreader serif *italic*** — used only on the verdict lines (Frames 4 & 6), exactly as the app reserves serif for verdicts. Never substitute a family; reference by role.
- **motion grammar + reveal model**: long-tail settle, **`power3` default** (`expo.out` on a fast arrival) — NEVER bouncy / overshoot / `back`/`bounce`/`elastic`. Reveal each on-screen piece on its own cue in sequence (pace to the copy order listed per frame); never front-load; spread reveals across the back ~50%. Entrances use `fromTo` (explicit from-state — seek-safe).
- **rhythm / held-frame allocation**: energy arc = brisk (F1–F3) → **LAND** (F4, the climax) → resolve (F5–F6). Frame 4 ends on a deliberate **HELD** read (score landed, still); Frame 6 holds on the resolved lockup. A held read beats bad motion; place stillness deliberately so the film isn't uniformly busy.
- **aliveness during holds**: subtle jitter ONLY (`sine-wave-loop`, low amplitude) on a held hero, or a live SVG internal (the ScoreDial ring) — NEVER lazy breathing, NEVER a back-half pan/push. All aliveness is a finite tween over the hold.
- **negative list**: none of the PRODUCT.md anti-refs — no neon, no degen glow, no rockets / FOMO counters / gamification; no Bloomberg-pastiche density; no drop shadows on content; no second accent; no square-corner content (save the bottom progress strip); no CSS `@keyframes`/`transition` for motion, no `repeat`/`yoyo`, no `Math.random`/`Date.now`; and neither failure mode — slideshow (front-load then freeze) nor screensaver (everything floating independently).

## Frame 1 — Hook · le biais

- scene: Une ligne tranchante sur fond near-black ; le mot clé bascule en ambre.
- voiceover: ""
- duration: 4s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Pain validation
- beat: skepticism → tension
- blueprint: kinetic-type-beats (Adapt)
- focal: — (typography-only)
- asset_candidates:

On-screen (la ligne se construit, puis « vous vendre quelque chose » bascule en ambre) :
- micro-eyebrow mono, en haut : « CRYPTO ANALYST »
- « La plupart des analyses crypto cherchent à **vous vendre quelque chose.** »

Adapt: no VO — the build-to-payoff (kinetic-type-beats' second mode) is timed to the beat, not a spoken cue; the amber key-phrase is the payoff hit.
Scene 1 (0.0–1.3s): near-black field; the mono eyebrow "CRYPTO ANALYST" fades in top-left; the line "La plupart des analyses crypto cherchent à…" assembles via **per-word staggered reveal** (`dynamic-content-sequencing`) on a smooth long-tail settle (`power3`), near-white, centered ~62% width, upper-third anchored. No camera move.
Scene 2 (1.3–2.7s): the final chunk "vous vendre quelque chose." reveals per-word, then **keyword glow** (`asr-keyword-glow`) sweeps "vous vendre quelque chose" to amber on its beat — the payoff hit.
Scene 3 (2.7–4.0s): hold the full line, still and reading; at most **subtle jitter** (`sine-wave-loop`, low amplitude) on the amber phrase. No drift.

narrativeRole: Ouvre à froid sur la défiance que ressent déjà le spectateur — le contenu crypto est promotionnel. Crée la tension avant tout produit.
keyMessage: On ne peut pas faire confiance aux analyses qu'on nous sert.

## Frame 2 — Pain · les données éparpillées

- scene: Quatre étiquettes de données dérivent, déconnectées, sur le canvas ; elles ne se rejoignent jamais.
- voiceover: ""
- duration: 4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-pain.html
- type: pain_point
- persuasion: Pain agitation
- beat: frustration → overwhelm
- blueprint: kinetic-type-beats (Adapt)
- focal: — (typography-only)
- asset_candidates:

On-screen :
- étiquettes mono dispersées : « Prix »  « TVL »  « Sécurité du contrat »  « Activité dev »
- ligne qui résout, sous les fragments : « Chaque chiffre vit ailleurs. **Jamais réconcilié.** »

Adapt: the four data labels are the "pain statements" — each landing alone, but at scattered positions (not a centered stack) so the layout itself reads as fragmentation; a resolve line follows. Keep "each pain lands solo" pacing.
Scene 1 (0.0–1.8s): four mono labels — "Prix", "TVL", "Sécurité du contrat", "Activité dev" — reveal **sequentially** via chunk reveal (`dynamic-content-sequencing`), each at a different scattered position (rule-of-thirds spread, ~3 depth layers via opacity), disconnected; smooth long-tail (`power3`). One cue at a time, never dumped.
Scene 2 (1.8–3.0s): the four labels nudge slightly apart (finite low-amplitude `center-outward-expansion`) to underscore "jamais réconcilié"; the resolve line "Chaque chiffre vit ailleurs. Jamais réconcilié." reveals per-word across lower-center, "Jamais réconcilié" near-white.
Scene 3 (3.0–4.0s): hold — labels sit dim at the edges, the line reads centered and still. Subtle jitter only.

narrativeRole: Agite la douleur concrète — la donnée existe mais elle est fragmentée, impossible à comparer. Le spectateur s'y reconnaît.
keyMessage: Faire sa due diligence soi-même, c'est un travail à plein temps.

## Frame 3 — Solution · le pipeline déterministe

- scene: Le nom du produit s'installe ; quatre statistiques s'assemblent en cartes teintées et comptent.
- voiceover: ""
- duration: 5.5s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/03-method.html
- type: product_intro
- persuasion: Show-don't-tell proof (Rule of three + zéro)
- beat: clarity → confidence
- blueprint: grid-card-assemble (Adapt)
- focal: — (typography + native data cards)
- asset_candidates:

On-screen :
- eyebrow mono ambre : « LA MÉTHODE »
- titre (Sans) : « Un pipeline déterministe. **Aucun chiffre inventé.** »
- 4 cartes teintées (chiffre Mono ambre qui compte + label Sans) : « 4 » sources publiques · « 10 » étapes de pipeline · « 6 » piliers notés · « 0 » chiffre inventé

Adapt: name-drop the method first, then the 4 tinted stat cards self-assemble in a staggered cascade; each numeral counts up as its card lands (the count-up is the proof). Keep the staggered-cascade signature.
Scene 1 (0.0–1.4s): eyebrow "LA MÉTHODE" (mono amber) reveals top-center; the title "Un pipeline déterministe." enters via **per-word staggered reveal** (`dynamic-content-sequencing`), near-white upper-third; "Aucun chiffre inventé." lands as the second beat, "Aucun chiffre inventé" swept to amber via **keyword glow** (`asr-keyword-glow`).
Scene 2 (1.4–4.3s): four tinted cards **self-assemble** left→right in a staggered cascade (`spring-pop-entrance`, smooth long-tail — no overshoot) on a centered row (~52% canvas); as each card lands, its mono amber numeral **counts up** on its own cue (`counting-dynamic-scale`) — "4", then "10", then "6", then "0" — Sans label beneath. The "0 chiffre inventé" card lands LAST as the payoff.
Scene 3 (4.3–5.5s): all four read; hold still, the "0" card held under a restrained amber emphasis (`asr-keyword-glow` settle); subtle jitter at most. No drift.

narrativeRole: Présente Crypto Analyst comme un instrument déterministe — données publiques, métriques horodatées, une note — l'inverse du thread d'opinion.
keyMessage: La donnée d'abord ; le qualitatif est rédigé à partir des chiffres, jamais l'inverse.

## Frame 4 — Proof · le verdict (Solana)

- scene: LE plan-clé. Le ScoreDial circulaire balaie de 0 à 62 ; le verdict « À surveiller » s'allume ; le mot du verdict en serif italique.
- voiceover: ""
- duration: 6.5s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-verdict.html
- type: feature_showcase
- persuasion: Show-don't-tell proof (Statistical proof)
- beat: intrigue → trust
- blueprint: dataviz-countup (Reproduce)
- focal: assets/solana-logo.png
- roles: solana-logo = supporting (identity mark, small, atop the cluster)
- asset_candidates: assets/solana-logo.png — la marque officielle Solana (recadrée), identité du token analysé

On-screen :
- identité : logo Solana + « Solana » (Sans) + pastille « SOL » (Mono)
- ScoreDial : anneau ambre balayant 0 → « **62** » /100 (Mono)
- pastille verdict : « À surveiller » + « confiance élevée »
- note Mono discrète : « avant red flags 67 · −5 pts »
- ligne serif italique (Newsreader), sous le dial : *« Le verdict en un coup d'œil. »*

Reproduce: the count-up ring IS the ScoreDial — sweep the amber arc while the center number counts 0→62, land on the verdict. Keep the count-up-ring signature; this is the film's climax.
Scene 1 (0.0–1.4s): near-black field; the Solana identity seats upper-center — solana-logo (small) + "Solana" (Sans) + "SOL" mono pill — via **spring-pop** (`spring-pop-entrance`, smooth). The empty ScoreDial track (amber-8%) draws in beneath, centered ~46%.
Scene 2 (1.4–4.3s): the amber arc **self-draws** 0→62 (`svg-path-draw` + `stat-bars-and-fills`) while the center number **counts up** 0→"62" in mono (`counting-dynamic-scale`), "/100" small beside it; a slow, minimal push-in on the dial (`multi-phase-camera`) settles as the number lands — the climax reveal.
Scene 3 (4.3–5.5s): the verdict pill "À surveiller" + "confiance élevée" reveals to the right of the dial on its cue (`spring-pop-entrance`); the mono meta "avant red flags 67 · −5 pts" fades in small beneath.
Scene 4 (5.5–6.5s): the serif italic line "Le verdict en un coup d'œil." reveals beneath the dial (per-word, Newsreader italic), then the whole frame **HOLDS** — landed and still; only a live SVG internal (the ring's end-cap a subtle finite pulse) keeps it alive. Deliberate held climax — no breathing, no drift.

narrativeRole: La preuve émotionnelle — un token reconnaissable, une note défendable, un verdict net. C'est le pic de la vidéo.
keyMessage: Crypto Analyst rend un score qu'on peut défendre.

## Frame 5 — Proof · les six piliers

- scene: Six barres de score étiquetées s'assemblent en cascade ; vert sur le pilier fort, ambre ailleurs ; une note red-flag.
- voiceover: ""
- duration: 5.5s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/05-pillars.html
- type: feature_showcase
- persuasion: Value stacking (preuve par la structure)
- beat: confidence → control
- blueprint: grid-card-assemble (Adapt — bar-ranking treatment)
- focal: — (native data-viz)
- asset_candidates:

On-screen (barres qui se remplissent, valeur Mono à droite) :
- eyebrow mono : « 6 PILIERS CHIFFRÉS »
- Fondamentaux — 80 (vert · success) · Social & mindshare — 68 · Sécurité & risques — 63 · Tokenomics — 57 · Marché & valorisation — 57 · Traction on-chain — 49 (ambre)
- bandeau bas : « 1 red flag majeur · 6 mineurs — explicites, jamais adoucis »

Adapt: bar-ranking treatment of grid-card-assemble — six labeled score bars self-assemble top→bottom in a staggered cascade; each fills to its value as it lands. Keep the staggered cascade; the fill is the proof.
Scene 1 (0.0–1.2s): eyebrow "6 PILIERS CHIFFRÉS" (mono amber) reveals top-left; the six empty bar tracks (amber-8%) stack in via a fast staggered reveal, left-anchored ~70% width.
Scene 2 (1.2–4.3s): each bar **fills** to its value in a staggered cascade (`stat-bars-and-fills`, smooth long-tail) — Sans label left, mono value **counting up** right — Fondamentaux→80 (success-green fill), Social→68, Sécurité→63, Tokenomics→57, Marché→57, Traction→49 (amber fills). One bar at a time, paced — never dumped.
Scene 3 (4.3–5.5s): the bottom strip "1 red flag majeur · 6 mineurs — explicites, jamais adoucis" reveals (mono; "majeur" inline `negative` red), then hold still. Subtle jitter at most.

narrativeRole: Montre la profondeur — le score n'est pas une boîte noire : six piliers pondérés, des red flags nommés, tout horodaté et sourcé.
keyMessage: La sévérité est visible ; rien n'est masqué.

## Frame 6 — CTA · arrêtez de deviner

- scene: Tout se vide ; la ligne-verdict serif revient, le bouton CTA ambre se condense au centre, le wordmark se pose.
- voiceover: ""
- duration: 4.5s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/06-cta.html
- type: cta
- persuasion: Risk reversal + callback (la promesse d'ouverture, payée)
- beat: resolve → motivation-to-act
- blueprint: cta-morph-press (Adapt)
- focal: — (wordmark + CTA, native)
- asset_candidates:

On-screen :
- ligne serif italique (Newsreader), centrée : *« Une note que vous pouvez défendre. »*
- bouton CTA ambre plein (pill) : « Analyser un projet »
- wordmark : carré ambre + « Crypto Analyst »
- micro-line mono, en bas : « 0 € de données · 100 % local · aucun chiffre inventé »

Adapt: no real cursor (brand forbids browser chrome) — the identity condenses into the one amber CTA at a single center; the serif callback line is the payoff. Keep the morph-to-CTA condense as the signature; a press/settle stands in for the literal click.
Scene 1 (0.0–1.4s): everything clears to near-black; the serif italic line "Une note que vous pouvez défendre." reveals centered via per-word reveal (Newsreader italic), near-white — the callback to the open.
Scene 2 (1.4–2.8s): the line settles upward; the solid amber CTA pill "Analyser un projet" **condenses in** at center (`scale-swap-transition` into a `press-release-spring` settle, smooth) — the one solid element.
Scene 3 (2.8–4.5s): the wordmark (amber square + "Crypto Analyst") reveals beneath the CTA; the mono micro-line "0 € de données · 100 % local · aucun chiffre inventé" fades in at the bottom; hold still under a restrained ambient glow on the CTA (`ambient-glow-bloom`). Final frame — a soft settle/hold is allowed here.

narrativeRole: Referme la boucle sur la promesse d'ouverture (« défendre »), transforme la tension du début en invitation à agir.
keyMessage: Arrêtez de deviner — lancez une analyse défendable.
