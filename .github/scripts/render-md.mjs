#!/usr/bin/env node
// Render a Markdown file to a styled, standalone HTML page.
// Usage: node render-md.mjs <inFile> <outFile> <title> <backHref> <backLabel>
import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";

const [, , inFile, outFile, title, backHref = "./", backLabel = "Viewer"] = process.argv;

marked.setOptions({ gfm: true });
const body = marked.parse(readFileSync(inFile, "utf8"));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
    color: #1f2328; background: #fff; }
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
  @media (prefers-color-scheme: dark) { blockquote { color: #8b949e; border-color: #30363d; } }
</style>
</head>
<body>
<nav><a href="${esc(backHref)}">&larr; ${esc(backLabel)}</a><a href="../">All viewers</a></nav>
${body}
</body>
</html>
`;

writeFileSync(outFile, html);
console.log("rendered", inFile, "->", outFile);
