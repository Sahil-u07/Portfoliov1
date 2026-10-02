# Portfolio

Personal portfolio of Sahil Lenka. Plain HTML, CSS and JavaScript: no framework, no build step.

- `index.html`: all content
- `styles.css`: design tokens at the top, then one block per section
- `main.js`: interactions (pipeline walkthrough, benchmark chart, skill filter, command menu on Ctrl/Cmd+K)

## Run locally

Open `index.html` in a browser, or serve the folder with `python3 -m http.server`.

## Test

```bash
npm install
npx playwright install chromium   # first time only
npm test
```

`tests/smoke.mjs` loads the page at desktop and mobile widths, clicks through every interactive piece, and fails on JS errors or horizontal scrolling.

## Deploy

Any static host works. On GitHub Pages: Settings → Pages → deploy from the `main` branch, root folder.
