# Licensed Vehicle Model — Source Reuse and Game Integration

Status: the user has explicitly changed the earlier reference-only restriction. The supplied Mazda RX-7 Spirit R Type A glTF may now be used as a licensed geometry/material base for selected parts of the fictional Asterion 13R.

## Current rule

- The supplied source model is no longer restricted to visual observation.
- Selected source vehicle meshes and materials may be reused as-is or modified where that produces a materially better result than rebuilding the surfaces procedurally.
- The current M0 viewer loads the original vehicle model as its first high-quality body-form baseline, then applies game-side adjustments: car-paint colour, hiding source badge/manufacturer-mark groups, and scale/position fitting.
- Original source files remain unchanged in the repository. The packer reads them and embeds copies into the standalone HTML.
- Required CC BY 4.0 attribution, source link, license link, and modification disclosure are mandatory in the game credits and repository docs.
- Never imply that Mazda or the original model author endorses the game.
- Keep Mazda emblems and visible manufacturer branding out of the fictional in-game identity. Use the fictional Veyra Rotary Atelier and Asterion 13R names.

## Source asset

Repository folder:

    mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com/

Original files include:
- `scene.gltf` — glTF 2.0 scene
- `scene.bin` — geometry buffer
- `license.txt` — original license and required attribution
- `textures/` — source PNG textures

Source inventory at the initial audit:
- 469 nodes
- 152 meshes
- 29 materials
- 25 textures
- 25 images
- glTF 2.0
- glTF binary buffer: 2,934,308 bytes
- scene.gltf: 396,160 bytes

Key component naming found in the glTF includes Hood6, FenderFR6, FenderFL6, FendersR6, BumperF6, BumperR6, Boot6, DoorL4, DoorR4, Glass6, Door glass, Boot glass, mirrors, lamps, spoiler, wheels and cockpit parts. These can be selectively retained, replaced, or reworked as the Asterion design develops.

## License

The original `license.txt` declares CC-BY-4.0 and says the author must be credited; commercial use is allowed.

Required attribution:

This work is based on "Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com" (https://sketchfab.com/3d-models/mazda-rx-7-spirit-r-type-a-2002-wwwvecarzcom-57ef6f2e2980487080b84e0b16979978) by vecarz (https://sketchfab.com/heynic) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/).

Every distributed build that contains or uses this asset must:
1. Credit vecarz.
2. Link to the source model.
3. Link to CC BY 4.0.
4. Clearly describe modifications.
5. Avoid suggesting endorsement by the creator or Mazda.

The CC license governs the model asset. It does not itself grant Mazda trademark rights or automatically clear other third-party rights visible in the asset. Hide/remove source brand emblems and do not present the game vehicle as an official Mazda model.

## Offline single-HTML pipeline

`scripts/pack.mjs`:
1. Reads the game bundle and HTML template.
2. Reads `scene.gltf` and verifies the source metadata / original license file.
3. Converts the local glTF binary buffer and all local texture images to data URIs.
4. Embeds the rewritten glTF JSON and application code into `dist/index.html`.
5. Does not edit the original source asset files.

`scripts/check-output.mjs` checks:
- The distributable is exactly one `index.html`.
- The embedded model block exists.
- Creator, source and CC BY 4.0 attribution are present.
- The modification disclosure is present in Japanese and English.
- No external runtime script, stylesheet, model, texture, or network-loaded asset is declared.

## Next model-quality actions

1. Review the integrated model from front, rear, side, top, and all three-quarter angles.
2. Identify which source parts should remain untouched and which should be reshaped for the Asterion identity.
3. Replace/hide all remaining source emblems and visible real-manufacturer marks.
4. Add original Asterion details: badges, lamps where needed, trim, aero, interior accents and materials.
5. Create an explicit parts register marking each component as reused, modified, or original.
6. Reduce model draw calls and texture size for the intended PC and mobile performance targets.
7. Create LODs from the approved game model only; do not let automatic optimization reintroduce hidden brand marks.
