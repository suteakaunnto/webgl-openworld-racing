# KITEBOUND: ROADS OF VEYRA

A browser-based open-world racing project built with Three.js, TypeScript, and WebGL2. The final distributable target is a single self-contained HTML file.

## Current development line

- Repository: suteakaunnto/webgl-openworld-racing
- Working branch: dev/m1-vehicle-motion-test
- Milestone: M1 — first interactive vehicle-part motion test, based on the verified M0 full-model viewer
- The supplied Mazda RX-7 Spirit R Type A glTF is licensed under CC BY 4.0 according to its preserved `license.txt`.
- The project uses the supplied Mazda RX-7 Spirit R Type A glTF in full: all source nodes, meshes, interior parts, wheels, lamps, badges, material assignments and textures are retained. The M1 branch adds a game-side runtime rig to animate wheel assemblies, steering pivots, pop-up headlights and lamp effects; original source geometry and textures remain unchanged.
- Required creator attribution, source link, CC BY 4.0 link, and a modification notice are provided in the in-game credits panel and `docs/ASSET_CREDITS.md`.
- Visible Mazda marks remain in this prototype under the user's full-model-use direction. CC BY 4.0 does not grant trademark rights; separately review those marks before public commercial release. No manufacturer endorsement is implied.

## M1 vehicle motion test

The `dev/m1-vehicle-motion-test` branch adds an interactive test panel to the standalone viewer. The panel can test four wheel assemblies, front steering, pop-up headlight movement, headlight beams/emission, brake-lamp emission and left/right/hazard indicators. The speed is a fixed motion-test speed; driving physics and speed-linked simulation are not part of this test.

The verification workflow also runs an automated rig test against the original glTF node hierarchy before uploading the artifact. Use the branch's GitHub Actions artifact after its workflow succeeds. Open the Actions run linked from the branch, download `kitebound-m0-standalone-html`, extract it, and open `index.html` in a WebGL2-compatible browser. Controls become enabled after the model loads. See `docs/VEHICLE_MOTION_TEST.md` for the checks and known limitations.

## Run the previous successful M0 GitHub Actions build

1. Open the [latest successful full-model build](https://github.com/suteakaunnto/webgl-openworld-racing/actions/runs/44885125797).
2. Under **Artifacts**, download `kitebound-m0-standalone-html`.
3. Extract the ZIP.
4. Open the extracted `index.html` in Chrome or Microsoft Edge.
5. No Node.js or local server is required when running the packaged HTML. Use a browser with WebGL2 support.

The latest successful full-model build is [GitHub Actions run 44885125797](https://github.com/suteakaunnto/webgl-openworld-racing/actions/runs/44885125797), commit `78f94a75f49be2107aeac704dfb3d8fa86263d27`. It produces one standalone `dist/index.html` (10,213,531 bytes); the complete 3D model, binary geometry and all local textures are embedded. The compressed Actions artifact is 5,795,302 bytes.

## Local development

Requirements:

- Node.js 20 or newer
- npm
- A modern browser with WebGL2

Install dependencies:

    npm install

Build and validate the single-file HTML:

    npm run verify

The build writes `dist/index.html`. The packer reads the source glTF and its local binary/PNG dependencies, rewrites those resources to data URIs, and embeds them into the standalone HTML. The runtime makes no CDN or model-asset request.

For a development-only view of the source model inventory, run a local server from the repository root:

    npx http-server . -p 8080

Then open:

    http://localhost:8080/tools/reference-inspector.html

Keep the original downloaded asset folder and its original `license.txt` unchanged for provenance. The game build packages a copy of its model data inside `dist/index.html`; it does not modify the source files.

## Japanese localization

- Japanese is the default display language.
- The current viewer includes an English/Japanese switch.
- Player-visible labels, status messages, errors, model statistics, controls, credits and attribution are translated.
- New game menus, tutorials, race notifications, settings and HUD must add Japanese and English strings to `src/i18n.ts`.
- See `docs/LOCALIZATION.md`.

## Project decisions

- Three.js + WebGL2, TypeScript, and esbuild.
- No runtime CDN or remote asset dependency.
- Final distributable target: one offline HTML file.
- Original game manufacturers, car names, UI and world content remain fictional.
- Licensed vehicle geometry can be reused only within its stated license terms and with the required attribution/modification notice.
- The in-game Asterion 13R is a fictional project vehicle and is not an official Mazda product.

## Documentation

- `docs/PROGRESS.md` — verified work and next steps
- `docs/NAMING.md` — canonical fictional naming
- `docs/REFERENCE_RESEARCH.md` — RX-7 Type A technical reference facts
- `docs/ASSET_INTEGRATION.md` — licensed source-asset use and integration workflow
- `docs/ASSET_CREDITS.md` — source attribution, license and modification disclosure
- `docs/VEHICLE_MOTION_TEST.md` — M1 motion-test controls and runtime test checklist
- `docs/LOCALIZATION.md` — Japanese-first language policy
- `tools/reference-inspector.html` — development-only visual asset inspector

Do not treat a successful TypeScript build as proof that every browser, device, or controller works. Record actual visual runtime checks in `docs/PROGRESS.md`.
