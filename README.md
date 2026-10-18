# Raymond Duma — Interactive Portfolio

A buildless, responsive portfolio for Raymond Jefa Duma, designed around code, circuits, and curiosity. Plain HTML, CSS, and JavaScript; no application dependencies, API credentials, analytics, or backend.

## Run

Serve the repository with any static server, for example `python3 -m http.server 8080`, then open `http://localhost:8080`. No `npm run build` is required. Typography uses system fonts and does not request external font files.

GitHub Pages currently uses `main` and the repository root. The redesign is prepared on `feat/interactive-portfolio`; merging it into `main` publishes through the repository's existing Pages configuration.

## Explore

- Drag or use arrow keys to rotate a procedurally drawn 3D sculpture; cycle sphere, torus, and wave geometry; send a pulse.
- Switch between three project panels. Run a simulated request lifecycle, cycle sample tasks, or explore the event disciplines.
- Open project notes, expand the experience timeline, and filter or inspect the technology toolbox.
- Adjust an oscilloscope's frequency, amplitude, and waveform.
- Use the terminal: `help`, `whoami`, `projects`, `skills`, `contact`, `cv`, `theme`, `pulse`, `surprise`, `clear`, `hello`, `ls`, `pwd`.
- Press Ctrl/Cmd+K for a searchable command palette. Arrow keys choose actions; Enter runs them; Escape closes it.
- Switch theme or pause motion. Preferences are stored locally when storage is available.
- Use the retained email, phone, GitHub, and original CV links.

All project demos use illustrative state in the current page. They do not move funds, access providers, change real business tasks, or represent a live event schedule. Project descriptions and career information are based on the previous portfolio. Unverified production/shipped labels have been removed.

## Accessibility and performance

Semantic sections, skip link, visible focus, keyboard-operable project tabs and dialogs, labeled sliders, responsive layouts, and reduced-motion support. Essential content is visible without JavaScript; the project panels are all shown in that mode. Canvas visuals have descriptions and adjacent controls. Animations skip offscreen canvases and background tabs; reduced-motion scenes redraw only when their state changes. Canvas resolution is capped at 2×. No audio plays.

## Verification

- `node --check script.js`
- `git diff --check`
- DOM interaction checks (jsdom 29): install jsdom in a separate directory, then run `NODE_PATH=/path/to/node_modules node tests/interactions.cjs`.

The automated checks cover project switching and keyboard navigation, simulations, task state, skill filters, motion/theme controls, waveform controls, detail dialogs, terminal output/history/injection handling, palette filtering/actions, internal links, unique IDs, and CV presence. Canvas rendering and responsive visual appearance still need a real-browser review; DOM checks do not replace that.

Before merging, review desktop and mobile widths, touch rotation and vertical scrolling, canvas appearance in both themes, dialog focus restoration/Escape, reduced motion, CV download, and external links. The original PDF is unchanged.

## Swift Wakala preview

The first project now links to the public interactive Swift Wakala preview at https://smart01-bot.github.io/swift-wakala-preview/. Internal `silverstone` element IDs remain stable for navigation and tests; the displayed project name is Swift Wakala. The font, heading sizes, and copy have been simplified. Versioned CSS and JavaScript URLs prevent the previous design’s cached assets from being mixed with the updated page.
