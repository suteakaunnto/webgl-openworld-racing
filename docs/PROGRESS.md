# Development Progress

Last updated: 2026-11-21 (JST)
Working branch: dev/m1-vehicle-motion-test
Base branch: dev/m0-foundation
Base commit: 95c3009ae8c6e8ebb0495ad219068241d6c8ce23
Latest verified commit: pending M1 GitHub Actions run

## Milestone status

| Milestone | Status | Notes |
|---|---|---|
| M0 — repository and source asset audit | Complete | glTF, 469 nodes, 152 meshes, 29 materials, 25 textures, and source license checked |
| M0 — licensed full-source vehicle integration | Implemented in source | Complete 469-node / 152-mesh scene is used; all parts, badges, material assignments and textures retained; only paint colour and display scale/position changed |
| M0 — Japanese-first interface | Implemented in source | Japanese default, English toggle, controls, status, model statistics, errors and credits localized |
| M0 — offline single-HTML packer | CI verified | glTF, binary geometry and local textures embedded as data URIs; output validator passed |
| M0 — offline single-HTML packer | CI verified | glTF, binary geometry and local textures embedded as data URIs; output validator passed |
| M1 — vehicle-part motion test rig | Implemented in source; CI pending | Wheel pivots, front steering, pop-up headlights, spotlights, emissive head/tail/indicator lamps and Japanese/English test controls |
| M2–M9 | Not started | Must not be represented as implemented |

## Updated source-model permission

The user explicitly authorized full use of the supplied RX-7 model. The current M0 viewer loads the entire glTF scene, keeps all source nodes and meshes visible, retains all source material assignments and textures, and does not hide badge groups. The game-side changes include paint/display fitting plus a runtime motion rig. The rig reparents selected source subassemblies into transform pivots without editing original geometry, materials or texture files. It animates wheel assemblies (excluding stationary calipers), front-wheel steering, pop-up headlight parts and additional light/emission effects. The original downloaded files remain unchanged in the repository.

Required author/source/license attribution and modification disclosure are included in the game credits and repository documentation. Visible Mazda marks remain in this prototype under the user's full-model-use direction. CC BY 4.0 does not grant trademark rights; review visible marks separately before public commercial release. No Mazda endorsement is implied.

## License and attribution

- Source model: "Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com"
- Author: vecarz
- License: CC BY 4.0, as stated in the preserved original `license.txt`
- The source license text says the author must be credited and commercial use is allowed.
- In-game credits include the original title, author, Sketchfab source link, CC BY 4.0 link and a modification description.
- The model license does not automatically clear third-party Mazda trademarks or other rights.

## Build and test record

- The previous M0 build on commit 95c3009ae8c6e8ebb0495ad219068241d6c8ce23 passed GitHub Actions and generated a standalone HTML artifact.
- The source-model integration branch passed GitHub Actions run 44884352245 on commit 944e791b33ada9d24e0b637969f43940c926b913.
- Full source-model integration (including all nodes, meshes, badges, material assignments and textures) passed GitHub Actions run 44885125797 on commit 78f94a75f49be2107aeac704dfb3d8fa86263d27.
- Latest verified package: dist/index.html, 10,213,531 bytes; artifact ZIP: 5,795,302 bytes.
- The output checker confirmed a single HTML file, embedded source geometry/textures, complete Japanese/English attribution and no runtime network dependencies.
- TypeScript typecheck, esbuild bundle, source-model packaging, and the output validator must all pass before treating this branch as build-verified.
- M1 motion-rig TypeScript compilation, standalone packaging and static output checks are pending the first branch Actions run.
- Local browser/offline visual testing has not yet been performed; in particular, actual pivot alignment, wheel rotation axes, pop-up hinge direction, beam direction and lamp material mapping still require visual confirmation.
- The current output is a vehicle-form viewer, not yet a playable racing game.
- No driving physics, open world, traffic AI, race events, full garage, controller validation, or finished roster are implemented yet.
- The 40,000-line minimum / 48,000-line target remain long-term scope goals, not current progress.

## Known limitations and open risks

- The integrated source model remains a prototype base, not a completed fictional production vehicle.
- The motion rig uses named source-node groups and estimated pivot/hinge locations; some positions, axes and light direction may need adjustment after browser inspection.
- The body design still needs a documented reused/modified/original parts register and custom Asterion details.
- The full source model includes Mazda marks. The user's current direction is to retain them in the prototype; separate trademark clearance or removal may be required before public commercial release.
- The source model is relatively detailed; triangle and texture performance must be checked on the target integrated-GPU laptop and mobile devices.
- The final in-game license/credits panel must remain visible and functional in the offline HTML.
- Runtime model loading from embedded data URIs must be tested in Chrome/Edge with network disabled.

## M1 motion-test actions

1. Wait for the branch GitHub Actions run to finish and fix any compile/package failure.
2. Download the M1 standalone HTML artifact and run it in Chrome/Edge with the network disabled.
3. Confirm four wheel assemblies spin without the calipers rotating with them.
4. Test front steering, both pop-up headlights, headlight beams, brake lamps, left/right indicators and hazard lights.
5. Report any visual mismatch so the pivots/material classification can be tuned before adding driving physics.

## Next actions

1. Download the latest passing artifact from run 44885125797 and open it in Chrome/Edge with the network disabled.
2. Inspect the complete source model from front, rear, side, top and three-quarter views; check all parts, badge visibility and camera framing.
3. Confirm the full-model use statement and vecarz / CC BY 4.0 credits in Japanese and English.
4. Measure draw calls, triangle count, texture memory and load time before starting the open-world environment.
5. Review visible Mazda branding separately before any public commercial release.
