#!/usr/bin/env node
// Render a Markdown file to a styled, standalone HTML page.
// Usage: node render-md.mjs <inFile> <outFile> <title> <backHref> <backLabel>
// <inFile> is a path in the docs repo: repos/<name>/README.md, GLOSSARY.md or ARCHITECTURE.md
// at the root, docs/contribute-to-greenstand.md, or docs/shared-resources.md.
// Headings get GitHub's anchors, so "#anchor" links work as they do on GitHub. Relative links
// to a page that the site renders point to that page (ONBOARDING.md -> onboarding.html, and
// the top README.md -> the landing page); other relative links point to the file on GitHub at
// this commit.
// A repo name in a heading moves to the next line as one piece (see keepRepoNamesWhole).
// A Mermaid block becomes a diagram, as on GitHub. The page loads the copy of Mermaid that the
// deploy workflow puts on the site. The script fails if that copy is missing.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { marked } from "marked";
import { escapeRegExp, loadEstate } from "./estate.mjs";
import { slugger } from "./slug.mjs";

const [, , inFile, outFile, title, backHref = "./", backLabel = "Viewer"] = process.argv;

// The path of a docs-repo file on the Pages site, or null if the site does not serve it.
function sitePath(path) {
  let m;
  if ((m = path.match(/^repos\/([^/]+)\/(README|ONBOARDING|GLOSSARY)\.md$/))) return `${m[1]}/${m[2].toLowerCase()}.html`;
  if ((m = path.match(/^repos\/([^/]+)\/((?:knowledge-graph|domain-graph|meta)\.json)$/))) return `${m[1]}/${m[2]}`;
  if (path === "GLOSSARY.md") return "glossary.html";
  if (path === "ARCHITECTURE.md") return "architecture.html";
  if (path === "docs/contribute-to-greenstand.md") return "contribute.html";
  if (path === "docs/shared-resources.md") return "shared-resources.html";
  // The landing page shows the estate index of README.md.
  if (path === "README.md") return "index.html";
  return null;
}

const from = posix.normalize(inFile);
const here = sitePath(from);
const atRoot = here !== null && !here.includes("/");
const { GITHUB_REPOSITORY: repo, GITHUB_SHA: sha } = process.env;

