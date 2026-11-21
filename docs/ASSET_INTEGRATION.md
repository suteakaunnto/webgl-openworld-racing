# RX-7 glTF Asset Integration Record

Status: source inventory and static JSON inspection completed; browser runtime integration is implemented in the M0 viewer but still requires a successful build and browser test.

## Source location

Repository folder:
mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com/

Files are retained with their original names. The source folder is immutable for the purposes of the game build.

## Verified source inventory

- glTF version: 2.0
- glTF generator: Sketchfab-16.75.0
- Scenes: 1
- Nodes: 469
- Meshes: 152
- Materials: 29
- Textures: 25
- Images: 25
- Buffer: scene.bin, declared and observed size 2,934,308 bytes
- scene.gltf: 396,160 bytes
- license.txt: 796 bytes
- Total files in the source asset folder: 28

The model's asset extras identify the title, author vecarz, Sketchfab source URL, and CC-BY-4.0 license.

## glTF features and references

- Buffer URI: scene.bin
- Image URIs: 25 relative PNG paths under textures/
- Extensions used: KHR_materials_specular, KHR_materials_clearcoat, KHR_materials_transmission
- The 25 images are referenced through 25 glTF texture objects in the current source.
- The scene root starts at node 0, named Sketchfab_model.

### Texture inventory

1. Calip_Col_normal.png
2. mazdaM_Badge_Max1_baseColor.png
3. mazdaM_Badge_Max1_normal.png
4. mazdaM_Chassis_Max1_baseColor.png
5. mazdaM_Chassis_Max1_metallicRoughness.png
6. mazdaM_Chassis_Max1_normal.png
7. mazdaM_Engine_Max1_baseColor.png
8. mazdaM_Engine_Max1_normal.png
9. mazdaM_InteriorTiledSimple_Max1_baseColor.png
10. mazdaM_InteriorTiledSimple_Max1_normal.png
11. mazdaM_InteriorTiled_Max1_baseColor.png
12. mazdaM_InteriorTiled_Max1_metallicRoughness.png
13. mazdaM_Interior_Max1_baseColor.png
14. mazdaM_Interior_Max1_normal.png
15. mazdaM_LightBucket_Max1_baseColor.png
16. mazdaM_LightBucket_Max1_metallicRoughness.png
17. mazdaM_RimBadge_Max1_baseColor.png
18. mazdaM_RimBadge_Max1_normal.png
19. mazdaM_Rim_NoTint_Max1_normal.png
20. wheelsMazda_RX7TNR0_1993_CallipersCalliperBadgeA_Material1_baseColor.png
21. wheels_TNRRims_92A18NbBrakeDisc_ForgedDrilled_Material1_baseColor.png
22. wheels_TNRRims_92A18NbBrakeDisc_ForgedDrilled_Material1_metallicRoughness.png
23. wheels_TNRRims_92A18NbBrakeDisc_ForgedDrilled_Material1_normal.png
24. wheels_TNRRims_92A18NbTireBlur_Material1_baseColor.png
25. wheels_TNRRims_92A18NbTireBlur_Material1_normal.png

### Important material names

The 29 source material names are retained and must be reviewed before any remapping:
- Calip_Col
- wheelsMazda_RX7TNR0_1993_CallipersCalliperGloss_Material1
- wheelsMazda_RX7TNR0_1993_CallipersCalliperBadgeA_Material1
- wheels_TNRRims_92A18NbTireBlur_Material1
- wheels_TNRRims_92A18NbBrakeDisc_ForgedDrilled_Material1
- mazdaM_RimBadge_Max1
- mazdaM_Rim_NoTint_Max1
- mazdaM_Rim_Main_Max1
- mazdaM_LightGlassNormal_Clear_Low1
- mazdaM_LightGlassNormal_Red_Low1
- mazdaM_LightGlassNormal_Orange_Low1
- mazdaM_LightBucket_Max1
- mazdaM_CarPaint_Max_018
- mazdaM_Badge_Max1
- mazdaM_Opaque_PlasticRoughBlack_Max1
- mazdaM_GlassOpaque_Mirror_Max_002
- mazdaM_CarPaintNormal_Max1
- mazdaM_Opaque_PlasticSmoothBlack_Max1
- mazdaM_Opaque_ChromeSmooth_Max1
- mazdaM_Chassis_Max1
- mazdaM_Engine_Max1
- mazdaM_Opaque_NickelRough_Max1
- mazdaM_Opaque_NickelSmooth_Max1
- mazdaM_CarPaint_Trim_PlasticSmoothBlack_Max1
- mazdaM_InteriorTiled_Max1
- mazdaM_Interior_Max1
- mazdaM_InteriorTiledSimple_Max1
- mazdaM_Glass_WindowSurroundFront_Low1
- mazdaM_Glass_WindowFront_Low1

## Static node-name observations

Names include groups or nodes containing:
- Wheel-related groups and subassemblies: Wheel1A, WheelFL6, WheelRL6, tire, rim, brake-disc, and calliper naming.
- Front and rear body areas: Hood6, FenderFR6, FenderFL6, BumperF6, BumperR6, Boot6, Diffuser6.
- Exterior details: MirrorL6, MirrorR6, Spoiler6, Exhausts6.
- Lighting: AnimatedHeadLightL6, AnimatedHeadLightR6, TailLightL6, TailLightR6.
- Cabin: Interior5, SteeringWheel5, DoorL4, DoorR4, and glass nodes.

These names are search clues only. They do not confirm wheel pivots, physical locations, exact left/right orientation, or animation correctness. The hierarchy and geometry must be inspected visually in the loaded scene before assigning controls.

## M0 import and packing strategy

1. Load the source glTF through Three.js GLTFLoader.
2. At build time, scripts/pack.mjs parses the glTF.
3. The packer checks every external buffer and image URI and verifies each file exists.
4. The packer converts scene.bin and all image bytes into data URIs, updates the in-memory glTF JSON only, and encodes that JSON into the final HTML.
5. The final HTML embeds the esbuild bundle and the glTF JSON data URI.
6. The original glTF and texture files remain unchanged in the repository.

## Not yet verified

- Browser rendering of every mesh and texture.
- Exact real-world scale and model coordinate axes.
- Four wheel pivots and correct rotation axes.
- Steering pivot and suspension articulation.
- Whether all materials render as intended in the selected Three.js version.
- Visual removal of Mazda marks and wheel badges from the derived game model.
- LOD0–LOD3 generation.
- Performance in the final standalone HTML.

Do not mark these as complete until actual browser tests and derived-asset review have been performed.

## Required next asset tasks

- Capture orthographic front, side, rear, and top views of the loaded model.
- Compare overall dimensions with docs/REFERENCE_RESEARCH.md.
- Determine the model's forward axis and scale without non-uniform scaling.
- Identify each wheel mesh group and build stable pivots.
- Verify material and texture color spaces.
- Make a derived copy for fictional emblem and badge replacement; preserve the source model.
- Add a regression check that the final HTML still contains all 25 source textures.
