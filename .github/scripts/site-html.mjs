// The shared parts of the generated HTML pages of the Pages site: the landing page
// (build-landing.mjs) and the moved pages (build-moved.mjs).

// Escape text for HTML text and for a double-quoted attribute.
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The base style: the colors in light and dark mode, the body, and the links. Each page adds its
// own rules after it.
export const BASE_STYLE = `  :root { color-scheme: light dark; --fg: #1f2328; --bg: #fff; --muted: #656d76;
    --line: #d0d7de; --link: #0969da; }
  @media (prefers-color-scheme: dark) { :root { --fg: #e6edf3; --bg: #0d1117;
    --muted: #8b949e; --line: #30363d; --link: #58a6ff; } }
  body { font: 16px/1.6 -apple-system, system-ui, "Segoe UI", sans-serif;
    max-width: 48rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem;
    color: var(--fg); background: var(--bg); }
  a { color: var(--link); text-decoration: none; }
  a:hover { text-decoration: underline; }`;
