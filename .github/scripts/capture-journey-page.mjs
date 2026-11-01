// The illustrated page of the capture journey on the Pages site (capture-journey.html): its style,
// its script, and its render. It also holds the parts that the page and the text copy share: the
// icons of the stages, the flags, and the credit line of the images. No CLI:
// build-capture-journey.mjs checks the data file, makes the view (the data with its links), and
// writes the page with --site.
import { plural } from "./estate.mjs";
import { BASE_STYLE, esc } from "./site-html.mjs";

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

// The page rules after BASE_STYLE (site-html.mjs). The text colors meet WCAG AA (4.5:1) on their
// backgrounds in light and dark mode; --accent is for lines and icons only.
const PAGE_STYLE = `  :root { --soft: #f6f8fa; --accent: #4c9a2a; --accent-text: #2b6b1a; --amber: #7d5300;
    --amberbg: #fff8c5; --red: #b31d28; --redbg: #ffebe9; --frame: #1b1f24; }
  @media (prefers-color-scheme: dark) { :root { --soft: #161b22; --accent: #57ab5a; --accent-text: #6bc46d;
    --amber: #e3b341; --amberbg: #272115; --red: #ff7b72; --redbg: #2d1619; --frame: #30363d; } }
  /* A long word breaks anywhere, so no text makes the page wider than the screen. Code (a repo
     name, a file name, a commit) stays on one line: a reader copies it. */
  body { max-width: 52rem; padding: 1.5rem 1.25rem 4rem; overflow-wrap: anywhere; }
  h1, h2 { line-height: 1.25; }
  h1 { text-wrap: balance; }
  h2 { text-wrap: pretty; }
  /* The code of this page is a repo name, a file name, or a commit: it stays on one line. */
  code { background: rgba(175,184,193,.2); padding: .15em .35em; border-radius: 5px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .88em; white-space: nowrap; }
  img { max-width: 100%; height: auto; }
  .muted { color: var(--muted); }
  .icon { display: block; }
  nav.top { display: flex; gap: 1rem; padding-bottom: 1rem; margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--line); font-size: .9rem; }
  .hero { text-align: center; padding: 1rem 0 .5rem; }
  .kicker { margin: 0; font-size: .85rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
    color: var(--accent-text); }
  .hero h1 { margin: .3rem 0 .2rem; font-size: 2.3rem; }
  .sub { margin: 0; font-size: 1.15rem; color: var(--muted); text-wrap: balance; }
  .track { position: relative; display: grid; grid-template-columns: repeat(var(--stages), minmax(0, 1fr)); gap: .5rem;
    list-style: none; margin: 2rem 0 1rem; padding: 0; }
  .track::before { content: ""; position: absolute; left: 8%; right: 8%; top: 31px;
    border-top: 2px dashed var(--accent); opacity: .6; }
  .track a { position: relative; display: flex; flex-direction: column; align-items: center; gap: .3rem;
    color: var(--fg); }
  .track a:hover { text-decoration: none; }
  .track a:hover .l { text-decoration: underline; }
  .track .icon { width: 62px; height: 62px; padding: 10px; border: 2px solid var(--accent); border-radius: 50%;
    background: var(--bg); color: var(--accent-text); box-sizing: border-box; }
  .track a:hover .icon, .track a:focus-visible .icon { background: var(--accent-text); color: var(--bg); }
  .n { position: absolute; top: -4px; left: calc(50% + 18px); min-width: 1.3rem; height: 1.3rem;
    border-radius: 999px; background: var(--accent-text); color: var(--bg); text-align: center;
    font: 700 .75rem/1.3rem system-ui, sans-serif; }
  .l { font-size: .85rem; line-height: 1.25; text-align: center; }
  /* The sticky bar is 2.5rem high. A stage that a link opens stops 1px higher, so its top line
     lies on the line of the bar: one line, not two. */
  .progress { display: none; position: sticky; top: 0; z-index: 5; align-items: center; gap: .75rem;
    height: 2.5rem; box-sizing: border-box; margin: 0 -1.25rem; padding: 0 1.25rem;
    background: var(--bg); border-bottom: 1px solid var(--line); }
  .js .progress { display: flex; }
  .dots { display: flex; gap: .4rem; }
  .dots span { width: .7rem; height: .7rem; border-radius: 50%; border: 2px solid var(--accent); box-sizing: border-box; }
  .dots span.done { background: var(--accent); opacity: .45; }
  .dots span.on { background: var(--accent); }
  .now { font-size: .9rem; font-weight: 600; }
  .legend { line-height: 2.1; font-size: .9rem; color: var(--muted); }
  /* A tag is inline, so find-in-page matches a phrase across the tag and the text after it. */
  .tag { display: inline; padding: .1em .55rem; border-radius: 999px; font: 600 .75rem/1.7 system-ui, sans-serif;
    white-space: nowrap; border: 1px solid currentColor; -webkit-box-decoration-break: clone;
    box-decoration-break: clone; }
  .tag.guess, .flag.guess .tag { background: var(--amberbg); color: var(--amber); }
  .tag.broken, .flag.broken .tag { background: var(--redbg); color: var(--red); }
  .flag { padding: .6rem .8rem; border-radius: 8px; margin: 1rem 0; }
  .flag.guess { background: var(--amberbg); }
  .flag.broken { background: var(--redbg); }
  /* The text has the wider column on both sides: a flipped stage mirrors the columns. */
  .stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 2rem; align-items: start;
    padding: 2.5rem 0; border-top: 1px solid var(--line); scroll-margin-top: calc(2.5rem - 1px); }
  .stage.flip { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
  .stage.flip .media { order: 2; }
  .stage.no-media { grid-template-columns: minmax(0, 1fr); }
  .stage h2 { border: 0; padding: 0; margin: .3rem 0 .75rem; font-size: 1.45rem; }
  .media { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
  .num { display: flex; align-items: center; gap: .4rem; margin: 0; font-size: .85rem; font-weight: 600;
    color: var(--accent-text); }
  figure { margin: 0; text-align: center; }
  figure.phone { width: 150px; }
  figure.phone img { display: block; width: 100%; border: 6px solid var(--frame); border-radius: 20px;
    box-sizing: border-box; }
  figure.drawing { width: 100%; max-width: 26rem; }
  figure.drawing img { display: block; width: 100%; border: 1px solid var(--line); border-radius: 12px;
    box-sizing: border-box; }
  figcaption { margin-top: .4rem; font-size: .8rem; color: var(--muted); }
  details.dev { border: 1px solid var(--line); border-radius: 8px; padding: .35rem .9rem; margin: 1rem 0;
    font-size: .9rem; }
  details.dev summary { cursor: pointer; font-weight: 600; }
  details.dev ul { padding-left: 1.2rem; margin: .5rem 0; }
  details.dev p { margin: .4rem 0 0; }
  .next { padding: 2rem 0 0; border-top: 1px solid var(--line); color: var(--muted); }
  @media (max-width: 760px) {
    .stage, .stage.flip { grid-template-columns: minmax(0, 1fr); gap: 1rem; padding: 2rem 0; }
    .stage.flip .media { order: 0; }
  }
  @media (max-width: 640px) {
    .hero h1 { font-size: 1.9rem; }
    .track { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 1.1rem; }
    .track::before { display: none; }
    figure.phone { width: 130px; }
  }`;

