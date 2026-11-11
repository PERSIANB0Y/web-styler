/* =========================================================
   AUTO THEME  ·  automatic, class-free theming layer
   ---------------------------------------------------------
   Drop this single file into any page:

       <script src="auto-theme.js"></script>

   It will:
     • inject the full design system (same look as styles.css)
     • auto-detect elements (header, nav, sections, buttons,
       cards, grids, eyebrows, forms, dialogs, footer ...)
       and tag them with data-ui="" — no classes / IDs needed
     • add a floating dark / light theme toggle
     • remember the choice, follow the OS theme
     • re-run itself when the DOM changes
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. THEME STATE
       ===================================================== */

    const STORAGE_KEY = "auto-theme";
    const root = document.documentElement;

    const systemQuery =
        window.matchMedia("(prefers-color-scheme: light)");

    let mode = readMode() || "system";   // "system" | "dark" | "light"


    function readMode() {
        try { return localStorage.getItem(STORAGE_KEY); }
        catch { return null; }
    }

    function saveMode(value) {
        try { localStorage.setItem(STORAGE_KEY, value); }
        catch { /* private mode — ignore */ }
    }

    function activeTheme() {
        return mode === "system"
            ? (systemQuery.matches ? "light" : "dark")
            : mode;
    }

    function applyTheme() {

        const theme = activeTheme();

        root.dataset.theme = theme;

        const icon =
            document.querySelector('[data-ui="theme-toggle"] span');

        if (icon) icon.textContent = theme === "dark" ? "☼" : "☾";

        const meta = document.querySelector('meta[name="theme-color"]');

        if (meta) {
            meta.setAttribute(
                "content",
                theme === "dark" ? "#09090c" : "#f5f3f4"
            );
        }

        // Play nicely with any existing Three.js scene
        if (typeof window.updateThreeTheme === "function") {
            try { window.updateThreeTheme(theme); } catch (e) { }
        }
    }


    /* =====================================================
       2. DESIGN SYSTEM  (injected stylesheet)
       ===================================================== */

    const CSS = `

/* ============ TOKENS ============ */

:root {
    --bg: #09090c;
    --surface: #111116;
    --surface-hover: #18171d;
    --surface-soft: #151219;

    --text: #f5f2f3;
    --muted: #99939b;
    --muted-2: #6e6871;

    --red: #a7193c;
    --red-light: #d52b50;
    --red-dark: #641329;

    --border: rgba(255, 255, 255, .085);
    --border-strong: rgba(255, 255, 255, .15);

    --shadow: 0 15px 50px rgba(0, 0, 0, .16);
    --red-glow: 0 0 40px rgba(167, 25, 60, .19);

    --radius-sm: 13px;
    --radius: 19px;
    --radius-lg: 27px;

    --container: 1080px;

    --font: "Inter", "Segoe UI", Arial, sans-serif;
    --font-fa: "Vazirmatn", Tahoma, Arial, sans-serif;

    --transition: .3s cubic-bezier(.2, .7, .2, 1);

    color-scheme: dark;
}

html[data-theme="light"] {
    --bg: #f5f3f4;
    --surface: #ffffff;
    --surface-hover: #f3edef;
    --surface-soft: #eee9eb;

    --text: #191419;
    --muted: #777078;
    --muted-2: #9b9299;

    --red: #a7193c;
    --red-light: #cb294d;
    --red-dark: #73152e;

    --border: rgba(30, 10, 20, .09);
    --border-strong: rgba(30, 10, 20, .15);

    --shadow: 0 15px 45px rgba(50, 15, 30, .07);
    --red-glow: 0 0 40px rgba(167, 25, 60, .09);

    color-scheme: light;
}


/* ============ FONT ============ */

@font-face {
    font-family: "Vazirmatn";
    src: url("./assets/fonts/Vazirmatn.woff2") format("woff2");
    font-display: swap;
}


/* ============ RESET ============ */

*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 110px;
    -webkit-text-size-adjust: 100%;
}

[hidden] {
    display: none !important;
}

body {
    margin: 0;
    min-height: 100vh;

    background: var(--bg);
    color: var(--text);

    font-family: var(--font);
    font-size: 14px;
    line-height: 1.6;

    overflow-x: hidden;

    transition:
        background .4s ease,
        color .4s ease;
}

::selection {
    background: var(--red);
    color: #fff;
}

* {
    scrollbar-width: thin;
    scrollbar-color: var(--surface-hover) transparent;
}

:where(a, button, input, textarea, select, summary, [tabindex]):focus-visible {
    outline: 2px solid var(--red-light);
    outline-offset: 4px;
    border-radius: 6px;
}


/* ============ AMBIENT BACKGROUND ============ */

[data-ui="ambient"] {
    position: fixed;
    inset: 0;
    z-index: -2;
    pointer-events: none;

    background:
        radial-gradient(ellipse at 50% 0%,
            rgba(123, 17, 47, .12),
            transparent 48%),
        radial-gradient(ellipse at 90% 70%,
            rgba(95, 15, 38, .07),
            transparent 45%);
}

html[data-theme="light"] [data-ui="ambient"] {
    background:
        radial-gradient(ellipse at 50% 0%,
            rgba(177, 34, 72, .07),
            transparent 48%);
}

[data-ui="noise"] {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    opacity: .025;

    background-image:
        url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}


/* ============ TYPOGRAPHY ============ */

h1, h2, h3, h4, h5, h6 {
    margin: 0 0 .45em;
    color: var(--text);
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: -.5px;
}

h1 {
    font-size: clamp(30px, 5vw, 48px);
    letter-spacing: -1.8px;
}

h2 {
    font-size: 25px;
    letter-spacing: -.7px;
}

h3 {
    font-size: 18px;
    font-weight: 700;
}

h4 {
    font-size: 15px;
    font-weight: 700;
}

h5, h6 {
    font-size: 13px;
    font-weight: 700;
}

p {
    margin: 0 0 1em;
    color: var(--muted);
    font-size: 12px;
    line-height: 2;
}

p:last-child {
    margin-bottom: 0;
}

strong, b {
    color: var(--text);
    font-weight: 700;
}

small, time, figcaption {
    color: var(--muted-2);
    font-size: 10px;
}

hr {
    height: 1px;
    margin: 24px 0;
    border: 0;
    background: var(--border);
}

a {
    color: inherit;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}

p a,
li a,
figcaption a {
    color: var(--red-light);
}

p a:hover,
li a:hover {
    text-decoration: underline;
}


/* ============ HEADER ============ */

[data-ui="header"] {
    position: sticky;
    top: 14px;
    z-index: 40;

    width: min(var(--container), calc(100% - 40px));
    min-height: 65px;

    margin: 14px auto 0;
    padding: 0 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;

    border: 1px solid var(--border);
    border-radius: var(--radius);

    background: color-mix(in srgb, var(--surface) 88%, transparent);

    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);

    box-shadow: var(--shadow);
}


/* ============ NAVIGATION ============ */

[data-ui="nav"] {
    display: flex;
    align-items: center;
    gap: 25px;
}

[data-ui="nav-link"] {
    color: var(--muted);
    font-size: 11px;
    white-space: nowrap;
    transition: color var(--transition);
}

[data-ui="nav-link"]:hover {
    color: var(--red-light);
}


/* ============ BUTTONS ============ */

[data-ui="button"],
button,
input[type="submit"],
input[type="button"],
input[type="reset"] {
    min-height: 43px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 14px;

    padding: 0 17px;

    border: 1px solid transparent;
    border-radius: 12px;

    background: var(--red);
    color: #fff;

    font: inherit;
    font-size: 11px;
    font-weight: 600;

    text-align: center;
    text-decoration: none;
    white-space: nowrap;

    cursor: pointer;

    transition:
        transform var(--transition),
        background var(--transition),
        border-color var(--transition),
        box-shadow var(--transition);
}

[data-ui="button"]:hover,
button:hover,
input[type="submit"]:hover,
input[type="button"]:hover,
input[type="reset"]:hover {
    background: var(--red-light);
    box-shadow: var(--red-glow);
    transform: translateY(-2px);
}

[data-ui="button"][data-variant="secondary"] {
    border-color: var(--border-strong);
    background: var(--surface);
    color: var(--text);
}

[data-ui="button"][data-variant="secondary"]:hover {
    border-color: var(--red);
    background: var(--surface);
    box-shadow: none;
}

/* small square buttons inside the header */

[data-ui="header"] button {
    width: 36px;
    min-width: 36px;
    height: 36px;
    min-height: 36px;

    padding: 0;

    border: 1px solid var(--border);
    border-radius: 11px;

    background: var(--surface-hover);
    color: var(--text);

    font-size: 15px;
}

[data-ui="header"] button:hover {
    border-color: var(--red);
    color: var(--red-light);
    box-shadow: none;
}


/* ============ SECTIONS ============ */

[data-ui="section"],
main > section,
main > article,
body > section {
    width: min(var(--container), calc(100% - 40px));
    margin-inline: auto;
    padding: 78px 0 10px;
}


/* ============ HERO ============ */

[data-ui="hero"] {
    min-height: 670px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 85px 0 40px;

    text-align: center;
}

[data-ui="hero"] > * {
    max-width: 640px;
}

[data-ui="hero"] h1 {
    margin: 0;
}

[data-ui="hero"] h2 {
    margin: 7px 0 0;
    color: var(--red-light);
    font-size: clamp(13px, 2vw, 16px);
    font-weight: 600;
    letter-spacing: 0;
}

[data-ui="hero"] p {
    margin: 17px 0 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 2;
}


/* ============ EYEBROW ============ */

[data-ui="eyebrow"] {
    display: block;

    margin: 0 0 8px;

    color: var(--red-light);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.7px;
    line-height: 1.5;
    text-transform: uppercase;
}


/* ============ CARDS ============ */

[data-ui="card"],
article,
figure,
aside,
blockquote,
details {
    padding: 21px;

    border: 1px solid var(--border);
    border-radius: var(--radius);

    background: var(--surface);
    box-shadow: var(--shadow);

    transition:
        transform var(--transition),
        border-color var(--transition),
        background var(--transition);
}

[data-ui="card"]:hover,
article:hover,
figure:hover,
aside:hover,
details:hover {
    border-color: color-mix(in srgb, var(--red-light) 35%, var(--border));
}

[data-ui="card"] > :last-child {
    margin-bottom: 0;
}

details > summary {
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
}


/* ============ AUTO GRID ============ */

[data-ui="grid"] {
    display: grid;
    gap: 14px;
    grid-template-columns:
        repeat(auto-fit, minmax(min(100%, 260px), 1fr));
}

ul[data-ui="grid"],
ol[data-ui="grid"] {
    padding: 0;
    list-style: none;
}


/* ============ LISTS ============ */

ul, ol {
    margin: 0 0 1em;
    padding-inline-start: 1.3em;

    color: var(--muted);
    font-size: 12px;
    line-height: 2;
}

li::marker {
    color: var(--red-light);
}


/* ============ FORMS ============ */

form {
    display: grid;
    gap: 15px;
}

label {
    display: block;
    margin-bottom: 7px;
    color: var(--muted);
    font-size: 10px;
    letter-spacing: .4px;
}

input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]),
textarea,
select {
    width: 100%;

    padding: 12px 14px;

    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    background: var(--surface-hover);
    color: var(--text);

    font: inherit;
    font-size: 12px;

    outline: none;

    transition: border-color var(--transition), background var(--transition);
}

input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):focus,
textarea:focus,
select:focus {
    border-color: var(--red-light);
    background: var(--surface);
}

textarea {
    min-height: 120px;
    resize: vertical;
}

::placeholder {
    color: var(--muted-2);
}

input[type="checkbox"],
input[type="radio"] {
    accent-color: var(--red);
}


/* ============ MEDIA ============ */

img, video, canvas, svg, iframe {
    max-width: 100%;
}

img, video {
    display: block;
    height: auto;
    border-radius: var(--radius-sm);
}


/* ============ TABLES ============ */

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

th, td {
    padding: 11px 13px;
    border-bottom: 1px solid var(--border);
    text-align: start;
}

th {
    color: var(--red-light);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
}

td {
    color: var(--muted);
}


/* ============ CODE ============ */

code, kbd, samp, pre {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: .92em;
}

code {
    padding: 2px 6px;

    border: 1px solid var(--border);
    border-radius: 7px;

    background: var(--surface-hover);
    color: var(--red-light);
}

pre {
    padding: 17px;

    border: 1px solid var(--border);
    border-radius: var(--radius-sm);

    background: var(--surface-soft);

    overflow-x: auto;
}

pre code {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
}


/* ============ FOOTER ============ */

[data-ui="footer"] {
    width: min(var(--container), calc(100% - 40px));
    min-height: 75px;

    margin: 40px auto 0;
    padding: 20px 0;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 15px;

    border-top: 1px solid var(--border);

    color: var(--muted);
    font-size: 9px;
}

[data-ui="footer"] a:hover {
    color: var(--red-light);
}


/* ============ DIALOG / MODAL ============ */

[data-ui="modal"] {
    max-width: min(560px, calc(100% - 40px));
    max-height: 90vh;
    overflow-y: auto;

    padding: 28px;

    border: 1px solid var(--border-strong);
    border-radius: 24px;

    background: var(--surface);
    color: var(--text);

    box-shadow: var(--shadow);
}

[data-ui="modal"]::backdrop {
    background: rgba(0, 0, 0, .72);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
}


/* ============ FLOATING THEME TOGGLE ============ */

[data-ui="theme-toggle"] {
    position: fixed;
    inset-block-end: 18px;
    inset-inline-end: 18px;
    z-index: 999;

    width: 42px;
    height: 42px;

    display: grid;
    place-items: center;

    padding: 0;

    border: 1px solid var(--border);
    border-radius: 12px;

    background: color-mix(in srgb, var(--surface) 88%, transparent);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);

    color: var(--text);
    font-size: 17px;
    line-height: 1;

    cursor: pointer;
    box-shadow: var(--shadow);

    transition:
        transform var(--transition),
        border-color var(--transition),
        color var(--transition);
}

[data-ui="theme-toggle"]:hover {
    border-color: var(--red);
    color: var(--red-light);
    transform: translateY(-2px);
}


/* ============ RTL ============ */

html[dir="rtl"] body {
    font-family: var(--font-fa);
}

html[dir="rtl"] [data-ui="section"] {
    text-align: right;
}

html[dir="rtl"] [data-ui="hero"] {
    text-align: center;
}

html[dir="rtl"] h1,
html[dir="rtl"] h2,
html[dir="rtl"] h3 {
    letter-spacing: 0;
}


/* ============ RESPONSIVE ============ */

@media (max-width: 720px) {

    [data-ui="header"] {
        flex-wrap: wrap;
        min-height: 0;
        padding: 12px 16px;
    }

    [data-ui="nav"] {
        order: 3;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
        gap: 14px;
    }

    [data-ui="section"],
    main > section,
    main > article {
        width: calc(100% - 30px);
        padding-top: 65px;
    }

    [data-ui="hero"] {
        min-height: 600px;
        padding: 70px 0 40px;
    }

    [data-ui="hero"] h1 {
        font-size: 32px;
    }
}


/* ============ REDUCED MOTION ============ */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
    }
}

`;


    /* =====================================================
       3. INJECT STYLES
       ===================================================== */

    function injectStyles() {
        if (document.getElementById("auto-theme-styles")) return;

        const style = document.createElement("style");
        style.id = "auto-theme-styles";
        style.textContent = CSS;

        (document.head || root).appendChild(style);
    }


    /* =====================================================
       4. AUTO-CLASSIFY ELEMENTS
       ===================================================== */

    const all = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    // Only tag elements that don't already have an explicit data-ui
    function tag(element, ui) {
        if (!element || element.dataset.ui) return;
        element.dataset.ui = ui;
    }

    function classify() {

        /* --- landmarks --- */
        all("header, [role='banner']").forEach(el => tag(el, "header"));
        all("nav, [role='navigation']").forEach(el => tag(el, "nav"));
        all("footer, [role='contentinfo']").forEach(el => tag(el, "footer"));
        all("dialog, [role='dialog'], [aria-modal='true']")
            .forEach(el => tag(el, "modal"));

        /* --- sections --- */
        const sections = all(
            "main > section, main > article, body > section"
        );

        sections.forEach(el => tag(el, "section"));

        // The first section containing an <h1> becomes the hero
        const hero = sections.find(s => s.querySelector("h1"));

        if (hero) hero.dataset.ui = "hero";

        /* --- navigation links --- */
        all("nav a, [data-ui='header'] a").forEach(el => tag(el, "nav-link"));

        /* --- buttons --- */
        all("button, input[type='submit'], input[type='button'], input[type='reset']")
            .forEach(el => tag(el, "button"));

        all("a[role='button']").forEach(el => {
            tag(el, "button");
            if (!el.dataset.variant) el.dataset.variant = "primary";
        });

        all("a[download]").forEach(el => {
            tag(el, "button");
            if (!el.dataset.variant) el.dataset.variant = "secondary";
        });

        /* --- cards --- */
        all("article, figure, aside, blockquote, details")
            .forEach(el => tag(el, "card"));

        /* --- grids: containers made of 2+ cards --- */
        all("div, section, ul, ol").forEach(el => {
            if (el.dataset.ui) return;

            const children = [...el.children];

            if (children.length < 2) return;

            const cards = children.filter(child =>
                child.dataset.ui === "card" ||
                /^(ARTICLE|FIGURE|ASIDE|DETAILS)$/.test(child.tagName)
            );

            if (cards.length === children.length) tag(el, "grid");
        });

        /* --- eyebrows: short ALL-CAPS label above a heading --- */
        all("h1, h2").forEach(heading => {

            const previous = heading.previousElementSibling;

            if (!previous || previous.children.length) return;
            if (previous.dataset.ui) return;

            const text = previous.textContent.trim();

            if (!text || text.length > 48) return;

            if (/^[A-Z0-9][A-Z0-9\s·&+\-–—\/.,:]+$/.test(text)) {
                previous.dataset.ui = "eyebrow";
            }
        });

        /* --- ambient background layers --- */
        if (!document.querySelector("[data-ui='ambient']")) {
            const ambient = document.createElement("div");
            ambient.dataset.ui = "ambient";
            ambient.setAttribute("aria-hidden", "true");
            document.body.prepend(ambient);
        }

        if (!document.querySelector("[data-ui='noise']")) {
            const noise = document.createElement("div");
            noise.dataset.ui = "noise";
            noise.setAttribute("aria-hidden", "true");
            document.body.appendChild(noise);
        }
    }


    /* =====================================================
       5. FLOATING THEME TOGGLE
       ===================================================== */

    function createThemeToggle() {

        if (document.querySelector("[data-ui='theme-toggle']")) return;

        const button = document.createElement("button");

        button.type = "button";
        button.dataset.ui = "theme-toggle";
        button.setAttribute("aria-label", "Toggle dark / light theme");

        button.innerHTML = "<span aria-hidden='true'>☼</span>";

        button.addEventListener("click", () => {
            mode = activeTheme() === "dark" ? "light" : "dark";
            saveMode(mode);
            applyTheme();
        });

        document.body.appendChild(button);
    }


    /* =====================================================
       6. REACT TO DOM CHANGES
       ===================================================== */

    let refreshScheduled = false;

    function observeDom() {

        if (!window.MutationObserver) return;

        const observer = new MutationObserver(() => {

            if (refreshScheduled) return;

            refreshScheduled = true;

            requestAnimationFrame(() => {
                refreshScheduled = false;
                classify();
            });
        });

        observer.observe(root, { childList: true, subtree: true });
    }


    /* =====================================================
       7. SYSTEM THEME LISTENER
       ===================================================== */

    function watchSystemTheme() {

        const onChange = () => {
            if (mode === "system") applyTheme();
        };

        if (systemQuery.addEventListener) {
            systemQuery.addEventListener("change", onChange);
        } else if (systemQuery.addListener) {
            systemQuery.addListener(onChange);
        }
    }


    /* =====================================================
       8. PUBLIC API
       ===================================================== */

    window.AutoTheme = {

        apply: applyTheme,
        refresh: classify,

        get mode() {
            return mode;
        },

        set(value) {
            if (!["system", "dark", "light"].includes(value)) return;
            mode = value;
            saveMode(mode);
            applyTheme();
        },

        toggle() {
            mode = activeTheme() === "dark" ? "light" : "dark";
            saveMode(mode);
            applyTheme();
        }
    };


    /* =====================================================
       9. BOOT
       ===================================================== */

    // Prevent a flash of unstyled / wrongly-themed content
    injectStyles();
    applyTheme();
    watchSystemTheme();

    function boot() {
        classify();
        createThemeToggle();
        applyTheme();
        observeDom();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }

})();