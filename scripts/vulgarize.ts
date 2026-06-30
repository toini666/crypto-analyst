// Repasse de vulgarisation des analyses existantes — réécrit la PROSE qualitative
// pour la rendre accessible à un lecteur non technique, SANS re-fetcher ni
// re-générer l'analyse. On part toujours de la version d'origine (sauvegardée
// dans raw_data.qualitative_original), donc la repasse est ré-exécutable.
//
//   tsx scripts/vulgarize.ts                 → DRY-RUN sur toutes les analyses
//   tsx scripts/vulgarize.ts <analysisId>    → DRY-RUN sur une seule
//   tsx scripts/vulgarize.ts --apply         → applique en base + écrit les .md
//
// Garanties : scores, sources, sévérités de red flags et chiffres du tableau de
// comparables sont conservés par fusion en code (jamais envoyés au LLM). Un
// garde-fou compare les nombres présents dans la prose avant/après et alerte si
// un chiffre a été modifié, ajouté ou perdu.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import type { CoinGeckoCoin } from "@/engine/fetchers/coingecko";
import type { DefiLlamaData } from "@/engine/fetchers/defillama";
import type { GoPlusData } from "@/engine/fetchers/goplus";
import type { GitHubData } from "@/engine/fetchers/github";
import type { QualitativeResult } from "@/lib/types";

const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) process.loadEnvFile(envPath);

interface RawData {
  coin: CoinGeckoCoin;
  defi: DefiLlamaData;
  security: GoPlusData;
  dev: GitHubData;
  qualitative: QualitativeResult | null;
  qualitative_original?: QualitativeResult | null;
  scoring?: unknown;
}

interface DbRow {
  id: string;
  created_at: string;
  token_name: string;
  ticker: string;
  coingecko_id: string | null;
  global_score: number | null;
  verdict: string | null;
  raw_data: string | null;
}

/** Concatène toute la prose d'un qualitatif (pour le contrôle des chiffres). */
function proseText(q: QualitativeResult): string {
  const parts: string[] = [
    q.project_summary,
    q.these,
    ...q.forces,
    ...q.faiblesses,
    ...q.catalyseurs,
    ...q.declencheurs_negatifs,
  ];
  for (const s of Object.values(q.sections)) {
    parts.push(s.resume, s.analyse, ...s.red_flags.map((f) => f.label));
  }
  for (const r of q.sections.comparables.table) parts.push(r.commentaire);
  return parts.join("\n");
}

/** Multiset des « jetons numériques » d'un texte (montants, %, années…). */
function numberCounts(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const raw of text.match(/\d[\d.,]*\s*%?/g) ?? []) {
    // Normalise : on retire les espaces et la ponctuation de fin de phrase
    // (virgule/point en fin de jeton) pour ne pas compter « 2026, » ≠ « 2026 ».
    // Le « % » est conservé (20 ≠ 20 %), le « $ »/suffixes (B, M) sont déjà hors capture.
    const tok = raw.replace(/\s+/g, "").replace(/[.,]+$/, "");
    if (tok) m.set(tok, (m.get(tok) ?? 0) + 1);
  }
  return m;
}

/** Différence de chiffres entre prose d'origine et prose vulgarisée. */
function numberDrift(before: string, after: string): { lost: string[]; added: string[] } {
  const b = numberCounts(before);
  const a = numberCounts(after);
  const lost: string[] = [];
  const added: string[] = [];
  for (const [tok, n] of b) if ((a.get(tok) ?? 0) < n) lost.push(tok);
  for (const [tok, n] of a) if ((b.get(tok) ?? 0) < n) added.push(tok);
  return { lost, added };
}

function snippet(s: string, n = 240): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
}

