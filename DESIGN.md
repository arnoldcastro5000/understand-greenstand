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
  numeral:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 75"
  body:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Noto Sans\", sans-serif"
    fontSize: "16.5px"
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
  mono:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "0.86em"
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
---

# Design System: understand-greenstand site look

## Overview

**Creative North Star: "The Land-Cover Map"**

The site reads as a land-cover classification map of the code estate. Each area of repos is a land-cover class. Each class has one flat, muted area color. The snapshot commit is the scene date. The reader sees the whole estate in one estate strip, learns the area key, follows the numbered Start here path, and then finds a repo entry with its proof links.

The site look is calm and dense. The page is a mineral ground with evergreen-black ink. Hairline rules divide the content. The parcel field, the faint ink boundaries of made-up field parcels, lies behind the legend rail. It is decoration, not data. Apart from the link blue, the area colors are the only saturated colors on the page, and they fill shapes only. The pages follow the color scheme of the reader, so each color is a pair: one value for light, one value for dark (the `-dark` tokens). The site look refuses the GitHub-clone docs look (the former look) and the stock eco template: no leaf art, no gradients, no drop shadows, no Greenstand logo.

Scope of this record: the build moves only the landing page and the shared base to the site look. The shared base is the colors in `.github/scripts/site-colors.mjs`, `siteStyle` and `siteHead` in `.github/scripts/site-html.mjs`, and the parcel field (`.github/scripts/build-parcel-field.mjs` writes `art/parcel-field.svg`). Only the landing page shows the parcel field today. The text pages (`render-md.mjs`), the capture journey page (`capture-journey-page.mjs`), and the moved pages (`build-moved.mjs`) still show the former look (`BASE_STYLE`). Later work moves them, and a later pass brings this file up to date. `BASE_STYLE` is not a rule source.

**Key Characteristics:**
- A mineral ground, an ink text color, and water blue for links only, from one data module of [light, dark] pairs.
- Eight area colors (seven land-cover classes and ink for Start here) that fill cells, chips, and rules, never text.
- An ink edge on each area fill, so that pale fills stay visible on the ground.
- Archivo (a variable face with a width axis) for headings, labels, and numerals; the system sans for body text.
- Square corners, hairline rules, and no elevation.
- The parcel field: the faint, still ink boundaries of made-up field parcels under the legend rail on a wide screen and under the masthead on a phone. The content column stays plain.
- The estate strip as the signature: a picture on a phone, a row of links on a wider page, an upright legend in the legend rail on a wide screen.

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
- **Ink** (the `ink` text color, `--c-ink`): Start here. It is the same value as the text ink.

Area colors fill the estate strip cells, the estate mark cells, the area chips, the 3px top rule of each area section, and the 14% tint of a target repo entry. Readers with red-green color blindness can tell the area colors apart (see the Color-Blind Key Rule).

### Tertiary
The state colors (`STATES`). A state color is the color of a state. The state colors are text colors, and each one is for its state only.
- **Best-Guess Ochre** (`best-guess`): the state color of a best guess.
- **Not-Working Rose** (`not-working`): the state color of a part that does not work or is gone.

A state never shows by its state color alone: a best guess also has a hatch, and a part that does not work also has a cross. These tokens exist in the build, and CI checks them. No built page in the site look shows a state yet.

### Neutral
- **Mineral Ground** (`ground`): the page background, the `html` background, the browser bar color (`theme-color`), and the scrollbar track.
- **Field Surface** (`surface`): a field on the page. The Start here field uses it.
- **Evergreen-Black Ink** (`ink`): body text, headings, the jump links, the rail names, and the "you are here" outline.
- **Lichen Muted** (`muted`): secondary text: the Start here intro, the snapshot line, the "Go deeper" line, the path numerals, and the area keys in the legend rail.
- **Hairline** (`line`): 1px rules between entries, the masthead rule on narrow pages, the jump-link border, the rail-edge hairline (a fixed 1px rule at the edge of the legend rail on a wide screen), and the scrollbar thumb.
- **Ink Edge** (`edge`): a 1px inset outline in 25% ink on each area fill.
- **Ink Selection** (`selection`): the background of selected text, an 18% ink tint. Selected text stays ink.
- **Parcel Ink** (`parcel-field`): the color of the parcel field and of nothing else. It is the ink at an ink share of 11.5% in light mode and 9.1% in dark mode (`PARCEL_FIELD_INK_SHARE`), mixed with transparent in sRGB. The mask of the field takes this color, so one file serves light and dark.

