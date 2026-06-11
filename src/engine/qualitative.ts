// Phase qualitative — Claude Code en mode headless local (claude -p).
// Aucune API LLM externe : on s'appuie sur l'installation locale de Claude Code.
// Le LLM ne calcule AUCUNE métrique : il reçoit les données déterministes en
// lecture seule et produit les sections qualitatives (équipe, utilité, unlocks,
// comparables…) sourcées par recherche web, au format JSON strict.

import { spawn } from "node:child_process";
import os from "node:os";
import { z } from "zod";
import type { Metrics, QualitativeResult, RedFlag } from "@/lib/types";

const sectionSchema = z.object({
  score: z.number().min(0).max(100).nullable(),
  resume: z.string(),
  analyse: z.string(),
  red_flags: z.array(z.string()).default([]),
  sources: z.array(z.string()).default([]),
});

const qualitativeSchema = z.object({
  project_summary: z.string(),
  narrative: z.string(),
  sections: z.object({
    equipe_financement: sectionSchema,
    probleme_solution: sectionSchema,
    execution_roadmap: sectionSchema,
    token_utilite_capture: sectionSchema,
    unlocks_inflation: sectionSchema,
    adoption_qualitative: sectionSchema,
    comparables: sectionSchema.extend({
      table: z
        .array(
          z.object({
            nom: z.string(),
            market_cap: z.string(),
            fdv: z.string(),
            commentaire: z.string(),
          })
        )
        .default([]),
    }),
    mindshare: sectionSchema,
    audits_legal: sectionSchema,
  }),
  catalyseurs: z.array(z.string()).default([]),
  declencheurs_negatifs: z.array(z.string()).default([]),
  these: z.string(),
  forces: z.array(z.string()).default([]),
  faiblesses: z.array(z.string()).default([]),
});

const SYSTEM_PROMPT = `Tu es un analyste crypto senior spécialiste de la due diligence de projets blockchain.
Tu produis la partie QUALITATIVE d'un rapport d'analyse. Les métriques quantitatives ont déjà été
calculées de façon déterministe par le système et te sont fournies : tu ne les recalcules JAMAIS
et tu n'inventes JAMAIS de chiffre. Tout chiffre supplémentaire que tu cites doit provenir d'une
source web que tu listes (URL) avec sa date.

Règles impératives :
- Recherche web active (WebSearch/WebFetch) pour : équipe, investisseurs, roadmap, news récentes,
  utilité du token, calendrier d'unlocks (Tokenomist, CryptoRank, docs officielles), audits
  (CertiK, Trail of Bits…), comparables du même narratif, mindshare récent.
- Ton neutre, analytique, professionnel. Français.
- Chaque section : score /100 calibré (50 = moyenne du marché, 80+ = exceptionnel, ≤30 = défaillant),
  resume en une phrase percutante, analyse argumentée (150-250 mots), red_flags explicites
  (uniquement les VRAIS signaux d'alerte, liste vide sinon), sources (URLs consultées).
- Si une information est introuvable : score null et dis-le dans l'analyse. N'invente rien.
- "token_utilite_capture" applique le test de capture de valeur : si le projet réussit, qu'est-ce
  qui force mécaniquement la valeur vers le détenteur du token ? Gouvernance seule = score ≤ 40.
- "unlocks_inflation" cherche le calendrier de vesting réel : cliffs < 90 jours et inflation
  > 20 %/an = red flags majeurs (à mentionner dans red_flags).
- Ta réponse finale doit être UNIQUEMENT un objet JSON valide conforme au schéma fourni,
  sans texte avant ou après, sans bloc de code markdown.`;

function buildPrompt(
  tokenName: string,
  ticker: string,
  coingeckoId: string,
  description: string,
  homepage: string,
  metrics: Metrics,
  quantRedFlags: RedFlag[]
): string {
  const schemaSkeleton = `{
  "project_summary": "description du projet en 2 lignes max",
  "narrative": "un seul mot-clé parmi : DeFi | L1 | L2 | meme | DePIN | RWA | AI | gaming | infra | stablecoin | autre",
  "sections": {
    "equipe_financement": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "probleme_solution": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "execution_roadmap": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "token_utilite_capture": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "unlocks_inflation": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "adoption_qualitative": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "comparables": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [], "table": [ { "nom": "", "market_cap": "", "fdv": "", "commentaire": "" } ] },
    "mindshare": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] },
    "audits_legal": { "score": 0, "resume": "", "analyse": "", "red_flags": [], "sources": [] }
  },
  "catalyseurs": ["4-5 déclencheurs positifs concrets et datables"],
  "declencheurs_negatifs": ["4-5 signaux d'invalidation concrets"],
  "these": "thèse d'investissement falsifiable en 2-3 phrases",
  "forces": ["3 forces principales"],
  "faiblesses": ["3 faiblesses principales"]
}`;

  return `Analyse le projet crypto suivant.

## Identité
- Nom : ${tokenName}
- Ticker : ${ticker.toUpperCase()}
- Id CoinGecko : ${coingeckoId}
- Site : ${homepage || "inconnu"}
- Description CoinGecko : ${description ? description.slice(0, 600) : "non fournie"}

## Métriques déterministes déjà calculées (source de vérité, ne pas recalculer)
${JSON.stringify(metrics, null, 2)}

## Red flags quantitatifs déjà détectés
${quantRedFlags.length > 0 ? quantRedFlags.map((f) => `- [${f.severity}] ${f.label} (${f.detail})`).join("\n") : "Aucun"}

## Travail demandé
Remplis le schéma JSON suivant après tes recherches web. Réponds UNIQUEMENT avec le JSON.

${schemaSkeleton}`;
}

function extractJson(text: string): unknown {
  // Claude peut entourer le JSON de fences malgré la consigne : on extrait le bloc.
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Aucun objet JSON dans la réponse");
  return JSON.parse(candidate.slice(start, end + 1));
}

interface ClaudeEnvelope {
  type: string;
  subtype: string;
  is_error: boolean;
  result?: string;
}

function runClaude(prompt: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      "-p",
      "--output-format", "json",
      "--system-prompt", SYSTEM_PROMPT,
      "--allowedTools", "WebSearch", "WebFetch",
      "--strict-mcp-config",
      "--mcp-config", '{"mcpServers":{}}',
    ];
    const model = process.env.CLAUDE_QUAL_MODEL;
    if (model) args.push("--model", model);

    // cwd neutre : on ne veut pas charger le CLAUDE.md de ce repo dans l'analyse.
    const child = spawn("claude", args, { cwd: os.tmpdir(), env: process.env });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Phase qualitative interrompue après ${timeoutMs / 60000} min`));
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

const TIMEOUT_MS = 25 * 60 * 1000;

export async function runQualitativeAnalysis(
  tokenName: string,
  ticker: string,
  coingeckoId: string,
  description: string,
  homepage: string,
  metrics: Metrics,
  quantRedFlags: RedFlag[]
): Promise<QualitativeResult> {
  const prompt = buildPrompt(tokenName, ticker, coingeckoId, description, homepage, metrics, quantRedFlags);

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await runClaude(
        attempt === 0
          ? prompt
          : `${prompt}\n\nIMPORTANT : ta précédente réponse n'était pas un JSON valide (${lastError?.message}). Réponds STRICTEMENT avec le JSON.`,
        TIMEOUT_MS
      );
      const parsed = qualitativeSchema.parse(extractJson(raw));
      return parsed as QualitativeResult;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw new Error(`Phase qualitative échouée après 2 tentatives : ${lastError?.message}`);
}
