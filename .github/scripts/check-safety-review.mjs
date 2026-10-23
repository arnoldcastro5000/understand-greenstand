#!/usr/bin/env node
// Check the safety review of the shared-resource page. The page must hold no security detail
// (CONTRIBUTING.md, "Change the shared-resource page"). A pull request that changes
// docs/shared-resources.md or shared-resources.json passes only when its text has:
// - the line of the safety review (LINE_FORM, with a real date), which the writer adds before
//   the pull request opens;
// - the item of the pull request template, ticked at the merge.
// The pull request text is read as a reader sees it: text in an HTML comment, in fenced code, or
// in an HTML block does not count. The changed files are the files of the "Files changed" tab:
// git diff base...head, with no rename detection, so a page that is moved away counts too.
// The check also fails when .github/pull_request_template.md does not hold the item, unticked,
// exactly once, so that the template and this check cannot drift apart. On a push, it checks
// only the template.
// It reads the event from $GITHUB_EVENT_PATH, not from step env values (GitHub prints those in
// the public log), and it prints no pull request text and no other file name.
// Usage: node check-safety-review.mjs   exit 1 and show each missing part (CI, the
//   private-names job of secrets-scan.yml)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fencedLines, root } from "./estate.mjs";

const PAGE_FILES = ["docs/shared-resources.md", "shared-resources.json"];
const TEMPLATE = ".github/pull_request_template.md";
const ITEM = "If this pull request changes `docs/shared-resources.md` or `shared-resources.json`: I confirm that the page has no security detail.";
const LINE_FORM = "Safety review: the page text was checked against the local findings list on <YYYY-MM-DD>. It has no security detail.";
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const LINE = new RegExp(`^${escapeRegExp(LINE_FORM).replace("<YYYY-MM-DD>", "(\\d{4}-\\d{2}-\\d{2})")}$`);
// A task list item as GitHub shows it: a list marker after at most 3 spaces, then the box.
const TASK = /^ {0,3}[-*+] \[([ xX])\] (.*)$/;
// A line that starts a new block, so it does not continue the item before it.
const NEW_BLOCK = /^\s*(?:[-*+]|\d+[.)])(?:\s|$)|^ {0,3}[#>]/;
const HINT = 'See "Change the shared-resource page" in CONTRIBUTING.md.';

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
const countItems = (items, ticked) => items.filter((item) => item.text === ITEM && item.ticked === ticked).length;
const realDate = (date) => !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;

const errors = [];
let hint = false;
const inTemplate = countItems(readText(readFileSync(join(root, TEMPLATE), "utf8")).items, false);
if (inTemplate !== 1) errors.push(`${TEMPLATE} must hold this item, unticked, exactly once (it has ${inTemplate}): - [ ] ${ITEM}`);

let result = "not a pull request: the pull request template holds the item";
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
    const pageFiles = PAGE_FILES.filter((file) => changed?.includes(file));
    if (changed && !pageFiles.length) {
      result = `the pull request changes neither ${PAGE_FILES.join(" nor ")} (${changed.length} changed file${changed.length === 1 ? "" : "s"}): no safety review is needed`;
    } else if (changed) {
      const files = pageFiles.join(" and ");
      const { lines, items } = readText(body ?? "");
      if (!lines.some((line) => realDate(line.match(LINE)?.[1] ?? ""))) {
        errors.push(`the pull request changes ${files}, but its text has no line of this form: ${LINE_FORM}`);
      }
      if (!countItems(items, true)) errors.push(`the pull request changes ${files}, but its text does not have this item ticked: - [x] ${ITEM}`);
      hint = errors.length > 0;
      if (!errors.length) result = `the pull request changes ${files}: the safety review line and the ticked item are there`;
    }
  }
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  if (hint) console.error(HINT);
  process.exit(1);
}
console.log(result);
