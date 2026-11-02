#!/usr/bin/env node
// Build the landing page of the Pages site (<site-dir>/index.html) from the estate
// (estate.mjs), so it shows the same areas, repos, and links as the README.md index. Like the top
// of README.md, it also links the estate glossary, the volunteer guide, the capture journey, the
// ecosystem maps, and the shared-resource page. The name of the capture journey entry is the title
// in capture-journey.json.
// The page is in the site look (site-html.mjs). The estate strip shows each repo as a cell in the
// color of its area; each cell links to the entry of the repo. On wide screens the strip stands
// upright in the legend rail, with the names of the repos and the areas.
// The deploy workflow runs it after it assembles <site-dir>/<repo>/. It fails if a page
// that the landing page links to, or the font or the parcel field of the site look, is missing
// there.
// Usage: node build-landing.mjs <site-dir>
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURE_JOURNEY_DATA, formerNamesText, isObject, loadEstate, parseJson, readDocsFile } from "./estate.mjs";
import { ARCHIVO, PARCEL_FIELD, WIDE, esc, siteHead, siteStyle } from "./site-html.mjs";

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
// The deploy workflow writes these files at the site root: the pages of the estate glossary, the
// volunteer guide, the ecosystem maps, the shared-resource page, and the capture journey, and the
// font and the parcel field of the site look.
const ROOT_FILES = ["glossary.html", "contribute.html", "architecture.html", "shared-resources.html", "capture-journey.html", ARCHIVO, PARCEL_FIELD];
for (const f of ROOT_FILES) if (!existsSync(join(site, f))) errors.push(`${site}/${f} is missing`);

const link = (href, text) => `<a href="${esc(href)}">${text}</a>`;
const anchor = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
// The id of the entry of a repo: the cell of the repo in the estate strip links to it.
const repoId = (name) => `repo-${name}`;
// The style that gives an element the color of an area (estate.mjs checks the color).
const areaStyle = (area) => `--area: var(--c-${area.color})`;
// A chip: a small square in the color of the area, with no words.
const CHIP = '<i class="chip" aria-hidden="true"></i>';

// One entry of an area list: a name that links to a page, a description, more lines, and an id.
function entry(href, name, description, { more = [], id = null } = {}) {
  return [id ? `<li id="${esc(id)}">` : "<li>", `<a class="name" href="${esc(href)}">${name}</a>`, `<p class="desc">${description}</p>`, ...more, "</li>"].join("\n");
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
    {
      more: [`<p class="links"><span>${links}</span><span class="snap">Snapshot ${esc(date)} at ${commit}</span></p>`],
      id: repoId(name),
    },
  );
}

// The capture journey tells how one capture travels through the system. The ecosystem maps show
// how the code repos work together. The shared-resource page shows what the code repos share. The
// "Start here" box lists the three below its repos: the story first, for a new volunteer.
// The script reads only the title of capture-journey.json; build-capture-journey.mjs checks the
// rest of the file.
const journeyTitle = readDocsFile(CAPTURE_JOURNEY_DATA, errors, (text) => {
  const data = parseJson(text);
  if (!isObject(data) || typeof data.title !== "string" || !data.title.trim()) {
    throw new Error("must have a title (a text). Run: node .github/scripts/build-capture-journey.mjs --check");
  }
  return data.title;
});
// The entry of the capture journey. The page template calls it after the error exit, so the
// title is set.
const journeyItem = (title) => entry(
  "./capture-journey.html",
  esc(title),
  "How one capture travels from the grower's phone to the grower's reward, step by step, with pictures.",
);
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

