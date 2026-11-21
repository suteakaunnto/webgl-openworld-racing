# Development Progress

Last updated: 2026-11-21 (JST)
Working branch: dev/m0-foundation
Base branch: main
Latest change: reference-only model policy

## Milestone status

| Milestone | Status | Notes |
|---|---|---|
| M0 — repository and model audit | In progress | Repository, source asset metadata, licence, and initial Type A research checked |
| M0 — original procedural vehicle-form viewer | Implemented in source | Updated to avoid all glTF imports; requires CI and browser validation |
| M0 — reference-only inspector | Implemented in source | Separate tools page, excluded from dist; requires local browser validation |
| M0 — single-HTML packer | Implemented in source | Updated to bundle game code only and reject reference-model leakage; requires CI |
| M1–M9 | Not started | Must not be represented as implemented |

## Reference model policy

The user clarified that the supplied RX-7 3D model should be used only as a visual reference, not directly used in the game. The project now treats this as a firm rule:
- The glTF may be opened only in tools/reference-inspector.html for dev-time visual comparison.
- Do not import it in src/main.ts or in any game runtime module.
- Do not copy/trace source mesh geometry, textures, or material maps into the game.
- Create the Asterion 13R with independent parametric geometry, dimensions, parts, and original materials.
- The original asset folder and license remain unchanged in the repository.
- scripts/pack.mjs never reads the reference asset folder.
- dist/index.html must not contain the source mesh, binary, textures, source attribution strings, or GLTFLoader.
- Any earlier M0 implementation that embedded the source glTF is superseded by this updated policy.

## Completed investigation

- Confirmed the source folder and all 28 files.
- Confirmed glTF 2.0, one scene, 469 nodes, 152 meshes, 29 materials, 25 textures, and 25 images.
- Confirmed scene.bin declared and observed size: 2,934,308 bytes.
- Confirmed scene.gltf size: 396,160 bytes.
- Confirmed extensions KHR_materials_specular, KHR_materials_clearcoat, and KHR_materials_transmission.
- Read the original license.txt and copied its required attribution into docs/ASSET_CREDITS.md.
- Inspected node and material names as reference metadata only. No source node is mapped to a playable rig.
- Researched Type A facts against Mazda's 2002 manufacturer release and Toyota GAZOO's Type A specification page.
- Created initial fictional naming register; the Asterion 13R remains a working fictional vehicle name.

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
- tools/reference-inspector.html

## Build and test record

- GitHub branch creation and source-repository writes: successful.
- Initial M0 implementation embedded the supplied glTF in the prototype; this was deliberately superseded after the user clarified the model should be reference-only.
- First CI run stopped during setup-node because npm caching expected a lockfile that was not present.
- Second CI run installed dependencies, then TypeScript reported strict-null errors for DOM element variables.
- A required-element helper was added to fix the nullability issue.
- Current M0 CI run passed TypeScript and esbuild but stopped in pack.mjs because a post-replacement placeholder check treated inserted bundle text as a possible unresolved marker. The packer now validates exactly one placeholder in the template before replacement and inserts the bundle through a callback.
- GitHub Actions ran npm install successfully. TypeScript typecheck and esbuild bundling passed on commit a532325fa532b6703ebbf951bfbf8622143f7e0c; the first reference-only packer run failed at its post-replacement placeholder assertion. A fix is committed in 44f3f57aab2bbbee96d97157725f68fb87d09272 and its rerun is pending.
- Local offline open and visual browser validation have not been performed.
- The procedural vehicle-form viewer is an early shape study, not a finished production vehicle.
- The reference inspector is a dev-only page and must be tested locally via HTTP server.
- No actual PC, smartphone, Xbox, or Switch Pro controller test has been performed.

## Known limitations and open risks

- Current custom body geometry is an early loft study; production fender cut-outs, wheel arches, true panel gaps, independent hood/door panels, cabin details, and high-quality original materials remain unfinished.
- The current wheels and lamps are procedural study components, not final detailed parts.
- Full Asterion reference/difference sheet is not yet complete.
- Final vehicle dimensions must be validated against Type A engineering data without reproducing its exact body shape.
- No playable driving system, physics, open world, AI traffic, race events, or full garage is implemented yet.
- 40,000-line minimum and 48,000-line target remain long-term scope goals, not current progress.

## Next actions

1. Confirm the latest GitHub Actions run on commit 44f3f57aab2bbbee96d97157725f68fb87d09272 and fix any remaining errors.
2. Open the procedural vehicle dist/index.html in a WebGL2 browser with network disabled.
3. Open tools/reference-inspector.html locally and perform a visual survey of the source reference.
4. Create a written reference observation sheet for hood, fenders, glass, wheel arches, cabin, and overall stance.
5. Create a design-difference sheet to make sure the Asterion's form is independently designed.
6. Improve the custom loft surfaces, fender cut-outs, wheel arches, glass seams, and original details before broadening the vehicle roster.
