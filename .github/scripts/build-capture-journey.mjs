#!/usr/bin/env node
// Build the capture journey from capture-journey.json (edited text): the text copy for GitHub
// (docs/capture-journey.md, built text) and the illustrated page of the Pages site
// (capture-journey.html, built by the deploy; its render is capture-journey-page.mjs). The images
// are in docs/capture-journey/: the copy links them there, and the deploy copies them beside the
// page.
// The data file holds the words of each stage, its flags ("Best guess" with the question it stands
// for, "Not working today" with its public issue), its images, and its evidence: each entry cites
// lines of a file of a public Greenstand repo at a commit, with 1 to 3 names that the lines hold
// (a Capture journey fact). A repo of estate.json links to its viewer and onboarding guide; a repo
// outside the estate links to GitHub.
// Usage: node build-capture-journey.mjs                  check the data, rewrite the copy
//        node build-capture-journey.mjs --check          exit 1 on a data error or a stale copy (CI)
//        node build-capture-journey.mjs --evidence       exit 1 when GitHub does not hold a fact.
//          It reads each repo, cited file, issue, and image source through the GitHub API
//          (GITHUB_TOKEN, if set). CI runs it only when the data, the images, or the code changes.
//        node build-capture-journey.mjs --site <dir>     write <dir>/capture-journey.html and copy the
//          images into <dir>/capture-journey/ (the deploy)
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURE_JOURNEY_COPY as COPY, CAPTURE_JOURNEY_DATA as DATA, CAPTURE_JOURNEY_IMAGES as IMAGES, EM_DASH, answerStatus, citedLines, githubApi, isObject, isRepoPath, lineAnchor, loadEstate, missingNames, parseJson, parseLines, plural, readDocsFile, root, urlPath } from "./estate.mjs";
import { FLAGS, ICONS, NO_ISSUE, creditText, pageHtml } from "./capture-journey-page.mjs";

const SCRIPT = ".github/scripts/build-capture-journey.mjs";
const PAGE = "capture-journey.html";
const USAGE = `use: node ${SCRIPT} [--check | --evidence | --site <dir>]`;

const args = process.argv.slice(2);
let mode = "write";
let siteDir = null;
if (args.length === 1 && (args[0] === "--check" || args[0] === "--evidence")) mode = args[0].slice(2);
else if (args.length === 2 && args[0] === "--site") [mode, siteDir] = ["site", args[1]];
else if (args.length) {
  console.error(`error: ${USAGE}`);
  process.exit(2);
}
// Every error at once: the estate, the directory of --site, then the data file.
const { estate, repos, errors } = loadEstate();
if (mode === "site" && !(existsSync(siteDir) && statSync(siteDir).isDirectory())) errors.push(`${siteDir} is not a directory`);
const estateRepos = new Set(repos.map((r) => r.name));

// The fields of each object of the data file, in the order of their checks. A flag has the fields
// of its kind.
const FIELDS = {
  top: ["title", "chapter", "subtitle", "intro", "legend", "stages", "next"],
  legend: ["guess", "broken", "dev"],
  stage: ["id", "short", "title", "icon", "story", "flags", "note", "images", "evidence", "moreRepos"],
  guess: ["kind", "text", "question"],
  broken: ["kind", "text", "issue"],
  image: ["file", "frame", "alt", "caption", "source"],
  source: ["repo", "path", "commit", "license"],
  evidence: ["repo", "path", "lines", "commit", "names", "what"],
  moreRepo: ["repo", "what"],
};
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REPO = /^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/;
const COMMIT = /^[0-9a-f]{7}$/;
const IMAGE_FILE = /^[a-z0-9]+(-[a-z0-9]+)*\.(png|svg)$/;
const shown = (v) => (v === undefined ? "missing" : JSON.stringify(v));