// An area: its heading, its intro, and its entries. The entries of the featured area are the
// numbered steps of the newcomer's path; the other areas list their repos.
function section(area, extra = []) {
  const lines = [
    `<section id="${anchor(area.title)}" class="area${area.featured ? " featured" : ""}" style="${areaStyle(area)}">`,
    `<h2>${area.featured ? "" : CHIP}${esc(area.title)}</h2>`,
  ];
  if (area.intro) lines.push(`<p class="intro">${esc(area.intro)}</p>`);
  const [open, close] = area.featured ? ['<ol class="path">', "</ol>"] : ['<ul class="register">', "</ul>"];
  lines.push(open, ...area.repos.map(item), ...extra, close);
  if (area.seeAlso) lines.push(`<p class="deeper">Go deeper: ${area.seeAlso.map((l) => link(l.url, esc(l.text))).join(" · ")}</p>`);
  lines.push("</section>");
  return lines.join("\n");
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// The gaps of the estate strip and the estate mark (px): between the cells of an area, and between
// two areas. The width of a group follows its count of repos (--n).
const CELL_GAP = 2;
const AREA_GAP = 6;
const group = (area, cells) => `<span class="group" style="${areaStyle(area)}; --n: ${area.repos.length}">${cells}</span>`;

// The estate strip: one cell for each repo, in the groups of the areas. The name of the area (the
// key) shows only in the legend rail.
const strip = [
  '<nav class="strip" aria-label="Repos by area">',
  ...areas.map((area) => group(area, `<span class="key">${esc(area.title)}</span>` +
    area.repos.map(({ name }) => `<a class="cell" href="#${esc(repoId(name))}"><span class="label">${esc(name)}</span></a>`).join(""))),
  "</nav>",
].join("\n");

// On a narrow page a strip cell is too small to tap: WCAG 2.2 asks for 24 px. There the strip is a
// picture: the estate mark, the same cells with no links and no words, hidden from screen readers.
// The cells are links from the strip width where each cell can be 24 px wide. The narrowest cells
// are in the area with the most repos: (the strip less the gaps between areas) / the repo count,
// less the gaps in that area, shared by its cells. The masthead is the container of the strip, so
// the page margins, the default font size, and a scroll bar do not change the rule.
const MIN_TARGET = 24;
const mostRepos = Math.max(...areas.map((a) => a.repos.length));
const linksFrom = Math.ceil(
  repos.length * (MIN_TARGET + (CELL_GAP * (mostRepos - 1)) / mostRepos) + AREA_GAP * (areas.length - 1),
);
const mark = [
  '<div class="mark" aria-hidden="true">',
  ...areas.map((area) => group(area, "<i></i>".repeat(area.repos.length))),
  "</div>",
].join("\n");

// "You are here": the cell of the repo entry that the address points to (for example after a click
// on the cell) gets an ink outline.
const youAreHereCells = repos
  .map(({ name }) => `body:has([id=${JSON.stringify(repoId(name))}]:target) .cell[href=${JSON.stringify(`#${repoId(name)}`)}]`)
  .join(",\n  ");

// The featured area ("Start here") goes first, in a box. The jump links list the other areas.
// estate.mjs makes sure that exactly one area is featured.
const start = areas.find((a) => a.featured);
const others = areas.filter((a) => !a.featured);
const jump = others.map((a) => `<a href="#${anchor(a.title)}" style="${areaStyle(a)}">${CHIP}${esc(a.title)}</a>`).join("\n");

// The layout: on a phone, the title, the strip across the page as a picture, and one column. On a
// wider page the strip cells are links (a name shows on hover or keyboard focus). On a wide screen
// (64rem and more), the legend rail at the left holds the title and the strip, upright, with all
// names, at any repo count; it stays in view while the page scrolls. In a window that is shorter
// than the rail, the rail scrolls on its own.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>understand-greenstand</title>
<meta name="description" content="Interactive knowledge-graph viewers and onboarding guides for the Greenstand repositories, grouped by area.">
${siteHead(".")}
<style>
${siteStyle(".")}
  .masthead { container: masthead / inline-size; padding: 2.75rem 1.25rem 1.75rem;
    border-bottom: 1px solid var(--line); }
  h1 { margin: 0 0 1.4rem; font-size: clamp(2rem, 1.4rem + 2.6vw, 3.1rem); font-weight: 720;
    letter-spacing: -.025em; }
  @media (max-width: 30rem) { h1 { font-stretch: 78%; letter-spacing: -.02em; } }
  .strip { display: none; position: relative; gap: ${AREA_GAP}px; padding-bottom: 1.9rem; }
  .mark { display: flex; gap: ${AREA_GAP}px; }
  .strip .group, .mark .group { display: flex; flex: var(--n) 1 0; gap: ${CELL_GAP}px; min-width: 0; }
  .strip .key { display: none; }
  .strip .cell, .mark i { display: block; flex: 1 1 0; min-width: 0; height: clamp(2rem, 1.3rem + 2.4vw, 3.25rem);
    text-decoration: none; }
  /* Only the color block moves: a transform on the link would move the name label with it. */
  .strip .cell::before, .mark i { background: var(--area); box-shadow: inset 0 0 0 1px var(--edge); }
  .strip .cell::before { content: ""; display: block; height: 100%;
    transition: transform .25s cubic-bezier(.16, 1, .3, 1); }
  .strip .cell:hover::before, .strip .cell:focus-visible::before { transform: translateY(-4px); }
  .strip .label { position: absolute; left: 0; bottom: 0; font: 600 .82rem/1.2 var(--display);
    font-stretch: 87.5%; color: var(--ink); opacity: 0; pointer-events: none; transition: opacity .15s; }
  .strip .cell:hover .label, .strip .cell:focus-visible .label { opacity: 1; }
  ${youAreHereCells} { outline: 2px solid var(--ink); outline-offset: 2px; }
  main { padding: 2rem 1.25rem 5rem; }
  p { margin: 0; }
  .lede, .welcome { max-width: 42rem; margin-bottom: .9rem; font-size: 1.06rem; }
  .welcome { margin-bottom: 2.25rem; }
  .chip { display: inline-block; width: .8em; height: .8em; margin-right: .45em; vertical-align: -.02em;
    background: var(--area); box-shadow: inset 0 0 0 1px var(--edge); }
  .featured { padding: 1.6rem 1.75rem 1.4rem; background: var(--surface); }
  .featured h2 { margin: 0 0 .35rem; font-size: 1.55rem; font-weight: 680; }
  .featured .intro { margin-bottom: 1rem; color: var(--muted); }
  .path { margin: 0; padding: 0; list-style: none; counter-reset: step; }
  .path > li { display: grid; grid-template-columns: 2.75rem minmax(0, 1fr); padding: .85rem 0 .9rem;
    border-top: 1px solid var(--line); counter-increment: step; }
  .path > li::before { content: counter(step); grid-row: span 3; padding-top: .1rem;
    font: 600 1.7rem/1 var(--display); font-stretch: 75%; font-variant-numeric: tabular-nums; color: var(--muted); }
  .path .name { font-size: 1.18rem; }
  .deeper { margin: .6rem 0 0 2.75rem; font-size: .92rem; color: var(--muted); }
  .jump { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1.4rem; margin-top: 2.75rem;
    padding: .9rem 0; border-block: 1px solid var(--line); font: 500 .98rem/1.3 var(--display);
    font-stretch: 87.5%; }
  .jump > span { color: var(--muted); }
  .jump a { color: var(--ink); text-decoration: none; }
  .jump a:hover { text-decoration: underline; text-decoration-color: var(--line); }
  .area { margin-top: 3rem; scroll-margin-top: 1.5rem; }
  .area:not(.featured) { padding-top: .9rem; border-top: 3px solid var(--area); }
  .area h2 { margin: 0 0 .9rem; font-size: 1.45rem; font-weight: 660; }
  .intro { max-width: 42rem; margin-bottom: .9rem; }
  .register { margin: 0; padding: 0; list-style: none; }
  .register > li { padding: .85rem 0 1.1rem; border-top: 1px solid var(--line); scroll-margin-top: 1.5rem; }
  .register > li:target { margin-inline: -1rem; padding-inline: 1rem;
    background: color-mix(in srgb, var(--area) 14%, transparent); }
  .name { font: 640 1.12rem/1.3 var(--display); }
  .desc { max-width: 40rem; margin: .2rem 0 .45rem; }
  .links { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .3rem 1.25rem; font-size: .92rem; }
  .snap { color: var(--muted); font-variant-numeric: tabular-nums; }
  @container masthead (min-width: ${linksFrom}px) { .strip { display: flex; } .mark { display: none; } }
  @media ${WIDE} {
    body { display: grid; grid-template-columns: var(--rail) minmax(0, 1fr); align-items: start; }
    .masthead { position: sticky; top: 0; box-sizing: border-box; max-height: 100vh; overflow-y: auto;
      padding: 2rem 1.5rem 1.5rem 2rem; border-bottom: 0; scrollbar-width: thin; }
    h1 { margin-bottom: 1.25rem; font-size: 1.95rem; line-height: 1.02; }
    .strip { display: flex; flex-direction: column; gap: .75rem; padding: 0; }
    .mark { display: none; }
    .strip .group { display: grid; gap: 2px; }
    .strip .key { display: block; margin: 0 0 .3rem; font: 600 .82rem/1.2 var(--display); font-stretch: 87.5%;
      color: var(--muted); }
    .strip .cell { display: grid; grid-template-columns: 1rem minmax(0, 1fr); align-items: center; gap: .65rem;
      height: auto; min-height: max(1.5rem, ${MIN_TARGET}px); color: var(--ink); }
    .strip .cell::before { height: auto; align-self: stretch; }
    .strip .cell:hover::before, .strip .cell:focus-visible::before { transform: translateX(3px); }
    .strip .label { position: static; opacity: 1; font: 500 .9rem/1.25 var(--display); font-stretch: 87.5%;
      overflow-wrap: anywhere; }
    .strip .cell:hover .label { text-decoration: underline; text-decoration-color: var(--line); }
    main { max-width: 50rem; padding: 2.75rem clamp(1.5rem, 4vw, 4.5rem) 5rem; }
  }
  @media (prefers-reduced-motion: reduce) { .strip .cell::before, .strip .label { transition: none; } }
</style>
</head>
<body>
<header class="masthead">
<h1>understand-greenstand</h1>
${strip}
${mark}
</header>
<main>
<p class="lede">Machine-generated documentation for the core-active Greenstand estate. Each repo has an
interactive knowledge-graph viewer, an onboarding guide, a glossary, and a README. The snapshot is
the source commit that the docs describe. The ${link("./glossary.html", "estate glossary")} lists the
business terms of all repos and the shared resources.</p>
<p class="welcome"><strong>New volunteer?</strong> Read ${link("./contribute.html", "How to contribute to Greenstand")}:
how to join the community, pick a first task, and get help.</p>
${section(start, [journeyItem(journeyTitle), MAPS_ITEM, SHARED_RESOURCES_ITEM])}
<nav class="jump" aria-label="Areas">
<span>Areas:</span>
${jump}
</nav>
${others.map((area) => section(area)).join("\n")}
</main>
</body>
</html>
`;

// Each custom property that the page uses must have a definition in the page. Without one (for
// example a color that site-colors.mjs lost), a part of the page would have no color.
const defined = new Set([...html.matchAll(/--([\w-]+):/g)].map((m) => m[1]));
const undefinedNames = [...new Set([...html.matchAll(/var\(--([\w-]+)/g)].map((m) => m[1]))].filter((n) => !defined.has(n));
if (undefinedNames.length) {
  for (const n of undefinedNames) console.error(`error: the landing page uses var(--${n}), but nothing defines --${n}`);
  process.exit(1);
}

writeFileSync(join(site, "index.html"), html);
console.log(`wrote ${join(site, "index.html")} (${count} repos)`);
