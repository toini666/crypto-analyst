// Persistance des rapports Markdown sur disque (dossier `reports/`, commité au
// repo). Le navigateur télécharge déjà le .md depuis la base ; ici on garde une
// copie versionnée par analyse — pratique à relire/diffuser hors de l'app, et
// les rapports sont coûteux à régénérer.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

export function reportsDir(): string {
  return path.join(process.cwd(), "reports");
}

/** Nom de fichier stable, aligné sur le nom de téléchargement de l'UI. */
export function reportFilename(ticker: string, createdAt: string): string {
  return `${ticker.toLowerCase()}-due-diligence-${createdAt.slice(0, 10)}.md`;
}

/** Écrit le rapport Markdown dans `reports/` et renvoie le chemin du fichier. */
export function writeReportFile(ticker: string, createdAt: string, markdown: string): string {
  const dir = reportsDir();
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, reportFilename(ticker, createdAt));
  writeFileSync(file, markdown, "utf8");
  return file;
}
