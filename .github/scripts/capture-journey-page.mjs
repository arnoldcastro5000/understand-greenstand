// The illustrated page of the capture journey on the Pages site (capture-journey.html): its style,
// its script, and its render. It also holds the parts that the page and the text copy share: the
// icons of the stages, the flags, and the credit line of the images. No CLI:
// build-capture-journey.mjs checks the data file, makes the view (the data with its links), and
// writes the page with --site. The page is in the site look (site-html.mjs, DESIGN.md).
import { plural } from "./estate.mjs";
import { READING_COLUMN, WIDE, esc, masthead, mastheadStyle, siteHead, siteStyle } from "./site-html.mjs";

// The icons of the stages: the inside of an SVG with the view box 0 0 48 48, drawn with lines.
export const ICONS = {
  phone: '<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M21 38h6"/>',
  upload: '<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M24 30V14M18 20l6-6 6 6"/>',
  chain: '<rect x="4" y="18" width="12" height="12" rx="2"/><rect x="18" y="18" width="12" height="12" rx="2"/><rect x="32" y="18" width="12" height="12" rx="2"/><path d="M16 24h2M30 24h2"/>',
  record: '<ellipse cx="24" cy="12" rx="14" ry="5"/><path d="M10 12v22c0 3 6 5 14 5s14-2 14-5V12M10 23c0 3 6 5 14 5s14-2 14-5"/>',
  verify: '<rect x="8" y="8" width="32" height="32" rx="6"/><path d="M16 24l6 6 11-12"/>',
  reward: '<circle cx="24" cy="24" r="16"/><path d="M24 14v20M29 18c-1-2-3-3-5-3-3 0-5 2-5 4s2 3 5 4 5 2 5 4-2 4-5 4c-2 0-4-1-5-3"/>',
};

// The flags of a stage, in the order of the legend: the label on the page and in the text copy,
// and the class of the page. A flag with an issue names its public issue, or says that there is
// none yet. The legend of the data file explains each flag once.
export const FLAGS = {
  guess: { label: "Best guess", class: "guess", issue: false },
  broken: { label: "Not working today", class: "broken", issue: true },
};
export const NO_ISSUE = "No public issue yet.";

// The credit line of the images that come from other repos: one part for each repo, commit, and
// license, in the order of the images. format turns a repo, a commit, and a data text into the
// output (Markdown or HTML). Null when every image was made for this page.
export function creditText({ groups, own }, format) {
  if (!groups.length) return null;
  const parts = groups.map((g) => `${plural(g.count, "image")} from ${format.repo(g)} at commit ${format.commit(g)} (license ${format.text(g.license)})`);
  return `Image credits: ${parts.join("; ")}.${own ? " The other images are from this docs repo." : ""}`;
}

// Data text in HTML: a pair of straight double quotes becomes curly quotes, then HTML escapes.
const htmlText = (s) => esc(s.replace(/"([^"]+)"/g, "“$1”"));

// A title in HTML: as data text, and "the", "a", or "an" stays on the line of the next word (a
// no-break space), so no line of a title ends with one of them.
const titleText = (s) => htmlText(s).replace(/(^|\s)(the|a|an) (?=\S)/gi, "$1$2&nbsp;");

const icon = (name, size) =>
  `<svg class="icon" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

// The content column of the page: the stages put the images and the text side by side in it.
// Running text outside the stages stays in the reading column (READING_COLUMN).
const COLUMN = "58rem";

// The marks of the states (DESIGN.md): a square with a hatch for a best guess, a square with a
// cross for a part that does not work. Each one is a mask that the state color paints, so a state
// never shows by its color alone.
const stateMark = (lines) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="#000" stroke-width="1.2"><rect x=".6" y=".6" width="10.8" height="10.8"/><path d="${lines}"/></svg>`)}")`;
const HATCH = stateMark("M.6 6.6l6-6M.6 11.4L11.4.6M5.4 11.4l6-6");
const CROSS = stateMark("M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6");

