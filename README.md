# Raymond Duma — Circuits first. Software followed.

An interactive portfolio connecting an electronics background to software projects. Warm paper, charcoal, copper, a visible grid, original dimensional illustrations, and locally hosted typography.

GitHub Pages serves the repository root on **main**:
https://smart01-bot.github.io/

## Experience

- Poppins leads the headlines, Inter handles navigation and labels, and Open Sans carries body text. Local WOFF2 files include Latin and common punctuation; licenses sit beside the font files. No font service is required at runtime.
- The hero is an original circuit sculpture projected with Canvas 2D. Pointer movement changes its perspective; clicking the sculpture or the keyboard-accessible **Send a signal** button sends a copper pulse through the traces. Scrolling separates its layers and reveals small interface planes.
- The sculpture requires no WebGL context or 3D library. A matching SVG remains visible if Canvas is unavailable. Its animation pauses off screen and in hidden documents; reduced-motion mode renders a still illustration.
- On larger, sufficiently tall screens, one artwork stage stays in place as the three project chapters scroll. Native anchor links jump directly to any project. On smaller screens or with reduced motion, each project keeps its own artwork in the document.
- All project text stays present and readable. Passive scrolling never hides the focused preview link. Existing interactive previews open in separate tabs; the original artwork is illustrative and does not claim to show the application screens.
- Project context and experience expand on demand. The résumé is downloadable from the header, About section, and dedicated download strip.
- Email and phone stay selectable plain text. Optional copying reports success only after the clipboard accepts the text, with a selection fallback when permission is unavailable.
- A Dar es Salaam clock, section navigation, reading progress, and a gently responsive name at the bottom complete the experience.

## Preserved destinations

| Project | Interactive preview |
| --- | --- |
| Swift Wakala | https://smart01-bot.github.io/swift-wakala-preview/ |
| Fahari.io | https://smart01-bot.github.io/Fahari.io-preview/ |
| Tour de Dar | https://smart01-bot.github.io/tour-de-dar-preview/ |

These are demonstrations, not live financial or event services. Swift's direct agent-system integration remains unresolved; Fahari uses sample figures; the Tour preview preserves an earlier site version. The original **Raymond_Duma_CV.pdf** is unchanged. No preview repository is modified.

## Source and checks

Buildless HTML, CSS, and JavaScript. No runtime dependencies, autoplay videos, trackers, or embedded applications. Open `index.html` directly or serve the root with a static web server.

For development checks only, use Node.js 20 or later:

```sh
npm ci
npm test
```

Ten DOM-level regression checks cover native links and downloads, font assets, CSS parsing, chapter selection, preserved keyboard focus, mobile and reduced-motion fallbacks, clipboard success/failure, navigation, Canvas fallback, and animation scheduling. The original SVG artwork and multiple renderer states were rendered separately for visual inspection. The updated social image was also rendered and inspected.

Full-browser layout and real-device touch verification were unavailable in the implementation environment. The DOM checks do not claim to replace them.

## Files

- `index.html`: semantic content, native links, and disclosures.
- `styles.css`: typography, responsive grid, artwork stages, motion, and print styles.
- `script.js`: chapter state, contact copying, clock, navigation, and name interaction.
- `circuit.js`: original renderer, pointer/pulse/scroll behavior, and animation lifecycle.
- `assets/circuit.svg`: generated still fallback for the sculpture.
- `assets/work-*.svg`: original illustrations for the three projects.
- `assets/fonts/`: local WOFF2 subsets and SIL Open Font License copies.
- `assets/social.png`: sharing image, with the new typography and sculpture.
- `tests/interactions.cjs`: development-only regression checks.

The layout and interaction direction draws on 3D Discovery and Nocturnal Dream. Their visual assets and source code are not included. Previous portfolio designs remain in Git history.
