#!/usr/bin/env node
// Report the drift of each source repo since its snapshot, and say which repos are due.
// Usage: node drift-report.mjs               print the report
//        node drift-report.mjs --sync-issue  also open, edit, or close the "Docs drift report"
//                                            issue in $GITHUB_REPOSITORY (CI)
// Reads the snapshots through estate.mjs and the described files from each knowledge-graph.json,
// and asks the GitHub compare API what changed since. Set GITHUB_TOKEN for the 5000/hour API
// limit: a run makes about 2 requests per repo, and the anonymous limit is 60/hour.
// The report is public (job summary, log, issue). It shows repo names, counts, and compare links
// only: commit messages and file paths of a source repo can mirror a private repo name. In GitHub
// Actions the shared private-name check (private-names.sh) reads the whole text before any of it
// is printed or posted.
import { spawnSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadEstate, root } from "./estate.mjs";

// A repo is due when any described file was removed or renamed, or when at least this share of
// its described files changed. New files do not count: they are often tests.
const DUE_PERCENT = 5;
// The compare API lists at most 300 changed files.
const MAX_FILES = 300;
const TITLE = "Docs drift report";
// The first line of the issue body. It records the due repos of the last run, so the next run
// can say what changed.
const MARKER = "<!-- drift-report due:";

const syncIssue = process.argv.includes("--sync-issue");
const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: docsRepo, GITHUB_STEP_SUMMARY: summaryFile } = process.env;
// In GitHub Actions every output is public. A source repo that is not found may be private now,
// so its name is shown only outside Actions.
const inActions = process.env.GITHUB_ACTIONS === "true";

const { estate, areas, errors } = loadEstate();
if (errors.length) fail(errors);
// The issue belongs to github-actions: a local sync would open a second one under your name.
if (syncIssue && !inActions) fail(["--sync-issue runs only in GitHub Actions"]);
if (syncIssue && !(token && docsRepo)) fail(["--sync-issue needs GITHUB_TOKEN and GITHUB_REPOSITORY"]);

function fail(lines) {
  for (const line of lines) console.error(`error: ${line}`);
  process.exit(1);
}

// Returns the parsed JSON, or null for a 404. Retries a 5xx or a rate limit twice.
async function api(method, path, body) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: body && JSON.stringify(body),
    });
    if (res.ok) return res.json();
    if (res.status === 404) return null;
    if (attempt < 3 && (res.status >= 500 || res.status === 429)) {
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      continue;
    }
    throw new Error(`GitHub API ${method} ${path.split("?")[0]}: HTTP ${res.status}`);
  }
}

// The files that have a node in the repo's graph.
function describedFiles(name) {
  const graph = JSON.parse(readFileSync(join(root, "repos", name, "knowledge-graph.json"), "utf8"));
  return new Set(graph.nodes.map((n) => n.filePath).filter(Boolean));
}