### Named Rules
**The One Color, One Job Rule.** An area color marks its area and nothing else. It fills cells, chips, rules, and tints. It never colors text. Water blue is for links only. The state colors are for states only.

**The Two Backgrounds Rule.** Each text color has a contrast of 4.5:1 or more on each background (the ground and the surface), in light and in dark mode. `.github/scripts/check-site-colors.mjs` enforces it in CI. Add a new text color to `TEXTS` in `site-colors.mjs`, so that CI checks it.

**The State Apart Rule.** Each area color is 10 or more (CIE76) from each state color, in both schemes. CI enforces it. Thus an area color does not look like a state.

**The Color-Blind Key Rule.** Each two area colors are 10 or more apart (CIEDE2000), in both schemes, for normal vision and for simulated protanopia and deuteranopia (Machado 2009, severity 1). CI enforces it. A new area color must pass this check before a page uses it.

**The Ink Edge Rule.** Every area fill carries the ink edge (a 1px inset outline in 25% ink). Pale fills, for example Mixed Forest Sage, stay visible on the ground.

**The Faint Field Rule.** The parcel field at full mask has a contrast of 1.25:1 or less with the ground, so it stays in the background. Each text color has a contrast of 4.5:1 or more on the field, because the title and the estate strip lie on it. The ink share is above 0 and at most 100. `check-site-colors.mjs` enforces these rules in CI, in light and in dark mode. Today the field is 1.2489:1 (light) and 1.2480:1 (dark) to the ground. The weakest text on the field is best-guess at 4.64:1 and muted at 4.66:1, both in light mode. Change the strength of the field only in `PARCEL_FIELD_INK_SHARE`.

## Typography

**Display Font:** Archivo (with the system sans as the fallback)
**Body Font:** the system sans (`system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`)
**Label/Mono Font:** Archivo for labels; `ui-monospace, "SF Mono", Menlo, Consolas, monospace` for code and commit ids only

**Character:** Archivo is a grotesque with a width axis. It gives the headings and the legend labels the compact voice of a map key. The system sans keeps the body text plain and fast to load.

Archivo comes from the npm package `@fontsource-variable/archivo` 5.3.0, file `archivo-latin-wdth-normal.woff2` (weight 100 to 900, width 62% to 125%, SIL OFL 1.1). The deploy workflow pins the package by its SHA-512 and copies the file and its license to `vendor/archivo/`. Each page preloads it, and `font-display: swap` applies.

### Hierarchy
- **Display** (720, `clamp(2rem, 1.4rem + 2.6vw, 3.1rem)`, 1.15, -0.025em): the site title in the masthead. In the legend rail it is 1.95rem with a line height of 1.02. Below 30rem it takes a width of 78% and -0.02em.
- **Headline** (660, 1.45rem, 1.15): the heading of an area section. The Start here heading is 680 and 1.55rem.
- **Title** (640, 1.12rem, 1.3): the name link of a repo entry. In the Start here path it is 1.18rem.
- **Numeral** (600, 1.7rem, 1, width 75%, tabular figures, muted): the step number of the Start here path.
- **Body** (400, 16.5px, 1.62): all running text. The lede and the volunteer line are 1.06rem in a 42rem column. Entry descriptions stop at 40rem. Small text (0.92rem) carries the entry links, the snapshot line, and the "Go deeper" line.
- **Label** (600, 0.82rem, 1.2, width 87.5%): the area keys in the legend rail (muted) and the repo name that shows on hover or focus over a strip cell (ink). The rail names are 500 at 0.9rem; the jump links are 500 at 0.98rem; both have a width of 87.5%.
- **Mono** (0.86em): commit ids and former repo names.

### Named Rules
**The Two Voices Rule.** Archivo sets headings, labels, and numerals. The system sans sets the body text. Monospace sets code and commit ids only.

**The Narrow Label Rule.** Archivo labels use a width of 87.5%. Numerals use a width of 75%. The full width is for headings. Headings use `text-wrap: balance`.

## Layout

The landing page has three layouts.

