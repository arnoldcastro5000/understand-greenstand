#!/usr/bin/env node
// Build the landing page of the Pages site (<site-dir>/index.html) from the estate
// (estate.mjs), so it shows the same areas, repos, and links as the README.md index.
// The deploy workflow runs it after it assembles <site-dir>/<repo>/. It fails if a page
// that the landing page links to is missing there.
// Usage: node build-landing.mjs <site-dir>
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEstate } from "./estate.mjs";

const site = process.argv[2];
if (!site) {
  console.error("usage: node build-landing.mjs <site-dir>");
  process.exit(2);
}

const { areas, count, errors } = loadEstate();

// The deploy workflow assembles these files beside each viewer.
const ASSEMBLED = ["index.html", "knowledge-graph.json", "onboarding.html", "readme.html"];
for (const { name } of areas.flatMap((a) => a.repos)) {
  for (const f of ASSEMBLED) if (!existsSync(join(site, name, f))) errors.push(`${site}/${name}/${f} is missing`);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const link = (href, text) => `<a href="${esc(href)}">${text}</a>`;
const anchor = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function item({ name, description, sha, date, source }) {
  const links = [
    link(`./${name}/`, "Viewer"),
    link(`./${name}/onboarding.html`, "Onboarding"),
    link(`./${name}/readme.html`, "README"),
    link(source, "Source"),
  ].join(" · ");
  const commit = link(`${source}/commit/${sha}`, `<code>${sha.slice(0, 7)}</code>`);
  return [
    "<li>",
    `<a class="name" href="./${esc(name)}/">${esc(name)}</a>`,
    `<p class="desc">${esc(description)}</p>`,
    `<p class="links"><span>${links}</span><span class="snap">Snapshot ${esc(date)} at ${commit}</span></p>`,
    "</li>",
  ].join("\n");
}

function section(area) {
  const id = anchor(area.title);
  const lines = [`<section id="${id}" class="area${area.featured ? " featured" : ""}">`, `<h2>${esc(area.title)}</h2>`];
  if (area.intro) lines.push(`<p class="intro">${esc(area.intro)}</p>`);
  lines.push("<ul>", ...area.repos.map(item), "</ul>");
  if (area.seeAlso) lines.push(`<p class="deeper">Go deeper: ${area.seeAlso.map((l) => link(l.url, esc(l.text))).join(" · ")}</p>`);
  lines.push("</section>");
  return lines.join("\n");
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

// Featured areas ("Start here") go first, in a box. The jump links list the other areas.
const featured = areas.filter((a) => a.featured);
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
  :root { color-scheme: light dark; --fg: #1f2328; --bg: #fff; --muted: #656d76;
    --line: #d0d7de; --link: #0969da; }
  @media (prefers-color-scheme: dark) { :root { --fg: #e6edf3; --bg: #0d1117;
    --muted: #8b949e; --line: #30363d; --link: #58a6ff; } }
  body { font: 16px/1.6 -apple-system, system-ui, "Segoe UI", sans-serif;
    max-width: 48rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;
    color: var(--fg); background: var(--bg); }
  a { color: var(--link); text-decoration: none; }
  a:hover { text-decoration: underline; }
  h1 { font-size: 1.8rem; line-height: 1.25; margin: 0 0 .75rem; }
  h2 { font-size: 1.25rem; line-height: 1.25; margin: 0 0 .5rem; }
  p { margin: 0; }
  code { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .88em; }
  .lede { margin-bottom: 1.5rem; }
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
interactive knowledge-graph viewer, an onboarding guide, and a README. The snapshot is the
source commit that the docs describe.</p>
${featured.map(section).join("\n")}
<nav class="jump" aria-label="Areas">
<span>Areas:</span>
${jump}
</nav>
${others.map(section).join("\n")}
</body>
</html>
`;

writeFileSync(join(site, "index.html"), html);
console.log(`wrote ${join(site, "index.html")} (${count} repos)`);
