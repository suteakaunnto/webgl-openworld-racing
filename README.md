# KITEBOUND: ROADS OF VEYRA

A browser-based open-world racing project, developed with Three.js, TypeScript, and WebGL2. The final distributable target is a single self-contained HTML file.

## Current development line

- Repository: suteakaunnto/webgl-openworld-racing
- Working branch: dev/m0-foundation
- Milestone: M0 — custom procedural vehicle-form viewer and offline HTML pipeline
- The supplied RX-7 glTF is a development-only visual reference. It is not a game asset and must never be bundled into the game, instantiated as a player car, or used as copied game geometry or textures.
- The game vehicles are authored as original parametric geometry and original materials. Reference-derived proportions are research inputs, not source meshes.

## Local requirements

- Node.js 20 or newer
- npm
- A modern browser with WebGL2

Install dependencies with npm install.

Build and validate the standalone HTML with npm run verify.

The build writes dist/index.html. It embeds the bundled application only. It must not contain the RX-7 glTF, scene.bin, reference textures, GLTFLoader, external URLs, or any runtime network dependency.

For a development-only view of the supplied reference model, start a local server at the repository root:

    npx http-server . -p 8080

Then open http://localhost:8080/tools/reference-inspector.html

The reference inspector is outside the production build and is not included in dist/index.html. Keep the original model folder and its license.txt unchanged.

Do not treat a successful TypeScript build as proof that every browser, device, or controller works. Record actual runtime checks in docs/PROGRESS.md.

## Project decisions

- Three.js + WebGL2, TypeScript, and esbuild.
- No runtime CDN or remote asset dependency.
- Final distributable target: one offline HTML file.
- Original car bodies, windows, lamps, wheels, materials, and emblems are created for this game.
- The supplied glTF is retained only for private development reference and must not appear in the distributable game.
- Its CC BY 4.0 attribution and source record are retained in docs/ASSET_CREDITS.md, because the reference model remains in the source repository.
- Mazda trademarks and logos are not granted by the model's CC BY 4.0 license. Avoid reproducing real marks in the fictional game.

## Documentation

- docs/PROGRESS.md — verified work and next steps
- docs/NAMING.md — canonical fictional naming
- docs/REFERENCE_RESEARCH.md — RX-7 Type A technical reference facts
- docs/ASSET_INTEGRATION.md — reference-only policy and original-vehicle workflow
- docs/ASSET_CREDITS.md — source-repository reference attribution
- tools/reference-inspector.html — development-only visual reference tool
