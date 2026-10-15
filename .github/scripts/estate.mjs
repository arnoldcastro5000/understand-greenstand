// Load the estate: estate.json (areas, descriptions, URLs) plus repos/*/meta.json (snapshots).
// build-index.mjs (the README.md index) and build-landing.mjs (the Pages landing page) both
// read it, so the two indexes cannot drift apart.
// Returns { estate, areas, count, errors }. Each repo in areas gets its snapshot and its
// Source URL. errors lists every problem at once; the caller prints them and exits.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Each repos/<name>/ directory must hold these files: both indexes link to them.
const REQUIRED_FILES = ["knowledge-graph.json", "README.md", "ONBOARDING.md"];

export function loadEstate() {
  const estate = JSON.parse(readFileSync(join(root, "estate.json"), "utf8"));
  const errors = [];

  if (!estate.siteUrl?.endsWith("/")) errors.push("estate.json: siteUrl must end with '/'");

  // Every repos/<name>/ directory needs exactly one entry, and every entry a directory.
  const dirs = readdirSync(join(root, "repos"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const listed = estate.areas.flatMap((a) => a.repos.map((r) => r.name));
  for (const name of dirs) if (!listed.includes(name)) errors.push(`repos/${name}/ has no entry in estate.json`);
  for (const name of listed) {
    if (listed.indexOf(name) !== listed.lastIndexOf(name)) errors.push(`estate.json lists ${name} twice`);
    if (!dirs.includes(name)) errors.push(`estate.json lists ${name}, but repos/${name}/ does not exist`);
  }

  function snapshot(name) {
    const file = join(root, "repos", name, "meta.json");
    if (!existsSync(file)) return errors.push(`repos/${name}/meta.json is missing`), null;
    const { gitCommitHash: sha, lastAnalyzedAt: at } = JSON.parse(readFileSync(file, "utf8"));
    if (!/^[0-9a-f]{40}$/.test(sha ?? "")) errors.push(`repos/${name}/meta.json: gitCommitHash is not a full SHA`);
    if (!/^\d{4}-\d{2}-\d{2}T/.test(at ?? "")) errors.push(`repos/${name}/meta.json: lastAnalyzedAt is not an ISO date`);
    return { sha, date: at?.slice(0, 10) };
  }

  const areas = estate.areas.map((area) => ({
    ...area,
    repos: area.repos
      .filter(({ name }) => dirs.includes(name))
      .map((repo) => {
        for (const f of REQUIRED_FILES) {
          if (!existsSync(join(root, "repos", repo.name, f))) errors.push(`repos/${repo.name}/${f} is missing`);
        }
        const snap = snapshot(repo.name);
        return snap && { ...repo, ...snap, source: `https://github.com/${estate.sourceOrg}/${repo.name}` };
      })
      .filter(Boolean),
  }));

  return { estate, areas, count: listed.length, errors };
}
