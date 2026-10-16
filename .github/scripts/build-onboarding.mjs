#!/usr/bin/env node
// Clean up the onboarding guide of each repo (repos/<name>/ONBOARDING.md) after a regeneration.
// /understand-anything:understand-onboard writes the guides, and it picks their format again on
// each run. Two parts of its output do not suit these docs:
// - A table: on a phone (390 px), GitHub cuts it off, and the reader must scroll it sideways.
//   Each table becomes a list with one item for each row.
// - An em dash: this repo's text uses none. The first em dash of a list item or a heading becomes
//   a colon. A pair of em dashes in one sentence becomes a pair of parentheses. Any other em dash
//   becomes a colon.
// Code (inline or fenced) stays as it is.
// Usage: node build-onboarding.mjs           rewrite the guides
//        node build-onboarding.mjs --check   exit 1 if a guide has a table or an em dash outside
//                                            code (CI)
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { EM_DASH, fencedLines, loadEstate, readDocsFile, root } from "./estate.mjs";

const SCRIPT = ".github/scripts/build-onboarding.mjs";

const check = process.argv.includes("--check");
const { repos, count, errors } = loadEstate();

// The runs of lines of a guide, in turn: text, and fenced code.
function splitAtFences(lines) {
  const fenced = fencedLines(lines);
  const out = [];
  lines.forEach((line, i) => {
    const last = out.at(-1);
    if (last?.code === fenced[i]) last.lines.push(line);
    else out.push({ code: fenced[i], lines: [line] });
  });
  return out;
}

// The kind of a line. A line in a blockquote counts without its ">" marks.
const content = (line) => line.replace(/^[ \t]*(?:>[ \t]?)*[ \t]*/, "");
const isBlank = (line) => content(line).trim() === "";
const isHeading = (line) => /^#{1,6}[ \t]/.test(content(line));
const isListItem = (line) => /^(?:[-*+]|\d+[.)])[ \t]/.test(content(line));

// The blocks of a run of text lines. A blank line ends a block. A list item or a heading starts a
// block, and a heading is a block of its own.
function blocks(lines) {
  const out = [];
  let ended = true;
  for (const line of lines) {
    if (ended || isBlank(line) || isListItem(line) || isHeading(line)) out.push([line]);
    else out.at(-1).push(line);
    ended = isBlank(line) || isHeading(line);
  }
  return out;
}

// Apply f to the parts of text between the separators that sep matches, with the index of each
// part. sep has one capture group, so split keeps the separators, at the odd indexes.
const mapParts = (text, sep, f) => text.split(sep).map((p, i) => (i % 2 ? p : f(p, i / 2))).join("");

