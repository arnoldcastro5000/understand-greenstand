#!/usr/bin/env node
// Check the safety review of the pages that must hold no security detail (CONTRIBUTING.md,
// "Change the shared-resource page or the capture journey"): the shared-resource page and the
// capture journey. Each page has its files (PAGES) and its item of the pull request template. A
// pull request that changes a file of a page passes only when its text has:
// - the line of the safety review (LINE_FORM, with a real date), once, which the writer adds
//   before the pull request opens;
// - the item of each page that it changes, ticked at the merge.
// The pull request text is read as a reader sees it: text in an HTML comment, in fenced code, or
// in an HTML block does not count. The changed files are the files of the "Files changed" tab:
// git diff base...head, with no rename detection, so a page that is moved away counts too. A
// path of PAGES that ends with "/" is a directory: each file under it counts. The paths come from
// estate.mjs, the source of the paths for the build scripts too.
// The check also fails when .github/pull_request_template.md does not hold the item of each page,
// unticked, exactly once, so that the template and this check cannot drift apart. On a push, it
// checks only the template.
// It reads the event from $GITHUB_EVENT_PATH, not from step env values (GitHub prints those in
// the public log), and it prints no pull request text and no file name but the paths of PAGES.
// Usage: node check-safety-review.mjs   exit 1 and show each missing part (CI, the
//   private-names job of secrets-scan.yml)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURE_JOURNEY_COPY, CAPTURE_JOURNEY_DATA, CAPTURE_JOURNEY_IMAGES, SHARED_RESOURCES_DATA, SHARED_RESOURCES_PAGE, escapeRegExp, fencedLines, root } from "./estate.mjs";

// The pages, each with its files and its item of the pull request template. The item of the
// shared-resource page keeps the words that the user accepted.
const PAGES = [
  {
    files: [SHARED_RESOURCES_PAGE, SHARED_RESOURCES_DATA],
    item: `If this pull request changes \`${SHARED_RESOURCES_PAGE}\` or \`${SHARED_RESOURCES_DATA}\`: I confirm that the page has no security detail.`,
  },
  {
    files: [CAPTURE_JOURNEY_COPY, CAPTURE_JOURNEY_DATA, `${CAPTURE_JOURNEY_IMAGES}/`],
    item: `If this pull request changes \`${CAPTURE_JOURNEY_COPY}\`, \`${CAPTURE_JOURNEY_DATA}\`, or \`${CAPTURE_JOURNEY_IMAGES}/\`: I confirm that the page has no security detail.`,
  },
];
const TEMPLATE = ".github/pull_request_template.md";
const LINE_FORM = "Safety review: the page text was checked against the local findings list on <YYYY-MM-DD>. It has no security detail.";
const LINE = new RegExp(`^${escapeRegExp(LINE_FORM).replace("<YYYY-MM-DD>", "(\\d{4}-\\d{2}-\\d{2})")}$`);
// A task list item as GitHub shows it: a list marker after at most 3 spaces, then the box.
const TASK = /^ {0,3}[-*+] \[([ xX])\] (.*)$/;
// A line that starts a new block, so it does not continue the item before it.
const NEW_BLOCK = /^\s*(?:[-*+]|\d+[.)])(?:\s|$)|^ {0,3}[#>]/;
const HINT = 'See "Change the shared-resource page or the capture journey" in CONTRIBUTING.md.';

// A Markdown text as a reader sees it: its text lines, and its task list items with the text of
// each. An HTML comment that is not closed hides the rest. An HTML block runs from a line that
// starts with a tag to the next blank line. A line that is not blank and starts no new block
// continues the item before it, so a wrapped item is one item.
function readText(markdown) {
  const raw = markdown.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?(?:-->|$)/g, "").split("\n");
  const fenced = fencedLines(raw);
  const lines = [];
  const items = [];
  let html = false;
  let item = null;
  raw.forEach((text, i) => {
    const line = fenced[i] ? "" : text.trimEnd();
    if (!line.trim()) {
      html = false;
      item = null;
    } else if (html || /^ {0,3}<[A-Za-z/]/.test(line)) {
      html = true;
      item = null;
    } else if (TASK.test(line)) {
      const [, box, itemText] = line.match(TASK);
      item = { ticked: box !== " ", text: itemText.trim() };
      items.push(item);
    } else if (item && !NEW_BLOCK.test(line)) {
      item.text += ` ${line.trim()}`;
    } else {
      item = null;
      lines.push(line);
    }
  });
  return { lines, items };
}
const countItems = (items, text, ticked) => items.filter((item) => item.text === text && item.ticked === ticked).length;
const realDate = (date) => !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
// The paths of a page that the pull request changes: a file path, or a directory path when a file
// under the directory changes. Only these paths are printed, never the name of another file.
const changedPaths = (page, changed) => page.files.filter((path) => changed.some((file) => (path.endsWith("/") ? file.startsWith(path) : file === path)));
// "a", "a and b", "a, b, and c".
const listed = (paths) => (paths.length < 3 ? paths.join(" and ") : `${paths.slice(0, -1).join(", ")}, and ${paths.at(-1)}`);

const errors = [];
let hint = false;
const templateItems = readText(readFileSync(join(root, TEMPLATE), "utf8")).items;
for (const { item } of PAGES) {
  const inTemplate = countItems(templateItems, item, false);
  if (inTemplate !== 1) errors.push(`${TEMPLATE} must hold this item, unticked, exactly once (it has ${inTemplate}): - [ ] ${item}`);
}

let result = "not a pull request: the pull request template holds the item of each page";
if (process.env.GITHUB_EVENT_NAME === "pull_request" && !errors.length) {
  if (!process.env.GITHUB_EVENT_PATH) {
    errors.push("GITHUB_EVENT_PATH is not set, so the check cannot read the pull request");
  } else {
    const { base, head, body } = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")).pull_request;
    let changed = null;
    try {
      const listed = execFileSync("git", ["diff", "--name-only", "--no-renames", "-z", `${base.sha}...${head.sha}`], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      changed = listed.split("\0").filter(Boolean);
    } catch (e) {
      errors.push(`git cannot list the changed files of the pull request: ${e.stderr?.trim() || e.message}`);
    }
    const pages = changed ? PAGES.map((page) => ({ ...page, paths: changedPaths(page, changed) })).filter((page) => page.paths.length) : [];
    if (changed && !pages.length) {
      result = `the pull request changes no file of a page that needs a safety review (${changed.length} changed file${changed.length === 1 ? "" : "s"}): no safety review is needed`;
    } else if (changed) {
      const files = listed(pages.flatMap((page) => page.paths));
      const { lines, items } = readText(body ?? "");
      if (!lines.some((line) => realDate(line.match(LINE)?.[1] ?? ""))) {
        errors.push(`the pull request changes ${files}, but its text has no line of this form: ${LINE_FORM}`);
      }
      for (const page of pages) {
        if (!countItems(items, page.item, true)) errors.push(`the pull request changes ${listed(page.paths)}, but its text does not have this item ticked: - [x] ${page.item}`);
      }
      hint = errors.length > 0;
      if (!errors.length) result = `the pull request changes ${files}: the safety review line and the ticked item${pages.length > 1 ? "s" : ""} are there`;
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  if (hint) console.error(HINT);
  process.exit(1);
}
console.log(result);