function rewrite(href) {
  if (!here || /^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const [path, hash = ""] = href.split(/(?=#)/);
  const target = posix.normalize(posix.join(posix.dirname(from), path));
  if (target.startsWith("..")) return href;
  const page = sitePath(target);
  if (page) return posix.relative(posix.dirname(here), page) + hash;
  return repo && sha ? `https://github.com/${repo}/blob/${sha}/${target}${hash}` : href;
}

// The path of the Mermaid ESM entry on the site. The deploy workflow copies it there.
const MERMAID_ENTRY = "vendor/mermaid/mermaid.esm.min.mjs";
let hasMermaid = false;

// A repo name in a heading goes into a span with the style "display: inline-block". Thus the
// name moves to the next line as one piece. A name that is wider than the line still breaks, so
// the page does not get wider than the screen. Only a page with such a span gets its style.
// A repo name that is a part of a longer word (tiles-1-docs, my-tiles-1, tiles-1.md) does not
// count. The longest name comes first, so that a name inside a longer name does not count.
const { repos, errors } = loadEstate();
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
const REPO_NAME = new RegExp(
  `(?<![\\w-])(?:${repos
    .map((r) => r.name)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|")})(?![\\w-]|\\.\\w)`,
  "g",
);
// An HTML tag. A quoted attribute value can hold ">".
const TAG = /(<(?:[^>"']|"[^"]*"|'[^']*')*>)/;
let hasRepoName = false;
// Changes only the text between the tags, not a tag or its attributes.
const keepRepoNamesWhole = (html) =>
  html
    .split(TAG)
    .map((part, i) =>
      i % 2
        ? part
        : part.replace(REPO_NAME, (name) => {
            hasRepoName = true;
            return `<span class="repo-name">${name}</span>`;
          }),
    )
    .join("");

const slug = slugger();
const text = (html) =>
  html.replace(/<[^>]*>/g, "").replace(/&(amp|lt|gt|quot|#39);/g, (m, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" })[e]);
marked.use({
  gfm: true,
  renderer: {
    heading(html, level) {
      return `<h${level} id="${slug(text(html))}">${keepRepoNamesWhole(html)}</h${level}>\n`;
    },
    link(href, title, html) {
      return marked.Renderer.prototype.link.call(this, rewrite(href), title, html);
    },
    code(code, lang) {
      if (lang?.trim().split(/\s/)[0] !== "mermaid") return false;
      hasMermaid = true;
      return `<pre class="mermaid">${esc(code)}\n</pre>\n`;
    },
  },
});
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const body = marked.parse(readFileSync(inFile, "utf8"));

// The style of a repo name span. An inline-block does not get the underline of a link around
// it, so the span takes the text decoration of its parent.
const repoNameStyle = hasRepoName ? "\n  .repo-name { display: inline-block; text-decoration: inherit; }" : "";

// The page loads Mermaid only if it has a Mermaid block. Until Mermaid draws the diagrams, the
// page hides their source text. A browser without modules does not hide the text.
// A diagram fits the width of the page. But it keeps at least 70% of its size: thus its labels
// stay readable on a phone. A wider diagram scrolls in its own box, and a shadow shows the side
// with more of the diagram. The error image of a broken diagram keeps the size that Mermaid
// gives it. When the color scheme changes, Mermaid draws the diagrams again.
let mermaidHead = "";
let mermaidScript = "";
if (hasMermaid) {
  const rel = posix.relative(posix.dirname(here ?? ""), MERMAID_ENTRY);
  const entryFile = join(dirname(outFile), rel);
  if (!existsSync(entryFile)) {
    console.error(`error: ${inFile} has a Mermaid block, but ${entryFile} is missing`);
    process.exit(1);
  }
  const shadows = (bg, shadow) => `linear-gradient(to right, ${bg} 30%, ${bg}00) left / 2rem 100% no-repeat local,
      linear-gradient(to left, ${bg} 30%, ${bg}00) right / 2rem 100% no-repeat local,
      radial-gradient(farthest-side at 0 50%, ${shadow}40, ${shadow}00) left / .75rem 100% no-repeat scroll,
      radial-gradient(farthest-side at 100% 50%, ${shadow}40, ${shadow}00) right / .75rem 100% no-repeat scroll`;
  mermaidHead = `
<style>
  pre.mermaid { padding: 0; text-align: center;
    background: ${shadows("#ffffff", "#1f2328")}; }
  @media (prefers-color-scheme: dark) { pre.mermaid {
    background: ${shadows("#0d1117", "#e6edf3")}; } }
  .mermaid-loading pre.mermaid { visibility: hidden; }
</style>
<script>if ("noModule" in HTMLScriptElement.prototype) document.documentElement.classList.add("mermaid-loading");</script>`;
  mermaidScript = `
<script type="module">
const root = document.documentElement;
const dark = matchMedia("(prefers-color-scheme: dark)");
const blocks = [...document.querySelectorAll("pre.mermaid")].map((pre) => [pre, pre.textContent]);
import(${JSON.stringify(rel.startsWith("../") ? rel : `./${rel}`)})
  .then(({ default: mermaid }) => {
    const draw = () => {
      root.classList.add("mermaid-loading");
      for (const [pre, source] of blocks) {
        pre.removeAttribute("data-processed");
        pre.textContent = source;
      }
      mermaid.initialize({ startOnLoad: false, theme: dark.matches ? "dark" : "default" });
      return mermaid.run().finally(() => {
        for (const svg of root.querySelectorAll('pre.mermaid svg:not([aria-roledescription="error"])')) {
          svg.style.minWidth = Math.round(svg.viewBox.baseVal.width * 0.7) + "px";
        }
        root.classList.remove("mermaid-loading");
      });
    };
    dark.addEventListener("change", draw);
    return draw();
  })
  .finally(() => root.classList.remove("mermaid-loading"));
</script>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.6 -apple-system, system-ui, "Segoe UI", sans-serif;
    max-width: 52rem; margin: 0 auto; padding: 1.5rem 1.25rem 4rem;
    color: #1f2328; background: #fff; overflow-wrap: break-word; }
  @media (prefers-color-scheme: dark) { body { color: #e6edf3; background: #0d1117; } }
  nav { display: flex; gap: 1rem; padding-bottom: 1rem; margin-bottom: 1.5rem;
    border-bottom: 1px solid #d0d7de; font-size: .9rem; }
  @media (prefers-color-scheme: dark) { nav { border-color: #30363d; } }
  a { color: #0969da; text-decoration: none; }
  @media (prefers-color-scheme: dark) { a { color: #58a6ff; } }
  a:hover { text-decoration: underline; }
  h1, h2, h3 { line-height: 1.25; margin-top: 1.8rem; }
  h1 { font-size: 1.8rem; } h2 { font-size: 1.4rem;
    border-bottom: 1px solid #d0d7de; padding-bottom: .3rem; }
  @media (prefers-color-scheme: dark) { h2 { border-color: #30363d; } }
  code { background: rgba(175,184,193,.2); padding: .15em .35em; border-radius: 5px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .88em; }
  pre { background: #f6f8fa; padding: 1rem; border-radius: 8px; overflow: auto; }
  @media (prefers-color-scheme: dark) { pre { background: #161b22; } }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; display: block; overflow: auto; }
  th, td { border: 1px solid #d0d7de; padding: .5rem .75rem; text-align: left; }
  @media (prefers-color-scheme: dark) { th, td { border-color: #30363d; } }
  th { background: rgba(175,184,193,.15); }
  blockquote { margin: 1rem 0; padding: 0 1rem; color: #656d76; border-left: .25rem solid #d0d7de; }
  @media (prefers-color-scheme: dark) { blockquote { color: #8b949e; border-color: #30363d; } }${repoNameStyle}
</style>${mermaidHead}
</head>
<body>
<nav><a href="${esc(backHref)}">&larr; ${esc(backLabel)}</a>${atRoot ? "" : '<a href="../">All viewers</a>'}</nav>
${body}${mermaidScript}
</body>
</html>
`;

writeFileSync(outFile, html);
console.log("rendered", inFile, "->", outFile);
