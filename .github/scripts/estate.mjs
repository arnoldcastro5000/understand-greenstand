// Load the estate: estate.json (areas, descriptions, URLs) plus repos/*/meta.json (snapshots).
// These scripts import this module, so their outputs cannot drift apart:
// build-index.mjs (the README.md index), build-landing.mjs (the Pages landing page),
// build-moved.mjs (the moved pages of renamed repos), build-glossary.mjs,
// build-repo-readmes.mjs, build-onboarding.mjs, build-ecosystem-maps.mjs,
// build-shared-resources.mjs, build-capture-journey.mjs, capture-journey-page.mjs,
// check-former-names.mjs, check-graphs.mjs, check-safety-review.mjs, drift-report.mjs,
// render-md.mjs, and start-path.mjs.
// Returns { estate, areas, repos, count, errors }. Each repo in areas gets its snapshot, its
// Source URL, and its valid former names (a list, often empty). repos lists the repos of all
// areas, in order. errors lists every problem at once; the caller prints them and exits.
// Also exports the helpers that the build scripts share: readDocsFile, parseJson, markedBlock,
// replaceMarked, formerNamesText, EM_DASH, fencedLines, readGraph, isObject, escapeRegExp,
// urlPath, plural, the name rule of the evidence (expandRepoName, hasWholeName, missingNames),
// the evidence form (isRepoPath, parseLines, lineAnchor, citedLines), the GitHub API of the
// evidence checks (githubApi, RAW, answerStatus), and the paths of the shared-resource page and of
// the capture journey.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AREA_COLORS } from "./site-colors.mjs";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// The em dash. This repo's text uses none, and the checks look for it.
export const EM_DASH = String.fromCharCode(0x2014);

// A count with its word: "1 file", "2 files", "2 evidence entries".
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// A JSON text as a value. A text that starts with a byte order mark gets a clear error: the mark is
// not visible in most editors, and JSON.parse names it only as an "Unexpected token".
export function parseJson(text) {
  if (text.startsWith(String.fromCharCode(0xfeff))) throw new Error("the file starts with a byte order mark (BOM): save it as UTF-8 without a BOM");
  return JSON.parse(text);
}

