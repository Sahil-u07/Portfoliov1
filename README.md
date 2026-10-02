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
- `src/components/RetrievalField.tsx`: the hero canvas. A rotating 3D point cloud, projected by hand, where a query's 5 nearest passages light up: a sketch of EvidenceRAG's dense retrieval. The pointer orbits the camera.
- `src/components/Ribbons.tsx`: the flowing light ribbons behind the page, one fixed canvas with additive blending.
- `src/base.css`: colour tokens, the 3D scroll reveal, and the scroll-linked animations (hero exit, heading rise, lime tile zoom, progress bar) in pure CSS.
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