- **Narrow masthead (below the links width):** the masthead holds the title and the estate mark across the page, over a 1px hairline. One column follows. The page margin is 1.25rem. The parcel field lies under the masthead only, inside its padding box.
- **Links width and more:** the estate strip replaces the estate mark, and its cells are links. The rule is a container query on the masthead (`container: masthead / inline-size`), so the page margins, the default font size, and a scroll bar do not change it. The build computes the links width from the repo counts: it is the narrowest strip where each cell of the area with the most repos can be 24px wide (WCAG 2.2 target size), with the 2px gaps in an area (`CELL_GAP`) and the 6px gaps between areas (`AREA_GAP`). Today it is a strip of 422px (a page of 462px at a 16px default font size). The value changes when the repo counts change.
- **Wide screen (64rem and more):** the body is a grid of a 17.5rem legend rail and a content column. The legend rail is sticky at the top, holds the title and the upright estate strip, and scrolls on its own in a short window (`max-height: 100vh`). The legend rail always shows the links and never the estate mark, at any repo count. The content column is at most 50rem, with a side padding of `clamp(1.5rem, 4vw, 4.5rem)`. The parcel field lies under the legend rail, and the rail-edge hairline marks the edge of the rail. The rail width is `--rail` (17.5rem).

The content column (the reading column) stays plain on all screens: the parcel field never lies under it. `site-html.mjs` holds the two media queries: `WIDE` (`(min-width: 64rem)`) and `NARROW` (`not all and (min-width: 64rem)`). `NARROW` is the exact opposite of `WIDE`, so no width falls between them. `build-landing.mjs` uses `WIDE` and `var(--rail)` for its grid.

The content column holds, in order: the lede, the volunteer line, the Start here field, the jump links, and one area section for each other area. Area sections are 3rem apart. Repo entries are one column, divided by hairlines, with 0.85rem above and 1.1rem below. The Start here path puts its numbers in a 2.75rem margin number column. Anchors have a scroll margin of 1.5rem.

Difference from the direction contract: the contract FORM names a dense two-column repo register on wide screens; the build has one column of repos, because the legend rail layout keeps the register to one column (FIRST VIEWPORT and the surface brief). The build wins.

### Named Rules
**The 24 px Target Rule.** A strip cell is a link only where it can be 24px wide. Below that width, the strip is the estate mark: a picture with no links and no words, hidden from screen readers. Do not hard-code the width; compute it from the repo counts and test it on the masthead container, not on the page. In the legend rail each row is at least `max(1.5rem, 24px)` high, so the rail always has links.

## Elevation & Depth

The site look is flat. It has no drop shadows, no gradients, and no layered cards. Depth comes from tone only: the surface field is one step darker than the ground in light mode (one step lighter in dark mode). The only `box-shadow` in the system is the 1px inset ink edge on area fills; it is an outline, not an elevation.

The parcel field is not an elevation either. It is a still ink layer behind the page: it lies under the content (z-index -1), it takes no pointer events, and it has no shadow and no gradient. The ground is on `html`, and `body` has no background, so the field lies between the ground and the page.

Motion is small and has one job: it shows which cell is under the pointer or the keyboard focus. The color block of a strip cell moves 4px up (3px right in the legend rail) in 0.25s with `cubic-bezier(.16, 1, .3, 1)`. The hover label fades in 0.15s. `prefers-reduced-motion: reduce` turns off both transitions. The parcel field has no motion. Its layer on a wide screen is 100lvh high (100vh where the browser does not know `lvh`), so the layer does not change its size when a browser shows or hides its toolbar.

### Named Rules
**The Flat Map Rule.** Surfaces are flat at all times. Use tone (the surface) and hairlines for structure. Use no drop shadow and no gradient. The parcel field is a flat ink layer behind the page, not a surface above it.

## Shapes

All corners are square (radius 0). Area fills are plain rectangles: strip cells, mark cells, and chips (0.8em squares). Rules are straight: 1px hairlines between entries, around the jump links, and at the edge of the legend rail, and a 3px rule in the area color above each area section. The parcel field has two marks only: straight boundaries with round joins, and round points in rows. The Start here field has no border; its surface tone sets it apart.

## Components

### Estate strip (signature)
One cell per repo, grouped by area, in the area colors. Each group takes a width in proportion to its repo count.
- **Cells:** flat area fill with the ink edge, 2px apart in an area, 6px between areas. Height `clamp(2rem, 1.3rem + 2.4vw, 3.25rem)`.
- **Links:** each cell links to its repo entry. On hover or keyboard focus, the color block moves up and the repo name shows below the strip in the label style.
- **In the legend rail:** the strip stands upright. Each group has its area name (the key, muted label) above it. Each row is a 1rem color block and the repo name; a row is at least `max(1.5rem, 24px)` high. The legend rail always shows the strip, never the estate mark. On hover the block moves right and the name gets a hairline underline.
- **You are here:** the row or cell of the repo entry that the address points to gets a 2px ink outline with a 2px offset.

