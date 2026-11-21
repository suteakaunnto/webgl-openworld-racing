# Development Progress

Last updated: 2026-11-21 (JST)
Working branch: dev/m0-japanese-source-model
Base branch: dev/m0-foundation
Base commit: 95c3009ae8c6e8ebb0495ad219068241d6c8ce23

## Milestone status

| Milestone | Status | Notes |
|---|---|---|
| M0 — repository and source asset audit | Complete | glTF, 469 nodes, 152 meshes, 29 materials, 25 textures, and source license checked |
| M0 — licensed source-model vehicle base | Implemented in source | Source car form integrated into the viewer; car paint recoloured and source badges hidden; visual browser validation pending |
| M0 — Japanese-first interface | Implemented in source | Japanese default, English toggle, controls, status, model statistics, errors and credits localized |
| M0 — offline single-HTML packer | Implemented in source | glTF, binary geometry and local textures rewritten to data URIs; CI validation pending |
| M1–M9 | Not started | Must not be represented as implemented |

## Updated source-model permission

The user explicitly changed the earlier reference-only rule. Portions of the source geometry and materials may now be reused as-is or modified where that improves vehicle quality. The current M0 viewer uses the source glTF as its initial body-form base, recolours car-paint materials, hides visible badge groups, and fits the model for the game viewer. The original downloaded files remain unchanged in the repository.

Required author/source/license attribution and modification disclosure are included in the game credits and repository documentation. Mazda logos and visible manufacturer branding must not be used as part of the fictional game identity. No Mazda endorsement is implied.

## License and attribution

- Source model: "Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com"
- Author: vecarz
- License: CC BY 4.0, as stated in the preserved original `license.txt`
- The source license text says the author must be credited and commercial use is allowed.
- In-game credits include the original title, author, Sketchfab source link, CC BY 4.0 link and a modification description.
- The model license does not automatically clear third-party Mazda trademarks or other rights.

## Build and test record

- The previous M0 build on commit 95c3009ae8c6e8ebb0495ad219068241d6c8ce23 passed GitHub Actions and generated a standalone HTML artifact.
- This branch changes the runtime vehicle source and packaging pipeline. Its CI result is pending until the branch push finishes.
- TypeScript typecheck, esbuild bundle, source-model packaging, and the output validator must all pass before treating this branch as build-verified.
- Local browser/offline visual testing has not yet been performed.
- The current output is a vehicle-form viewer, not yet a playable racing game.
- No driving physics, open world, traffic AI, race events, full garage, controller validation, or finished roster are implemented yet.
- The 40,000-line minimum / 48,000-line target remain long-term scope goals, not current progress.

## Known limitations and open risks

- The integrated source model is currently a visual base, not a completed fictional production vehicle.
- The body design still needs a documented reused/modified/original parts register and custom Asterion details.
- Source logos and all other visible manufacturer marks must be removed or replaced before this vehicle is considered complete.
- The source model is relatively detailed; triangle and texture performance must be checked on the target integrated-GPU laptop and mobile devices.
- The final in-game license/credits panel must remain visible and functional in the offline HTML.
- Runtime model loading from embedded data URIs must be tested in Chrome/Edge with network disabled.

## Next actions

1. Run CI for this branch and resolve type/build/pack/output-check failures.
2. Download the new artifact and open it in Chrome/Edge with the network disabled.
3. Inspect front, rear, side, top and three-quarter views; check the initial camera framing.
4. Confirm all Mazda badges/brand emblems are hidden and game credits are present in Japanese and English.
5. Build the Asterion-specific design by replacing or modifying selected bumpers, lamps, spoiler, cabin details, wheel design and original fictional badges.
6. Measure draw calls, triangle count, texture memory and load time before starting the open-world environment.