// A JSON object: not null, and not a list.
export const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// A text as a regular expression that matches exactly that text.
export const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A path in a repo as a URL path. "(" and ")" are encoded too, so a Markdown link stays whole.
export const urlPath = (path) =>
  path
    .split("/")
    .map((segment) => encodeURIComponent(segment).replace(/[()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))
    .join("/");

// The name rule of the shared-resource facts, for build-shared-resources.mjs (at the snapshot)
// and drift-report.mjs (on the default branch). A build workflow often gives the image name as
// greenstand/${{ github.event.repository.name }}: expandRepoName reads that one expression as the
// repo name. GitHub expressions ignore case.
export const expandRepoName = (text, repo) => text.replace(/\$\{\{\s*github\.event\.repository\.name\s*\}\}/gi, repo);
// A name counts only as a whole name: greenstand/a is not in greenstand/a-dev or in greenstand/a.old.
export const hasWholeName = (text, name) => new RegExp(`(?<![\\w/-])${escapeRegExp(name)}(?![\\w/.-])`).test(text);

// The form of an evidence entry (shared-resources.json, capture-journey.json). A path in a repo:
// a text with no leading "/" and no empty, ".", or ".." part.
export const isRepoPath = (path) =>
  typeof path === "string" && path !== "" && !path.startsWith("/") && !path.split("/").some((s) => s === "" || s === "." || s === "..");
// The cited lines: "<n>" or "<first>-<last>", one written form for each range: no leading zero,
// and the first line before the last. Returns { first, last }, or null for any other value.
export function parseLines(lines) {
  const m = typeof lines === "string" ? lines.match(/^([1-9]\d*)(?:-([1-9]\d*))?$/) : null;
  const range = m && { first: Number(m[1]), last: Number(m[2] ?? m[1]) };
  return range && (m[2] === undefined || range.first < range.last) ? range : null;
}
// The line anchor of a GitHub file link: #L7 or #L3-L5.
export const lineAnchor = ({ first, last }) => (first === last ? `#L${first}` : `#L${first}-L${last}`);

// The GitHub API of the evidence checks (build-shared-resources.mjs and
// build-capture-journey.mjs), for the repos of one owner: each request once. get(path, accept)
// answers { body } (a text for the raw media type, else the JSON value) or { status } (the HTTP
// status, or null with the error when GitHub gives no answer). file() reads a file of a repo at a
// commit.
export const RAW = "application/vnd.github.raw";
export function githubApi(owner, token) {
  const asked = new Map(); // "<accept> <path>" -> a promise of the answer
  const get = (path, accept = "application/vnd.github+json") => {
    const key = `${accept} ${path}`;
    if (!asked.has(key)) {
      const headers = { Accept: accept, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      asked.set(
        key,
        fetch(`https://api.github.com/repos/${owner}/${path}`, { headers }).then(
          async (res) => (res.ok ? { body: accept === RAW ? await res.text() : await res.json() } : { status: res.status }),
          (e) => ({ status: null, error: e.message }),
        ),
      );
    }
    return asked.get(key);
  };
  const file = (repo, path, commit, accept = RAW) => get(`${repo}/contents/${urlPath(path)}?ref=${commit}`, accept);
  return { get, file };
}
// The status of an answer with no body, for an error: "HTTP 404", or "no answer: <error>".
export const answerStatus = (answer) => (answer.status === null ? `no answer: ${answer.error}` : `HTTP ${answer.status}`);
// The cited lines of a file: { text } with the lines, or { count } (the lines of the file) when the
// file is shorter than the range. CRLF counts as one line end.
export function citedLines(fileText, { first, last }) {
  const lines = fileText.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n");
  return last > lines.length ? { count: lines.length } : { text: lines.slice(first - 1, last).join("\n") };
}
// The names that a text does not hold, by the name rule (hasWholeName), in their order.
export const missingNames = (text, names) => names.filter((name) => !hasWholeName(text, name));

// Which lines of a Markdown text are fenced code: a fence line, or a line between an opening
// fence and its closing fence. As in CommonMark, a closing fence uses the character of the
// opening fence ("`" or "~"), is at least as long, and holds nothing else.
export function fencedLines(lines) {
  let open = null; // the opening fence, for example "```"
  return lines.map((line) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (open === null) {
      open = fence ?? null;
      return Boolean(fence);
    }
    if (fence?.[0] === open[0] && fence.length >= open.length && line.trim() === fence) open = null;
    return true;
  });
}

// Each repos/<name>/ directory must hold these files: both indexes link to them.
const REQUIRED_FILES = ["knowledge-graph.json", "README.md", "ONBOARDING.md"];

export function loadEstate() {
  const estate = JSON.parse(readFileSync(join(root, "estate.json"), "utf8"));
  const errors = [];

  if (!estate.siteUrl?.endsWith("/")) errors.push("estate.json: siteUrl must end with '/'");

  // The landing page shows the featured area first, in its "Start here" box, with the steps of the
  // Start here path (start-path.mjs). The estate index shows the areas in their order. Thus exactly
  // one area is featured, and it is the first area.
  const featured = estate.areas.filter((a) => a.featured).length;
  if (featured !== 1) errors.push(`estate.json must have exactly one featured area (the "Start here" box of the landing page); it has ${featured}`);
  else if (!estate.areas[0].featured) {
    const { title } = estate.areas.find((a) => a.featured);
    errors.push(`estate.json: the featured area ${JSON.stringify(title)} must be the first area: the estate index and the landing page show it first`);
  }

  // The featured area has no repos: its box shows the path, and the estate strip shows only the
  // areas with repos. Thus it has no color either. Each other area has one or more repos.
  for (const { title, featured, color, repos } of estate.areas) {
    if (featured) {
      if (color !== undefined || repos !== undefined) {
        errors.push(`estate.json: the featured area ${JSON.stringify(title)} must have no color and no repos: the Start here box shows the path, and the estate strip shows only the areas with repos`);
      }
    } else if (!Array.isArray(repos) || repos.length === 0) {
      errors.push(`estate.json: the area ${JSON.stringify(title)} must have a list of one or more repos`);
    }
  }
  // From here on, each area has a list of repos. The list of the featured area is empty, unless
  // the error above names its repos: then the repos stay, so that they get no false error.
  const areaList = estate.areas.map((area) => ({ ...area, repos: Array.isArray(area.repos) ? area.repos : [] }));

  // A note on a repo (for example that some of its information is out of date) shows with its
  // description on the landing page, in the estate index, and in the per-repo README.
  for (const { name, note } of areaList.flatMap((a) => a.repos)) {
    if (note !== undefined && (typeof note !== "string" || !note.trim())) errors.push(`estate.json: the note of ${name} must be a text that is not empty`);
  }

  // The site look fills the cells of an area in the estate strip with the color of the area: one
  // of the area colors of site-colors.mjs. Two areas with one color would look like one area, so
  // each area with repos needs its own color.
  const colorOf = new Map(); // an area color -> the title of its area
  for (const { title, color, featured } of areaList) {
    if (featured) continue;
    if (typeof color !== "string" || !Object.hasOwn(AREA_COLORS, color)) {
      errors.push(`estate.json: the color of the area ${JSON.stringify(title)} must be one of ${Object.keys(AREA_COLORS).join(", ")}`);
    } else if (colorOf.has(color)) {
      errors.push(`estate.json: the areas ${JSON.stringify(colorOf.get(color))} and ${JSON.stringify(title)} have the same color (${color}); each area needs its own color`);
    } else {
      colorOf.set(color, title);
    }
  }

  // Every repos/<name>/ directory needs exactly one entry, and every entry a directory.
  const dirs = readdirSync(join(root, "repos"), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const listed = areaList.flatMap((a) => a.repos.map((r) => r.name));

  // A renamed repo lists its former names in formerNames. The deploy writes a moved page at
  // the subpath of each former name (build-moved.mjs). Thus a former name must be a repo name
  // that no repo uses now, and that can be a subpath of the site: it does not start with "."
  // (a hidden file) and does not end with ".html" (a page at the root of the site).
  const formerNamesOf = new Map(); // the name of a repo -> its valid former names
  const nameOf = new Map(); // a valid former name -> the name of its repo
  for (const { name, formerNames } of areaList.flatMap((a) => a.repos)) {
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

  const areas = areaList.map((area) => ({
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

// The data file of the shared-resource page, and the page. build-shared-resources.mjs builds the
// page from the data file and checks all of the data file.
export const SHARED_RESOURCES_DATA = "shared-resources.json";
export const SHARED_RESOURCES_PAGE = "docs/shared-resources.md";

// The data file of the capture journey, its text copy for GitHub, and its image directory.
// build-capture-journey.mjs builds the copy and the page of the Pages site from the data file,
// and checks all of the data file.
export const CAPTURE_JOURNEY_DATA = "capture-journey.json";
export const CAPTURE_JOURNEY_COPY = "docs/capture-journey.md";
export const CAPTURE_JOURNEY_IMAGES = "docs/capture-journey";

// Read the resources of the data file for a script that uses only some of their fields. readable
// checks the shape of those fields in one resource, and fields names them in the error. Return
// the resources, or record in errors what is wrong and return null.
export function readSharedResources(errors, fields, readable) {
  return readDocsFile(SHARED_RESOURCES_DATA, errors, (text) => {
    const data = parseJson(text);
    if (!isObject(data) || !Array.isArray(data.resources) || !data.resources.every((r) => isObject(r) && readable(r))) {
      throw new Error(`must have a list of resources, each with ${fields}. Run: node .github/scripts/build-shared-resources.mjs --check`);
    }
    return data.resources;
  });
}

// Read the graph of a repo (repos/<name>/knowledge-graph.json) and check the shape of the parts
// that the scripts read: a list of nodes, and the lists of edges, layers, and tour steps (each
// optional). Return the graph, or record in errors what is wrong and return null. A missing graph
// returns null with no error: loadEstate records it.
export function readGraph(name, errors) {
  const at = `repos/${name}/knowledge-graph.json`;
  if (!existsSync(join(root, at))) return null;
  // Wrap the value: readDocsFile returns null for an error, and the JSON text "null" is null too.
  const read = readDocsFile(at, errors, (text) => ({ graph: parseJson(text) }));
  if (read === null) return null;
  const { graph } = read;
  if (!isObject(graph)) return errors.push(`${at}: the graph must be a JSON object`), null;
  const problems = [];
  const parts = [["nodes", "node"], ["edges", "edge"], ["layers", "layer"], ["tour", "tour step"]];
  for (const [key, item] of parts) {
    const list = graph[key];
    if (list === undefined && key !== "nodes") continue;
    if (!Array.isArray(list)) {
      problems.push(`${key} must be a list`);
      continue;
    }
    list.forEach((v, i) => {
      if (!isObject(v)) problems.push(`${item} ${i} must be a JSON object`);
      else if ((key === "layers" || key === "tour") && !Array.isArray(v.nodeIds)) problems.push(`${item} ${i}: nodeIds must be a list`);
    });
  }
  for (const problem of problems) errors.push(`${at}: ${problem}`);
  return problems.length ? null : graph;
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