// The page rules after siteStyle and mastheadStyle (site-html.mjs). The colors come from
// site-colors.mjs: the track, its stations, and the icons are ink; a best guess has the best-guess
// color and the hatch; a part that does not work has the not-working color and the cross. The
// layout of the stages follows the width of main (a container query), not of the screen, because
// the legend rail takes a part of a wide screen.
const PAGE_STYLE = `  /* A long word breaks anywhere, so no text makes the page wider than the screen. Code (a repo
     name, a file name, a commit) stays on one line: a reader copies it. */
  body { overflow-wrap: anywhere; }
  .masthead .chapter { margin: .5rem 0 0; font: 600 .82rem/1.25 var(--display); font-stretch: 87.5%; color: var(--muted); }
  main { --pad: 1.25rem; container-type: inline-size; padding: 1.25rem var(--pad) 5rem; }
  main > * { box-sizing: border-box; max-width: ${COLUMN}; margin-inline: auto; }
  p, ul { margin-block: 0 1rem; }
  code { padding: .1em .35em; background: var(--surface); white-space: nowrap; }
  img { max-width: 100%; height: auto; }
  .muted { color: var(--muted); }
  .icon { display: block; }
  .hero h1 { margin: 1.5rem 0 .6rem; font-size: clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem); font-weight: 720;
    letter-spacing: -.02em; }
  .sub { margin: 0; font-size: 1.15rem; color: var(--muted); text-wrap: balance; }
  /* The track: one station for each stage on an ink line. */
  .track { position: relative; display: grid; grid-template-columns: repeat(var(--stages), minmax(0, 1fr)); gap: .5rem;
    list-style: none; margin: 2.25rem 0 1.5rem; padding: 0; }
  .track::before { content: ""; position: absolute; left: calc(50% / var(--stages)); right: calc(50% / var(--stages));
    top: calc(1.75rem - .75px); border-top: 1.5px solid var(--ink); }
  .track a { position: relative; display: flex; flex-direction: column; align-items: center; gap: .5rem;
    color: var(--ink); text-decoration: none; }
  .track .icon { width: 3.5rem; height: 3.5rem; padding: .7rem; box-sizing: border-box; border: 1.5px solid var(--ink);
    background: var(--ground); color: var(--ink); }
  .track a:hover .icon { background: var(--ink); color: var(--ground); }
  .track a:hover .l { text-decoration: underline; text-decoration-color: var(--line); }
  .n { position: absolute; top: -.45rem; left: calc(50% + 1.3rem); min-width: 1.25rem; height: 1.25rem; padding: 0 .2rem;
    box-sizing: border-box; background: var(--ink); color: var(--ground); text-align: center;
    font: 600 .75rem/1.25rem var(--display); font-stretch: 75%; font-variant-numeric: tabular-nums;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .l { font: 500 .9rem/1.25 var(--display); font-stretch: 87.5%; text-align: center; }
  /* The sticky bar is 2.5rem high, across main. A stage that a link opens stops under it, so the
     ink rule of the stage shows under the hairline of the bar. On a wide screen the bar starts 1px
     right of the edge of the legend rail, so the hairline at that edge stays in view. */
  .progress { display: none; position: sticky; top: 0; z-index: 5; align-items: center; gap: .75rem;
    height: 2.5rem; box-sizing: border-box; max-width: none; margin-inline: calc(-1 * var(--pad));
    padding-inline: calc(var(--pad) + max(0px, (100% - ${COLUMN}) / 2));
    background: var(--ground); border-bottom: 1px solid var(--line); }
  .js .progress { display: flex; }
  .dots { display: flex; flex: none; gap: .3rem; }
  .dots span { width: .65rem; height: .65rem; box-sizing: border-box; border: 1.5px solid var(--ink); }
  .dots span.done { background: var(--muted); border-color: var(--muted); }
  .dots span.on { background: var(--ink); }
  /* A long stage name stays on one line in the bar: its end gives way to an ellipsis. */
  .now { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
    font: 600 .9rem/1.3 var(--display); font-stretch: 87.5%; font-variant-numeric: tabular-nums; }
  .intro { padding-top: 1.5rem; }
  .intro > p, .next > p { max-width: ${READING_COLUMN}; }
  .legend { margin-block: .5rem; font-size: .92rem; line-height: 1.5; color: var(--muted); }
  /* A tag is inline, so find-in-page matches a phrase across the tag and the text after it. The
     mark of its state comes before its label. */
  .tag { display: inline; font: 600 .82rem/1.7 var(--display); font-stretch: 87.5%; white-space: nowrap; }
  .tag::before { content: ""; display: inline-block; width: .9em; height: .9em; margin-right: .4em; vertical-align: -.1em;
    background-color: currentColor; -webkit-mask: var(--state-mark) center / 100% 100% no-repeat;
    mask: var(--state-mark) center / 100% 100% no-repeat; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .tag.guess, .flag.guess .tag { --state-mark: ${HATCH}; color: var(--best-guess); }
  .tag.broken, .flag.broken .tag { --state-mark: ${CROSS}; color: var(--not-working); }
  @media (forced-colors: active) {
    .tag::before, .dots span.on { forced-color-adjust: none; background-color: CanvasText; } }
  /* The sticky bar follows the screen: it does not print. */
  @media print { .js .progress { display: none; } }
  .flag { margin: 1rem 0; padding: .6rem .85rem; border: 1px solid; }
  .flag.guess { border-color: var(--best-guess); }
  .flag.broken { border-color: var(--not-working); }
  /* The issue of a flag (a repo name and a number) stays on one line. */
  .flag a { white-space: nowrap; }
  /* The text has the wider column on both sides: a flipped stage mirrors the columns. */
  .stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 1.5rem 2.5rem; align-items: start;
    margin-top: 3rem; padding-top: 1.5rem; border-top: 2px solid var(--ink); scroll-margin-top: 2.5rem; }
  .stage.flip { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
  .stage.flip .media { order: 2; }
  .stage.no-media { grid-template-columns: minmax(0, 1fr); }
  .stage h2 { margin: .6rem 0 .9rem; font-size: 1.5rem; font-weight: 660; }
  .num { display: flex; align-items: center; gap: .55rem; margin: 0; font: 600 .82rem/1.2 var(--display);
    font-stretch: 87.5%; font-variant-numeric: tabular-nums; color: var(--muted); }
  .num .icon { width: 1.75rem; height: 1.75rem; padding: .3rem; box-sizing: border-box; border: 1.5px solid var(--ink);
    color: var(--ink); }
  /* The images of a stage lie on a plate in the surface color. */
  .media { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; padding: 1.25rem; background: var(--surface); }
  figure { margin: 0; text-align: center; }
  figure img { display: block; width: 100%; box-sizing: border-box; }
  figure.phone { width: 150px; }
  figure.phone img { outline: 1px solid var(--edge); outline-offset: -1px; }
  figure.drawing { width: 100%; max-width: 26rem; }
  figure.drawing img { border: 1px solid var(--line); }
  figcaption { margin-top: .5rem; font-size: .85rem; line-height: 1.4; color: var(--muted); text-wrap: balance; }
  details.dev { margin: 1.25rem 0 0; padding: .25rem .9rem; border: 1px solid var(--line); font-size: .92rem; }
  details.dev summary { padding-block: .2rem; cursor: pointer; font: 600 .92rem/1.6 var(--display); font-stretch: 87.5%; }
  details.dev summary::marker { color: var(--muted); }
  details.dev ul { margin: .5rem 0; padding-left: 1.2rem; }
  details.dev li { margin-block: .3rem; }
  details.dev p { margin: .4rem 0 0; }
  .next { margin-top: 3rem; padding-top: 1.25rem; border-top: 1px solid var(--line); color: var(--muted); }
  @media ${WIDE} {
    main { --pad: clamp(1.5rem, 4vw, 4.5rem); }
    main > * { margin-inline: 0; }
    .progress { margin-left: calc(1px - var(--pad)); padding-inline: calc(var(--pad) - 1px) var(--pad); }
    .masthead .chapter { margin-top: 1.25rem; }
  }
  @container (max-width: 46rem) {
    .stage, .stage.flip { grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
    .stage.flip .media { order: 0; }
  }
  @container (max-width: 34rem) {
    .track { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 1.25rem; }
    .track::before { display: none; }
    figure.phone { width: 130px; }
  }
  /* On the narrowest phones a long code (a file name) can break, so it stays in its box. */
  @container (max-width: 20rem) {
    details.dev code { white-space: normal; }
  }`;

