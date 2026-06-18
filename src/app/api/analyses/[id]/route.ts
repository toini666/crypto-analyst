// GET    /api/analyses/[id] — analyse + ses événements (lecture pour la page de détail).
// DELETE /api/analyses/[id] — suppression d'une analyse (et de ses événements, en cascade).
import { NextResponse } from "next/server";
import { deleteAnalysis, getAnalysis, listEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analysis = getAnalysis(id);
  if (!analysis) return NextResponse.json({ error: "introuvable" }, { status: 404 });
  return NextResponse.json({ analysis, events: listEvents(id) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    deleteAnalysis(id);
  } catch (e) {
    const message = e instanceof Error ? e.message : "suppression échouée";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
