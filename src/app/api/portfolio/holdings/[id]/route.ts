// PATCH  /api/portfolio/holdings/[id] — modifie une ligne (montant, secteur…).
// DELETE /api/portfolio/holdings/[id] — retire une ligne.
import { NextResponse } from "next/server";
import { z } from "zod";
import { removeHolding, updateHolding } from "@/lib/db";
import { PORTFOLIO_SECTORS } from "@/engine/methodology";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    ticker: z.string().min(1).max(20).optional(),
    sector: z.enum(PORTFOLIO_SECTORS).optional(),
    amount: z.number().nonnegative().max(1e12).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "aucun champ" });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "champs invalides" }, { status: 400 });
  }
  const fields = { ...parsed.data };
  if (fields.ticker) fields.ticker = fields.ticker.trim().toUpperCase();
  if (fields.name) fields.name = fields.name.trim();
  try {
    updateHolding(id, fields);
  } catch (e) {
    const message = e instanceof Error ? e.message : "mise à jour échouée";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    removeHolding(id);
  } catch (e) {
    const message = e instanceof Error ? e.message : "suppression échouée";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