// The script of the page: the sticky progress bar follows the stage in view. Without JavaScript the
// bar stays hidden (the "js" class) and every word of the page shows. String concatenation only:
// this text is inside a template literal.
const PAGE_SCRIPT = `const stages = [...document.querySelectorAll("section.stage")];
const dots = [...document.querySelectorAll(".progress .dots span")];
const now = document.querySelector(".progress .now");
const bar = document.querySelector(".progress");
function update() {
  // The current stage: the last stage that starts at the bottom line of the bar or above it. At the
  // end of the page, a last stage that is too short to reach the bar is current when it starts in
  // the top half of the screen.
  const line = bar.getBoundingClientRect().bottom + 1;
  let current = 0;
  stages.forEach((s, i) => {
    if (s.getBoundingClientRect().top <= line) current = i;
  });
  const end = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
  const last = stages.length - 1;
  if (end && stages[last].getBoundingClientRect().top < innerHeight * 0.5) current = last;
  dots.forEach((d, i) => {
    d.classList.toggle("on", i === current);
    d.classList.toggle("done", i < current);
  });
  now.textContent = (current + 1) + " of " + stages.length + ": " + stages[current].dataset.short;
}
addEventListener("scroll", update, { passive: true });
addEventListener("resize", update);
update();`;

function figureHtml(image, imageDir) {
  return `<figure class="${image.frame === "phone" ? "phone" : "drawing"}"><img src="${imageDir}/${esc(image.file)}" width="${image.width}" height="${image.height}" alt="${htmlText(image.alt)}" loading="lazy"><figcaption>${htmlText(image.caption)}</figcaption></figure>`;
}

