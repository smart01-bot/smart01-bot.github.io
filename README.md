# Raymond Duma / a personal internet corner

A print-inspired, deliberately uneven light portfolio with no frameworks, font dependencies, external scripts or tracking.

The site uses editorial page layouts rather than repeated project cards. It features honest writing about unfinished work, including Swift Wakala's agent-system integration questions, sample data in Fahari.io, and the original Tour de Dar visual preview.

The resume PDF is visible from the header, introduction and a full-width yellow section. Contact email and phone are plain selectable text rather than links.

Previews:
- https://smart01-bot.github.io/swift-wakala-preview/
- https://smart01-bot.github.io/Fahari.io-preview/
- https://smart01-bot.github.io/tour-de-dar-preview/

Run locally by opening index.html or using python3 -m http.server 8080. Run node tests/interactions.cjs for static checks.

GitHub Pages hosts main from the repository root. The PDF Raymond_Duma_CV.pdf is deliberately preserved. Older layouts remain available in commit history.

## Swift Wakala automated walkthrough

The Swift feature shows an autoplaying, pausable **live browser-demo walkthrough**, not an MP4. It embeds the public no-login Swift preview from the same GitHub Pages origin, crops its actual phone UI and navigates between sample-only agent and main-agent screens. Users can pause it; reduced-motion users must opt in to playback. If the remote preview cannot be embedded, the frame shows a direct link. No provider or backend actions are performed.
