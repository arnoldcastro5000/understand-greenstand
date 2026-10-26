#!/usr/bin/env node
// Build the landing page of the Pages site (<site-dir>/index.html) from the estate
// (estate.mjs), so it shows the same areas, repos, and links as the README.md index. Like the top
// of README.md, it also links the estate glossary, the volunteer guide, the ecosystem maps, and the
// shared-resource page.
// The deploy workflow runs it after it assembles <site-dir>/<repo>/. It fails if a page
// that the landing page links to is missing there.
// Usage: node build-landing.mjs <site-dir>
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { formerNamesText, loadEstate } from "./estate.mjs";
import { BASE_STYLE, esc } from "./site-html.mjs";

const site = process.argv[2];
if (!site) {
  console.error("usage: node build-landing.mjs <site-dir>");
  process.exit(2);
}

const { areas, repos, count, errors } = loadEstate();

// The deploy workflow assembles these files beside each viewer.
const ASSEMBLED = ["index.html", "knowledge-graph.json", "onboarding.html", "readme.html", "glossary.html"];
for (const { name } of repos) {
  for (const f of ASSEMBLED) if (!existsSync(join(site, name, f))) errors.push(`${site}/${name}/${f} is missing`);
}
// The deploy workflow renders these pages at the site root: the estate glossary, the volunteer
// guide, the ecosystem maps, and the shared-resource page.
const ROOT_PAGES = ["glossary.html", "contribute.html", "architecture.html", "shared-resources.html"];
for (const f of ROOT_PAGES) if (!existsSync(join(site, f))) errors.push(`${site}/${f} is missing`);

const link = (href, text) => `<a href="${esc(href)}">${text}</a>`;
const anchor = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// One entry of an area list: a name that links to a page, a description, and more lines.
function entry(href, name, description, more = []) {
  return ["<li>", `<a class="name" href="${esc(href)}">${name}</a>`, `<p class="desc">${description}</p>`, ...more, "</li>"].join("\n");
}

function item({ name, description, formerNames, sha, date, source }) {
  const links = [
    link(`./${name}/`, "Viewer"),
    link(`./${name}/onboarding.html`, "Onboarding"),
    link(`./${name}/glossary.html`, "Glossary"),
    link(`./${name}/readme.html`, "README"),
    link(source, "Source"),
  ].join(" · ");
  const commit = link(`${source}/commit/${sha}`, `<code>${sha.slice(0, 7)}</code>`);
  return entry(
    `./${name}/`,
    esc(name),
    `${esc(description)}${formerNamesText(formerNames, (n) => `<code>${esc(n)}</code>`)}`,
    [`<p class="links"><span>${links}</span><span class="snap">Snapshot ${esc(date)} at ${commit}</span></p>`],
  );
}

// The ecosystem maps show how the code repos work together. The shared-resource page shows what
// the code repos share. The "Start here" box lists both below its repos.
const MAPS_ITEM = entry(
  "./architecture.html",
  "Ecosystem maps",
  "How the code repos work together at run time: which app calls which API, and which data they share.",
);
const SHARED_RESOURCES_ITEM = entry(
  "./shared-resources.html",
  "Shared resources",
  "What the code repos share to build, deploy, and run, for example the container registry, the clusters, and the shared database.",
);

function section(area, extra = []) {
  const id = anchor(area.title);
  const lines = [`<section id="${id}" class="area${area.featured ? " featured" : ""}">`, `<h2>${esc(area.title)}</h2>`];
  if (area.intro) lines.push(`<p class="intro">${esc(area.intro)}</p>`);
  lines.push("<ul>", ...area.repos.map(item), ...extra, "</ul>");
  if (area.seeAlso) lines.push(`<p class="deeper">Go deeper: ${area.seeAlso.map((l) => link(l.url, esc(l.text))).join(" · ")}</p>`);
  lines.push("</section>");
  return lines.join("\n");
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// The featured area ("Start here") goes first, in a box. The jump links list the other areas.
// estate.mjs makes sure that exactly one area is featured.
const start = areas.find((a) => a.featured);
const others = areas.filter((a) => !a.featured);
const jump = others.map((a) => link(`#${anchor(a.title)}`, esc(a.title))).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>understand-greenstand</title>
<meta name="description" content="Interactive knowledge-graph viewers and onboarding guides for the Greenstand repositories, grouped by area.">
<style>
${BASE_STYLE}
  h1 { font-size: 1.8rem; line-height: 1.25; margin: 0 0 .75rem; }
  h2 { font-size: 1.25rem; line-height: 1.25; margin: 0 0 .5rem; }
  p { margin: 0; }
  code { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .88em; }
  .lede { margin-bottom: .75rem; }
  .welcome { margin-bottom: 1.5rem; }
  .area { margin-top: 2rem; scroll-margin-top: 1rem; }
  .intro { margin-bottom: .75rem; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin: .6rem 0; padding: .75rem 1rem; border: 1px solid var(--line); border-radius: 8px; }
  .name { font-size: 1.05rem; font-weight: 600; }
  .desc { margin: .15rem 0 .4rem; }
  .links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .25rem 1rem;
    font-size: .9rem; }
  .snap, .deeper, .jump { color: var(--muted); }
  .deeper { margin-top: .5rem; font-size: .9rem; }
  .featured { margin-top: 0; padding: 1rem 1.1rem; border: 2px solid var(--link); border-radius: 10px; }
  .featured h2 { font-size: .75rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: var(--link); }
  .featured li { margin: .5rem 0; padding: 0; border: 0; }
  .featured .name { font-size: 1.2rem; }
  .jump { display: flex; flex-wrap: wrap; gap: .25rem 1rem; margin-top: 2rem; padding: .75rem 0;
    border-block: 1px solid var(--line); font-size: .9rem; }
</style>
</head>
<body>
<h1>understand-greenstand</h1>
<p class="lede">Machine-generated documentation for the core-active Greenstand estate. Each repo has an
interactive knowledge-graph viewer, an onboarding guide, a glossary, and a README. The snapshot is
the source commit that the docs describe. The ${link("./glossary.html", "estate glossary")} lists the
business terms of all repos and the shared resources.</p>
<p class="welcome"><strong>New volunteer?</strong> Read ${link("./contribute.html", "How to contribute to Greenstand")}:
how to join the community, pick a first task, and get help.</p>
${section(start, [MAPS_ITEM, SHARED_RESOURCES_ITEM])}
<nav class="jump" aria-label="Areas">
<span>Areas:</span>
${jump}
</nav>
${others.map((area) => section(area)).join("\n")}
</body>
</html>
`;

writeFileSync(join(site, "index.html"), html);
console.log(`wrote ${join(site, "index.html")} (${count} repos)`);