### Estate mark
The estate strip as a picture: the same groups and cells, with no links and no words, and `aria-hidden`. Where the masthead is narrower than the links width, it replaces the estate strip. It never shows in the legend rail.

### Parcel field
The background of the site look: the boundaries of made-up field parcels, seen from above, in parcel ink. About one parcel in five has rows of points (planting rows). The field is decoration, not data: no parcel is a real place or a capture.
- **Source:** `build-parcel-field.mjs` draws the field from a fixed seed (20261103) into `art/parcel-field.svg` (1600 x 1000, `preserveAspectRatio="xMidYMid slice"`). Each run writes the same file, byte for byte. The deploy workflow runs it, and `build-landing.mjs` fails when the file is missing.
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
- **Content:** the Start here heading (no chip, no rule), the intro in muted, and an ordered list of steps with muted Archivo numerals in the margin number column. The "Go deeper" line aligns with the step text.

### Area section and repo register
- **Rule:** a 3px top rule in the area color, then the chip and the heading.
- **Entry:** the repo name as a title link, a description, and one small line with the five page links (separated by " · ") at the left and the snapshot with its commit id at the right.
- **Target:** the target entry gets a 14% tint of its area color and extends 1rem to each side.

### Navigation
- **Jump links:** one row between two hairlines, after the Start here field. A muted "Areas:" label, then one link per area: a chip and the area name in ink, Archivo 500 at width 87.5%, no underline. On hover a hairline underline shows.
- **Text links:** water blue with a soft underline (see Colors). Focus: a 2px water-blue outline with a 2px offset on every focusable element.

### Decided, not built yet
These parts are decided in the direction contract but are not in the build. They are not part of the system until a build ships them:
- Diagram nodes of a repo in a 30% tint of its area color, with a full-strength border, on a surface plate.
- The legend rail of the text pages, with the back link and a small estate mark.
- The capture journey page in the land-cover palette: an ink track, ochre with a hatch for a best guess, rose with a cross for a part that does not work. The state colors already exist as tokens.

## Do's and Don'ts

### Do:
- **Do** take every color from `BACKGROUNDS`, `TEXTS`, `STATES`, `LINES`, and `AREA_COLORS` in `site-colors.mjs`, as a [light, dark] pair, through the CSS custom properties of `siteStyle`.
- **Do** define every custom property that a page uses. `build-landing.mjs` fails when the page uses a custom property that nothing defines.
- **Do** give an element its area color with `--area: var(--c-<color>)`, from the `"color"` of its area in `estate.json`.
- **Do** put the ink edge (1px inset, 25% ink) on every area fill.
- **Do** keep text at 4.5:1 or more on the ground, on the surface, and on the parcel field in both schemes, and let `check-site-colors.mjs` prove it. Text may sit on the parcel field.
- **Do** change the strength of the parcel field only in `PARCEL_FIELD_INK_SHARE`, and keep the field at 1.25:1 or less with the ground.
- **Do** hide the parcel field and the rail-edge hairline in forced colors, with `prefers-contrast: more`, and in print.
- **Do** set headings, labels, and numerals in Archivo, and body text in the system sans.
- **Do** keep a strip cell at 24px or more wherever it is a link.
- **Do** turn off motion under `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** color text with an area color.
- **Don't** show a state by its state color alone.
- **Don't** use water blue for anything but links and the focus ring.
- **Don't** use a drop shadow, a gradient, a rounded corner, or leaf art.
- **Don't** add a Greenstand logo or Greenstand brand colors. The site has no binding Greenstand brand, and it shows no Greenstand logo until Greenstand approves one (PRODUCT.md).
- **Don't** load a font or another asset from a third-party host; vendor it and pin its hash.
- **Don't** take a value from `BASE_STYLE`; it is the former look.
- **Don't** put the parcel field under the content column. It belongs to the legend rail and the masthead only.
- **Don't** animate the parcel field.
- **Don't** add fills or a hatch to the parcel field. A hatch is the mark of a best guess.
- **Don't** show a real place or a capture in the parcel field, and do not call the field a map, a wallpaper, or a background illustration. It is decoration, not data.
