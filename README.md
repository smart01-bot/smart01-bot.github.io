# Raymond Duma — Electronics to software

A light, text-led portfolio connecting an electronics background to software projects. The page uses warm cream, brown, and near-black with the original locally hosted Poppins, Inter, and Open Sans fonts.

GitHub Pages serves the repository root on **main**:
https://smart01-bot.github.io/

## Experience

- A simple introduction, selected projects, About section, résumé download, and plain-text contact details.
- Project descriptions and native disclosure sections stay readable without JavaScript.
- Four live project previews are embedded in responsive device frames: TEST.MOBILE and Swift Wakala use phone frames; Fahari.io and Tour de Dar use desktop browser frames. The original project links remain available as direct alternatives. Project illustrations and the animated circuit sculpture are not displayed on the page.
- Poppins leads headlines, Inter handles navigation and labels, and Open Sans carries body text. The local WOFF2 files and licenses remain in the repository.
- Lightweight JavaScript handles language and theme switching, the Dar es Salaam clock, active section navigation, and responsive preview scaling. Preview iframes load only when they approach the viewport.
- Reduced-motion preferences are respected. Fonts are served locally; previews are embedded from the existing GitHub Pages demo sites. There are no trackers or autoplay media.

## Preserved destinations

| Project | Interactive preview |
| --- | --- |
| TEST.MOBILE | https://smart01-bot.github.io/TEST.MOBILE.preview/ |
| Swift Wakala | https://smart01-bot.github.io/swift-wakala-preview/ |
| Fahari.io | https://smart01-bot.github.io/Fahari.io-preview/ |
| Tour de Dar | https://smart01-bot.github.io/tour-de-dar-preview/ |

The demos are not live financial or event services. Swift's direct agent-system integration remains unresolved; Fahari uses sample figures; the Tour preview preserves an earlier site version. The C.A.R.D. Informatics live-site link is included separately. The original **Raymond_Duma_CV.pdf** is unchanged. The About section now includes the NACTVET Award Verification Certificate details and links to the certificate’s QR-code verification destination. The certificate PDF itself is not duplicated in this repository. No preview repository is modified.

## Source and checks

Buildless HTML, CSS, and JavaScript. Open `index.html` directly or serve the root with any static web server.

For development checks, use Node.js 20 or later:

```sh
npm ci
npm test
```

The regression tests check semantic content, preview and résumé links, safe external link targets, local fonts and licenses, CSS parsing, responsive and reduced-motion rules, plain-text contact details, native disclosures, the local clock, and section navigation.

The automated checks validate preview destinations, frame types, lazy-loading configuration, responsive styles, local assets, and the existing portfolio interactions. They do not replace full-browser visual QA on desktop and mobile.

## Files

- `index.html`: semantic content, project descriptions, credential details, and native disclosures.
- `styles.css`: warm palette, existing typography, responsive layout, focus styles, and print styles.
- `script.js`: local clock and section navigation.
- `assets/work-*.svg`: original project illustrations retained in the repository but no longer shown on the page.
- `assets/fonts/`: locally hosted WOFF2 files and SIL Open Font License copies.
- `tests/interactions.cjs`: development-only regression checks.

Older designs remain available in Git history.
