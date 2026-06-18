// Backend local : SQLite (fichier unique, mode WAL) — aucun serveur, aucun Docker.
// Le serveur Next.js et le runner détaché (scripts/run-analysis.ts) sont deux
// processus distincts qui ouvrent le même fichier ; WAL autorise plusieurs
// lecteurs + un rédacteur en concurrence. Toute la (dé)sérialisation JSON des
// colonnes objet vit ici, pour que l'appelant manipule des objets typés.

import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { AnalysisEvent, AnalysisListRow, AnalysisRow } from "@/lib/types";

const DB_PATH =
  process.env.DB_PATH ?? path.join(process.cwd(), "data", "app.db");

// Colonnes stockées en JSON (texte) côté SQLite, exposées en objets côté app.
const JSON_COLUMNS = ["pillar_scores", "red_flags", "metrics", "raw_data"] as const;

const SCHEMA = `
create table if not exists analyses (
  id text primary key,
  created_at text not null,
  updated_at text not null,

  token_name text not null,
  ticker text not null,
  coingecko_id text,
  token_image text,

  status text not null default 'pending'
    check (status in ('pending','running','completed','failed')),
  current_step text,
  progress integer not null default 0 check (progress between 0 and 100),
  error text,

  methodology_version text,
  global_score real,
  verdict text check (verdict in ('privilegier','surveiller','eviter')),
  confidence text check (confidence in ('high','medium','low')),
  pillar_scores text,
  red_flags text,
  metrics text,
  raw_data text,
  report_md text
);

create table if not exists analysis_events (
  id integer primary key autoincrement,
  analysis_id text not null references analyses(id) on delete cascade,
  created_at text not null,
  step text not null,
  level text not null default 'info' check (level in ('info','warn','error','success')),
  message text not null
);

create index if not exists analysis_events_analysis_idx on analysis_events (analysis_id, id);
create index if not exists analyses_created_idx on analyses (created_at desc);
`;

// Connexion unique, mise en cache sur globalThis pour survivre au hot-reload de
// Next en dev (sinon chaque rechargement ouvre un nouveau handle → verrous).
const globalForDb = globalThis as unknown as {
  __cryptoAnalystDb?: Database.Database;
};

function init(): Database.Database {
  mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(SCHEMA);
  return db;
}

export function getDb(): Database.Database {
  if (!globalForDb.__cryptoAnalystDb) {
    globalForDb.__cryptoAnalystDb = init();
  }
  return globalForDb.__cryptoAnalystDb;
}

/** Désérialise les colonnes JSON d'une ligne brute SQLite. */
function hydrate(raw: Record<string, unknown> | undefined): AnalysisRow | null {
  if (!raw) return null;
  const row = { ...raw } as Record<string, unknown>;
  for (const col of JSON_COLUMNS) {
    const v = row[col];
    row[col] = typeof v === "string" ? JSON.parse(v) : null;
  }
  return row as unknown as AnalysisRow;
}

// Colonnes patchables par le pipeline (whitelist : pas de SQL dynamique non maîtrisé).
const PATCHABLE = new Set([
  "coingecko_id",
  "token_image",
  "status",
  "current_step",
  "progress",
  "error",
  "methodology_version",
  "global_score",
  "verdict",
  "confidence",
  "pillar_scores",
  "red_flags",
  "metrics",
  "raw_data",
  "report_md",
]);

const JSON_COLUMN_SET = new Set<string>(JSON_COLUMNS);

/** Crée une analyse en statut `pending` et renvoie son id. */
export function createAnalysis(input: { token_name: string; ticker: string }): string {
  const id = randomUUID();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `insert into analyses (id, created_at, updated_at, token_name, ticker)
       values (@id, @now, @now, @token_name, @ticker)`
    )
    .run({ id, now, token_name: input.token_name, ticker: input.ticker });
  return id;
}

/** Analyse complète (colonnes JSON désérialisées), ou null si absente. */
export function getAnalysis(id: string): AnalysisRow | null {
  const raw = getDb()
    .prepare("select * from analyses where id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return hydrate(raw);
}

const LIST_COLUMNS =
  "id, created_at, updated_at, token_name, ticker, coingecko_id, token_image, status, current_step, progress, error, methodology_version, global_score, verdict, confidence";

/** Liste des analyses (sans les gros champs JSON), de la plus récente à la plus ancienne. */
export function listAnalyses(): AnalysisListRow[] {
  return getDb()
    .prepare(`select ${LIST_COLUMNS} from analyses order by created_at desc`)
    .all() as AnalysisListRow[];
}

export function deleteAnalysis(id: string): void {
  getDb().prepare("delete from analyses where id = ?").run(id);
}

/** Met à jour un sous-ensemble de colonnes (les colonnes objet sont sérialisées ici). */
export function patchAnalysis(id: string, fields: Record<string, unknown>): void {
  const keys = Object.keys(fields).filter((k) => PATCHABLE.has(k));
  if (keys.length === 0) return;
  const assignments = keys.map((k) => `${k} = @${k}`).join(", ");
  const params: Record<string, unknown> = { id, updated_at: new Date().toISOString() };
  for (const k of keys) {
    const v = fields[k];
    params[k] = JSON_COLUMN_SET.has(k) && v != null ? JSON.stringify(v) : (v ?? null);
  }
  getDb()
    .prepare(`update analyses set ${assignments}, updated_at = @updated_at where id = @id`)
    .run(params);
}

export function insertEvent(input: {
  analysis_id: string;
  step: string;
  level: AnalysisEvent["level"];
  message: string;
}): void {
  getDb()
    .prepare(
      `insert into analysis_events (analysis_id, created_at, step, level, message)
       values (@analysis_id, @created_at, @step, @level, @message)`
    )
    .run({ ...input, created_at: new Date().toISOString() });
}

export function listEvents(analysisId: string): AnalysisEvent[] {
  return getDb()
    .prepare("select * from analysis_events where analysis_id = ? order by id asc")
    .all(analysisId) as AnalysisEvent[];
}
