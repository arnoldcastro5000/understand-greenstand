// The shared parts of the generated HTML pages of the Pages site: the landing page
// (build-landing.mjs), the moved pages (build-moved.mjs), and the page of the capture journey
// (build-capture-journey.mjs).
import { AREA_COLORS, BACKGROUNDS, LINES, TEXTS } from "./site-colors.mjs";

// Escape text for HTML text and for a double-quoted attribute.
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The base style of the former look: the colors in light and dark mode, the body, and the links.
// The moved pages and the page of the capture journey use it until they move to the site look.
// Each page adds its own rules after it.
export const BASE_STYLE = `  :root { color-scheme: light dark; --fg: #1f2328; --bg: #fff; --muted: #656d76;
    --line: #d0d7de; --link: #0969da; }
  @media (prefers-color-scheme: dark) { :root { --fg: #e6edf3; --bg: #0d1117;
    --muted: #8b949e; --line: #30363d; --link: #58a6ff; } }
  body { font: 16px/1.6 -apple-system, system-ui, "Segoe UI", sans-serif;
    max-width: 48rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;
    color: var(--fg); background: var(--bg); }
  a { color: var(--link); text-decoration: none; }
  a:hover { text-decoration: underline; }`;

// The font of the headings and the labels: Archivo (SIL Open Font License 1.1), a variable font
// with a weight axis and a width axis, Latin letters. The text stays in the system font. The
// deploy workflow copies the font file and its license from the npm package
// @fontsource-variable/archivo (pinned by its hash) to this path of the site.
export const ARCHIVO = "vendor/archivo/archivo-latin-wdth-normal.woff2";

const SANS = `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`;
const MONO = `ui-monospace, "SF Mono", Menlo, Consolas, monospace`;

// The colors as CSS custom properties, for the scheme i (0 light, 1 dark), one line for each
// kind: --ground and --surface; the text colors (--ink, ...); --line; the area colors
// (--c-evergreen, ...).
const colorLines = (i) =>
  [
    Object.entries(BACKGROUNDS),
    Object.entries(TEXTS),
    Object.entries(LINES),
    Object.entries(AREA_COLORS).map(([name, pair]) => [`c-${name}`, pair]),
  ].map((kind) => `    ${kind.map(([name, pair]) => `--${name}: ${pair[i]};`).join(" ")}`).join("\n");

// The head lines of a page in the site look: the color of the browser bar, and an early request
// for the font. toRoot is the path from the page to the root of the site ("." or "..").
export const siteHead = (toRoot) => `<meta name="theme-color" content="${BACKGROUNDS.ground[0]}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${BACKGROUNDS.ground[1]}" media="(prefers-color-scheme: dark)">
<link rel="preload" href="${toRoot}/${ARCHIVO}" as="font" type="font/woff2" crossorigin>`;

// The style of the site look: the font, the colors in light and dark mode, the page, the
// selection, the links, the headings, and code. --edge is the ink outline of an area color.
// toRoot is the path from the page to the root of the site. Each page adds its own rules after it.
export const siteStyle = (toRoot) => `  @font-face { font-family: "Archivo"; src: url("${toRoot}/${ARCHIVO}") format("woff2");
    font-weight: 100 900; font-stretch: 62% 125%; font-display: swap; }
  :root { color-scheme: light dark;
${colorLines(0)}
    --display: "Archivo", ${SANS};
    --edge: color-mix(in srgb, var(--ink) 25%, transparent); }
  @media (prefers-color-scheme: dark) { :root {
${colorLines(1)} } }
  html { background: var(--ground); scrollbar-color: var(--line) var(--ground); }
  body { margin: 0; color: var(--ink); background: var(--ground); font: 16.5px/1.62 ${SANS};
    overflow-wrap: break-word; }
  ::selection { color: var(--ink); background: color-mix(in srgb, var(--ink) 18%, transparent); }
  a { color: var(--link); text-decoration: underline; text-decoration-thickness: 1px;
    text-decoration-color: color-mix(in srgb, var(--link) 35%, transparent); text-underline-offset: .2em; }
  a:hover { text-decoration-color: currentColor; }
  :focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }
  h1, h2, h3 { font-family: var(--display); line-height: 1.15; text-wrap: balance; }
  code { font-family: ${MONO}; font-size: .86em; }`;
