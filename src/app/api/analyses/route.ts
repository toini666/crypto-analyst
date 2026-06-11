// POST /api/analyses — crée une analyse et lance le runner en processus détaché.
import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  token_name: z.string().min(1).max(100),
  ticker: z.string().min(1).max(20),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "token_name et ticker sont requis" },
      { status: 400 }
    );
  }
  const { token_name, ticker } = parsed.data;

  const db = createAdminClient();
  const { data, error } = await db
    .from("analyses")
    .insert({ token_name: token_name.trim(), ticker: ticker.trim().toUpperCase() })
    .select("id")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insertion échouée" }, { status: 500 });
  }

  // Runner détaché : l'analyse survit au cycle de vie de la requête HTTP.
  const root = process.cwd();
  const logsDir = path.join(root, "logs");
  mkdirSync(logsDir, { recursive: true });
  const log = openSync(path.join(logsDir, `${data.id}.log`), "a");

  const child = spawn(
    path.join(root, "node_modules", ".bin", "tsx"),
    [path.join(root, "scripts", "run-analysis.ts"), data.id],
    { cwd: root, detached: true, stdio: ["ignore", log, log], env: process.env }
  );
  child.unref();

  return NextResponse.json({ id: data.id }, { status: 201 });
}
