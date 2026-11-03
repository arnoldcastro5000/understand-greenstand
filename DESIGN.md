---
name: understand-greenstand site look
description: The built pages read as a land-cover map of the code estate.
colors:
  ground: "#f3f5f0"
  ground-dark: "#131915"
  surface: "#e8ece5"
  surface-dark: "#1b231e"
  ink: "#1b2420"
  ink-dark: "#e2e8e0"
  muted: "#56625a"
  muted-dark: "#9aa79e"
  link: "#2c5d84"
  link-dark: "#8fb9d9"
  best-guess: "#7a5a12"
  best-guess-dark: "#d9b25c"
  not-working: "#9e3f4b"
  not-working-dark: "#e08a93"
  line: "#c5cec3"
  line-dark: "#2e3a33"
  edge: "color-mix(in srgb, #1b2420 25%, transparent)"
  edge-dark: "color-mix(in srgb, #e2e8e0 25%, transparent)"
  selection: "color-mix(in srgb, #1b2420 18%, transparent)"
  selection-dark: "color-mix(in srgb, #e2e8e0 18%, transparent)"
  parcel-field: "color-mix(in srgb, #1b2420 11.5%, transparent)"
  parcel-field-dark: "color-mix(in srgb, #e2e8e0 9.1%, transparent)"
  evergreen: "#35614e"
  evergreen-dark: "#33634d"
  cropland: "#92600d"
  cropland-dark: "#916618"
  shrub: "#bba25b"
  shrub-dark: "#b49e56"
  wetland: "#6f9db3"
  wetland-dark: "#7fb0c6"
  deciduous: "#6c8951"
  deciduous-dark: "#49854f"
  mixed-forest: "#b1bd97"
  mixed-forest-dark: "#b1b38e"
  bare-ground: "#7c796e"
  bare-ground-dark: "#858377"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 3.1rem)"
    fontWeight: 720
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  display-rail:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.95rem"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline-featured:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 680
    lineHeight: 1.15
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 660
    lineHeight: 1.15
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 640
    lineHeight: 1.3
  display-text:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem)"
    fontWeight: 720
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-text:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 660
    lineHeight: 1.15
  title-text:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.16rem"
    fontWeight: 640
    lineHeight: 1.15
  title-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 640
    lineHeight: 1.3
  numeral:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 75"
  body:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "1.03125rem"
    fontWeight: 400
    lineHeight: 1.62
  body-small:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1.2
    fontVariation: "\"wdth\" 87.5"
  label-rail:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.25
    fontVariation: "\"wdth\" 87.5"
  label-nav:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 500
    lineHeight: 1.3
    fontVariation: "\"wdth\" 87.5"
  label-table:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 600
    lineHeight: 1.3
    fontVariation: "\"wdth\" 87.5"
  subtitle:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.62
  numeral-station:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1.25rem"
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 75"
  label-bar:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.3
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 87.5"
  label-summary:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 600
    lineHeight: 1.6
    fontVariation: "\"wdth\" 87.5"
  mono:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "0.86em"
  drawing-title:
    fontFamily: "\"Archivo Drawing\", system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "18px"
    fontWeight: 600
  drawing-line:
    fontFamily: "\"Archivo Drawing\", system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
  drawing-numeral:
    fontFamily: "\"Archivo Drawing\", system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "17px"
    fontWeight: 600
    fontFeature: "\"tnum\""
rounded:
  none: "0"
spacing:
  cell-gap: "2px"
  group-gap: "6px"
  page-margin: "1.25rem"
  entry: "0.85rem"
  number-column: "2.75rem"
  section: "3rem"
  rail: "17.5rem"
  reading-column: "44rem"
  text-content: "64rem"
  diagram-plate: "62rem"
  journey-column: "58rem"
  station: "3.5rem"
  sticky-bar: "2.5rem"
  stage: "3rem"
components:
  estate-cell:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    height: "clamp(2rem, 1.3rem + 2.4vw, 3.25rem)"
  estate-cell-rail:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.ink}"
    typography: "{typography.label-rail}"
    rounded: "{rounded.none}"
    height: "1.5rem"
  area-chip:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    size: "0.8em"
  start-here-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.6rem 1.75rem 1.4rem"
  register-entry:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.85rem 0 1.1rem"
  jump-link:
    textColor: "{colors.ink}"
    typography: "{typography.label-nav}"
  text-link:
    textColor: "{colors.link}"
  parcel-field:
    backgroundColor: "{colors.parcel-field}"
    width: "{spacing.rail}"
  estate-mark-small:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    width: "8.5rem"
    height: "0.55rem"
  estate-mark-rail:
    backgroundColor: "{colors.evergreen}"
    rounded: "{rounded.none}"
    width: "min(100%, 13.5rem)"
    height: "0.75rem"
  back-link:
    textColor: "{colors.ink}"
    typography: "{typography.label-nav}"
    padding: "0.15rem 0"
  code-inline:
    backgroundColor: "{colors.surface}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "0.1em 0.35em"
  code-block:
    backgroundColor: "{colors.surface}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "1rem"
  table-head:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label-table}"
    padding: "0.55rem 0.8rem"
  quote:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  diagram-plate:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "1.5rem 1rem"
  diagram-node:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  chapter-line:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  track-station:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "{spacing.station}"
    padding: "0.7rem"
  track-station-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    size: "{spacing.station}"
  station-number:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.numeral-station}"
    rounded: "{rounded.none}"
    height: "1.25rem"
    padding: "0 0.2rem"
  station-label:
    textColor: "{colors.ink}"
    typography: "{typography.label-rail}"
  sticky-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.label-bar}"
    height: "{spacing.sticky-bar}"
  bar-dot-current:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "0.65rem"
  bar-dot-done:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.none}"
    size: "0.65rem"
  state-tag-best-guess:
    textColor: "{colors.best-guess}"
    typography: "{typography.label}"
  state-tag-not-working:
    textColor: "{colors.not-working}"
    typography: "{typography.label}"
  flag:
    rounded: "{rounded.none}"
    padding: "0.6rem 0.85rem"
  stage-number:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  stage-media:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
  developers-box:
    typography: "{typography.label-summary}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.9rem"
  drawing:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
  drawing-step:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.drawing-title}"
    rounded: "{rounded.none}"
  drawing-step-number:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.drawing-numeral}"
    rounded: "{rounded.none}"
    size: "30px"
