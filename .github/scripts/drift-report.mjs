#!/usr/bin/env node
// Report the drift of each source repo since its snapshot, and say which repos are due.
// Usage: node drift-report.mjs               print the report
//        node drift-report.mjs --sync-issue  also open, edit, or close the "Docs drift report"
//                                            issue in $GITHUB_REPOSITORY (CI)
// Reads the snapshots through estate.mjs and the described files from each knowledge-graph.json,
// and asks the GitHub compare API what changed since. It also reads each file that
// shared-resources.json cites, on the default branch, and lists the shared-resource facts that
// are gone. Set GITHUB_TOKEN for the 5000/hour API limit: a run makes about 2 requests per repo
// and 1 per cited file, and the anonymous limit is 60/hour.
// The report is public (job summary, log, issue). It shows repo names, counts, compare links, the
// names that the shared-resource page shows, and the files that the page links: commit messages
// and other file paths of a source repo can mirror a private repo name. In GitHub Actions the
// shared private-name check (private-names.sh) reads the whole text before any of it is printed
// or posted.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expandRepoName, hasWholeName, loadEstate, readDocsFile, root, urlPath } from "./estate.mjs";

// A repo is due when any described file was removed or renamed. It is also due when at least
// DUE_MIN_FILES described files changed, and they are at least DUE_PERCENT% of its described
// files. New files do not count: they are often tests.
const DUE_PERCENT = 5;
// Without the minimum, 1 changed file can make a small repo due (1 of 15 is 6.7%).
const DUE_MIN_FILES = 2;
// The compare API lists at most 300 changed files.
const MAX_FILES = 300;
const TITLE = "Docs drift report";
// The first line of the issue body. It records the due repos and the gone facts of the last run,
// so the next run can say what changed: "<!-- drift-report due: <repo> ... facts: <hash> ... -->".
// Without gone facts, the line has no "facts:" part.
const MARKER = "<!-- drift-report due:";
const MARKER_FACTS = "facts:";
// GitHub refuses an issue body of more than 65536 characters.
const MAX_BODY = 65536;

const syncIssue = process.argv.includes("--sync-issue");
const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: docsRepo, GITHUB_STEP_SUMMARY: summaryFile } = process.env;
// In GitHub Actions every output is public. A source repo that is not found may be private now,
// so its name is shown only outside Actions.
const inActions = process.env.GITHUB_ACTIONS === "true";

const { estate, repos, errors } = loadEstate();
const sharedResources = readDocsFile("shared-resources.json", errors, JSON.parse);
if (errors.length) fail(errors);
// The issue belongs to github-actions: a local sync would open a second one under your name.
if (syncIssue && !inActions) fail(["--sync-issue runs only in GitHub Actions"]);
if (syncIssue && !(token && docsRepo)) fail(["--sync-issue needs GITHUB_TOKEN and GITHUB_REPOSITORY"]);

function fail(lines) {
  for (const line of lines) console.error(`error: ${line}`);
  process.exit(1);
}

// Returns the answer, or null for a 404. Retries a 5xx or a rate limit twice.
async function request(method, path, { body, accept = "application/vnd.github+json" } = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        accept,
        "x-github-api-version": "2022-11-28",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: body && JSON.stringify(body),
    });
    if (res.ok) return res;
    if (res.status === 404) return null;
    if (attempt < 3 && (res.status >= 500 || res.status === 429)) {
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      continue;
    }
    throw new Error(`GitHub API ${method} ${path.split("?")[0]}: HTTP ${res.status}`);
  }
}

// The parsed JSON of an answer, or null for a 404.
async function api(method, path, body) {
  const res = await request(method, path, { body });
  return res && res.json();
}

// The text of a file of a source repo on a branch, or null when the file is not there.
async function fileText(repo, path, branch) {
  const res = await request("GET", `/repos/${estate.sourceOrg}/${repo}/contents/${urlPath(path)}?ref=${encodeURIComponent(branch)}`, {
    accept: "application/vnd.github.raw",
  });
  return res && res.text();
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
  const found = { ...base, branch };
  const compareUrl = `https://github.com/${estate.sourceOrg}/${name}/compare/${sha}...${branch}`;
  const cmp = await api("GET", `/repos/${estate.sourceOrg}/${name}/compare/${sha}...${encodeURIComponent(branch)}?per_page=1`);
  if (!cmp) return { ...found, compareUrl, broken: "the snapshot commit was not found" };
  if (cmp.status === "behind" || cmp.status === "diverged") {
    return { ...found, compareUrl, broken: `the snapshot is not on the default branch (${branch})` };
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
    ...found, compareUrl, commits: cmp.ahead_by, files, truncated: files >= MAX_FILES,
    described: described.size, changed, removed, added, percent,
  };
}

