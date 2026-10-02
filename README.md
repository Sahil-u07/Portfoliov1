# Portfolio

Personal portfolio of Sahil Lenka, built with React, TypeScript and Vite. No UI, animation or icon libraries.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Where things live

- `src/data.ts`: every piece of content (copy, numbers, links). Edit this to update the site.
- `src/components/`: one component per section, each with its own CSS file.
- `src/components/RetrievalField.tsx`: the hero canvas. Dots are passages, your cursor is the query, and the 5 nearest light up, a 2D sketch of EvidenceRAG's dense retrieval.
- `src/components/Pipeline.tsx` and `Benchmark.tsx`: the EvidenceRAG walkthrough and chart, using numbers from that project's README.
- `src/components/CommandMenu.tsx`: Ctrl/Cmd+K menu on the native `<dialog>` element.
- `src/hooks.ts`: scroll reveal and active-section tracking with `IntersectionObserver`.

## Test

```bash
npx playwright install chromium   # first time only
npm run build && npm test
```

`tests/smoke.mjs` serves the build, clicks through every interactive piece at desktop and phone width, and fails on JS errors or horizontal scrolling. CI runs it on every pull request.

## Deploy

`npm run build` writes a static site to `dist/` with relative asset paths. Every push to `main` deploys it to GitHub Pages at https://sahil-u07.github.io/Portfoliov1/ (`.github/workflows/deploy.yml`).