---

# Design System: understand-greenstand site look

## Overview

**Creative North Star: "The Land-Cover Map"**

The site reads as a land-cover classification map of the code estate. Each area of repos is a land-cover class. Each class has one flat, muted area color. The snapshot commit is the scene date. The reader sees the whole estate in one estate strip, learns the area key, follows the numbered Start here path, and then finds a repo entry with its proof links.

The site look is calm and dense. The page is a mineral ground with evergreen-black ink. Hairline rules divide the content. The parcel field, the faint ink boundaries of made-up field parcels, lies behind the legend rail. It is decoration, not data. Apart from the link blue, the area colors are the only saturated colors on the page, and they fill shapes only. The pages follow the color scheme of the reader, so each color is a pair: one value for light, one value for dark (the `-dark` tokens). The site look refuses the GitHub-clone docs look (the former look) and the stock eco template: no leaf art, no gradients, no drop shadows, no Greenstand logo.

Scope of this record: every page that the site scripts make is in the site look. These pages are the landing page, the text pages, the capture journey page, and the moved pages. The shared base is the colors in `.github/scripts/site-colors.mjs` and these parts of `.github/scripts/site-html.mjs`: `siteStyle`, `siteHead`, the estate mark (`estateMark`, `areaGroup`, `areaStyle`), the masthead (`masthead`, `mastheadStyle`), the reading column (`READING_COLUMN`), and the files of the site look (`SITE_LOOK_FILES`: the font and the parcel field). The parcel field is also in the shared base (`.github/scripts/build-parcel-field.mjs` writes `art/parcel-field.svg`). `build-landing.mjs` writes the landing page. `render-md.mjs` writes the text pages: the ecosystem maps, the shared-resource page, the estate glossary, the volunteer guide, and the onboarding guide, the README, and the glossary of each repo. `capture-journey-page.mjs` holds the capture journey page, and `build-capture-journey.mjs --site` writes it. `build-moved.mjs` writes the moved pages: a moved page is at the former name of a repo and sends the reader to the new name. Every page shows the parcel field. The former look (`BASE_STYLE`) is not in the build any more.

**Key Characteristics:**
- A mineral ground, an ink text color, and water blue for links only, from one data module of [light, dark] pairs.
- Eight area colors (seven land-cover classes and ink for Organization) that fill cells, chips, and rules, never text.
- An ink edge on each area fill, so that pale fills stay visible on the ground.
- Archivo (a variable face with a width axis) for headings, labels, and numerals; the system sans for body text.
- Square corners, hairline rules, and no elevation.
- The parcel field: the faint, still ink boundaries of made-up field parcels under the legend rail on a wide screen and under the masthead on a phone. The content column stays plain.
- The estate strip as the signature: a picture on a phone, a row of links on a wider page, an upright legend in the legend rail on a wide screen. The other pages show it small, as the estate mark in the masthead.
- The capture journey as an ink track: one square station for each stage. A best guess has a hatch, and a part that does not work has a cross.
- Diagrams on a plate in the surface color, with each repo node in a tint of its area color.

## Colors

A muted, flat land-cover palette on a pale mineral ground, with one blue for links and two state colors. All colors live once in `.github/scripts/site-colors.mjs`: `BACKGROUNDS` (ground, surface), `TEXTS`, `STATES`, `LINES` (line), and `AREA_COLORS`, and the ink share of the parcel field (`PARCEL_FIELD_INK_SHARE`). `siteStyle` makes the CSS custom properties from them (`--<name>`, `--c-<name>` for an area color, and `--parcel-ink-share`).

### Primary
- **Water Blue** (`link`, `link-dark`): the color of links only. Links have a 1px underline in 35% of the link color; on hover the underline takes the full link color. The focus ring (2px solid, 2px offset) is water blue too.

### Secondary
The area colors. `estate.json` gives each area a `"color"` (the area color name). The page sets `--area` from it on each area element.
- **Evergreen** (`evergreen`): Core API.
- **Cropland Ochre** (`cropland`): Wallet.
- **Shrub Khaki** (`shrub`): Admin.
- **Wetland Blue-Gray** (`wetland`): Web map.
- **Deciduous Green** (`deciduous`): Mobile.
- **Mixed Forest Sage** (`mixed-forest`): Data ingest.
- **Bare Ground Taupe** (`bare-ground`): Infrastructure.
- **Ink** (the `ink` text color, `--c-ink`): Organization, the area of Greenstand's own documents, not code. It is the same value as the text ink. Start here has no repos, so it has no area color.

Area colors fill the estate strip cells, the estate mark cells, the area chips, the 3px top rule of each area section, and the 14% tint of a target repo entry. In a diagram, the node of a repo has a fill of its area color at the node tint (`DIAGRAM_NODE_TINT`, 30%) mixed with the ground, and a 1.5px border in its area color. Readers with red-green color blindness can tell the area colors apart (see the Color-Blind Key Rule).

### Tertiary
The state colors (`STATES`). A state color is the color of a state. The state colors are text colors. They also paint the state marks and the border of a flag. Each one is for its state only.
- **Best-Guess Ochre** (`best-guess`): the state color of a best guess.
- **Not-Working Rose** (`not-working`): the state color of a part that does not work or is gone.

A state never shows by its state color alone: a best guess also has a hatch, and a part that does not work also has a cross. CI checks these tokens. The capture journey page shows both states: in a state tag, in a flag, and in the legend (see State marks). The error image of a broken diagram also uses a state color: Mermaid draws it in the not-working color (`errorBkgColor` and `errorTextColor`), with its own error text.