async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  // --chunk : réécriture en 2 passes (pour les gros rapports qui traînent en 1 appel).
  const chunked = argv.includes("--chunk");
  // Flags valués : valeur = jeton suivant (s'il n'est pas lui-même un flag).
  const flagValue = (name: string): string | null => {
    const i = argv.indexOf(name);
    return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : null;
  };
  // --dump-prose <dir> : écrit la prose source à réécrire (n'appelle pas claude).
  const dumpDir = flagValue("--dump-prose");
  // --from <dir> : lit la prose déjà vulgarisée dans <dir>/<ticker>-vulg.json.
  const fromDir = flagValue("--from");
  const consumed = new Set([dumpDir, fromDir].filter(Boolean) as string[]);
  // Filtre optionnel : un ou plusieurs ids (le reste des args hors flags/valeurs).
  const idFilters = new Set(argv.filter((a) => !a.startsWith("--") && !consumed.has(a)));

  const { getDb, patchAnalysis } = await import("@/lib/db");
  const { computeMetrics } = await import("@/engine/metrics");
  const { detectQuantRedFlags } = await import("@/engine/redflags");
  const { computeScoring } = await import("@/engine/scoring");
  const { buildReport } = await import("@/engine/report");
  const { METHODOLOGY_VERSION } = await import("@/engine/methodology");
  const { vulgarizeQualitative, vulgarizeQualitativeChunked, extractProse, mergeVulgarizedProse } =
    await import("@/engine/vulgarization");
  const { writeReportFile } = await import("@/lib/reportFile");

  const db = getDb();
  const rows = (
    db
      .prepare(
        `select id, created_at, token_name, ticker, coingecko_id, global_score, verdict, raw_data
         from analyses where status = 'completed' order by created_at desc`
      )
      .all() as DbRow[]
  ).filter((r) => idFilters.size === 0 || idFilters.has(r.id));

  console.log(
    `\nVulgarisation de ${rows.length} analyse(s) — mode ${apply ? "APPLY ✍️" : "DRY-RUN 👀"}${idFilters.size ? ` (${idFilters.size} id ciblé·s)` : ""}\n`
  );

  let ok = 0;
  let skipped = 0;
  let warned = 0;

  for (const row of rows) {
    if (!row.raw_data) {
      console.log(`• ${row.ticker} — raw_data manquant, ignoré`);
      skipped++;
      continue;
    }
    const raw = JSON.parse(row.raw_data) as RawData;
    const { coin, defi, dev, security } = raw;
    // Toujours repartir de l'original : repasse idempotente.
    const source = raw.qualitative_original ?? raw.qualitative;
    if (!source) {
      console.log(`• ${row.ticker} — pas de qualitatif, rien à vulgariser`);
      skipped++;
      continue;
    }

    // Mode --dump-prose : on écrit la prose source à réécrire, sans rien d'autre.
    if (dumpDir) {
      mkdirSync(dumpDir, { recursive: true });
      const f = path.join(dumpDir, `${row.ticker}-prose.json`);
      writeFileSync(f, JSON.stringify(extractProse(source), null, 2), "utf8");
      console.log(`• ${row.ticker} — prose exportée → ${path.relative(process.cwd(), f)}`);
      ok++;
      continue;
    }

    process.stdout.write(
      `• ${row.ticker} — ${fromDir ? "réinjection" : `réécriture${chunked ? " (2 passes)" : ""}`} en cours…`
    );
    let vqual: QualitativeResult;
    try {
      if (fromDir) {
        const f = path.join(fromDir, `${row.ticker}-vulg.json`);
        vqual = mergeVulgarizedProse(source, JSON.parse(readFileSync(f, "utf8")));
      } else {
        vqual = chunked ? await vulgarizeQualitativeChunked(source) : await vulgarizeQualitative(source);
      }
    } catch (e) {
      console.log(` ÉCHEC : ${e instanceof Error ? e.message : String(e)}`);
      skipped++;
      continue;
    }

    // Contrôle de préservation des chiffres (alerte, ne bloque pas).
    const drift = numberDrift(proseText(source), proseText(vqual));
    const driftNote =
      drift.lost.length || drift.added.length
        ? ` ⚠️ chiffres modifiés — perdus: [${drift.lost.join(", ")}] ajoutés: [${drift.added.join(", ")}]`
        : " ✓ chiffres préservés";
    console.log(driftNote);
    if (drift.lost.length || drift.added.length) warned++;

    // Re-scoring (identique en valeur : les scores de section sont préservés) —
    // sert surtout à propager les libellés de red flags vulgarisés.
    const metrics = computeMetrics(coin, defi, security, dev);
    const quantRedFlags = detectQuantRedFlags(metrics, security);
    const scoring = computeScoring(metrics, quantRedFlags, vqual);
    const report = buildReport(
      coin.name,
      coin.symbol,
      row.coingecko_id ?? coin.id,
      metrics,
      scoring,
      vqual,
      { createdAt: row.created_at }
    );

    const before = row.global_score == null ? "n/d" : String(Math.round(row.global_score));
    const after = scoring.globalScore == null ? "n/d" : String(scoring.globalScore);
    if (before !== after) {
      console.log(`    ⚠️ score modifié ${before} → ${after} (attendu identique) — à vérifier`);
      warned++;
    }

    // Aperçu avant/après pour relecture humaine (thèse + une analyse).
    console.log(`    thèse  AVANT : ${snippet(source.these)}`);
    console.log(`    thèse  APRÈS : ${snippet(vqual.these)}`);
    console.log(`    util.  AVANT : ${snippet(source.sections.token_utilite_capture.analyse)}`);
    console.log(`    util.  APRÈS : ${snippet(vqual.sections.token_utilite_capture.analyse)}`);

    // En dry-run, dump complet avant/après (logs/, gitignoré) pour inspection fine.
    if (!apply) {
      const dir = path.join(process.cwd(), "logs");
      mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, `vulg-${row.ticker}-before.txt`), proseText(source), "utf8");
      writeFileSync(path.join(dir, `vulg-${row.ticker}-after.txt`), proseText(vqual), "utf8");
    }

    if (apply) {
      patchAnalysis(row.id, {
        methodology_version: METHODOLOGY_VERSION,
        global_score: scoring.globalScore,
        verdict: scoring.verdict,
        confidence: scoring.confidence,
        pillar_scores: scoring.pillars,
        red_flags: scoring.redFlags,
        metrics,
        report_md: report,
        raw_data: {
          coin,
          defi,
          security,
          dev,
          qualitative: vqual,
          qualitative_original: source,
          scoring: {
            rawScore: scoring.rawScore,
            redFlagPenalty: scoring.redFlagPenalty,
            contractCriticalCap: scoring.contractCriticalCap,
          },
        },
      });
      const file = writeReportFile(coin.symbol, row.created_at, report);
      console.log(`    ✍️  appliqué + ${path.relative(process.cwd(), file)}`);
    }
    ok++;
  }

  console.log(
    `\n${apply ? "✅ Appliqué" : "👀 Dry-run terminé"} — ${ok} vulgarisée(s), ${skipped} ignorée(s), ${warned} alerte(s).` +
      (apply ? "\n" : "\nRelance avec --apply pour écrire en base et générer les .md.\n")
  );
}

main().catch((e) => {
  console.error("[vulgarize] Échec :", e);
  process.exit(1);
});
