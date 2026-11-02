// The shared parts of the generated HTML pages of the Pages site: the landing page
// (build-landing.mjs), the moved pages (build-moved.mjs), and the page of the capture journey
// (build-capture-journey.mjs).
import { AREA_COLORS, BACKGROUNDS, LINES, PARCEL_FIELD_INK_SHARE, TEXTS } from "./site-colors.mjs";

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

// The parcel field, the still drawing in the legend rail (DESIGN.md): an SVG mask at this path of
// the site. The deploy workflow writes it with build-parcel-field.mjs.
export const PARCEL_FIELD = "art/parcel-field.svg";

// The media queries of the legend rail: a wide screen (64rem and more) shows the legend rail; a
// narrow screen shows the title band (the masthead) at the top. "not all and" makes the narrow
// query the exact opposite of the wide one, so no width falls between them.
export const WIDE = "(min-width: 64rem)";
export const NARROW = `not all and ${WIDE}`;

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
// selection, the links, the headings, code, and the parcel field. --edge is the ink outline of an
// area color. --rail is the width of the legend rail.
// Each page in the site look has a legend rail, in its masthead (the title band, class
// "masthead"). On a wide screen the masthead is the first column of the body, var(--rail) wide,
// and the parcel field lies under it, with a hairline at the edge of the rail. On a narrow screen
// the masthead is the band at the top of the page, and the parcel field lies under it. The reading
// column stays plain. The field is a still layer behind the page, out of the way of the pointer:
// the ink color at --parcel-ink-share paints the mask. check-site-colors.mjs checks the same mix
// of the ink and the ground. The field and the hairline do not show in forced colors, with more
// contrast, or in print. The layer of the rail is as high as the large viewport (100lvh): it does
// not change its size, and the field does not zoom, when a phone browser shows or hides its
// toolbar. The ground is on html, and body has no background, because the layer of the rail lies
// between them.
// toRoot is the path from the page to the root of the site. Each page adds its own rules after it.
const fieldMask = (toRoot) => `url("${toRoot}/${PARCEL_FIELD}") center / cover no-repeat`;
const fieldPaint = (toRoot) => `background-color: color-mix(in srgb, var(--ink) var(--parcel-ink-share), transparent);
      -webkit-mask: ${fieldMask(toRoot)}; mask: ${fieldMask(toRoot)};`;
export const siteStyle = (toRoot) => `  @font-face { font-family: "Archivo"; src: url("${toRoot}/${ARCHIVO}") format("woff2");
    font-weight: 100 900; font-stretch: 62% 125%; font-display: swap; }
  :root { color-scheme: light dark;
${colorLines(0)}
    --display: "Archivo", ${SANS};
    --edge: color-mix(in srgb, var(--ink) 25%, transparent);
    --rail: 17.5rem; --parcel-ink-share: ${PARCEL_FIELD_INK_SHARE[0]}%; }
  @media (prefers-color-scheme: dark) { :root {
${colorLines(1)}
    --parcel-ink-share: ${PARCEL_FIELD_INK_SHARE[1]}%; } }
  html { background: var(--ground); scrollbar-color: var(--line) var(--ground); }
  body { margin: 0; color: var(--ink); background: transparent; font: 16.5px/1.62 ${SANS};
    overflow-wrap: break-word; }
  @media ${WIDE} {
    body::before { content: ""; position: fixed; top: 0; left: 0; width: var(--rail); height: 100vh; height: 100lvh;
      z-index: -1; pointer-events: none;
      ${fieldPaint(toRoot)} }
    body::after { content: ""; position: fixed; top: 0; bottom: 0; left: var(--rail); width: 1px; z-index: -1;
      pointer-events: none; background: var(--line); } }
  @media ${NARROW} {
    .masthead { position: relative; isolation: isolate; }
    .masthead::before { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
      ${fieldPaint(toRoot)} } }
  @media (forced-colors: active), (prefers-contrast: more), print {
    body::before, body::after, .masthead::before { display: none; } }
  ::selection { color: var(--ink); background: color-mix(in srgb, var(--ink) 18%, transparent); }
  a { color: var(--link); text-decoration: underline; text-decoration-thickness: 1px;
    text-decoration-color: color-mix(in srgb, var(--link) 35%, transparent); text-underline-offset: .2em; }
  a:hover { text-decoration-color: currentColor; }
  :focus-visible { outline: 2px solid var(--link); outline-offset: 2px; }
  h1, h2, h3 { font-family: var(--display); line-height: 1.15; text-wrap: balance; }
  code { font-family: ${MONO}; font-size: .86em; }`;