### Neutral
- **Mineral Ground** (`ground`): the page background, the `html` background, the browser bar color (`theme-color`), the scrollbar track, and the fill of the diagram nodes and clusters. On the capture journey page, it is the fill of a station, the color of a station number and of a station icon on hover, and the background of the sticky bar. In a drawing in the site look: the fill of a step box, of the cloud, and of the cylinder, and the color of a step numeral.
- **Field Surface** (`surface`): a field on the page. The Start here field uses it. On a text page, the inline code, the code blocks, the table heads, the quotes, and the diagram plates use it. It is also the background of the edge labels in a diagram. On the capture journey page, the image plate of a stage and the inline code use it. On a moved page, the inline code uses it. It is the background of a drawing in the site look.
- **Evergreen-Black Ink** (`ink`): body text, headings, the jump links, the back links, the rail names, the "you are here" outline, the 2px rule above a text-page h2, and the labels of the diagram nodes. On the capture journey page: the track line, the station borders and icons, the station fill on hover, the fill of a station number, the 2px rule above a stage, the border of a bar dot, and the fill of the current bar dot. In a drawing in the site look: the titles and the squares of the step numbers.
- **Lichen Muted** (`muted`): secondary text: the Start here intro, the snapshot line, the "Go deeper" line, the path numerals, the area keys in the legend rail, the list markers, and the quote text. In a diagram, it is the color of the lines and of the node borders. On the capture journey page: the chapter line, the subtitle, the legend, the stage numbers, the captions, the marker of a "For developers" box, the text "No public issue yet.", and the footer. Muted has a second job as a fill: the done dots of the sticky bar (fill and border). In a drawing in the site look: the other lines of text, the borders of the boxes, the lines, and the arrow heads.
- **Hairline** (`line`): 1px rules between entries, the masthead rule on narrow pages, the jump-link border, the rail-edge hairline (a fixed 1px rule at the edge of the legend rail on a wide screen), the table row rules, the `hr` rule, the hover underline of a back link, the cluster borders of a diagram, and the scrollbar thumb. On the capture journey page: the rule below the sticky bar, the hover underline of a station label, the border of a drawing, the border of a "For developers" box, and the rule above the footer.
- **Ink Edge** (`edge`): a 1px inset outline in 25% ink on each area fill. It has a second job: a 1px inset outline (`outline-offset: -1px`) on a phone screenshot of the capture journey page.
- **Ink Selection** (`selection`): the background of selected text, an 18% ink tint. Selected text stays ink.
- **Parcel Ink** (`parcel-field`): the color of the parcel field and of nothing else. It is the ink at an ink share of 11.5% in light mode and 9.1% in dark mode (`PARCEL_FIELD_INK_SHARE`), mixed with transparent in sRGB. The mask of the field takes this color, so one file serves light and dark.

### Named Rules
**The One Color, One Job Rule.** An area color marks its area and nothing else. It fills cells, chips, rules, and tints. It never colors text. Water blue is for links only. The state colors are for states only.

**The Two Backgrounds Rule.** Each text color has a contrast of 4.5:1 or more on each background (the ground and the surface), in light and in dark mode. `.github/scripts/check-site-colors.mjs` enforces it in CI. Add a new text color to `TEXTS` in `site-colors.mjs`, so that CI checks it.

**The State Apart Rule.** Each area color is 10 or more (CIE76) from each state color, in both schemes. CI enforces it. Thus an area color does not look like a state.

**The Color-Blind Key Rule.** Each two area colors are 10 or more apart (CIEDE2000), in both schemes, for normal vision and for simulated protanopia and deuteranopia (Machado 2009, severity 1). CI enforces it. A new area color must pass this check before a page uses it.

**The Ink Edge Rule.** Every area fill carries the ink edge (a 1px inset outline in 25% ink). Pale fills, for example Mixed Forest Sage, stay visible on the ground.

**The Faint Field Rule.** The parcel field at full mask has a contrast of 1.25:1 or less with the ground, so it stays in the background. Each text color has a contrast of 4.5:1 or more on the field, because the title and the estate strip lie on it. The ink share is above 0 and at most 100. `check-site-colors.mjs` enforces these rules in CI, in light and in dark mode. Today the field is 1.2489:1 (light) and 1.2480:1 (dark) to the ground. The weakest text on the field is best-guess at 4.64:1 and muted at 4.66:1, both in light mode. Change the strength of the field only in `PARCEL_FIELD_INK_SHARE`.

**The Node Tint Rule.** The node of a repo in a diagram has a fill of its area color at `DIAGRAM_NODE_TINT` (30%) mixed with the ground. The ink labels have a contrast of 4.5:1 or more on the node tint of each area color, in light and in dark mode. The tint is a percent above 0 and at most 100. `check-site-colors.mjs` enforces these rules in CI. Today the weakest label is ink on the ink tint (Organization): 7.76:1 in light mode and 5.93:1 in dark mode. Change the tint only in `DIAGRAM_NODE_TINT`.

**The Drawing Colors Rule.** A drawing in the site look holds the site color block: the 5 neutral colors (ground, surface, ink, muted, line) as CSS custom properties on `svg`, light and dark by `prefers-color-scheme`. An SVG in an `<img>` cannot read the custom properties of the page, so the drawing holds its own copy. `build-capture-journey.mjs` writes the block from `site-colors.mjs` (`DRAWING_COLORS` in `site-drawings.mjs`), and `--site` copies the drawing with the current block. `--check` (CI) fails on a stale block. Each mode fails on a `var(--x)` that is not one of the 5. Each mode also fails on any other color outside the block: a hex color, a color function, a named color, or `currentColor`. A drawing with no site color block fails when it uses `var(--x)` or the drawing font. Thus a drawing in the site look has no area color, no state color, and no link color (the One Color, One Job Rule). A drawing with no site color block keeps its own colors.

## Typography

