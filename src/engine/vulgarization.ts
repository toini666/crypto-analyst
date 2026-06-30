// Vulgarisation de la partie qualitative.
//
// Deux usages d'un même socle de règles (VULGARIZATION_GUIDE) :
//   1. À la génération (qualitative.ts) : Claude rédige d'emblée accessible.
//   2. En repasse (scripts/vulgarize.ts) : on réécrit la prose d'analyses déjà
//      produites SANS la régénérer ni re-fetcher — on garde l'essence et le fond,
//      on n'allège que la forme.
//
// Invariant respecté : aucun chiffre ne passe par le LLM pour être (re)calculé.
// Ici, on n'envoie au modèle QUE des champs de prose (résumés, analyses, thèse…)
// et on lui interdit de modifier le moindre chiffre, %, date, ticker ou nom
// propre. Les scores, sources, sévérités et chiffres du tableau de comparables
// ne sont jamais transmis : ils sont conservés tels quels par fusion en code.

import { spawn } from "node:child_process";
import os from "node:os";
import { z } from "zod";
import type { QualitativeResult } from "@/lib/types";

/** Socle de style partagé entre la rédaction initiale et la repasse. */
export const VULGARIZATION_GUIDE = `Accessibilité (lecteur non spécialiste) :
- Écris pour un lecteur curieux mais NON technique, qui ne maîtrise pas le jargon crypto/finance.
- Garde TOUTE la rigueur, la profondeur et les nuances : on vulgarise la forme, jamais le fond. Ne supprime aucun argument, n'efface aucune réserve, ne change aucun verdict.
- À la première occurrence d'un terme technique indispensable (TVL, FDV, MC/FDV, unlock/vesting, gouvernance, staking, slashing, oracle, L1/L2, dilution, market maker, P/S…), explique-le en quelques mots, simplement, par exemple entre parenthèses. Pas d'acronyme non explicité, pas de jargon gratuit.
- Phrases plutôt courtes et concrètes ; une analogie du quotidien est bienvenue quand elle éclaire vraiment, jamais pour faire joli.
- Pas de simplification excessive ni de ton « pour les nuls » : le lecteur doit saisir les subtilités, pas recevoir une version appauvrie.
- Ton pédagogue, clair, neutre et professionnel. Français.`;

// ── Clés des 9 sections qualitatives (ordre stable). ──
const SECTION_KEYS = [
  "equipe_financement",
  "probleme_solution",
  "execution_roadmap",
  "token_utilite_capture",
  "unlocks_inflation",
  "adoption_qualitative",
  "comparables",
  "mindshare",
  "audits_legal",
] as const;
type SectionKey = (typeof SECTION_KEYS)[number];

/** Sous-ensemble « prose » d'une section : ce qu'on autorise le LLM à reformuler. */
const sectionProseSchema = z.object({
  resume: z.string(),
  analyse: z.string(),
  red_flags: z.array(z.string()).default([]),
});

const proseBundleSchema = z.object({
  project_summary: z.string(),
  these: z.string(),
  forces: z.array(z.string()),
  faiblesses: z.array(z.string()),
  catalyseurs: z.array(z.string()),
  declencheurs_negatifs: z.array(z.string()),
  sections: z.object(
    Object.fromEntries(SECTION_KEYS.map((k) => [k, sectionProseSchema])) as Record<
      SectionKey,
      typeof sectionProseSchema
    >
  ),
  comparables_commentaires: z.array(z.string()),
});
type ProseBundle = z.infer<typeof proseBundleSchema>;

/** Extrait du résultat qualitatif uniquement les champs textuels à vulgariser. */
export function extractProse(q: QualitativeResult): ProseBundle {
  const sections = Object.fromEntries(
    SECTION_KEYS.map((k) => {
      const s = q.sections[k];
      return [k, { resume: s.resume, analyse: s.analyse, red_flags: s.red_flags.map((f) => f.label) }];
    })
  ) as ProseBundle["sections"];

  return {
    project_summary: q.project_summary,
    these: q.these,
    forces: q.forces,
    faiblesses: q.faiblesses,
    catalyseurs: q.catalyseurs,
    declencheurs_negatifs: q.declencheurs_negatifs,
    sections,
    comparables_commentaires: q.sections.comparables.table.map((r) => r.commentaire),
  };
}

