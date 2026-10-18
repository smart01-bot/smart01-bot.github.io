# Raymond Duma — Editorial portfolio

An intentionally simple, responsive, light-mode portfolio. Built with semantic HTML and CSS, with no JavaScript dependencies, external fonts, tracking scripts, backend services or build process.

## Current design

- Warm paper surfaces, dark green accents, legible typography and reduced visual clutter.
- Featured project cards link to independent Swift Wakala, Fahari.io and Tour de Dar previews.
- Background/experience, selected technologies and straightforward, non-clickable email and phone details.
- **Prominent résumé download** in the navigation, hero and dedicated résumé section, using the retained \`Raymond_Duma_CV.pdf\` file.
- Source project repositories are unchanged. The portfolio keeps preview destinations even where a preview repository has not yet been published through GitHub Pages.

## Local use

Open \`index.html\` or serve the directory with \`python3 -m http.server 8080\`. No build is required. Run \`node tests/interactions.cjs\` for static checks.

## Deployment

GitHub Pages serves the \`main\` branch from repository root. A single revision replaced the earlier dark, animation-heavy portfolio with the editorial design. The previous version remains accessible via Git history for rollback.

## Caveats

Previews are demonstrations rather than operational systems. The standalone preview repositories each require their own contents and GitHub Pages deployment to be publicly accessible; updating a portfolio link does not publish a preview automatically.