function flagHtml(flag) {
  const { label, class: kind, issue } = FLAGS[flag.kind];
  const named = !issue ? "" : flag.issue ? ` <a href="${flag.issue.url}">${esc(flag.issue.label)}</a>` : ` <span class="muted">${NO_ISSUE}</span>`;
  return `<p class="flag ${kind}"><span class="tag">${label}</span> ${htmlText(flag.text)}${named}</p>`;
}

// A repo of the estate links to its viewer and its onboarding guide (relative links on the Pages
// site); a repo outside the estate links to GitHub.
function repoHtml(dev) {
  if (dev.github) return `<a href="${dev.github}"><code>${esc(dev.repo)}</code></a> (outside the docs repo)`;
  return `<code>${esc(dev.repo)}</code> (<a href="./${esc(dev.site)}">viewer</a>, <a href="./${esc(dev.site)}onboarding.html">onboarding guide</a>)`;
}

function developersHtml(stage, legend) {
  const items = stage.developers.map((dev) => {
    const files = dev.files.map((file) => `<li><a href="${esc(file.url)}"><code>${esc(file.name)}</code> ${file.lines}</a>: ${htmlText(file.what)}</li>`);
    return `<li>${repoHtml(dev)}${dev.what ? `: ${htmlText(dev.what)}` : ""}${files.length ? `\n<ul>\n${files.join("\n")}\n</ul>` : ""}</li>`;
  });
  return [`<details class="dev"><summary>For developers</summary>`, `<p class="muted">${htmlText(legend.dev)}</p>`, "<ul>", ...items, "</ul>", "</details>"].join("\n");
}

