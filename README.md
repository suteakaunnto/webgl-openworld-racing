# KITEBOUND: ROADS OF VEYRA

A browser-based open-world racing project. The project begins with a real glTF asset inspection and a self-contained Three.js showroom viewer before the driving simulation and world streaming are added.

## Current development line

- Repository: suteakaunnto/webgl-openworld-racing
- Working branch: dev/m0-foundation
- Milestone: M0 — repository baseline, build pipeline, and RX-7 asset viewer
- The original RX-7 model folder is treated as immutable source material. Any future brand-removal or rigging work must be performed on derived data.

## Local requirements

- Node.js 20 or newer
- npm
- A modern browser with WebGL2

Install dependencies with:

    npm install

Build and validate the standalone HTML with:

    npm run verify

The build writes dist/index.html. That file embeds the bundled application, the glTF JSON, scene.bin, and every referenced image as data URIs. It is intended to be opened locally without a server or network connection. The original asset folder remains intact.

For a quick local HTTP preview during development:

    npx http-server dist

Do not treat a successful TypeScript build as proof that every browser, device, or controller works. Record actual runtime checks in docs/PROGRESS.md.

## Project decisions

- Three.js + WebGL2, TypeScript, and esbuild.
- No runtime CDN or remote asset dependency.
- The final distributable target is one HTML file.
- The supplied glTF is CC BY 4.0; its specific attribution is in docs/ASSET_CREDITS.md.
- The model's CC BY 4.0 license does not grant Mazda trademark or logo rights. Derived game assets must address those separately.

## Documentation

- docs/PROGRESS.md — verified work and next steps
- docs/NAMING.md — canonical fictional naming
- docs/REFERENCE_RESEARCH.md — RX-7 Type A reference facts and sources
- docs/ASSET_INTEGRATION.md — source-model inventory and integration status
- docs/ASSET_CREDITS.md — required third-party attribution
