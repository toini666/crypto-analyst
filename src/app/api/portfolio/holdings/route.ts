// POST /api/portfolio/holdings — ajoute une ligne au portefeuille par défaut.
import { NextResponse } from "next/server";
import { z } from "zod";
import { addHolding, getOrCreateDefaultPortfolio } from "@/lib/db";
import { PORTFOLIO_SECTORS } from "@/engine/methodology";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  name: z.string().min(1).max(100),
  ticker: z.string().min(1).max(20),
  sector: z.enum(PORTFOLIO_SECTORS),
  amount: z.number().nonnegative().max(1e12),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "name, ticker, sector et amount sont requis" },
      { status: 400 }
    );
  }
  const { name, ticker, sector, amount } = parsed.data;
  const portfolio = getOrCreateDefaultPortfolio();
  const id = addHolding(portfolio.id, {
    name: name.trim(),
    ticker: ticker.trim().toUpperCase(),
    sector,
    amount,
  });
  return NextResponse.json({ id }, { status: 201 });
}
