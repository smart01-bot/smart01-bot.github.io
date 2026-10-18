# Raymond Duma / things I'm making

A small light-mode portfolio that reads more like a working notebook than a product landing page. Written in plain HTML and CSS without JavaScript, analytics, external fonts or runtime dependencies.

## What changed

- An intentionally irregular, type-led layout instead of evenly sized marketing cards and mock product screenshots.
- Personal copy about electronics, learning software and actual project constraints.
- Three external interactive demos: Swift Wakala, Fahari.io and Tour de Dar. Each demo is isolated from this repo.
- Résumé download accessible from navigation, introduction and a dedicated high-visibility section.
- Contact email and phone displayed only as selectable text, not `mailto:` or `tel:` links.
- No production payments or real customer data. The previews are demonstrations and are labelled accordingly.

## Run

Open `index.html` locally or run `python3 -m http.server` in the repository root. Optional static test: `node tests/interactions.cjs`.

## Deploy

GitHub Pages serves the repository root on `main`. The original `Raymond_Duma_CV.pdf` remains alongside these files. Older designs are available from Git commit history if we want to revert.