// The shared-resource facts: each name of shared-resources.json with the resource and the file
// that cite it, once, in the order of the data file. The short hash of a fact goes into the issue
// marker.
const facts = new Map();
for (const resource of sharedResources.resources) {
  for (const { repo, path, names } of resource.evidence) {
    for (const { kind, name } of names) {
      const key = [resource.id, repo, path, kind, name].join("\n");
      if (!facts.has(key)) facts.set(key, { hash: createHash("sha256").update(key).digest("hex").slice(0, 7), resource, repo, path, kind, name });
    }
  }
}

// A fact is gone when its file on the default branch does not hold the name (the name rule of
// estate.mjs), or is not there. A gone fact does not make a repo due, and it keeps the result of
// its repo (source). The facts of a repo that is not found are not read: the "Not found" section
// covers that repo, without its name.
async function goneFacts(results) {
  const files = new Map(); // "<repo>\n<path>" -> a promise of the text of the file, or of null
  const gone = [];
  for (const fact of facts.values()) {
    const source = results.find((r) => r.name === fact.repo && !r.missing);
    if (!source) continue;
    const key = `${fact.repo}\n${fact.path}`;
    if (!files.has(key)) files.set(key, fileText(fact.repo, fact.path, source.branch));
    const text = await files.get(key);
    if (text === null) gone.push({ ...fact, source, fileGone: true });
    else if (!hasWholeName(expandRepoName(text, fact.repo), fact.name)) gone.push({ ...fact, source });
  }
  return gone;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

function reasons(r) {
  if (r.broken) return [r.broken];
  const out = [];
  if (r.removed) out.push(`${plural(r.removed, "described file")} removed or renamed`);
  // Round down, so that a repo below DUE_PERCENT never shows DUE_PERCENT or more: 22 of 444
  // (4.955%) shows "4.9%", not "5.0%".
  out.push(`${r.changed} of ${r.described} described files changed (${(Math.floor(r.percent * 10) / 10).toFixed(1)}%)`);
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

let results, gone;
try {
  results = await Promise.all(repos.map(measure));
  gone = await goneFacts(results);
} catch (e) {
  fail([e.message, "no issue was changed"]);
}

const missing = results.filter((r) => r.missing);
const missingNames = new Set(missing.map((r) => r.name));
// The facts that were not read, because their repo is not found.
const unread = [...facts.values()].filter((f) => missingNames.has(f.repo));
const measured = results.filter((r) => !r.missing);
const isDue = (r) =>
  r.broken || r.removed > 0 || (r.percent >= DUE_PERCENT && r.changed >= DUE_MIN_FILES) || r.truncated;
const severity = (r) => (r.broken ? Infinity : r.percent);
const bySeverity = (a, b) => severity(b) - severity(a) || a.name.localeCompare(b.name);
const due = measured.filter(isDue).sort(bySeverity);
const quiet = measured.filter((r) => !isDue(r) && r.commits === 0).sort((a, b) => a.name.localeCompare(b.name));
const notDue = measured.filter((r) => !isDue(r) && r.commits > 0).sort(bySeverity);

// A link to a doc of this repo. The issue needs an absolute URL; a local run gets the path.
const doc = (path) => (docsRepo ? `https://github.com/${docsRepo}/blob/HEAD/${path}` : path);
const now = new Date().toISOString().replace("T", " ").slice(0, 16);

// A gone fact links its file on the default branch, or at the snapshot when the file is not there.
// The snapshot link uses the short commit, as the links of the shared-resource page do.
function factItem(f) {
  const resource = `**[${f.resource.name}](${doc(`docs/shared-resources.md#${f.resource.id}`)})**`;
  const ref = f.fileGone ? f.source.sha.slice(0, 7) : f.source.branch;
  const file = `[\`${f.path}\`](https://github.com/${estate.sourceOrg}/${f.repo}/blob/${ref}/${urlPath(f.path)})`;
  return f.fileGone
    ? `- ${resource}: the file of the ${f.kind} \`${f.name}\` is not on the default branch (${f.source.branch}).\\\n  ${f.repo} ${file} at the snapshot`
    : `- ${resource}: the ${f.kind} \`${f.name}\` is not in the file.\\\n  ${f.repo} ${file}`;
}

// The report with the first `shown` gone facts. Only the issue shows fewer than all: the others
// are in the job summary of the run.
function reportOf(shown) {
  const unreadRepos = new Set(unread.map((f) => f.repo)).size;
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${docsRepo}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const lines = [
    `Report of ${now} UTC, for ${plural(results.length, "source repo")}. Drift is the change in a ` +
      "source repo since the snapshot that its docs describe. A described file is a file with a " +
      "node in the repo's graph. A repo is **due** when any described file was removed or renamed. " +
      `It is also due when at least ${DUE_MIN_FILES} described files changed, and they are at least ` +
      `${DUE_PERCENT}% of its described files. New files do not count. ` +
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
    "",
    `### Shared-resource facts to check (${gone.length})`,
    "",
    `A shared-resource fact is a name on the [shared-resource page](${doc("docs/shared-resources.md")}) and the file of a ` +
      "code repo that cites it. A fact is gone when that file on the default branch does not hold the name, or is not " +
      "there. A gone fact does not make a repo due. It leaves this list when the name comes back, or when you regenerate " +
      `the repo and [check its facts again](${doc("docs/regenerating.md#notes")}).`,
    "",
    ...(gone.length ? gone.slice(0, shown).map(factItem) : ["No fact is gone."]),
    ...(shown < gone.length ? [`- And ${plural(gone.length - shown, "more fact")}: see the [job summary of this run](${runUrl}).`] : []),
    ...(unread.length
      ? [
          "",
          `The report did not check ${plural(unread.length, "fact")}, because it could not read ` +
            `${unreadRepos === 1 ? "the source repo" : `${unreadRepos} source repos`} (see "Not found" below).`,
        ]
      : []),
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
  return lines.join("\n") + "\n";
}

const report = reportOf(gone.length);
const dueNames = due.map((r) => r.name);
const goneHashes = gone.map((f) => f.hash);

// The issue body: the marker, then the report with as many gone facts as fit in MAX_BODY.
function issueBody(marker) {
  for (let shown = gone.length; ; shown--) {
    const body = `${marker}\n${reportOf(shown)}`;
    if (Buffer.byteLength(body) <= MAX_BODY || shown === 0) return body;
  }
}

// In Actions all output is public: pass each text through the shared check before it goes out.
function check(text, label) {
  if (!inActions) return;
  const run = spawnSync(join(root, ".github/scripts/private-names.sh"), ["text", label], {
    input: text,
    stdio: ["pipe", "inherit", "inherit"],
  });
  if (run.status !== 0) fail([`the private-name check of ${label} did not pass (exit ${run.status}): it was not published`]);
}

check(report, "the drift report");

// The issue has the title already; the job summary and a local run get it as a heading.
const page = `## ${TITLE}\n\n${report}`;
process.stdout.write(page);
if (summaryFile) appendFileSync(summaryFile, page);

if (syncIssue) await sync();
if (missing.length) fail([`${plural(missing.length, "source repo")} not found`]);

// One issue holds the report. A run opens or reopens it when a repo is due or a fact is gone,
// edits it on each run, and closes it when no repo is due and no fact is gone. A comment (it
// notifies) says when the due list or the list of gone facts changes.
async function sync() {
  const issue = await findIssue();
  const marked = issue?.body?.split("\n", 1)[0].slice(MARKER.length).replace("-->", "").trim().split(/\s+/).filter(Boolean) ?? [];
  const at = marked.indexOf(MARKER_FACTS);
  const dueBefore = at < 0 ? marked : marked.slice(0, at);
  // Only short hashes count as facts: a hand edit can leave other words.
  const factsBefore = at < 0 ? [] : marked.slice(at + 1).filter((t) => /^[0-9a-f]{7}$/.test(t));
  const added = dueNames.filter((n) => !dueBefore.includes(n));
  // A repo that is not found now may be private: the "Not found" section covers it, without a name.
  const dropped = dueBefore.filter((n) => !dueNames.includes(n) && !missingNames.has(n));
  // A fact of the last run that was not read now stays on the list: its hash names no repo.
  const unreadHashes = new Set(unread.map((f) => f.hash));
  const factHashes = [...goneHashes, ...factsBefore.filter((h) => unreadHashes.has(h))];
  const factsAdded = goneHashes.filter((h) => !factsBefore.includes(h));
  const factsDropped = factsBefore.filter((h) => !factHashes.includes(h));
  const note = [
    added.length && `Now due: ${added.join(", ")}.`,
    dropped.length && `No longer due: ${dropped.join(", ")}.`,
    factsAdded.length && `${plural(factsAdded.length, "new shared-resource fact")} to check.`,
    factsDropped.length &&
      `${plural(factsDropped.length, "shared-resource fact")} ${factsDropped.length === 1 ? "is" : "are"} no longer on the list.`,
  ].filter(Boolean).join(" ");
  const body = issueBody([MARKER, ...dueNames, ...(factHashes.length ? [MARKER_FACTS, ...factHashes] : []), "-->"].join(" "));
  check(body, "the issue body");
  const path = `/repos/${docsRepo}/issues`;

  if (!dueNames.length && !factHashes.length) {
    if (!issue || issue.state === "closed") return console.error("issue: no repo is due, no fact is gone, and no issue is open");
    const comment = `${note} No repo is due and no shared-resource fact is gone now, so this issue closes.`.trim();
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
  const again = [
    dueNames.length && `Due again: ${dueNames.join(", ")}.`,
    factHashes.length && `${plural(factHashes.length, "shared-resource fact")} to check again.`,
  ].filter(Boolean).join(" ");
  const comment = note || (reopen ? again : "");
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