// The width and the height of an image of the image directory, for the page (so the layout does not move
// when an image loads): a PNG (its IHDR chunk), or an SVG with a viewBox. null if not readable.
function imageSize(file) {
  const bytes = readFileSync(join(root, IMAGES, file));
  if (file.endsWith(".png")) {
    const png = bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47 && bytes.toString("latin1", 12, 16) === "IHDR";
    const size = png && { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    return size && size.width && size.height ? size : null;
  }
  const box = bytes.toString("utf8").match(/<svg\b[^>]*?\sviewBox="\s*-?[\d.]+[\s,]+-?[\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  const size = box && { width: Math.round(Number(box[1])), height: Math.round(Number(box[2])) };
  return size && size.width && size.height ? size : null;
}
// The size of each image of the data file, read once by validData.
const sizeOf = new Map();

// The objects of a stage that have their own place in an error ("stage <id>, image 2"), and the
// lists of plain strings, with the word of one item ("story paragraph 2", "name 1").
const PLACES = { flags: "flag", images: "image", evidence: "evidence", moreRepos: "more repo" };
const ITEMS = { intro: "intro paragraph", story: "story paragraph", names: "name" };

// Check capture-journey.json, and return it only if it is valid. Every error is recorded at once,
// with its place. Every string of the file (a text, a path, a name) is on one line, with no em
// dash: one pass checks them all, in the order of the file. Then the checks of each field.
function validData(data) {
  if (data === null) return null; // readDocsFile recorded the error
  const before = errors.length;
  const fail = (where, message) => errors.push(`${DATA}: ${where ? `${where}: ` : ""}${message}`);
  const checkString = (where, label, value) => {
    if (typeof value === "string") {
      if (/[\r\n]/.test(value)) fail(where, `${label} must be on one line`);
      if (value.includes(EM_DASH)) fail(where, `${label} has an em dash; use a colon, a comma, or two sentences`);
    } else if (Array.isArray(value)) value.forEach((item, i) => checkString(where, `${ITEMS[label] ?? label} ${i + 1}`, item));
    else if (isObject(value)) for (const [key, inner] of Object.entries(value)) checkString(where, label ? `${label}.${key}` : key, inner);
  };
  const checkObjectStrings = (where, object) => {
    for (const [key, value] of Object.entries(object)) {
      if (PLACES[key] && Array.isArray(value)) {
        value.forEach((item, i) => (isObject(item) ? checkObjectStrings(`${where}, ${PLACES[key]} ${i + 1}`, item) : checkString(where, `${PLACES[key]} ${i + 1}`, item)));
      } else if (key === "source" && isObject(value)) checkObjectStrings(`${where}, source`, value);
      else checkString(where, key, value);
    }
  };
  const checkText = (where, label, value) => {
    if (typeof value !== "string" || !value.trim()) return fail(where, `${label} must be text that is not empty`);
    if (/^[^\S\r\n]|[^\S\r\n]$/.test(value)) fail(where, `${label} has a space at its start or end`);
  };
  const checkFields = (where, object, allowed) => {
    for (const key of Object.keys(object)) if (!allowed.includes(key)) fail(where, `unknown field "${key}" (use: ${allowed.join(", ")})`);
  };
  const checkParagraphs = (where, label, list, max) => {
    if (!Array.isArray(list) || !list.length || list.length > max) {
      return fail(where, `${label} must be a list of ${max === Infinity ? "1 or more" : `1 or ${max}`} paragraphs`);
    }
    list.forEach((p, i) => checkText(where, `${label} paragraph ${i + 1}`, p));
  };
  const checkRepoName = (where, repo) => {
    if (typeof repo !== "string" || !REPO.test(repo)) fail(where, `repo must be a repo name; it is ${shown(repo)}`);
  };
  const checkRepoPath = (where, path) => {
    if (!isRepoPath(path) || path.includes("`")) fail(where, `path must be a path in the repo, with no "\`"; it is ${shown(path)}`);
  };
  const checkCommit = (where, value) => {
    if (typeof value !== "string" || !COMMIT.test(value)) fail(where, `commit must be the first 7 characters of a commit, in lowercase; it is ${shown(value)}`);
  };

  if (!isObject(data)) {
    fail("", `must be an object with the fields ${FIELDS.top.join(", ")}`);
    return null;
  }
  // The place of a stage in an error: its id, or its number when the id is not valid or not unique.
  const stageAt = [];
  const ids = new Set();
  (Array.isArray(data.stages) ? data.stages : []).forEach((stage, i) => {
    const id = stage?.id;
    stageAt.push(typeof id === "string" && SLUG.test(id) && !ids.has(id) ? `stage ${id}` : `stage ${i + 1}`);
    ids.add(id);
  });
  for (const [key, value] of Object.entries(data)) {
    if (key !== "stages" || !Array.isArray(value)) checkString("", key, value);
    else value.forEach((stage, i) => (isObject(stage) ? checkObjectStrings(stageAt[i], stage) : checkString("", `stage ${i + 1}`, stage)));
  }

  checkFields("", data, FIELDS.top);
  checkText("", "title", data.title);
  if (!Number.isInteger(data.chapter) || data.chapter < 1) fail("", "chapter must be a whole number from 1");
  checkText("", "subtitle", data.subtitle);
  checkParagraphs("", "intro", data.intro, Infinity);
  if (!isObject(data.legend)) fail("", `legend must be an object with the fields ${FIELDS.legend.join(", ")}`);
  else {
    checkFields("legend", data.legend, FIELDS.legend);
    for (const key of FIELDS.legend) checkText("", `legend.${key}`, data.legend[key]);
  }
  const stages = Array.isArray(data.stages) ? data.stages : [];
  if (!stages.length) fail("", "stages must be a list of 1 or more stages");

  const cited = new Map(); // "<repo> <path> <lines>" -> the place of its first entry
  // The image directory holds only the images of the data file, each one used once.
  const entries = existsSync(join(root, IMAGES)) ? readdirSync(join(root, IMAGES), { withFileTypes: true }) : [];
  const imageFiles = new Set(entries.filter((f) => f.isFile()).map((f) => f.name));
  const imageAt = new Map(); // file name -> its place
  const seenIds = new Set();
  stages.forEach((stage, i) => {
    if (!isObject(stage)) return errors.push(`${DATA}: stage ${i + 1} must be an object`);
    const { id } = stage;
    const at = stageAt[i];
    checkFields(at, stage, FIELDS.stage);
    if (typeof id !== "string" || !SLUG.test(id)) fail(at, `the id ${shown(id)} must be lowercase words joined by "-"`);
    else if (seenIds.has(id)) fail(at, `the id ${id} is used twice`);
    seenIds.add(id);
    checkText(at, "short", stage.short);
    checkText(at, "title", stage.title);
    if (!Object.hasOwn(ICONS, stage.icon)) fail(at, `unknown icon ${shown(stage.icon)} (use one of: ${Object.keys(ICONS).join(", ")})`);
    checkParagraphs(at, "story", stage.story, 2);

    if (stage.flags !== undefined && !Array.isArray(stage.flags)) fail(at, "flags must be a list");
    (Array.isArray(stage.flags) ? stage.flags : []).forEach((flag, j) => {
      const where = `${at}, flag ${j + 1}`;
      if (!isObject(flag)) return errors.push(`${DATA}: ${where} must be an object`);
      if (!Object.hasOwn(FLAGS, flag.kind)) return fail(where, `unknown kind ${shown(flag.kind)} (use ${Object.keys(FLAGS).join(" or ")})`);
      checkFields(where, flag, FIELDS[flag.kind]);
      checkText(where, "text", flag.text);
      if (FLAGS[flag.kind].issue) {
        const { issue } = flag;
        const valid = issue === null || (isObject(issue) && Object.keys(issue).length === 2 && typeof issue.repo === "string" && REPO.test(issue.repo) && Number.isInteger(issue.number) && issue.number >= 1);
        if (!valid) fail(where, 'issue must be null (no public issue yet) or { "repo": a repo name, "number": a whole number from 1 }');
      } else if (typeof flag.question !== "string" || !flag.question.trim().endsWith("?")) {
        fail(where, 'a guess needs a question that ends with "?" (the question for the maintainer review)');
      } else checkText(where, "question", flag.question);
    });
    if (stage.note !== undefined) checkText(at, "note", stage.note);

    // An image with a source comes from another repo (the credit line names it); an image with no
    // source was made for this page.
    if (stage.images !== undefined && !Array.isArray(stage.images)) fail(at, "images must be a list");
    (Array.isArray(stage.images) ? stage.images : []).forEach((image, j) => {
      const where = `${at}, image ${j + 1}`;
      if (!isObject(image)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, image, FIELDS.image);
      if (typeof image.file !== "string" || !IMAGE_FILE.test(image.file)) fail(where, `file must be lowercase words joined by "-", with .png or .svg; it is ${shown(image.file)}`);
      else if (imageAt.has(image.file)) fail(where, `${image.file} is also ${imageAt.get(image.file)}: use each image once`);
      else {
        imageAt.set(image.file, `image ${j + 1} of ${at}`);
        const size = imageFiles.has(image.file) && imageSize(image.file);
        if (!imageFiles.has(image.file)) fail(where, `${IMAGES}/${image.file} is missing`);
        else if (!size) fail(where, `cannot read the size of ${IMAGES}/${image.file} (a PNG, or an SVG with a viewBox)`);
        else sizeOf.set(image.file, size);
      }
      if (image.frame !== undefined && image.frame !== "phone") fail(where, `frame must be "phone" or absent; it is ${shown(image.frame)}`);
      checkText(where, "alt", image.alt);
      checkText(where, "caption", image.caption);
      if (image.source === undefined) return;
      if (!isObject(image.source)) return fail(where, `source must be an object with the fields ${FIELDS.source.join(", ")}`);
      const from = `${where}, source`;
      checkFields(from, image.source, FIELDS.source);
      checkRepoName(from, image.source.repo);
      checkRepoPath(from, image.source.path);
      checkCommit(from, image.source.commit);
      checkText(from, "license", image.source.license);
    });

    if (!Array.isArray(stage.evidence) || !stage.evidence.length) fail(at, "evidence must be a list with at least one entry");
    (Array.isArray(stage.evidence) ? stage.evidence : []).forEach((entry, j) => {
      const where = `${at}, evidence ${j + 1}`;
      if (!isObject(entry)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, entry, FIELDS.evidence);
      checkRepoName(where, entry.repo);
      checkRepoPath(where, entry.path);
      if (!parseLines(entry.lines)) fail(where, `lines must be "<n>" or "<first>-<last>", with 1 <= first < last; it is ${shown(entry.lines)}`);
      checkCommit(where, entry.commit);
      if (!Array.isArray(entry.names) || entry.names.length < 1 || entry.names.length > 3) fail(where, "names must be a list of 1 to 3 names");
      else {
        entry.names.forEach((name, k) => checkText(where, `name ${k + 1}`, name));
        const seen = new Set();
        for (const name of entry.names) {
          if (seen.has(name)) fail(where, `the name ${shown(name)} is there twice`);
          seen.add(name);
        }
      }
      checkText(where, "what", entry.what);
      const key = `${entry.repo} ${entry.path} ${entry.lines}`;
      if (cited.has(key)) fail(where, `the same repo, path, and lines as ${cited.get(key)}`);
      else cited.set(key, where);
    });

    if (stage.moreRepos !== undefined && !Array.isArray(stage.moreRepos)) fail(at, "moreRepos must be a list");
    const evidenceRepos = new Set((Array.isArray(stage.evidence) ? stage.evidence : []).map((entry) => entry?.repo));
    const seenMore = new Set();
    (Array.isArray(stage.moreRepos) ? stage.moreRepos : []).forEach((more, j) => {
      const where = `${at}, more repo ${j + 1}`;
      if (!isObject(more)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, more, FIELDS.moreRepo);
      if (evidenceRepos.has(more.repo)) fail(where, `${more.repo} has an evidence entry on this stage: remove it here`);
      else if (seenMore.has(more.repo)) fail(where, `${more.repo} is there twice`);
      else checkRepoName(where, more.repo);
      seenMore.add(more.repo);
      checkText(where, "what", more.what);
    });
  });
  checkText("", "next", data.next);
  for (const f of entries) {
    if (!f.isFile()) errors.push(`${IMAGES}/${f.name} is a directory: the image directory holds only the image files`);
    else if (!imageAt.has(f.name)) errors.push(`${IMAGES}/${f.name} is in no stage of ${DATA}: add it to a stage, or remove it`);
  }
  return errors.length > before ? null : data;
}

const data = validData(readDocsFile(DATA, errors, parseJson));

// ---------- The view: the data with its links, for both outputs ----------

// The directory of the images, as a relative path from the copy and from the page.
const imageDir = IMAGES.split("/").pop();
const fileLink = (e) => `https://github.com/${estate.sourceOrg}/${e.repo}/blob/${e.commit}/${urlPath(e.path)}${lineAnchor(parseLines(e.lines))}`;
const repoLink = (repo) => `https://github.com/${estate.sourceOrg}/${repo}`;
const issueLink = ({ repo, number }) => `https://github.com/${estate.sourceOrg}/${repo}/issues/${number}`;
const commitLink = (repo, commit) => `https://github.com/${estate.sourceOrg}/${repo}/commit/${commit}`;
const linesText = ({ first, last }) => (first === last ? `line ${first}` : `lines ${first} to ${last}`);

// The view of the journey: the data, with the links of each repo, file, issue, and image source,
// and the size of each image. A repo of the estate gets the path of its viewer on the Pages site;
// a repo outside the estate gets its GitHub link. The developers of a stage are its repos in the
// order of their first evidence entry, each with its files, then the repos with no cited file. The
// link text of a file is its name and its lines: unique in the stage, so each link has its own name
// for a screen reader (one repo can have two entries in one file).
function viewOf() {
  const repoView = (repo) => (estateRepos.has(repo) ? { repo, site: `${repo}/` } : { repo, github: repoLink(repo) });
  const fileView = (e) => ({ name: e.path.split("/").pop(), lines: linesText(parseLines(e.lines)), url: fileLink(e), what: e.what });
  const images = data.stages.flatMap((s) => s.images ?? []);
  const groups = new Map(); // "<repo> <commit> <license>" -> a group of the credit line
  for (const { source } of images.filter((image) => image.source)) {
    const key = `${source.repo} ${source.commit} ${source.license}`;
    const group = groups.get(key) ?? { ...source, repoUrl: repoLink(source.repo), commitUrl: commitLink(source.repo, source.commit), count: 0 };
    group.count++;
    groups.set(key, group);
  }
  return {
    title: data.title,
    chapter: data.chapter,
    subtitle: data.subtitle,
    intro: data.intro,
    legend: data.legend,
    next: data.next,
    imageDir,
    stages: data.stages.map((stage) => ({
      id: stage.id,
      short: stage.short,
      title: stage.title,
      icon: stage.icon,
      story: stage.story,
      note: stage.note,
      flags: (stage.flags ?? []).map((flag) => ({
        kind: flag.kind,
        text: flag.text,
        issue: flag.issue && { label: `${flag.issue.repo} #${flag.issue.number}`, url: issueLink(flag.issue) },
      })),
      images: (stage.images ?? []).map((image) => ({ ...image, ...sizeOf.get(image.file) })),
      developers: [
        ...[...new Set(stage.evidence.map((e) => e.repo))].map((repo) => ({ ...repoView(repo), files: stage.evidence.filter((e) => e.repo === repo).map(fileView) })),
        ...(stage.moreRepos ?? []).map(({ repo, what }) => ({ ...repoView(repo), what, files: [] })),
      ],
    })),
    credits: { groups: [...groups.values()], own: images.some((image) => !image.source) },
  };
}

// ---------- The text copy (GitHub) ----------

// Data text is plain text, on one line. In the copy it gets no Markdown meaning (t06cj renders the
// copy to prove it):
// - each mark that can start an inline format or HTML gets a backslash: \ ` * _ ~ [ ] < >. This also
//   covers the block starts "*", ">", "<", a fence of "`" or "~", and a thematic break of "*" or "_";
// - "&" becomes "&amp;", so no entity;
// - a text that starts with "-", "+", "=", or "#" gets a backslash: a list item, a thematic break
//   ("---"), a setext line, a heading;
// - a text that starts with a number and "." or ")" gets a backslash before the mark: an ordered
//   list item;
// - a text that ends with a space and "#" marks gets a backslash before them: in a heading they
//   would be its closing sequence, and the heading would lose them.
// A text never starts with 4 spaces (no indented code): the data check refuses a leading space.
const mdText = (s) =>
  s
    .replace(/[\\`*_~[\]<>]/g, "\\$&")
    .replace(/&/g, "&amp;")
    .replace(/^(\d+)([.)])(?=\s|$)/, "$1\\$2")
    .replace(/^[-+=#]/, "\\$&")
    .replace(/(\s)(#+)$/, "$1\\$2");
// A label of the Mermaid flow, in double quotes: "#" and '"' as Mermaid entity codes.
const mermaidLabel = (s) => s.replace(/#/g, "#35;").replace(/"/g, "#quot;");
// A small HTML escape for the HTML blocks of the copy (the images).
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A repo of the estate links to its viewer and its onboarding guide on the Pages site; a repo
// outside the estate links to GitHub.
function repoMd(dev) {
  if (dev.github) return `[${dev.repo}](${dev.github}) (outside the docs repo)`;
  return `${dev.repo} ([viewer](${estate.siteUrl}${dev.site}), [onboarding guide](${estate.siteUrl}${dev.site}onboarding.html))`;
}

function developersMd(stage) {
  const lines = stage.developers.flatMap((dev) => [
    `- ${repoMd(dev)}${dev.what ? `: ${mdText(dev.what)}` : ""}`,
    ...dev.files.map((file) => `  - [\`${file.name}\` ${file.lines}](${file.url}): ${mdText(file.what)}`),
  ]);
  return ["<details>", "<summary>For developers</summary>", "", ...lines, "", "</details>"];
}

// The flags of a stage as quotes, in their order. The question of a guess is not on the page.
function flagsMd(stage) {
  return stage.flags.flatMap((flag) => {
    const { label, issue } = FLAGS[flag.kind];
    const named = !issue ? "" : flag.issue ? ` See [${flag.issue.label}](${flag.issue.url}).` : ` ${NO_ISSUE}`;
    return [`> **${label}:** ${mdText(flag.text)}${named}`, ""];
  });
}

// The images of a stage in one line: a phone screen at 160 px, a drawing at 360 px. The captions
// follow in the order of the images. HTML block: the texts get HTML escapes, not Markdown ones.
function imagesMd(stage) {
  if (!stage.images.length) return [];
  const imgs = stage.images.map((image) => `<img src="${imageDir}/${esc(image.file)}" width="${image.frame === "phone" ? 160 : 360}" alt="${esc(image.alt)}">`);
  return [`<p>${imgs.join(" ")}<br><sub>${stage.images.map((image) => esc(image.caption)).join(" · ")}</sub></p>`, ""];
}

function copyText(view) {
  const out = [
    `<!-- Built by ${SCRIPT} from ${DATA}. Do not edit. -->`,
    "",
    `# ${mdText(view.title)}`,
    "",
    `**Chapter ${view.chapter}: ${mdText(view.subtitle)}**`,
    "",
    `This is the text copy of the page for GitHub. The illustrated page is on the [Pages site](${estate.siteUrl}${PAGE}).`,
    "",
    ...view.intro.flatMap((p) => [mdText(p), ""]),
    "How to read this page:",
    "",
    ...Object.entries(FLAGS).map(([kind, flag]) => `- **${flag.label}:** ${mdText(view.legend[kind])}`),
    `- **For developers:** ${mdText(view.legend.dev)}`,
    "",
    "```mermaid",
    "flowchart LR",
    ...view.stages.map((s, i) => `  s${i + 1}["${i + 1}. ${mermaidLabel(s.short)}"]`),
    ...(view.stages.length > 1 ? [`  ${view.stages.map((_, i) => `s${i + 1}`).join(" --> ")}`] : []),
    "```",
    "",
  ];
  view.stages.forEach((stage, i) => {
    out.push(`## ${i + 1}. ${mdText(stage.title)}`, "", ...imagesMd(stage), ...stage.story.flatMap((p) => [mdText(p), ""]), ...flagsMd(stage));
    if (stage.note) out.push(mdText(stage.note), "");
    out.push(...developersMd(stage), "");
  });
  out.push("## Next", "", mdText(view.next), "");
  const credit = creditText(view.credits, {
    repo: (g) => `[${g.repo}](${g.repoUrl})`,
    commit: (g) => `[\`${g.commit}\`](${g.commitUrl})`,
    text: mdText,
  });
  if (credit) out.push(credit, "");
  return out.join("\n");
}

// A guard of the page render: each link to an anchor has its id, each id is unique, and each image
// of the page is an image of the data file. The data checks cannot see a defect of the render.
function checkPage(html) {
  const where = `${PAGE} (built in memory)`;
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) errors.push(`${where}: the id ${id} is used twice`);
  for (const [, id] of html.matchAll(/href="#([^"]*)"/g)) if (!ids.includes(id)) errors.push(`${where}: a link to #${id}, but no id ${id}`);
  for (const [, src] of html.matchAll(/\ssrc="([^"]*)"/g)) if (!sizeOf.has(src.replace(`${imageDir}/`, ""))) errors.push(`${where}: an image ${src} that is not in ${DATA}`);
}

