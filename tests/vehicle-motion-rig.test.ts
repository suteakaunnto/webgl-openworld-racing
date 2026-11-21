import * as THREE from "three";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { VehicleMotionRig } from "../src/vehicle-rig";

const assetDirectory = "mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com";
const gltf = JSON.parse(await readFile(resolve(process.cwd(), assetDirectory, "scene.gltf"), "utf8"));
const definitions = gltf.nodes as Array<Record<string, any>>;
const objects = definitions.map((definition, index) => {
  const object = new THREE.Group();
  object.name = definition.name || "node_" + index;
  if (Array.isArray(definition.matrix)) {
    new THREE.Matrix4().fromArray(definition.matrix).decompose(object.position, object.quaternion, object.scale);
  } else {
    if (definition.translation) object.position.fromArray(definition.translation);
    if (definition.rotation) object.quaternion.fromArray(definition.rotation);
    if (definition.scale) object.scale.fromArray(definition.scale);
  }
  if (Number.isInteger(definition.mesh)) {
    const meshDefinition = gltf.meshes[definition.mesh];
    for (const primitive of meshDefinition.primitives || []) {
      const accessor = gltf.accessors[primitive.attributes?.POSITION];
      const minimum = accessor?.min || [-0.025, -0.025, -0.025];
      const maximum = accessor?.max || [0.025, 0.025, 0.025];
      const geometry = new THREE.BufferGeometry();
      geometry.boundingBox = new THREE.Box3(
        new THREE.Vector3(minimum[0], minimum[1], minimum[2]),
        new THREE.Vector3(maximum[0], maximum[1], maximum[2])
      );
      const materialDefinition = gltf.materials[primitive.material] || {};
      const material = new THREE.MeshStandardMaterial();
      material.name = materialDefinition.name || "test-material";
      object.add(new THREE.Mesh(geometry, material));
    }
  }
  return object;
});

for (let index = 0; index < definitions.length; index += 1) {
  for (const childIndex of definitions[index].children || []) objects[index].add(objects[childIndex]);
}
const modelRoot = new THREE.Group();
for (const rootIndex of gltf.scenes[gltf.scene || 0].nodes) modelRoot.add(objects[rootIndex]);
modelRoot.updateWorldMatrix(true, true);

const rig = new VehicleMotionRig(modelRoot);
assert.equal(rig.wheelCount, 4, "all four named wheel assemblies should be detected");
assert.equal(rig.popupCount, 2, "both pop-up headlight assemblies should be detected");
assert.ok(rig.lampCount > 0, "the source lamp materials should be mapped");

const frontLeft = modelRoot.getObjectByName("MotionPivot_front-left") as THREE.Group;
const initialWheel = frontLeft.quaternion.clone();
rig.setWheelSpin(true);
rig.update(0.12);
assert.ok(frontLeft.quaternion.angleTo(initialWheel) > 0.1, "wheel spin should change wheel pivot rotation");

rig.setWheelSpin(false);
const initialSteer = frontLeft.quaternion.clone();
rig.setSteering(28);
rig.update(0.016);
assert.ok(frontLeft.quaternion.angleTo(initialSteer) > 0.1, "front steering should change front wheel pivot");

const leftPopup = modelRoot.getObjectByName("PopupHeadlightPivot_L") as THREE.Group;
const initialPopup = leftPopup.quaternion.clone();
rig.setPopup(true);
rig.setHeadlights(true);
for (let index = 0; index < 48; index += 1) rig.update(0.05);
assert.ok(leftPopup.quaternion.angleTo(initialPopup) > 0.2, "pop-up headlight pivot should animate");
const beam = modelRoot.getObjectByName("HeadlightBeam_L") as THREE.SpotLight;
assert.ok(beam && beam.intensity > 0, "headlight beam should enable when pop-ups open");

rig.setBrake(true);
let redLampLit = false;
modelRoot.traverse((node) => {
  const mesh = node as THREE.Mesh;
  if (!mesh.isMesh) return;
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  if (materials.some((material) => material.name.includes("LightGlassNormal_Red") && material.emissiveIntensity >= 2.5)) redLampLit = true;
});
assert.ok(redLampLit, "brake input should brighten the red tail lamp material");

rig.setSignal("left");
let indicatorLit = false;
for (let index = 0; index < 40 && !indicatorLit; index += 1) {
  rig.update(0.05);
  modelRoot.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (materials.some((material) => material.name.includes("LightGlassNormal_Orange") && material.emissiveIntensity >= 2.3)) indicatorLit = true;
  });
}
assert.ok(indicatorLit, "turn-signal input should flash an orange lamp material");

console.log("[motion-test] PASS — four wheel pivots detected and rotated.");
console.log("[motion-test] PASS — front steering changes wheel orientation.");
console.log("[motion-test] PASS — both pop-up assemblies detected; headlight beam enabled.");
console.log("[motion-test] PASS — brake and turn-signal lamp materials respond.");
console.log("[motion-test] Source hierarchy: " + definitions.length + " glTF nodes; " + gltf.meshes.length + " meshes.");
