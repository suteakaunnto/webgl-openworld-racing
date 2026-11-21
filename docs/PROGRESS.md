# Development Progress

Last updated: 2026-11-21 (JST)
Working branch: dev/m0-foundation
Base branch: main
Base commit: 736ed4b785852f196e9e0051c2568ab9106a62fa

## Milestone status

| Milestone | Status | Notes |
|---|---|---|
| M0 — repository and model audit | In progress | Repository, asset metadata, licence, and initial Type A research checked |
| M0 — Three.js startup and showroom | Implemented in source | Needs CI build and browser runtime validation |
| M0 — single-HTML packer | Implemented in source | Needs build run and offline browser check |
| M1–M9 | Not started | Must not be represented as implemented |

## Verified repository state at start

- Repository: public, not archived.
- Default branch: main.
- Permissions returned by GitHub: admin, maintain, pull, push, triage.
- Main had one commit at audit time: 736ed4b785852f196e9e0051c2568ab9106a62fa.
- Main tree contained only the RX-7 source asset folder; no README, package.json, TypeScript source, build scripts, or docs existed.
- A new branch, dev/m0-foundation, was created from main. Main was not modified during initial setup.

## Completed investigation

- Confirmed the source folder and all 28 files.
- Confirmed glTF 2.0, one scene, 469 nodes, 152 meshes, 29 materials, 25 textures, and 25 images.
- Confirmed scene.bin declared and actual size: 2,934,308 bytes.
- Confirmed scene.gltf size: 396,160 bytes.
- Confirmed asset extensions KHR_materials_specular, KHR_materials_clearcoat, and KHR_materials_transmission.
- Read the original license.txt and copied its required attribution into docs/ASSET_CREDITS.md.
- Inspected glTF node and material names. Wheel pivots have not been confirmed.
- Researched Type A facts against Mazda's 2002 manufacturer release and Toyota GAZOO's Type A specification page.
- Created initial project naming register in docs/NAMING.md.

## Files added in the M0 foundation change

- README.md
- .gitignore
- package.json
- tsconfig.json
- index.html
- src/main.ts
- src/global.d.ts
- scripts/build.mjs
- scripts/pack.mjs
- scripts/check-output.mjs
- .github/workflows/ci.yml
- docs/NAMING.md
- docs/REFERENCE_RESEARCH.md
- docs/ASSET_INTEGRATION.md
- docs/ASSET_CREDITS.md
- docs/PROGRESS.md

## Build and test record

- GitHub branch creation: successful.
- Source code files and build scripts: committed as an M0 foundation change.
- npm install: not run in this session.
- TypeScript typecheck: not run in this session.
- esbuild: not run in this session.
- Final dist/index.html: not generated or browser-tested in this session.
- WebGL2 loading, offline file opening, and visual correctness: pending CI/browser validation.

## Known limitations and open risks

- The initial viewer is an asset-validation scene, not a playable car or racing game.
- Original Mazda marks in the source asset have not been altered. A derived game asset must address visible marks before public distribution.
- Type A wheel groups and pivot transforms need visual/coordinate verification.
- The current Packer checks missing external resources and embeds their bytes, but browser loading and offline file behavior still require runtime testing.
- No actual PC, smartphone, Xbox, or Switch Pro controller test has been performed.
- The 40,000-line minimum and 48,000-line target are long-term scope targets, not current progress.

## Next actions

1. Confirm the CI workflow result for this branch.
2. Fix any TypeScript, bundling, or packer errors found by CI.
3. Open dist/index.html in a WebGL2 browser with the network disabled.
4. Verify all meshes and textures visually; capture orthographic views.
5. Inspect dimensions, axes, wheel centers, pivots, and model hierarchy.
6. Only then begin derived Asterion 13R rigging and M1 geometry/material work.