// The script of the page: the sticky progress bar follows the stage in view. Without JavaScript the
// bar stays hidden (the "js" class) and every word of the page shows. String concatenation only:
// this text is inside a template literal.
const PAGE_SCRIPT = `const stages = [...document.querySelectorAll("section.stage")];
const dots = [...document.querySelectorAll(".progress .dots span")];
const now = document.querySelector(".progress .now");
function update() {
  let current = 0;
  stages.forEach((s, i) => {
    if (s.getBoundingClientRect().top < innerHeight * 0.45) current = i;
  });
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

// The page of a view. copyUrl is the link to the text copy on GitHub, or null.
export function pageHtml(view, copyUrl) {
  const credit = creditText(view.credits, {
    repo: (g) => `<a href="${g.repoUrl}"><code>${esc(g.repo)}</code></a>`,
    commit: (g) => `<a href="${g.commitUrl}"><code>${esc(g.commit)}</code></a>`,
    text: htmlText,
  });
  const legend = Object.entries(FLAGS)
    .map(([kind, flag]) => `<span class="tag ${flag.class}">${flag.label}</span> ${htmlText(view.legend[kind])}`)
    .join("<br>");
  const first = view.stages[0];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${htmlText(view.title)}</title>
<meta name="description" content="${htmlText(`Chapter ${view.chapter}: ${view.subtitle}`)}">
<style>
${BASE_STYLE}
${PAGE_STYLE}
</style>
<script>document.documentElement.classList.add("js");</script>
</head>
<body>
<nav class="top"><a href="./">&larr; All viewers</a></nav>
<header class="hero">
<p class="kicker">Chapter ${view.chapter} of the capture journey</p>
<h1>${titleText(view.title)}</h1>
<p class="sub">${htmlText(view.subtitle)}</p>
<ol class="track" aria-label="The stages" style="--stages: ${view.stages.length}">
${view.stages.map((s, i) => `<li><a href="#${s.id}">${icon(s.icon, 40)}<span class="n">${i + 1}</span><span class="l">${htmlText(s.short)}</span></a></li>`).join("\n")}
</ol>
</header>
<div class="progress" aria-hidden="true"><span class="dots">${view.stages.map(() => "<span></span>").join("")}</span><span class="now">1 of ${view.stages.length}: ${htmlText(first.short)}</span></div>
<section class="intro">
${view.intro.map((p) => `<p>${htmlText(p)}</p>`).join("\n")}
<p class="legend">${legend}</p>
</section>
${view.stages.map((stage, i) => stageHtml(stage, i, view)).join("\n")}
<footer class="next">
<p><strong>Next:</strong> ${htmlText(view.next)}</p>${credit ? `\n<p class="credit">${credit}</p>` : ""}${copyUrl ? `\n<p class="copy"><a href="${copyUrl}">Read the text copy of this page on GitHub</a></p>` : ""}
</footer>
<script type="module">
${PAGE_SCRIPT}
</script>
</body>
</html>
`;
}
