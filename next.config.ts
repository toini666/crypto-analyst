import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 est un module natif : on le sort du bundling serveur
  // (require Node natif au lieu d'être empaqueté par Next).
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
