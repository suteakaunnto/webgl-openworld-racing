# RX-7 Reference Model — Research Only, Not a Game Asset

Status: source inventory and static glTF inspection completed. The model is not imported into the game, not used as player or AI vehicle geometry, not modified into a derived game mesh, and not embedded in the final HTML.

## Confirmed use policy

The supplied mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com folder is a separate development reference library. Use it only to examine broad visual and engineering references such as:

- Overall coupe proportions and stance.
- Hood / bonnet length, crown, and transition into the front fenders.
- Fender volume and wheel-arch clearance.
- Roof, windshield, side-glass, and rear-hatch surface relationships.
- Bumper and side-sill separation.
- General placement and scale relationships of lamps, mirrors, wheels, and cabin details.
- Material categories such as painted metal, glass, rubber, and unpainted trim.

The source model must not be copied, traced vertex-for-vertex, re-skinned, decimated into game LODs, rigged as a playable car, or shipped as part of the game. Do not use its mesh data or textures as the basis of production geometry/materials.

The production vehicle inspired by the research is the fictional Veyra Rotary Atelier Asterion 13R. It must have its own proportions, cross-sections, surface transitions, lamps, trim, wheel design, cabin, material maps, and badge. It is a rotary-powered FR sports coupe concept, not a Mazda or an in-game licensed RX-7.

## Source folder — preserved unchanged

Repository folder:
mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com/

The original source files are retained for reference and license provenance. At the time of inventory there were 28 files:

- scene.gltf — 396,160 bytes
- scene.bin — 2,934,308 bytes
- license.txt — 796 bytes
- textures/ — 25 PNG files

## Static glTF inventory

- glTF version: 2.0
- Generator: Sketchfab-16.75.0
- Scenes: 1
- Nodes: 469
- Meshes: 152
- Materials: 29
- Textures: 25
- Images: 25
- Buffer URI: scene.bin
- Extensions used: KHR_materials_specular, KHR_materials_clearcoat, KHR_materials_transmission
- Asset extras identify title, author vecarz, Sketchfab source, and CC BY 4.0.

This metadata is useful to understand what the reference contains; it is not a reason to load it in the game runtime.

## Static texture and component inventory

The 25 texture filenames and source material names are retained in the original asset directory. They may be enumerated in research notes to help identify which general surface categories a reference scene uses, but none of those textures may be sampled, copied, embedded, or repurposed in the game.

Node names include Hood6, FenderFR6, FenderFL6, BumperF6, BumperR6, Boot6, Diffuser6, MirrorL6, MirrorR6, Spoiler6, Exhausts6, AnimatedHeadLightL6, AnimatedHeadLightR6, TailLightL6, TailLightR6, Interior5, SteeringWheel5, DoorL4, and DoorR4. These are visual-inspection clues only and must not be treated as production part definitions or copied geometry.

## Development-only inspection

tools/reference-inspector.html is a separate local viewer for the source model. It:
- Loads the reference over a local development server.
- Displays bounds, node, mesh, material, and triangle counts.
- Allows orbit inspection of the source geometry.
- Is not imported by src/main.ts, scripts/build.mjs, or the final packer.
- Is not included in dist/index.html.

Run from the repository root:

    npx http-server . -p 8080

Open:

    http://localhost:8080/tools/reference-inspector.html

This tool is for comparison and observation only. Do not copy or directly port source mesh, texture, or node hierarchy data into the game.

## Production geometry process

1. Research actual vehicle engineering dimensions independently and record source citations in docs/REFERENCE_RESEARCH.md.
2. Inspect the reference model visually using the separate development inspector.
3. Record observations as written proportions, measurements, and design notes; do not export source meshes or textures.
4. Design the fictional Asterion 13R cross-sections from its own parameter set.
5. Build the body with original longitudinal loft sections and custom wheel-arch cut-outs / fender surfaces.
6. Create original cabin, windows, hood, doors, lamps, mirrors, bumpers, rims, tyres, seats, and cockpit parts.
7. Create new procedural or authored materials. Do not use the reference PNG files as source textures.
8. Compare the new car's general stance and broad surface-flow quality to independent public photographs and technical dimensions. Do not attempt a one-to-one body copy.
9. Add a design-difference review before calling the fictional car complete.

## Distribution firewall

scripts/pack.mjs never reads the reference directory. dist/index.html must not contain:
- scene.gltf or scene.bin
- GLTFLoader
- any of the source texture files
- source model author/source identifiers
- source model meshes, textures, or binary data

scripts/check-output.mjs enforces those conditions. The final distribution contains only dist/index.html, the application, and bundled Three.js.

## Not yet completed

- Full visual survey of the reference from front, side, rear, top, and three-quarter angles.
- Independently documented design-difference sheet for the Asterion.
- High-quality original body shell and panel geometry.
- Independent wheel-arch and fender construction.
- Original PBR material set and original UV textures.
- A production cockpit with two original seats and controls.
- Final vehicle dimensions and proportion validation.
- Original game-vehicle rigging and driving integration.

Do not mark those tasks complete until they have been implemented and visually checked.