**Display Font:** Archivo (with the system sans as the fallback)
**Body Font:** the system sans (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`)
**Label/Mono Font:** Archivo for labels; `ui-monospace, "SF Mono", Menlo, Consolas, monospace` for code and commit ids only
**Drawing Font:** "Archivo Drawing", a subset of Archivo in each drawing in the site look (with the system sans as the fallback)

**Character:** Archivo is a grotesque with a width axis. It gives the headings and the legend labels the compact voice of a map key. The system sans keeps the body text plain and fast to load.

Archivo comes from the npm package `@fontsource-variable/archivo` 5.3.0, file `archivo-latin-wdth-normal.woff2` (weight 100 to 900, width 62% to 125%, SIL OFL 1.1). The deploy workflow pins the package by its SHA-512 and copies the file and its license to `vendor/archivo/`. Each page preloads it (`siteHead`), but a moved page does not: a moved page shows no Archivo text (`siteHead(toRoot, { preloadFont: false })`). `font-display: swap` applies.

The drawing font comes from the same Archivo file. An SVG in an `<img>` cannot load the font of the page, so each drawing in the site look holds its own copy in the drawing font block. `subset-drawing-font.py` writes the block: 2 static faces at a width of 87.5% (weight 600 and weight 400), with only the characters of the drawing, as WOFF2 data URLs. The CSS family is "Archivo Drawing". The script checks the SHA-256 of the source file. Each face keeps the copyright and license lines of the font (OFL 1.1). `build-capture-journey.mjs` fails when a character of a drawing has no glyph in its drawing font.

### Hierarchy
- **Display** (720, `clamp(2rem, 1.4rem + 2.6vw, 3.1rem)`, 1.15, -0.025em): the site title in the masthead. In the legend rail it is 1.95rem with a line height of 1.02. Below 30rem it takes a width of 78% and -0.02em.
- **Headline** (660, 1.45rem, 1.15): the heading of an area section. The Start here heading is 680 and 1.55rem.
- **Title** (640, 1.12rem, 1.3): the name link of a repo entry. In the Start here path it is 1.18rem: a link to a page, or plain ink text for a step with a links line.
- **Numeral** (600, 1.7rem, 1, width 75%, tabular figures, muted): the step number of the Start here path.
- **Body** (400, 1.03125rem, 1.62): all running text. The size is 16.5px at the default font size of 16px, and it follows the default font size of the reader. The lede and the volunteer line are 1.06rem in a 42rem column. Entry descriptions stop at 40rem. Small text (0.92rem) carries the entry links, the snapshot line, and the "Go deeper" line.
- **Label** (600, 0.82rem, 1.2, width 87.5%): the area keys in the legend rail (muted) and the repo name that shows on hover or focus over a strip cell (ink). The rail names are 500 at 0.9rem; the jump links are 500 at 0.98rem; both have a width of 87.5%.
- **Mono** (0.86em): commit ids and former repo names. On a text page, also inline code and code blocks.

On a text page:
- **Display (text page)** (720, `clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem)`, 1.15, -0.02em): the h1 of the page.
- **Headline (text page)** (660, 1.5rem, 1.15): the h2. A 2px ink rule is above it, with a padding of .75rem.
- **Title (text page)** (640, 1.16rem, 1.15): the h3.
- **Title small** (640, 1rem, 1.3): the h4, with `text-wrap: balance`.
- **Label (table)** (600, .92rem, 1.3, width 87.5%): the table heads (`th`). Tables use tabular numbers.
- **Label (back links)**: the back links use the jump-link style (500, .98rem, 1.3, width 87.5%).
- A repo name in a heading moves to the next line as one piece (an inline-block span).
- Diagram labels are in Archivo. Mermaid measures the labels, so the font loads before Mermaid draws.

On the capture journey page:
- **Display (text page)**: the h1 (the title).
- **Subtitle** (400, 1.15rem, muted, `text-wrap: balance`): the line under the title.
- **Headline (text page)** (660, 1.5rem, 1.15): the h2 of a stage.
- **Label** (600, .82rem, width 87.5%): the chapter line (muted, line height 1.25), the state tags (in the state color, line height 1.7), and the stage numbers (muted, tabular, line height 1.2).
- **Label (station)**: the label of a station uses the rail-name style (500, .9rem, 1.25, width 87.5%).
- **Numeral (station)** (600, .75rem, 1.25rem, width 75%, tabular): the number of a station.
- **Label (bar)** (600, .9rem, 1.3, width 87.5%, tabular): the text of the sticky bar.
- **Label (summary)** (600, .92rem, 1.6, width 87.5%): the summary of a "For developers" box. The text of the box is .92rem.
- Captions are .85rem with a line height of 1.4. The legend is .92rem with a line height of 1.5.
- A long word breaks anywhere (`overflow-wrap: anywhere`), so no text makes the page wider than the screen. Code stays on one line, because a reader copies it.
- In a title, "the", "a", or "an" stays on the line of the next word (a no-break space).

In a drawing in the site look (all text in the drawing font, with `text-rendering: geometricPrecision`):
- **Drawing title** (600, 18px, ink): the title of a step, and the name of the cloud, of the cylinder, and of a dashed box.
- **Drawing line** (400, 15.5px, muted): the other lines. A repo name is a drawing line too, not monospace, as the repo nodes of the diagrams.
- **Drawing numeral** (600, 17px, tabular, ground): the step number on its ink square.
- The sizes are in drawing units. At a 390px screen, the page shows a drawing 310px wide, so a drawing line shows at 12px.

### Named Rules
**The Two Voices Rule.** Archivo sets headings, labels, and numerals. The system sans sets the body text. Monospace sets code and commit ids only.

**The Narrow Label Rule.** Archivo labels use a width of 87.5%. Numerals use a width of 75%. The full width is for headings. Headings use `text-wrap: balance`.

**The No Lone Word Rule.** `siteStyle` sets `text-wrap: pretty` on paragraphs, list items, `dd`, and quotes, on every page in the site look. Thus the browser avoids one word alone on the last line of a paragraph.

**The Drawing Font Rule.** All text of a drawing in the site look is in the drawing font. The system sans is only its fallback. When the words of a drawing change, run `subset-drawing-font.py`, so that the drawing font has each character.

## Layout

### Landing page

The landing page has three layouts.

- **Narrow masthead (below the links width):** the masthead holds the title and the estate mark across the page, over a 1px hairline. One column follows. The page margin is 1.25rem. The parcel field lies under the masthead only, inside its padding box.
- **Links width and more:** the estate strip replaces the estate mark, and its cells are links. The rule is a container query on the masthead (`container: masthead / inline-size`), so the page margins, the default font size, and a scroll bar do not change it. The build computes the links width from the repo counts: it is the narrowest strip where each cell of the area with the most repos can be 24px wide (WCAG 2.2 target size), with the 2px gaps in an area (`CELL_GAP`) and the 6px gaps between areas (`AREA_GAP`). Today it is a strip of 422px (a page of 462px at a 16px default font size). The value changes when the repo counts change.
- **Wide screen (64rem and more):** the body is a grid of a 17.5rem legend rail and a content column. The legend rail is sticky at the top, holds the title and the upright estate strip, and scrolls on its own in a short window (`max-height: 100vh`). The legend rail always shows the links and never the estate mark, at any repo count. The content column is at most 50rem, with a side padding of `clamp(1.5rem, 4vw, 4.5rem)`. The parcel field lies under the legend rail, and the rail-edge hairline marks the edge of the rail. The rail width is `--rail` (17.5rem).

The content column (the reading column) stays plain on all screens: the parcel field never lies under it. `site-html.mjs` holds the two media queries: `WIDE` (`(min-width: 64rem)`) and `NARROW` (`not all and (min-width: 64rem)`). `NARROW` is the exact opposite of `WIDE`, so no width falls between them. `build-landing.mjs` uses `WIDE` and `var(--rail)` for its grid.

The content column holds, in order: the lede, the volunteer line, the Start here field, the jump links, and one area section for each other area. Area sections are 3rem apart. Repo entries are one column, divided by hairlines, with 0.85rem above and 1.1rem below. The Start here path puts its numbers in a 2.75rem margin number column. Anchors have a scroll margin of 1.5rem.

Difference from the direction contract: the contract FORM names a dense two-column repo register on wide screens; the build has one column of repos, because the legend rail layout keeps the register to one column (FIRST VIEWPORT and the surface brief). The build wins.

### Text pages

A text page has two layouts. Each child of `main` is border-box and at most 44rem wide (the reading column, `READING_COLUMN`). `mastheadStyle(READING_COLUMN)` in `site-html.mjs` gives the masthead and the page grid.

- **Narrow screen (`NARROW`):** the masthead is a band at the top, over a 1px hairline. It holds the estate mark (8.5rem x .55rem) over the back links, in one row that wraps. Its padding is 1.25rem, and its side padding grows (`max(1.25rem, calc((100% - 44rem) / 2))`), so the estate mark and the back links align with the reading column. The parcel field lies under the masthead only. `main` has a padding of 1.5rem 1.25rem 5rem, and the reading column is in the center.
- **Wide screen (`WIDE`):** the body is a grid of the legend rail (`var(--rail)`) and the content column. The legend rail is sticky at the top, with a padding of 2.4rem 1.5rem 2rem 2rem and no hairline below it. It holds the estate mark (100% of the rail up to 13.5rem, x .75rem) over the back links, one under the other. The parcel field lies under the legend rail. `main` is at most 64rem, with a padding of 1.25rem `clamp(1.5rem, 4vw, 4.5rem)` 5rem. The children of `main` start at the left.

A diagram can be wider than the reading column. On a narrow screen its plate is up to 62rem wide, in the center. On a wide screen the plate takes the full width of `main`. Each diagram keeps at least 70% of its own width, so its labels stay readable on a phone. A wider diagram scrolls in its own box. A table also scrolls in its own box. The block rhythm: paragraphs, lists, tables, code blocks, and quotes have 1rem below them; list items are .3rem apart; headings have a scroll margin of 1.5rem.

### Capture journey page

The capture journey page uses the masthead and the page grid of the text pages (`mastheadStyle`), with a content column of 58rem (`COLUMN` in `capture-journey-page.mjs`). On a narrow screen, the masthead content aligns with this column.

- **Narrow screen (`NARROW`):** `main` has a padding of 1.25rem 1.25rem 5rem. The children of `main` are at most 58rem wide, in the center.
- **Wide screen (`WIDE`):** the side padding of `main` is `clamp(1.5rem, 4vw, 4.5rem)`. The children of `main` start at the left.

The intro paragraphs, the legend, and the footer paragraphs stay in the reading column (`READING_COLUMN`, 44rem). `main` is a container (`container-type: inline-size`). The stage layout and the track follow the width of `main`, not of the screen, because the legend rail takes a part of a wide screen:
- **`main` 46rem or less:** a stage is one column, and the images come first.
- **`main` 34rem or less:** the track is rows of 3 stations with no line. A phone screenshot is 130px wide (150px in a wider `main`).
- **`main` 20rem or less (the narrowest phones):** the code in a "For developers" box can break, so it stays in its box.

Stages are 3rem apart. A link to a stage lands the stage under the sticky bar (`scroll-margin-top: 2.5rem`), so the ink rule of the stage shows under the hairline of the bar.

### Moved pages

A moved page uses the same masthead and page grid, with the reading column (`mastheadStyle(READING_COLUMN)`). Its one paragraph is in the reading column. On a narrow screen, `main` has a padding of 1.5rem 1.25rem 5rem, and the column is in the center. On a wide screen, `main` has a padding of 2.4rem `clamp(1.5rem, 4vw, 4.5rem)` 5rem, and the column starts at the left.

### Named Rules
**The 24 px Target Rule.** A strip cell is a link only where it can be 24px wide. Below that width, the strip is the estate mark: a picture with no links and no words, hidden from screen readers. Do not hard-code the width; compute it from the repo counts and test it on the masthead container, not on the page. In the legend rail each row is at least `max(1.5rem, 24px)` high, so the rail always has links.

## Elevation & Depth

The site look is flat. It has no drop shadows, no gradients, and no layered cards. Depth comes from tone only: the surface field is one step darker than the ground in light mode (one step lighter in dark mode). The only `box-shadow` in the system is the 1px inset ink edge on area fills; it is an outline, not an elevation. Diagrams use the "classic" look of Mermaid, because its default look draws node shadows.

The one exception is the scroll shadows of a wide diagram. They show that the diagram scrolls. At each side of the plate, a 2rem gradient in the surface color moves with the diagram (`local`) and covers a .75rem radial shade of 25% ink that stays at the edge (`scroll`). Thus a shade shows only on a side with more of the diagram. The plate takes both values from `site-colors.mjs`, light and dark.

The sticky bar of the capture journey page is flat too: the ground with a hairline below. It lies above the content (z-index 5) and has no shadow.

The parcel field is not an elevation either. It is a still ink layer behind the page: it lies under the content (z-index -1), it takes no pointer events, and it has no shadow and no gradient. The ground is on `html`, and `body` has no background, so the field lies between the ground and the page.

Motion is small and has one job: it shows which cell is under the pointer or the keyboard focus. The color block of a strip cell moves 4px up (3px right in the legend rail) in 0.25s with `cubic-bezier(.16, 1, .3, 1)`. The hover label fades in 0.15s. `prefers-reduced-motion: reduce` turns off both transitions. The parcel field has no motion. Its layer on a wide screen is 100lvh high (100vh where the browser does not know `lvh`), so the layer does not change its size when a browser shows or hides its toolbar.

### Named Rules
**The Flat Map Rule.** Surfaces are flat at all times. Use tone (the surface) and hairlines for structure. Use no drop shadow and no gradient. The one exception is the scroll shadows of a wide diagram: they are the cue that a diagram scrolls, and they show nowhere else. The parcel field is a flat ink layer behind the page, not a surface above it.

## Shapes

All corners are square (radius 0). Area fills are plain rectangles: strip cells, mark cells, and chips (0.8em squares). Rules are straight: 1px hairlines between entries, around the jump links, and at the edge of the legend rail, and a 3px rule in the area color above each area section. The parcel field has two marks only: straight boundaries with round joins, and round points in rows. The Start here field has no border; its surface tone sets it apart. On a text page, the code, the table heads, the quotes, and the diagram plates are square surface fields with no border. A quote has no rule at its side. The h2 has a 2px ink rule above it. Table rows and `hr` are 1px hairlines. A repo node of a diagram has a 1.5px border in its area color. On the capture journey page, the stations, the station numbers, the bar dots, the state marks, the flags, the image plates, and the "For developers" boxes are square. The track line and the station borders are 1.5px ink. A flag has a 1px border in its state color. A stage has a 2px ink rule above it, as the text-page h2. A drawing in the site look is square too. Its step boxes, its cloud, and its cylinder (a store of data) have a ground fill and a 1.5 muted border. Its lines and arrow heads are muted, at a width of 2. A dashed border (`stroke-dasharray: 6 5`) marks a step outside the Greenstand system or an older path.

## Components

### Estate strip (signature)
One cell per repo, grouped by area, in the area colors. Each group takes a width in proportion to its repo count. Start here has no repos, so the strip has no Start here group.
- **Cells:** flat area fill with the ink edge, 2px apart in an area, 6px between areas. Height `clamp(2rem, 1.3rem + 2.4vw, 3.25rem)`.
- **Links:** each cell links to its repo entry. On hover or keyboard focus, the color block moves up and the repo name shows below the strip in the label style.
- **In the legend rail:** the strip stands upright. Each group has its area name (the key, muted label) above it. Each row is a 1rem color block and the repo name; a row is at least `max(1.5rem, 24px)` high. The legend rail always shows the strip, never the estate mark. On hover the block moves right and the name gets a hairline underline.
- **You are here:** the row or cell of the repo entry that the address points to gets a 2px ink outline with a 2px offset.

### Estate mark
The estate strip as a picture: the same groups and cells, with no links and no words, and `aria-hidden`. `estateMark(areas)` in `site-html.mjs` writes it, with `areaGroup` and `areaStyle`. Every page uses the same markup. The landing page gives it its own size, and `mastheadStyle` gives its size on the other pages.
- **Landing page:** where the masthead is narrower than the links width, it replaces the estate strip. It never shows in the legend rail of the landing page.
- **Text page, capture journey page, and moved page:** it is small and always shows. The gap is 3px between areas and 1px between cells, and each cell has the ink edge. It is 8.5rem x .55rem on a narrow screen. On a wide screen it is 100% of the rail up to 13.5rem, x .75rem. In print, the cells keep their area colors (`print-color-adjust: exact` in `mastheadStyle`).

### Text-page masthead
The estate mark over the back links. On a narrow screen it is the band at the top; on a wide screen it is the legend rail (see Layout). `masthead(areas, parts)` in `site-html.mjs` writes it, and `mastheadStyle(column)` gives its style. The capture journey page and the moved pages use the same masthead with other parts (see below).
- **Back links:** "← " and the back label (the viewer of the repo, or another page), and "All viewers" on a page in a repo folder. Archivo 500 .98rem/1.3, width 87.5%, in ink, with no underline. On hover a hairline underline in the line color shows. Each link has a padding of .15rem above and below, so it is 24px high or more.
- **Gaps:** .25rem between rows and 1.5rem between links in the narrow band. In the legend rail the links are one under the other.

### Text-page content
- **Headings:** see Typography. The h2 has the 2px ink rule above it.
- **Lists:** muted markers.
- **Code:** inline code on the surface (padding .1em .35em); a code block on the surface (padding 1rem) that scrolls in its own box. Square corners.
- **Tables:** the table scrolls in its own box. The heads are on the surface in the table label style. Cells have a padding of .55rem .8rem and a hairline below. Numbers are tabular.
- **Quotes:** the surface, muted text, a padding of .75rem 1rem, and no rule at the side.
- **Rules:** `hr` is a hairline, with 2rem above and below.

### Diagrams
Only a page with a Mermaid block loads Mermaid and gets the diagram style.
- **Plate:** a surface plate with a padding of 1.5rem 1rem, square, with the diagram in the center (see Layout for its width). A wide diagram scrolls in the plate and shows the scroll shadows (see Elevation & Depth).
- **Theme:** Mermaid theme "base" with `themeVariables` from `site-colors.mjs`, light and dark: nodes in the ground color with a muted border, ink labels, muted lines, the edge label background in the surface color, and clusters in the ground color with a line border. Look "classic". The labels are in Archivo. When the color scheme changes, Mermaid draws the diagrams again.
- **Repo nodes:** a node whose label is exactly the name of a repo in `estate.json` gets the class `area-node` and `--area` (its area color). Its fill is the node tint (30%) of the area color on the ground, and its border is 1.5px in the area color. The ink labels stay (see the Node Tint Rule).
- **Broken diagram:** the error image is in the not-working color. A broken diagram does not stop the area colors and the sizes of the other diagrams: the script sets them in a `finally`.
- **Loading:** until Mermaid draws, the page hides the source text of the diagrams. A browser without modules shows the source text.

### Parcel field
The background of the site look: the boundaries of made-up field parcels, seen from above, in parcel ink. About one parcel in five has rows of points (planting rows). The field is decoration, not data: no parcel is a real place or a capture.
- **Source:** `build-parcel-field.mjs` draws the field from a fixed seed (20261103) into `art/parcel-field.svg` (1600 x 1000, `preserveAspectRatio="xMidYMid slice"`). Each run writes the same file, byte for byte. The deploy workflow runs it. Each page script fails when the file is missing (`SITE_LOOK_FILES`).
- **Marks:** boundaries at a stroke width of 1.1 with round joins. Points 9 units apart, 7 units or more from the edge of the parcel, with round caps, a stroke width of 2.4, and an opacity of 0.8. No fills and no hatch: a hatch is the mark of a best guess.
- **Paint:** the file is a mask (`center / cover no-repeat`). Parcel ink (`color-mix(in srgb, var(--ink) var(--parcel-ink-share), transparent)`) paints the layer through the mask.
- **Wide screen (`WIDE`):** a fixed layer (`body::before`) under the legend rail, `var(--rail)` wide and 100lvh high, at z-index -1, with no pointer events. A fixed 1px rule in `line` (`body::after`) is the rail-edge hairline, from the top to the bottom of the window.
- **Narrow screen (`NARROW`):** the layer (`.masthead::before`) lies under the masthead only, inside its padding box. The masthead makes its own stacking context (`isolation: isolate`).
- **Not shown:** under the content column. The field and the rail-edge hairline are hidden in forced colors, with `prefers-contrast: more`, and in print.
- **Motion:** none. The field is still.

### Chips
- **Style:** a 0.8em square in the area color with the ink edge, before the area heading and before each jump link. A chip has no words and is hidden from screen readers.
- **State:** none. Start here has no chip.

### Start here field
- **Corner Style:** square.
- **Background:** the surface.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none. Hairlines divide the steps.
- **Internal Padding:** 1.6rem 1.75rem 1.4rem.
- **Content:** the Start here heading (no chip, no rule), the intro in muted, and an ordered list of steps with muted Archivo numerals in the margin number column. Most steps link a page of the docs repo: the name is the link. A step with links to other sites has its name in plain text and a links line under the description. The "Go deeper" line aligns with the step text.

### Area section and repo register
- **Rule:** a 3px top rule in the area color, then the chip and the heading.
- **Entry:** the repo name as a title link, a description, and one small line with the five page links (separated by " · ") at the left and the snapshot with its commit id at the right.
- **Target:** the target entry gets a 14% tint of its area color and extends 1rem to each side.

### Navigation
- **Jump links:** one row between two hairlines, after the Start here field. A muted "Areas:" label, then one link per area: a chip and the area name in ink, Archivo 500 at width 87.5%, no underline. On hover a hairline underline shows.
- **Back links (text pages):** in the masthead; see Text-page masthead.
- **Back link (capture journey page):** one back link, "← All viewers", in the masthead. A moved page has no back link.
- **Track (capture journey page):** a link to each stage; see Track.
- **Text links:** water blue with a soft underline (see Colors). Focus: a 2px water-blue outline with a 2px offset on every focusable element.

### Capture journey masthead
The text-page masthead with three parts: the estate mark, the back link ("← All viewers"), and the chapter line ("Chapter 1 of the capture journey", class `chapter`).
- **Chapter line:** Archivo 600 .82rem/1.25, width 87.5%, muted. It is .5rem below the back link in the narrow band and 1.25rem below it in the legend rail. It is in the masthead, not above the title: the craft floor bans an eyebrow above a heading.

### Capture journey head
- **Title:** the h1 in the display text-page style.
- **Subtitle:** muted, 1.15rem, `text-wrap: balance`.

### Track
One station for each stage, in one row, on a 1.5px ink line from the first station to the last. The track is an ordered list with the label "The stages".
- **Station:** a link to its stage. A 3.5rem square with a 1.5px ink border, a ground fill, and the ink icon of the stage (padding .7rem).
- **Number:** the number of the stage on an ink square (1.25rem high, 1.25rem or more wide) at the top right of the station. Archivo 600 .75rem, width 75%, tabular, in the ground color. It keeps its color in print.
- **Label:** the short name of the stage, under the station, in the center. Archivo 500 .9rem/1.25, width 87.5%, ink.
- **Hover:** the station fills with ink, and the icon takes the ground color. The label gets a hairline underline.
- **Narrow `main` (34rem or less):** rows of 3 stations, 1.25rem apart, with no line.

### Sticky bar
The bar shows the stage in view. A script updates it. Without JavaScript, the bar stays hidden. Screen readers do not read it (`aria-hidden`).
- **Box:** 2.5rem high, sticky at the top, across `main`: the ground with a hairline below. Its content aligns with the content column. On a wide screen it starts 1px right of the rail edge, so the rail-edge hairline stays in view.
- **Dots:** one .65rem square for each stage, .3rem apart, with a 1.5px ink border. A done stage has a muted fill and a muted border. The current stage has an ink fill (CanvasText in forced colors).
- **Text:** "N of 6: <stage>" in Archivo 600 .9rem/1.3, width 87.5%, tabular. It stays on one line. A long stage name ends in an ellipsis.
- **Print:** the bar does not print.

### State marks
A state shows by its mark, its label, and its state color together.
- **Tag:** the mark and the label ("Best guess" or "Not working today") in the state color. Archivo 600 .82rem/1.7, width 87.5%, inline, on one line.
- **Mark:** a .9em square before the label: a square with a hatch for a best guess, a square with a cross for not working. It is an SVG mask that the state color paints (`currentColor`). In forced colors it is CanvasText. In print it keeps its color (`print-color-adjust: exact`).
- **Flag:** a block in a stage: the tag, the text, and for not working the issue link or "No public issue yet." (muted). A 1px border in its state color, square, no fill, with a padding of .6rem .85rem. The issue link of a flag stays on one line.
- **Legend:** one paragraph for each state, in the intro: the tag and its meaning. Muted, .92rem, line height 1.5.

### Stage
- **Rule:** a 2px ink rule above the stage (as the text-page h2), with a padding of 1.5rem below it.
- **Layout:** the images and the text side by side (1 : 1.2). The text is in the wider column. A flipped stage (each second stage) mirrors the columns. A stage with no images is one column. In a narrow `main` (46rem or less), each stage is one column.
- **Stage number:** "Stage N of 6" after a small station icon (a 1.75rem square, 1.5px ink border, ink icon). Archivo 600 .82rem/1.2, width 87.5%, tabular, muted. It is a section number: the craft floor allows a number that carries the order.
- **Heading:** the h2 in the text-page headline style (660, 1.5rem).
- **Images:** the images lie on a plate in the surface color, with a padding of 1.25rem and a gap of 1rem, in the center. A phone screenshot is 150px wide, with a 1px inset outline in the ink edge color. A drawing is at most 26rem wide, with a hairline border. A caption is muted, .85rem/1.4, under its image, in the center. Two of the four SVG drawings in `docs/capture-journey/` are drawings in the site look: `bundle-chain.svg` (stage 3) and `reward.svg` (stage 6). A drawing in the site look holds the site color block and the drawing font block (see the Drawing Colors Rule and the Drawing Font Rule). It is 400 units wide. Its background is the surface. A step is a square box in the ground color with a 1.5 muted border. A step number is a 30-unit ink square with a ground numeral, as the station number of the track. A step has no color of its own: its words say who does it. A muted line with an arrow head joins two steps. A dashed box marks a step outside the Greenstand system (step 4 of the reward) and the older path (the bundle chain). The page shows a drawing 350px wide at a 1280px screen, 416px wide at 1024px, and 310px wide at 390px. The text copy on GitHub shows it 360px wide. `web-map-badges.svg` and `verify-page.svg` keep their own colors, because they show screens of Greenstand apps. They are not a rule source.
- **For developers:** a square `details` box with a hairline border and a padding of .25rem .9rem. The summary is Archivo 600 .92rem/1.6, width 87.5%, with a muted marker.

### Capture journey footer
A hairline above it and muted text. The hairline has a margin of 3rem above it and a padding of 1.25rem below it. The footer holds the next chapter, the image credits, and the link to the text copy.

### Moved page
The masthead holds only the estate mark: a moved page has no back link, because it adds no new link. One paragraph follows in the reading column: the former name, the new name, and the link. The inline code is on the surface (padding .1em .35em). A link and a code stay on one line.

## Do's and Don'ts

### Do:
- **Do** take every color from `BACKGROUNDS`, `TEXTS`, `STATES`, `LINES`, and `AREA_COLORS` in `site-colors.mjs`, as a [light, dark] pair, through the CSS custom properties of `siteStyle`.
- **Do** define every custom property that a page uses. `build-landing.mjs`, `render-md.mjs`, `build-capture-journey.mjs`, and `build-moved.mjs` fail when a page uses a custom property that nothing defines (`undefinedProperties` in `site-html.mjs`; the check skips scripts).
- **Do** let a page build fail when a file that the page loads is missing. `build-landing.mjs`, `render-md.mjs`, `build-capture-journey.mjs --site`, and `build-moved.mjs` check the files of the site look (`SITE_LOOK_FILES`: the font and the parcel field) and show every missing file at once. `render-md.mjs` also checks Mermaid for a page with a diagram.
- **Do** write the estate mark with `estateMark`, `areaGroup`, and `areaStyle` from `site-html.mjs`. On each page but the landing page, write the masthead with `masthead` and its style with `mastheadStyle`, which gives the estate mark its size. The landing page gives the estate mark its size in its own style.
- **Do** take the diagram colors from `site-colors.mjs` through the Mermaid `themeVariables`, and change the tint of a repo node only in `DIAGRAM_NODE_TINT`.
- **Do** give an element its area color with `--area: var(--c-<color>)`, from the `"color"` of its area in `estate.json`.
- **Do** put the ink edge (1px inset, 25% ink) on every area fill.
- **Do** keep text at 4.5:1 or more on the ground, on the surface, and on the parcel field in both schemes, and let `check-site-colors.mjs` prove it. Text may sit on the parcel field.
- **Do** change the strength of the parcel field only in `PARCEL_FIELD_INK_SHARE`, and keep the field at 1.25:1 or less with the ground.
- **Do** hide the parcel field and the rail-edge hairline in forced colors, with `prefers-contrast: more`, and in print.
- **Do** set headings, labels, and numerals in Archivo, and body text in the system sans.
- **Do** keep a strip cell at 24px or more wherever it is a link.
- **Do** turn off motion under `prefers-reduced-motion: reduce`.
- **Do** put a drawing of the capture journey in the site look, unless it shows a screen of a Greenstand app: the site color block, the drawing font block, and the 5 neutral colors only. Run `build-capture-journey.mjs` for the colors and `subset-drawing-font.py` for the font.

### Don't:
- **Don't** color text with an area color.
- **Don't** show a state by its state color alone.
- **Don't** use water blue for anything but links and the focus ring.
- **Don't** put an area color, a state color, or water blue in a drawing in the site look.
- **Don't** use a drop shadow, a gradient, a rounded corner, or leaf art. The one exception is the scroll shadows of a wide diagram (see the Flat Map Rule).
- **Don't** use the default look of Mermaid; it draws node shadows. Use the "classic" look.
- **Don't** add a Greenstand logo or Greenstand brand colors. The site has no binding Greenstand brand, and it shows no Greenstand logo until Greenstand approves one (PRODUCT.md).
- **Don't** load a font or another asset from a third-party host; vendor it and pin its hash.
- **Don't** put the parcel field under the content column. It belongs to the legend rail and the masthead only.
- **Don't** animate the parcel field.
- **Don't** add fills or a hatch to the parcel field. A hatch is the mark of a best guess.
- **Don't** show a real place or a capture in the parcel field, and do not call the field a map, a wallpaper, or a background illustration. It is decoration, not data.
