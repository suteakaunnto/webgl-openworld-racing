# Licensed Vehicle Model — Full-Source Integration

Status: the user has explicitly authorized use of the entire supplied Mazda RX-7 Spirit R Type A glTF model, not merely selected parts or visual reference. The previous reference-only policy is superseded.

## Current rule

- Use the source glTF scene in full for the current M0 vehicle prototype.
- Keep all source scene nodes and meshes visible, including body panels, doors, cabin/interior, steering wheel, wheels, tyres, brakes, lamps, mirrors, spoiler and badge objects.
- Use the full source material assignments and all included local textures.
- Do not hide source badge/manufacturer-mark nodes in the M0 viewer. The user explicitly requested full use of the provided model.
- Current visual changes include car-paint recolouring and scale/position fitting; a game-side runtime rig now animates selected vehicle subassemblies and light effects without editing source geometry or source files.
- The original source folder and `license.txt` must remain unchanged. The packer embeds copies of the model data, buffer and textures into the standalone HTML.
- In-game credits must name vecarz, link to the original Sketchfab page, link to CC BY 4.0, and describe the actual changes.
- The visible Mazda marks in the supplied model are retained in this development prototype because the user requested full use. Do not imply Mazda endorsement or claim the game is an official Mazda product.
- Before public commercial release, separately review the Mazda trademarks/branding visible in the model. CC BY 4.0 does not license trademark rights.

## Source asset

Repository folder:

    mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com/

Original files include:
- `scene.gltf` — full glTF 2.0 scene
- `scene.bin` — geometry buffer
- `license.txt` — original license and required attribution
- `textures/` — 25 source PNG files

Source inventory:
- 469 nodes
- 152 meshes
- 29 materials
- 25 textures
- 25 images
- glTF 2.0
- glTF binary buffer: 2,934,308 bytes
- scene.gltf: 396,160 bytes

## License and attribution

The original `license.txt` declares CC-BY-4.0, says the author must be credited, and states commercial use is allowed.

Required attribution:

This work is based on "Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com" (https://sketchfab.com/3d-models/mazda-rx-7-spirit-r-type-a-2002-wwwvecarzcom-57ef6f2e2980487080b84e0b16979978) by vecarz (https://sketchfab.com/heynic) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/).

Current modifications: car-paint material recolouring and display scale/position fitting, plus game-side runtime pivots, motion and light-emission effects. All source geometry, scene nodes, mesh assignments, materials and textures are retained; original downloaded files remain unchanged.

CC BY 4.0 requires appropriate attribution, a license link, and an indication of changes. It also prohibits suggesting that the licensor endorses the project. Section 2(b)(2) does not grant trademark rights. The source model contains Mazda branding; review those marks separately before public commercial release. See https://creativecommons.org/licenses/by/4.0/legalcode.

## Offline single-HTML pipeline

`scripts/pack.mjs`:
1. Reads the game bundle and HTML template.
2. Reads `scene.gltf` and verifies the source metadata / original license file.
3. Converts the glTF binary buffer and all 25 local texture images to data URIs.
4. Embeds the complete rewritten glTF JSON and application code into `dist/index.html`.
5. Does not modify the original source asset files.

`scripts/check-output.mjs` checks:
- The distributable is exactly one `index.html`.
- The embedded model block exists.
- Creator, source and CC BY 4.0 attribution are present.
- The Japanese and English full-model usage/modification disclosure is present.
- The viewer no longer contains the old source-badge visibility filter.
- No external runtime script, stylesheet, model, texture, or network-loaded asset is declared.

## Next model-quality actions

1. Visually inspect the complete integrated car from front, rear, side, top and all three-quarter angles.
2. Verify that every source scene component, material and texture renders correctly in the standalone HTML.
3. Profile the complete 469-node / 152-mesh model on the target PC and mobile hardware.
4. Preserve the full model for the prototype; do not remove or replace source parts without an explicit change to the user's full-use direction.
5. If a fictional Asterion variant is created later, keep the source RX-7 representation separately identifiable and document every alteration.