function stageHtml(stage, i, view) {
  const classes = ["stage", ...(i % 2 ? ["flip"] : []), ...(stage.images.length ? [] : ["no-media"])].join(" ");
  return [
    `<section id="${stage.id}" class="${classes}" data-short="${htmlText(stage.short)}">`,
    ...(stage.images.length ? [`<div class="media">${stage.images.map((image) => figureHtml(image, view.imageDir)).join("")}</div>`] : []),
    '<div class="text">',
    `<p class="num">${icon(stage.icon, 22)} Stage ${i + 1} of ${view.stages.length}</p>`,
    `<h2>${titleText(stage.title)}</h2>`,
    ...stage.story.map((p) => `<p>${htmlText(p)}</p>`),
    ...stage.flags.map(flagHtml),
    ...(stage.note ? [`<p class="note">${htmlText(stage.note)}</p>`] : []),
    developersHtml(stage, view.legend),
    "</div>",
    "</section>",
  ].join("\n");
}

// The page of a view. copyUrl is the link to the text copy on GitHub, or null. areas are the areas
// of estate.json, for the estate mark. The page is at the root of the site.
export function pageHtml(view, copyUrl, areas) {
  const credit = creditText(view.credits, {
    repo: (g) => `<a href="${g.repoUrl}"><code>${esc(g.repo)}</code></a>`,
    commit: (g) => `<a href="${g.commitUrl}"><code>${esc(g.commit)}</code></a>`,
    text: htmlText,
  });
  const legend = Object.entries(FLAGS)
    .map(([kind, flag]) => `<p class="legend"><span class="tag ${flag.class}">${flag.label}</span> ${htmlText(view.legend[kind])}</p>`)
    .join("\n");
  const first = view.stages[0];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${htmlText(view.title)}</title>
<meta name="description" content="${htmlText(`Chapter ${view.chapter}: ${view.subtitle}`)}">
${siteHead(".")}
<style>
${siteStyle(".")}
${mastheadStyle(COLUMN)}
${PAGE_STYLE}
</style>
<script>document.documentElement.classList.add("js");</script>
</head>
<body>
${masthead(areas, `<nav><a href="./">&larr; All viewers</a></nav>\n<p class="chapter">Chapter ${view.chapter} of the capture journey</p>`)}
<main>
<header class="hero">
<h1>${titleText(view.title)}</h1>
<p class="sub">${htmlText(view.subtitle)}</p>
<ol class="track" aria-label="The stages" style="--stages: ${view.stages.length}">
${view.stages.map((s, i) => `<li><a href="#${s.id}">${icon(s.icon, 40)}<span class="n">${i + 1}</span><span class="l">${htmlText(s.short)}</span></a></li>`).join("\n")}
</ol>
</header>
<div class="progress" aria-hidden="true"><span class="dots">${view.stages.map(() => "<span></span>").join("")}</span><span class="now">1 of ${view.stages.length}: ${htmlText(first.short)}</span></div>
<section class="intro">
${view.intro.map((p) => `<p>${htmlText(p)}</p>`).join("\n")}
${legend}
</section>
${view.stages.map((stage, i) => stageHtml(stage, i, view)).join("\n")}
<footer class="next">
<p><strong>Next:</strong> ${htmlText(view.next)}</p>${credit ? `\n<p class="credit">${credit}</p>` : ""}${copyUrl ? `\n<p class="copy"><a href="${copyUrl}">Read the text copy of this page on GitHub</a></p>` : ""}
</footer>
</main>
<script type="module">
${PAGE_SCRIPT}
</script>
</body>
</html>
`;
}