/** Vérifie que la réécriture a conservé la structure (longueurs de tableaux). */
function assertSameShape(orig: QualitativeResult, p: ProseBundle): void {
  const eq = (a: number, b: number, what: string) => {
    if (a !== b) throw new Error(`Réécriture incohérente : ${what} (${b} ≠ ${a} attendu)`);
  };
  eq(orig.forces.length, p.forces.length, "nombre de forces");
  eq(orig.faiblesses.length, p.faiblesses.length, "nombre de faiblesses");
  eq(orig.catalyseurs.length, p.catalyseurs.length, "nombre de catalyseurs");
  eq(orig.declencheurs_negatifs.length, p.declencheurs_negatifs.length, "nombre de déclencheurs négatifs");
  eq(orig.sections.comparables.table.length, p.comparables_commentaires.length, "commentaires de comparables");
  for (const k of SECTION_KEYS)
    eq(orig.sections[k].red_flags.length, p.sections[k].red_flags.length, `red flags de ${k}`);
}

/** Refusionne la prose vulgarisée dans le qualitatif, en conservant tout le reste. */
function mergeProse(orig: QualitativeResult, p: ProseBundle): QualitativeResult {
  const merged: QualitativeResult = structuredClone(orig);
  merged.project_summary = p.project_summary;
  merged.these = p.these;
  merged.forces = p.forces;
  merged.faiblesses = p.faiblesses;
  merged.catalyseurs = p.catalyseurs;
  merged.declencheurs_negatifs = p.declencheurs_negatifs;

  for (const k of SECTION_KEYS) {
    const src = p.sections[k];
    const dst = merged.sections[k];
    dst.resume = src.resume;
    dst.analyse = src.analyse;
    // On ne remplace QUE le label, la sévérité (qui pilote le score) reste celle d'origine.
    dst.red_flags = orig.sections[k].red_flags.map((rf, i) => ({
      severity: rf.severity,
      label: src.red_flags[i] ?? rf.label,
    }));
  }
  // Commentaires du tableau de comparables : on garde nom / market_cap / fdv intacts.
  merged.sections.comparables.table = orig.sections.comparables.table.map((row, i) => ({
    ...row,
    commentaire: p.comparables_commentaires[i] ?? row.commentaire,
  }));

  return merged;
}

/**
 * Fusionne une prose vulgarisée fournie de l'extérieur (JSON au format ProseBundle)
 * dans le qualitatif d'origine, avec les mêmes garde-fous que la voie automatique
 * (même structure, scores/sources/sévérités/chiffres du tableau préservés). Permet
 * d'appliquer une réécriture produite hors `claude -p` (relecture humaine, agent).
 */
export function mergeVulgarizedProse(qual: QualitativeResult, rawBundle: unknown): QualitativeResult {
  const bundle = proseBundleSchema.parse(rawBundle);
  assertSameShape(qual, bundle);
  return mergeProse(qual, bundle);
}

