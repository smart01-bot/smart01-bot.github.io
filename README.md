# Raymond Duma — Personal portfolio

A simple, responsive light-mode portfolio using semantic HTML and CSS. No JavaScript runtime, external fonts, authentication, analytics or build step.

## Design direction

- Warm, light paper surfaces with quiet pine-green typography and accents.
- Short introduction, three consistent project cards and direct interactive preview links.
- Compact education and work background, without decorative dashboards or oversized monogram art.
- Résumé PDF is prominent in the header, hero and dedicated résumé section.
- Email and phone are deliberately plain, selectable text rather than mailto/tel links.
- Source repositories and their preview repositories are independent and unchanged by this portfolio.

## Preview links

- [Swift Wakala](https://smart01-bot.github.io/swift-wakala-preview/)
- [Fahari.io](https://smart01-bot.github.io/Fahari.io-preview/)
- [Tour de Dar](https://smart01-bot.github.io/tour-de-dar-preview/)

Each preview is a product demonstration using sample data. The portfolio does not imply live payments, verified business records or live event operations.

## Local use

Open index.html, or run a local static server:

    python3 -m http.server 8080

Run static checks:

    node tests/interactions.cjs

## Deployment

GitHub Pages hosts this repository from its main branch and root directory. The résumé lives at Raymond_Duma_CV.pdf. Prior designs remain in commit history for easy rollback.
