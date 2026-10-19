# Raymond Duma — Circuits first. Software followed.

A light, minimal personal portfolio. Built with HTML, CSS, JavaScript, and local SVG artwork; there are no runtime dependencies, font services, trackers, or build step.

GitHub Pages serves the repository root on **main**:
https://smart01-bot.github.io/

## Experience

- Three projects in one gallery. Click the tabs, use left/right arrow keys or Home/End, or swipe the artwork on a touchscreen.
- Each project opens its existing interactive preview in a new tab. The SVGs are original project illustrations, not screenshots of the applications.
- Project context and experience details expand on demand.
- The résumé remains available in the header, About section, and dedicated download strip.
- Email and phone remain selectable plain text. Optional copy buttons report success only after the clipboard accepts the text, with a selection fallback when access is unavailable.
- A local Dar es Salaam clock, active section navigation, subtle transitions, and reading progress provide small details.
- Reduced-motion preferences are respected. Without JavaScript, all three projects, their links, native disclosure sections, and downloads remain available.

## Preserved destinations

| Project | Interactive preview |
| --- | --- |
| Swift Wakala | https://smart01-bot.github.io/swift-wakala-preview/ |
| Fahari.io | https://smart01-bot.github.io/Fahari.io-preview/ |
| Tour de Dar | https://smart01-bot.github.io/tour-de-dar-preview/ |

These are demonstrations, not live financial or event services. Swift's direct agent-system integration remains unresolved; Fahari uses sample figures; the Tour preview preserves an earlier site version.

The original **Raymond_Duma_CV.pdf** is unchanged.

## Local use and checks

Open index.html directly, or serve the repository with any static web server.

For development checks only, use Node.js 20 or later:

~~~sh
npm ci
npm test
~~~

The regression suite checks progressive enhancement, preserved assets and links, CSS syntax, tab relationships, keyboard navigation, project switching, gesture handling, reduced motion, clipboard success/failure, and navigation state.

These are DOM-level tests. They do not prove browser layout, native focus behavior, or real-device touch behavior. Real-browser visual QA was unavailable in the implementation environment.

## Files

- index.html — semantic content and native links/disclosures.
- styles.css — responsive layout, states, reduced motion, and print styles.
- script.js — small progressive enhancements.
- assets/ — original SVG project artwork, favicon, and social preview.
- tests/interactions.cjs — DOM-level regression checks; dependencies are development-only.

No changes are made to the preview repositories. Older portfolio designs remain in Git history.