const SYSTEM_PROMPT = `Tu es un éditeur spécialisé dans la vulgarisation d'analyses financières crypto.
On te fournit la PROSE d'une analyse déjà rédigée (résumés, analyses, thèse, forces, faiblesses,
catalyseurs, signaux d'alerte, commentaires de comparables). Ta mission : la réécrire pour qu'elle
soit limpide pour un lecteur non technique, en gardant exactement le même sens et les mêmes faits.

${VULGARIZATION_GUIDE}

Contraintes ABSOLUES :
- Reproduis VERBATIM tout chiffre, pourcentage, date, montant, ticker, nom propre, nom de société,
  nom de protocole et URL. N'arrondis pas, n'ajoute pas, ne supprime aucun chiffre ni aucune source.
- Ne change ni le verdict, ni le sens, ni la sévérité d'un signal d'alerte. Aucune information nouvelle.
- Conserve EXACTEMENT la même structure : mêmes clés, et chaque tableau garde le même nombre d'éléments,
  dans le même ordre (forces, faiblesses, catalyseurs, declencheurs_negatifs, red_flags par section,
  comparables_commentaires). Réécris chaque élément à sa position, n'en fusionne ni n'en ajoute aucun.
- N'utilise aucun outil : réponds directement.
- Ta réponse finale est UNIQUEMENT l'objet JSON, sans texte autour ni bloc de code markdown.`;

function buildPrompt(bundle: ProseBundle): string {
  return `Réécris la prose ci-dessous en plus accessible, en respectant toutes les contraintes.
Renvoie un JSON STRICTEMENT identique en structure (mêmes clés, mêmes longueurs de tableaux),
seules les valeurs textuelles sont reformulées.

${JSON.stringify(bundle, null, 2)}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Aucun objet JSON dans la réponse");
  return JSON.parse(candidate.slice(start, end + 1));
}

interface ClaudeEnvelope {
  is_error: boolean;
  result?: string;
}

function runClaude(prompt: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      "-p",
      "--output-format", "json",
      "--system-prompt", SYSTEM_PROMPT,
      "--strict-mcp-config",
      "--mcp-config", '{"mcpServers":{}}',
    ];
    const model = process.env.CLAUDE_QUAL_MODEL;
    if (model) args.push("--model", model);

    // cwd neutre : ne pas charger le CLAUDE.md de ce repo dans la réécriture.
    const child = spawn("claude", args, { cwd: os.tmpdir(), env: process.env });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Vulgarisation interrompue après ${timeoutMs / 60000} min`));
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (err) => { clearTimeout(timer); reject(err); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`claude -p a échoué (code ${code}) : ${stderr.slice(0, 500)}`));
      try {
        const envelope = JSON.parse(stdout) as ClaudeEnvelope;
        if (envelope.is_error || !envelope.result)
          return reject(new Error(`claude -p en erreur : ${JSON.stringify(envelope).slice(0, 500)}`));
        resolve(envelope.result);
      } catch {
        reject(new Error(`Enveloppe JSON illisible : ${stdout.slice(0, 300)}`));
      }
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

// 6 min/essai : un appel sain est rapide (sonnet) ; au-delà l'appel est bloqué
// (file d'attente/rate-limit) → on coupe et on retente, 2 essais = 12 min max
// (sous le budget d'exécution d'une tâche d'arrière-plan).
const TIMEOUT_MS = 6 * 60 * 1000;

/**
 * Réécrit la prose d'un résultat qualitatif pour la rendre accessible, sans
 * toucher aux scores, sources, sévérités ni chiffres du tableau. Idempotent par
 * conception quand on l'appelle toujours depuis l'original (cf. scripts/vulgarize.ts).
 */
export async function vulgarizeQualitative(qual: QualitativeResult): Promise<QualitativeResult> {
  const bundle = extractProse(qual);
  const prompt = buildPrompt(bundle);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await runClaude(
        attempt === 0
          ? prompt
          : `${prompt}\n\nIMPORTANT : ta précédente réponse était invalide (${lastError?.message}). Renvoie STRICTEMENT le JSON, mêmes clés et mêmes longueurs de tableaux.`,
        TIMEOUT_MS
      );
      const parsed = proseBundleSchema.parse(extractJson(raw));
      assertSameShape(qual, parsed);
      return mergeProse(qual, parsed);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw new Error(`Vulgarisation échouée après 2 tentatives : ${lastError?.message}`);
}

/* ───────────────────────── Mode découpé (gros rapports) ─────────────────────
   Pour les analyses très volumineuses, un seul appel peut traîner au-delà du
   budget d'exécution. On scinde alors la prose en deux passes plus petites
   (donc plus rapides et fiables), validées et fusionnées à l'identique. */

