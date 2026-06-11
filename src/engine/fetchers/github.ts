// Fetcher GitHub — activité développeurs (API publique, 60 req/h sans token).
// Repo principal déduit des liens CoinGecko (links.repos_url.github).

export interface GitHubData {
  available: boolean;
  reason?: string;
  repo: string | null;
  stars: number | null;
  commits90d: number | null;
  contributors: number | null;
  lastCommitDaysAgo: number | null;
}

const EMPTY: GitHubData = {
  available: false, repo: null, stars: null, commits90d: null,
  contributors: null, lastCommitDaysAgo: null,
};

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "crypto-analyst",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function gh<T>(path: string): Promise<T | null> {
  const res = await fetch(`https://api.github.com${path}`, { headers: headers() });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

/** Extrait "owner/repo" d'une URL GitHub (repo direct ou organisation). */
function parseRepoUrl(url: string): { owner: string; repo: string | null } | null {
  const m = url.match(/github\.com\/([^/]+)(?:\/([^/#?]+))?/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] ?? null };
}

/** Repo le plus récemment actif d'une organisation (ou d'un compte utilisateur). */
async function mostActiveRepo(owner: string): Promise<string | null> {
  const repos =
    (await gh<{ full_name: string }[]>(`/orgs/${owner}/repos?sort=pushed&per_page=1`)) ??
    (await gh<{ full_name: string }[]>(`/users/${owner}/repos?sort=pushed&per_page=1`));
  return repos?.[0]?.full_name ?? null;
}

async function analyzeRepo(fullName: string): Promise<GitHubData | null> {
  const repoInfo = await gh<{ stargazers_count: number; pushed_at: string }>(`/repos/${fullName}`);
  if (!repoInfo) return null;

  // commit_activity : 52 semaines de comptage hebdomadaire → somme des ~13 dernières.
  let commits90d: number | null = null;
  const activity = await gh<{ total: number; week: number }[]>(
    `/repos/${fullName}/stats/commit_activity`
  );
  if (Array.isArray(activity) && activity.length > 0) {
    commits90d = activity.slice(-13).reduce((s, w) => s + (w.total ?? 0), 0);
  }

  const contributors = await gh<unknown[]>(
    `/repos/${fullName}/contributors?per_page=100&anon=false`
  );

  const lastCommitDaysAgo = repoInfo.pushed_at
    ? Math.floor((Date.now() - new Date(repoInfo.pushed_at).getTime()) / 86_400_000)
    : null;

  return {
    available: true,
    repo: fullName,
    stars: repoInfo.stargazers_count ?? null,
    commits90d,
    contributors: Array.isArray(contributors) ? contributors.length : null,
    lastCommitDaysAgo,
  };
}

export async function getGitHubActivity(githubUrls: string[]): Promise<GitHubData> {
  const first = githubUrls.find((u) => u && u.includes("github.com"));
  if (!first) return { ...EMPTY, reason: "Aucun repo GitHub référencé sur CoinGecko" };

  const parsed = parseRepoUrl(first);
  if (!parsed) return { ...EMPTY, reason: "URL GitHub illisible" };

  let fullName = parsed.repo ? `${parsed.owner}/${parsed.repo}` : await mostActiveRepo(parsed.owner);
  if (!fullName) return { ...EMPTY, reason: "Organisation GitHub sans repo accessible" };

  let data = await analyzeRepo(fullName);
  if (!data) return { ...EMPTY, reason: `Repo ${fullName} inaccessible` };

  // CoinGecko référence souvent un repo historique abandonné (ex. aave-protocol V1) :
  // si le repo listé est périmé, on bascule sur le repo le plus actif de l'organisation.
  if (data.lastCommitDaysAgo != null && data.lastCommitDaysAgo > 90) {
    const fallback = await mostActiveRepo(parsed.owner);
    if (fallback && fallback !== fullName) {
      const fresher = await analyzeRepo(fallback);
      if (
        fresher?.lastCommitDaysAgo != null &&
        fresher.lastCommitDaysAgo < data.lastCommitDaysAgo
      ) {
        data = fresher;
        fullName = fallback;
      }
    }
  }

  return data;
}
