// Load the estate: estate.json (areas, descriptions, URLs) plus repos/*/meta.json (snapshots).
// build-index.mjs (the README.md index), build-landing.mjs (the Pages landing page),
// build-moved.mjs (the moved pages of renamed repos), build-glossary.mjs,
// build-repo-readmes.mjs, build-ecosystem-maps.mjs, and drift-report.mjs read it, so the
// outputs cannot drift apart.
// Returns { estate, areas, repos, count, errors }. Each repo in areas gets its snapshot, its
// Source URL, and its valid former names (a list, often empty). repos lists the repos of all
// areas, in order. errors lists every problem at once; the caller prints them and exits.
// Also exports the helpers that the build scripts share: readDocsFile, markedBlock,
// replaceMarked, and formerNamesText.
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

  // A renamed repo lists its former names in formerNames. The deploy writes a moved page at
  // the subpath of each former name (build-moved.mjs). Thus a former name must be a repo name
  // that no repo uses now, and that can be a subpath of the site: it does not start with "."
  // (a hidden file) and does not end with ".html" (a page at the root of the site).
  const formerNamesOf = new Map(); // the name of a repo -> its valid former names
  const nameOf = new Map(); // a valid former name -> the name of its repo
  for (const { name, formerNames } of estate.areas.flatMap((a) => a.repos)) {
    if (formerNames === undefined) continue;
    if (!Array.isArray(formerNames) || !formerNames.every((f) => typeof f === "string")) {
      errors.push(`estate.json: formerNames of ${name} must be a list of repo names`);
      continue;
    }
    for (const former of formerNames) {
      if (!/^[A-Za-z0-9_-][A-Za-z0-9._-]*$/.test(former) || former.endsWith(".html")) {
        errors.push(`estate.json: ${JSON.stringify(former)} (a former name of ${name}) is not a repo name that can be a subpath of the site`);
      } else if (listed.includes(former)) {
        errors.push(`estate.json: ${former} is the name of a repo, so it cannot be a former name of ${name}`);
      } else if (nameOf.has(former)) {
        errors.push(`estate.json lists ${former} as a former name twice`);
      } else {
        nameOf.set(former, name);
        formerNamesOf.set(name, [...(formerNamesOf.get(name) ?? []), former]);
      }
    }
  }

  for (const dir of dirs) {
    if (listed.includes(dir)) continue;
    const name = nameOf.get(dir);
    errors.push(name ? `repos/${dir}/ remains, but ${dir} is a former name of ${name}: move it to repos/${name}/` : `repos/${dir}/ has no entry in estate.json`);
  }
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
        const formerNames = formerNamesOf.get(repo.name) ?? [];
        return snap && { ...repo, ...snap, formerNames, source: `https://github.com/${estate.sourceOrg}/${repo.name}` };
      })
      .filter(Boolean),
  }));

  return { estate, areas, repos: areas.flatMap((a) => a.repos), count: listed.length, errors };
}

// Read a file of the docs repo (at is its path from the root) and parse it, or record in errors
// why it cannot be read or parsed, and return null.
export function readDocsFile(at, errors, parse = (text) => text) {
  const file = join(root, at);
  if (!existsSync(file)) return errors.push(`${at} is missing`), null;
  try {
    return parse(readFileSync(file, "utf8"));
  } catch (e) {
    return errors.push(`${at}: ${e.message}`), null;
  }
}

// The text after the description of a renamed repo in the README index and on the landing page:
// " Former name: `old`." code formats one name (Markdown or HTML). Empty without former names.
export function formerNamesText(formerNames, code) {
  if (!formerNames.length) return "";
  return ` Former name${formerNames.length > 1 ? "s" : ""}: ${formerNames.map(code).join(", ")}.`;
}

const occurrences = (text, marker) => text.split(marker).length - 1;

// A generated block: markers is { begin, end, what, optional }. begin and end are the marker
// lines; what names the block in errors ("estate index"); optional means that a file may lack
// the markers, and the caller then inserts the block.
export const markedBlock = ({ begin, end }, inner) => `${begin}\n\n${inner}\n\n${end}`;

// Replace the marked block in the text of file at with inner. Return the new text. If the
// markers are not one of each, in order, record an error and return the text unchanged. If the
// text has neither marker and markers.optional is set, return null: the caller inserts the block.
export function replaceMarked(at, text, markers, inner, errors) {
  const { begin, end, what, optional } = markers;
  const begins = occurrences(text, begin);
  const ends = occurrences(text, end);
  if (begins === 0 && ends === 0) {
    if (optional) return null;
    return errors.push(`${at} lacks the BEGIN/END markers of the ${what}`), text;
  }
  if (begins !== 1 || ends !== 1) {
    return errors.push(`${at}: ${begins} BEGIN and ${ends} END markers of the ${what}; expected one of each${optional ? ", or none" : ""}`), text;
  }
  const start = text.indexOf(begin);
  const stop = text.indexOf(end);
  if (stop < start) return errors.push(`${at}: the END marker of the ${what} comes before its BEGIN marker`), text;
  return text.slice(0, start) + markedBlock(markers, inner) + text.slice(stop + end.length);
}