interface ChunkOpts { top: boolean; comp: boolean }

/** Résultat d'une passe partielle (les champs « top » et « comp » sont optionnels). */
interface ChunkResult {
  project_summary?: string;
  these?: string;
  forces?: string[];
  faiblesses?: string[];
  catalyseurs?: string[];
  declencheurs_negatifs?: string[];
  comparables_commentaires?: string[];
  sections: Record<SectionKey, { resume: string; analyse: string; red_flags: string[] }>;
}

function buildChunkSchema(keys: readonly SectionKey[], opts: ChunkOpts) {
  const shape: Record<string, z.ZodTypeAny> = {
    sections: z.object(Object.fromEntries(keys.map((k) => [k, sectionProseSchema]))),
  };
  if (opts.top) {
    shape.project_summary = z.string();
    shape.these = z.string();
    shape.forces = z.array(z.string());
    shape.faiblesses = z.array(z.string());
    shape.catalyseurs = z.array(z.string());
    shape.declencheurs_negatifs = z.array(z.string());
  }
  if (opts.comp) shape.comparables_commentaires = z.array(z.string());
  return z.object(shape);
}

function sliceBundle(full: ProseBundle, keys: readonly SectionKey[], opts: ChunkOpts) {
  const out: Record<string, unknown> = {
    sections: Object.fromEntries(keys.map((k) => [k, full.sections[k]])),
  };
  if (opts.top) {
    out.project_summary = full.project_summary;
    out.these = full.these;
    out.forces = full.forces;
    out.faiblesses = full.faiblesses;
    out.catalyseurs = full.catalyseurs;
    out.declencheurs_negatifs = full.declencheurs_negatifs;
  }
  if (opts.comp) out.comparables_commentaires = full.comparables_commentaires;
  return out;
}

async function runChunk(partial: unknown, schema: z.ZodTypeAny): Promise<ChunkResult> {
  const prompt = buildPrompt(partial as ProseBundle);
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await runClaude(
        attempt === 0
          ? prompt
          : `${prompt}\n\nIMPORTANT : ta précédente réponse était invalide (${lastError?.message}). Renvoie STRICTEMENT le JSON, mêmes clés et mêmes longueurs de tableaux.`,
        TIMEOUT_MS
      );
      return schema.parse(extractJson(raw)) as ChunkResult;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw new Error(`Passe de vulgarisation échouée : ${lastError?.message}`);
}

/** Variante découpée en 2 passes — même résultat, appels plus petits. */
export async function vulgarizeQualitativeChunked(qual: QualitativeResult): Promise<QualitativeResult> {
  const full = extractProse(qual);
  const k1 = SECTION_KEYS.slice(0, 5);
  const k2 = SECTION_KEYS.slice(5);
  const o1: ChunkOpts = { top: true, comp: false };
  const o2: ChunkOpts = { top: false, comp: true };

  const p1 = await runChunk(sliceBundle(full, k1, o1), buildChunkSchema(k1, o1));
  const p2 = await runChunk(sliceBundle(full, k2, o2), buildChunkSchema(k2, o2));

  const bundle: ProseBundle = {
    project_summary: p1.project_summary ?? full.project_summary,
    these: p1.these ?? full.these,
    forces: p1.forces ?? full.forces,
    faiblesses: p1.faiblesses ?? full.faiblesses,
    catalyseurs: p1.catalyseurs ?? full.catalyseurs,
    declencheurs_negatifs: p1.declencheurs_negatifs ?? full.declencheurs_negatifs,
    sections: { ...full.sections },
    comparables_commentaires: p2.comparables_commentaires ?? full.comparables_commentaires,
  };
  for (const k of k1) bundle.sections[k] = p1.sections[k];
  for (const k of k2) bundle.sections[k] = p2.sections[k];

  assertSameShape(qual, bundle);
  return mergeProse(qual, bundle);
}