// A block hides its inline code behind a mark during the clean-up.
const MARK = String.fromCharCode(0xe000);
const CODE_SPAN = /(`+)[\s\S]*?\1/g;
const MARKED = new RegExp(`${MARK}(\\d+)${MARK}`, "g");

// A sentence ends at ".", "!", or "?" before white space and an upper-case letter, a digit, or
// markup. It also ends at a hard line break: "\" or two spaces at the end of a line.
const SENTENCE_END = new RegExp(String.raw`((?<=[.!?])\s+(?=[A-Z0-9*[_("${MARK}])|(?<=\\| {2})\n)`);

// One em dash, with the white space around it.
const SPACED_EM_DASH = new RegExp(String.raw`(\s*)${EM_DASH}(\s*)`, "g");

// Clean up the em dashes of one sentence. If lead is set, the first em dash ends the term of a
// list item or a heading, so it becomes a colon. A pair of the other em dashes encloses an aside,
// so they become parentheses. Any other em dash becomes a colon. An em dash at a line break keeps
// the line break.
function cleanSentence(sentence, lead) {
  let left = sentence.split(EM_DASH).length - 1; // the em dashes that are not cleaned up yet
  let opened = false;
  return sentence.replace(SPACED_EM_DASH, (dash, before, after, offset) => {
    const lineBreak = [after, before].find((space) => space.includes("\n"));
    const pair = !lead && left === 2;
    if (lead) {
      lead = false;
      left--;
    }
    if (!pair) return `:${lineBreak ?? (after || " ")}`;
    if (!opened) {
      opened = true;
      return `${lineBreak ?? (before || " ")}(`;
    }
    const next = sentence[offset + dash.length] ?? "";
    return `)${lineBreak ?? (after || (/\w/.test(next) ? " " : ""))}`;
  });
}

function cleanBlock(block) {
  const spans = [];
  const hidden = block.replace(CODE_SPAN, (span) => `${MARK}${spans.push(span) - 1}${MARK}`);
  const lead = isListItem(block) || isHeading(block);
  return mapParts(hidden, SENTENCE_END, (sentence, i) => cleanSentence(sentence, lead && i === 0))
    .replace(MARKED, (_, i) => spans[i]);
}

// The cells of a table row: the text between unescaped "|". The outer "|" are optional.
const cells = (row) => row.trim().replace(/^\|/, "").replace(/(?<!\\)\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim());
const DELIMITER_ROW = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const isTable = (lines, i) =>
  lines[i].includes("|") && lines[i + 1]?.includes("|") && DELIMITER_ROW.test(lines[i + 1]) &&
  cells(lines[i]).length === cells(lines[i + 1]).length;

// Each row of a table becomes a list item, at the indentation of the table: the first cell is its
// bold title, and each other cell is a line "Header: value" after a hard line break ("\"). A list
// needs no escape for "|".
function tablesToLists(lines) {
  const cleanCells = (row) => cells(row).map((c) => cleanBlock(c.replaceAll("\\|", "|")));
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!isTable(lines, i)) {
      out.push(lines[i]);
      continue;
    }
    const indent = lines[i].match(/^\s*/)[0];
    const headers = cleanCells(lines[i]);
    for (i += 2; i < lines.length && lines[i].includes("|"); i++) {
      const [first, ...rest] = cleanCells(lines[i]);
      const title = !first || first.includes("**") ? first : `**${first}**`;
      const parts = [title, ...rest.map((v, k) => v && (headers[k + 1] ? `${headers[k + 1]}: ${v}` : v))].filter(Boolean);
      if (parts.length) out.push(`${indent}- ${parts.join(`\\\n${indent}  `)}`);
    }
    if (i < lines.length && lines[i].trim()) out.push("");
    i--;
  }
  return out;
}

function cleanUp(lines) {
  return splitAtFences(lines)
    .flatMap(({ code, lines: run }) => (code ? run : blocks(tablesToLists(run)).map((block) => cleanBlock(block.join("\n")))))
    .join("\n");
}

// What the clean-up changes, by line number: the first row of each table, and each line with an
// em dash outside code. It reads the blocks as cleanUp does, so both agree on what is code.
function findings(lines) {
  const out = [];
  let start = 1; // the line number of the first line of a run
  for (const { code, lines: run } of splitAtFences(lines)) {
    if (!code) {
      run.forEach((_, i) => isTable(run, i) && out.push([start + i, "a table"]));
      let n = start;
      for (const block of blocks(run)) {
        const blanked = block.join("\n").replace(CODE_SPAN, (span) => span.replace(/[^\n]/g, " "));
        blanked.split("\n").forEach((line, i) => line.includes(EM_DASH) && out.push([n + i, "an em dash"]));
        n += block.length;
      }
    }
    start += run.length;
  }
  return out.sort(([a], [b]) => a - b).map(([n, what]) => `${n}: ${what}`);
}

// The line number of the first line that differs.
function firstChange(a, b) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return i + 1;
}

const updates = [];
for (const { name } of repos) {
  const at = `repos/${name}/ONBOARDING.md`;
  const guide = readDocsFile(at, errors);
  if (guide === null) continue;
  // Work on the lines, and write the guide back with its own line ending.
  const eol = guide.includes("\r\n") ? "\r\n" : "\n";
  const lines = guide.split(/\r?\n/);
  updates.push({ at, guide, lines, next: cleanUp(lines).replaceAll("\n", eol) });
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

const changed = updates.filter(({ guide, next }) => next !== guide);
if (check) {
  if (changed.length) {
    for (const { at, lines, next } of changed) {
      const found = findings(lines);
      for (const f of found.length ? found : [`${firstChange(lines, next.split(/\r?\n/))}: needs a clean-up`]) {
        console.error(`error: ${at}:${f}`);
      }
    }
    console.error(`Run: node ${SCRIPT}`);
    process.exit(1);
  }
  console.log(`onboarding guides have no table and no em dash outside code (${count} repos)`);
} else {
  for (const { at, next } of changed) writeFileSync(join(root, at), next);
  console.log(`cleaned up the onboarding guides (${count} repos, ${changed.length} changed)`);
}
