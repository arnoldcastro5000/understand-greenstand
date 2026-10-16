#!/usr/bin/env node
// Check that no hand-written file of the docs repo contains a former name of a repo
// (formerNames in estate.json), so that after a rename the docs use the new name everywhere.
// It reads each file that git tracks or would track (git ls-files), except:
// - the generated files of repos/: the graphs, the onboarding guides, and the glossaries. A
//   regeneration writes them, and mirrored text may contain the former name. The per-repo
//   README.md is hand-written, so the check reads it.
// - estate.json, which records the former names, and GLOSSARY.md, which is generated from the
//   domain graphs.
// - the generated blocks between BEGIN and END markers (the README index shows the former name).
// Usage: node check-former-names.mjs   exit 1 and show each line that contains a former name (CI)
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadEstate, root } from "./estate.mjs";

const handWrittenFile = (file) =>
  (!file.startsWith("repos/") || /^repos\/[^/]+\/README\.md$/.test(file)) && file !== "estate.json" && file !== "GLOSSARY.md";
// A generated block keeps its line breaks, so the line numbers of the rest stay true.
const GENERATED = /<!-- BEGIN [^\n]*-->[\s\S]*?<!-- END [^\n]*-->/g;
const handWrittenText = (text) => text.replace(GENERATED, (block) => block.replace(/[^\n]/g, ""));
// A name, not a part of a longer name: tiles-1 matches in "Greenstand/tiles-1." but not in
// "tiles-10".
const nameIn = (name) => new RegExp(`(?<![\\w.-])${name.replace(/[.]/g, "\\.")}(?![\\w-])`);

const { repos, errors } = loadEstate();
const renamed = repos.flatMap(({ name, formerNames }) => formerNames.map((former) => ({ former, name, re: nameIn(former) })));

let files = [];
if (renamed.length) {
  try {
    const listed = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" });
    // A file deleted from the work tree stays in the list until the deletion is staged.
    files = [...new Set(listed.split("\0"))].filter((f) => f && handWrittenFile(f) && statSync(join(root, f), { throwIfNoEntry: false })?.isFile());
  } catch (e) {
    errors.push(`git ls-files cannot list the files of the docs repo: ${e.message}`);
  }
}

for (const file of files) {
  const text = readFileSync(join(root, file), "utf8");
  if (text.includes("\0")) continue; // not a text file
  handWrittenText(text).split("\n").forEach((line, i) => {
    for (const { former, name, re } of renamed) if (re.test(line)) errors.push(`${file}:${i + 1} contains ${former}, a former name of ${name}`);
  });
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
if (!renamed.length) console.log("no repo has a former name");
else console.log(`no hand-written file contains a former name (${renamed.length} former name${renamed.length > 1 ? "s" : ""}, ${files.length} files)`);
