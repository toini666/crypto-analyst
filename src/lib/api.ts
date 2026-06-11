// Appels API côté client.

export async function launchAnalysis(tokenName: string, ticker: string): Promise<string> {
  const res = await fetch("/api/analyses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token_name: tokenName, ticker }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Le lancement de l'analyse a échoué");
  return json.id as string;
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "La suppression a échoué");
  }
}