async function measure({ name, sha, date }) {
  const base = { name, sha, date };
  const repo = await api("GET", `/repos/${estate.sourceOrg}/${name}`);
  if (!repo) return { ...base, missing: true };
  const branch = repo.default_branch;
  const compareUrl = `https://github.com/${estate.sourceOrg}/${name}/compare/${sha}...${branch}`;
  const cmp = await api("GET", `/repos/${estate.sourceOrg}/${name}/compare/${sha}...${encodeURIComponent(branch)}?per_page=1`);
  if (!cmp) return { ...base, compareUrl, broken: "the snapshot commit was not found" };
  if (cmp.status === "behind" || cmp.status === "diverged") {
    return { ...base, compareUrl, broken: `the snapshot is not on the default branch (${branch})` };
  }

  const described = describedFiles(name);
  let changed = 0, removed = 0, added = 0;
  for (const f of cmp.files ?? []) {
    if (f.status === "added" || f.status === "copied") added++;
    const old = f.previous_filename ?? f.filename;
    if (f.status === "added" || f.status === "copied" || !described.has(old)) continue;
    changed++;
    if (f.status === "removed" || f.status === "renamed") removed++;
  }
  const files = cmp.files?.length ?? 0;
  const percent = described.size ? (100 * changed) / described.size : 0;
  return {
    ...base, compareUrl, commits: cmp.ahead_by, files, truncated: files >= MAX_FILES,
    described: described.size, changed, removed, added, percent,
  };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function reasons(r) {
  if (r.broken) return [r.broken];
  const out = [];
  if (r.removed) out.push(`${plural(r.removed, "described file")} removed or renamed`);
  out.push(`${r.changed} of ${r.described} described files changed (${r.percent.toFixed(1)}%)`);
  if (r.truncated) out.push(`the compare API lists only ${MAX_FILES} changed files, so the counts are a minimum`);
  return out;
}

function item(r) {
  const snapshot = `snapshot \`${r.sha.slice(0, 7)}\` (${r.date})`;
  const context = r.broken
    ? `The ${snapshot}. [Compare](${r.compareUrl})`
    : `Since the ${snapshot}: ${plural(r.commits, "commit")}, ${r.truncated ? `${MAX_FILES} or more files` : plural(r.files, "file")} changed, ${plural(r.added, "new file")}. [Compare](${r.compareUrl})`;
  return `- **${r.name}**: ${reasons(r).join("; ")}.\\\n  ${context}`;
}

const repos = areas.flatMap((a) => a.repos);
let results;
try {
  results = await Promise.all(repos.map(measure));
} catch (e) {
  fail([e.message, "no issue was changed"]);
}

const missing = results.filter((r) => r.missing);
const measured = results.filter((r) => !r.missing);
const isDue = (r) => r.broken || r.removed > 0 || r.percent >= DUE_PERCENT || r.truncated;
const severity = (r) => (r.broken ? Infinity : r.percent);
const bySeverity = (a, b) => severity(b) - severity(a) || a.name.localeCompare(b.name);
const due = measured.filter(isDue).sort(bySeverity);
const quiet = measured.filter((r) => !isDue(r) && r.commits === 0).sort((a, b) => a.name.localeCompare(b.name));
const notDue = measured.filter((r) => !isDue(r) && r.commits > 0).sort(bySeverity);

// A link to a doc of this repo. The issue needs an absolute URL; a local run gets the path.
const doc = (path) => (docsRepo ? `https://github.com/${docsRepo}/blob/HEAD/${path}` : path);
const now = new Date().toISOString().replace("T", " ").slice(0, 16);
const lines = [
  `## ${TITLE}`,
  "",
  `Report of ${now} UTC, for ${plural(results.length, "source repo")}. Drift is the change in a ` +
    "source repo since the snapshot that its docs describe. A described file is a file with a " +
    "node in the repo's graph. A repo is **due** when any described file was removed or renamed, " +
    `or when at least ${DUE_PERCENT}% of its described files changed. New files do not count. ` +
    `See [When to regenerate](${doc("docs/regenerating.md#when-to-regenerate")}).`,
  "",
  `### Due (${due.length})`,
  "",
  ...(due.length ? due.map(item) : ["No repo is due."]),
  "",
  `### Not due (${notDue.length + quiet.length})`,
  "",
  ...notDue.map(item),
  ...(quiet.length ? [`- No drift: ${quiet.map((r) => r.name).join(", ")}.`] : []),
];
if (missing.length) {
  lines.push(
    "",
    "### Not found",
    "",
    `${plural(missing.length, "source repo")} could not be read. A repo that is deleted or private ` +
      "returns the same answer. In GitHub Actions the report does not show the name, because a " +
      "private repo name must not be published. Run this report locally to see the name, and see " +
      `[A repo turns private after we wrote its name](${doc("docs/private-names.md#a-repo-turns-private-after-we-wrote-its-name")}).`,
  );
  if (!inActions) lines.push("", ...missing.map((r) => `- ${r.name}`));
}
const report = lines.join("\n") + "\n";
const dueNames = due.map((r) => r.name);
const body = `${[MARKER, ...dueNames, "-->"].join(" ")}\n${report}`;

// In Actions all output is public: pass each text through the shared check before it goes out.
function check(text, label) {
  if (!inActions) return;
  const run = spawnSync(join(root, ".github/scripts/private-names.sh"), ["text", label], {
    input: text,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (run.status !== 0) fail([`the private-name check of ${label} did not pass (exit ${run.status}): it was not published`]);
}

check(body, "the drift report");

process.stdout.write(report);
if (summaryFile) appendFileSync(summaryFile, report);

if (syncIssue) await sync();
if (missing.length) fail([`${plural(missing.length, "source repo")} not found`]);

// One issue holds the report. A run opens or reopens it when a repo is due, edits it on each
// run, and closes it when no repo is due. A comment (it notifies) says when the due list changes.
async function sync() {
  const issue = await findIssue();
  const before = issue?.body?.split("\n", 1)[0].slice(MARKER.length).replace("-->", "").trim().split(/\s+/).filter(Boolean) ?? [];
  const added = dueNames.filter((n) => !before.includes(n));
  // A repo that is not found now may be private: the "Not found" section covers it, without a name.
  const dropped = before.filter((n) => !dueNames.includes(n) && !missing.some((r) => r.name === n));
  const note = [
    added.length && `Now due: ${added.join(", ")}.`,
    dropped.length && `No longer due: ${dropped.join(", ")}.`,
  ].filter(Boolean).join(" ");
  const path = `/repos/${docsRepo}/issues`;

  if (!dueNames.length) {
    if (!issue || issue.state === "closed") return console.error("issue: no repo is due, and no issue is open");
    const comment = `${note} No repo is due now, so this issue closes.`.trim();
    check(comment, "the issue comment");
    await api("PATCH", `${path}/${issue.number}`, { body });
    await api("POST", `${path}/${issue.number}/comments`, { body: comment });
    await api("PATCH", `${path}/${issue.number}`, { state: "closed", state_reason: "completed" });
    return console.error(`issue: closed #${issue.number}`);
  }
  if (!issue) {
    const made = await api("POST", path, { title: TITLE, body });
    return console.error(`issue: opened #${made.number}`);
  }
  const reopen = issue.state === "closed";
  const comment = note || (reopen ? `Due again: ${dueNames.join(", ")}.` : "");
  if (comment) check(comment, "the issue comment");
  const edit = issue.body !== body || reopen;
  if (edit) await api("PATCH", `${path}/${issue.number}`, { body, ...(reopen && { state: "open" }) });
  if (comment) await api("POST", `${path}/${issue.number}/comments`, { body: comment });
  const done = reopen ? "reopened" : edit ? "updated" : "unchanged";
  console.error(`issue: ${done} #${issue.number}${comment ? ` (${comment})` : ""}`);
}

// The oldest issue that github-actions opened with the marker. Pull requests are skipped.
async function findIssue() {
  for (let page = 1; ; page++) {
    const batch = await api("GET", `/repos/${docsRepo}/issues?state=all&per_page=100&page=${page}&sort=created&direction=asc`);
    const hit = batch.find((i) => !i.pull_request && i.user?.login === "github-actions[bot]" && i.body?.startsWith(MARKER));
    if (hit) return hit;
    if (batch.length < 100) return null;
  }
}