// ---------- The evidence (GitHub) ----------

// Read each fact on GitHub, once for each repo, file, image, and issue (githubApi of estate.mjs):
// each repo is public; each cited file is in its repo at its commit, has the cited lines, and holds
// each name in them, by the name rule of estate.mjs (missingNames); each issue of a flag is an open
// issue; each image with a source is the same file (git blob SHA) as its source at its commit. An
// error never names a repo that GitHub does not show: it may be private now.
async function checkEvidence() {
  const api = githubApi(estate.sourceOrg, process.env.GITHUB_TOKEN);
  const fail = (where, message) => errors.push(`${DATA}: ${where}: ${message}`);
  // True if the repo is public; else record why at this place, with no repo name.
  const repoSet = new Set();
  const publicRepo = async (where, repo) => {
    repoSet.add(repo);
    const answer = await api.get(repo);
    if (answer.body) return answer.body.private === false ? true : (fail(where, "the repo is private: the page names only public repos"), false);
    if (answer.status === 404) fail(where, "the repo is not found (HTTP 404): it may be private now");
    else fail(where, `cannot read the repo (${answerStatus(answer)})`);
    return false;
  };
  const counts = { entries: 0, names: 0, images: 0, issues: 0 };
  const files = new Set(); // "<repo>@<commit>:<path>"

  for (const stage of data.stages) {
    const at = `stage ${stage.id}`;
    for (const [j, flag] of (stage.flags ?? []).entries()) {
      if (!FLAGS[flag.kind].issue || !flag.issue) continue;
      const where = `${at}, flag ${j + 1}`;
      if (!(await publicRepo(where, flag.issue.repo))) continue;
      counts.issues++;
      const name = `${flag.issue.repo} #${flag.issue.number}`;
      const answer = await api.get(`${flag.issue.repo}/issues/${flag.issue.number}`);
      if (!answer.body) fail(where, `${name} is not found (${answerStatus(answer)})`);
      else if (answer.body.pull_request) fail(where, `${name} is a pull request, not an issue`);
      else if (answer.body.state !== "open") fail(where, `${name} is closed: check the flag, then remove the issue or the flag`);
    }
    for (const [j, image] of (stage.images ?? []).entries()) {
      if (!image.source) continue;
      const where = `${at}, image ${j + 1}`;
      const { repo, path, commit } = image.source;
      if (!(await publicRepo(where, repo))) continue;
      counts.images++;
      const answer = await api.file(repo, path, commit, "application/vnd.github+json");
      const bytes = readFileSync(join(root, IMAGES, image.file));
      const local = createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest("hex");
      if (!answer.body) fail(where, `${repo} ${path} is not in the repo at ${commit} (${answerStatus(answer)})`);
      else if (answer.body.sha !== local) fail(where, `${IMAGES}/${image.file} is not the file ${repo} ${path} at ${commit}`);
    }
    for (const [j, entry] of stage.evidence.entries()) {
      if (!(await publicRepo(`${at}, evidence ${j + 1}`, entry.repo))) continue;
      const range = parseLines(entry.lines);
      const where = `${at}, evidence ${j + 1} (${entry.repo} ${entry.path}${lineAnchor(range)} at ${entry.commit})`;
      counts.entries++;
      files.add(`${entry.repo}@${entry.commit}:${entry.path}`);
      const answer = await api.file(entry.repo, entry.path, entry.commit);
      if (answer.body === undefined) {
        fail(where, `the file is not in the repo at the commit (${answerStatus(answer)})`);
        continue;
      }
      const cited = citedLines(answer.body, range);
      if (cited.text === undefined) {
        fail(where, `the file has ${plural(cited.count, "line")}`);
        continue;
      }
      counts.names += entry.names.length;
      for (const name of missingNames(cited.text, entry.names)) fail(where, `${name} is not in the cited lines`);
    }
    for (const [j, { repo }] of (stage.moreRepos ?? []).entries()) await publicRepo(`${at}, more repo ${j + 1}`, repo);
  }
  return `${plural(counts.entries, "evidence entry", "evidence entries")}, ${plural(counts.names, "name")}, ${plural(files.size, "file")}, ${plural(counts.images, "image")}, ${plural(counts.issues, "issue")}, ${plural(repoSet.size, "repo")}`;
}

