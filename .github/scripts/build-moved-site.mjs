#!/usr/bin/env node
// Build the moved site of the archived docs repo. The docs moved to the folder understand-greenstand/
// of Greenstand/greenstand-documentation, and the site moved to NEW_SITE. Pages has no redirects, so the
// old site keeps a page at each old path that sends the reader to the same path on the new site.
// Input: moved-pages.txt, the pages of the old site (one path in each line, sorted). Output in
// <site-dir>: a moved page for each path, 404.html for every other path, and .nojekyll. Nothing else:
// the pages load no file. It fails, and writes nothing, when the list has an error.
// Usage: node build-moved-site.mjs <site-dir>
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The new site.
const NEW_SITE = "https://greenstand.github.io/greenstand-documentation/";
// The docs folder in the home repo.
const NEW_DOCS = "https://github.com/Greenstand/greenstand-documentation/tree/main/understand-greenstand";
// The path of the old site on its host.
const OLD_PATH = "/understand-greenstand/";

const site = process.argv[2];
if (!site) {
  console.error("usage: node build-moved-site.mjs <site-dir>");
  process.exit(2);
}

// The list: one path of the old site in each line, relative to its root, sorted. Check all of it
// first, so that an error stops the script before it writes a file.
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const text = readFileSync(join(root, "moved-pages.txt"), "utf8");
const paths = text.endsWith("\n") ? text.slice(0, -1).split("\n") : text.split("\n");
const errors = [];
if (text === "") errors.push("no path");
else {
  const seen = new Set();
  paths.forEach((path, i) => {
    const linePrefix = `line ${i + 1}: `;
    if (path === "") errors.push(`${linePrefix}empty`);
    else if (seen.has(path)) errors.push(`${linePrefix}${path} is in the list twice`);
    else if (path.split("/").includes("..")) errors.push(`${linePrefix}${path} has a .. step`);
    else if (path.startsWith("/")) errors.push(`${linePrefix}${path} starts with /`);
    else if (!path.endsWith(".html")) errors.push(`${linePrefix}${path} does not end with .html`);
    else if (path === "404.html") errors.push(`${linePrefix}404.html is the page for all other paths, so it cannot be in the list`);
    else if (i > 0 && paths[i - 1] !== "" && path < paths[i - 1]) errors.push(`${linePrefix}${path} comes before ${paths[i - 1]} (sort the list)`);
    seen.add(path);
  });
}
if (errors.length) {
  for (const e of errors) console.error(`error: moved-pages.txt: ${e}`);
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// A string literal for a script in the page: "<" is escaped, so the text can never close the script
// element.
const scriptString = (s) => JSON.stringify(s).replace(/</g, "\\u003c");

// The text of a URL in a page: each part of its path, with its "/", stays on one line, and the text can
// break after each "/". So a long URL breaks at a "/", never at the "-" of a name.
const urlText = (u) => {
  const [, scheme, rest] = u.match(/^(https:\/\/)(.*)$/);
  const parts = rest.split(/(?<=\/)/);
  parts[0] = scheme + parts[0];
  return parts.map((part) => `<span class="part">${esc(part)}</span>`).join("<wbr>");
};

// The same page on the new site: the same path, with a final index.html cut off (the new site links
// its folders as "<folder>/").
const targetOf = (path) => NEW_SITE + path.replace(/(^|\/)index\.html$/, "$1");

// The style of the pages: the paper, ink, and link colors of the site look, light and dark
// (site-colors.mjs of the docs folder), and the system font. The pages load no file.
const STYLE = `
  :root { color-scheme: light dark; --ground: #f3f5f0; --ink: #1b2420; --muted: #56625a; --link: #2c5d84; }
  @media (prefers-color-scheme: dark) {
    :root { --ground: #131915; --ink: #e2e8e0; --muted: #9aa79e; --link: #8fb9d9; }
  }
  body { margin: 0; background: var(--ground); color: var(--ink);
    font: 1.0625rem/1.6 system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
  main { box-sizing: border-box; max-width: 40rem; margin: 0 auto; padding: 3rem 1.25rem; }
  h1 { font-size: 1.5rem; line-height: 1.25; margin: 0 0 1rem; }
  p { margin: 0 0 1rem; }
  .note { color: var(--muted); }
  a { color: var(--link); overflow-wrap: anywhere; }
  .part { white-space: nowrap; }`;

const NOTE = `<p class="note">The Understand Greenstand docs are now in the folder <a href="${esc(NEW_DOCS)}">understand-greenstand/</a>
of Greenstand/greenstand-documentation.</p>`;

// A page of the moved site, with its title as the heading. The scripts and links in <head> come first,
// so a browser with scripts leaves before it draws the page.
const shell = ({ title, head, body }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${head}
<style>${STYLE}
</style>
</head>
<body>
<main>
<h1>${title}</h1>
${body}
${NOTE}
</main>
</body>
</html>
`;

// A moved page: a script sends the reader to the target, with the query and the #anchor. The
// refresh is for a browser without scripts.
function movedPage(path) {
  const target = targetOf(path);
  return shell({
    title: "This page moved",
    head: `<link rel="canonical" href="${esc(target)}">
<script>location.replace(${scriptString(target)} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${esc(target)}">`,
    body: `<p>Its new place is:<br><a href="${esc(target)}">${urlText(target)}</a></p>`,
  });
}

// 404.html: Pages serves it for every other path (the graphs, the raw markdown, the assets of the
// viewers, a mistyped path). Its script sends the reader to the same path on the new site, with the
// query and the #anchor. It has no refresh: a refresh can only go to one fixed URL, and it could
// race the script. Without scripts, the page shows a link to the new site.
function notFoundPage() {
  return shell({
    title: "Understand Greenstand moved",
    head: `<script>var p = location.pathname, old = ${scriptString(OLD_PATH)};
location.replace(p.indexOf(old) === 0 ? ${scriptString(NEW_SITE)} + p.slice(old.length) + location.search + location.hash : ${scriptString(NEW_SITE)});</script>`,
    body: `<p>The site is now at:<br><a href="${esc(NEW_SITE)}">${urlText(NEW_SITE)}</a></p>`,
  });
}

mkdirSync(site, { recursive: true });
for (const path of paths) {
  mkdirSync(dirname(join(site, path)), { recursive: true });
  writeFileSync(join(site, path), movedPage(path));
}
writeFileSync(join(site, "404.html"), notFoundPage());
writeFileSync(join(site, ".nojekyll"), "");
console.log(`wrote ${paths.length} moved pages and 404.html to ${site}`);