// ---------- The modes ----------

function exitOnErrors() {
  if (!errors.length) return;
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

exitOnErrors();
if (mode === "evidence") {
  const counts = await checkEvidence();
  exitOnErrors();
  console.log(`each capture journey fact holds (${counts})`);
  process.exit(0);
}
const view = viewOf();
const copy = copyText(view);
const { GITHUB_REPOSITORY: githubRepo, GITHUB_SHA: githubSha } = process.env;
const page = pageHtml(view, githubRepo && githubSha ? `https://github.com/${githubRepo}/blob/${githubSha}/${COPY}` : null);
checkPage(page);
exitOnErrors();

const images = data.stages.flatMap((s) => s.images ?? []);
const summary = `${plural(data.stages.length, "stage")}, ${plural(data.stages.flatMap((s) => s.evidence).length, "evidence entry", "evidence entries")}, ${plural(images.length, "image")}`;
if (mode === "check") {
  if (readDocsFile(COPY, []) !== copy) {
    console.error(`error: ${COPY} is stale. Run: node ${SCRIPT}`);
    process.exit(1);
  }
  console.log(`${COPY} is current (${summary})`);
} else if (mode === "site") {
  writeFileSync(join(siteDir, PAGE), page);
  mkdirSync(join(siteDir, imageDir), { recursive: true });
  for (const image of images) copyFileSync(join(root, IMAGES, image.file), join(siteDir, imageDir, image.file));
  console.log(`wrote ${join(siteDir, PAGE)} and ${plural(images.length, "image")} (${summary})`);
} else {
  writeFileSync(join(root, COPY), copy);
  console.log(`wrote ${COPY} (${summary})`);
}
