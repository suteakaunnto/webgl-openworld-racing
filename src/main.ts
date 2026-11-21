/**
 * Responsibility: M0 showroom containing a completely procedural, original vehicle-form study.
 * Public API: application bootstrap only. Geometry builders will be separated into car/geometry in later milestones.
 * Dependencies: Three.js. No GLTFLoader, glTF files, reference textures, or remote assets are used here.
 * Data: original station-based longitudinal body loft, independent cabin loft, glass surfaces, lamps, and four wheel groups.
 * Relations: this is the first visual proof for the original Asterion 13R design. Reference-model observations remain outside the game runtime.
 */
import * as THREE from "three";

type BodyStation = {
  x: number;
  halfWidth: number;
  centerY: number;
  halfHeight: number;
};

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error("M0 viewer markup is missing required element: " + selector);
  return element;
}

const viewport = requireElement<HTMLElement>("#viewport");
const status = requireElement<HTMLElement>("#status");
const modelInfo = requireElement<HTMLElement>("#model-info");
const errorPanel = requireElement<HTMLElement>("#error");
const rotateButton = requireElement<HTMLButtonElement>("#rotate-toggle");
const resetButton = requireElement<HTMLButtonElement>("#reset-view");

let renderer: THREE.WebGLRenderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
} catch (error) {
  errorPanel.style.display = "block";
  errorPanel.textContent = "WebGL2 initialization failed.\n" + String(error);
  status.textContent = "WEBGL2 UNAVAILABLE";
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b121b);
scene.fog = new THREE.Fog(0x0b121b, 20, 75);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.05, 250);
const target = new THREE.Vector3(0, 0.78, 0);
let azimuth = -0.72;
let polar = 1.16;
let radius = 7.9;
const minimumRadius = 3.6;
const maximumRadius = 24;

scene.add(new THREE.HemisphereLight(0xb9d9ef, 0x17202b, 1.5));
const keyLight = new THREE.DirectionalLight(0xffecd4, 4.0);
keyLight.position.set(7, 10, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -8;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x80bce8, 2.1);
fillLight.position.set(-8, 4, -4);
scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xf0f5ff, 2.6);
rimLight.position.set(0, 5, -10);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({ color: 0x111b26, roughness: 0.78, metalness: 0.12 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0.025;
floor.receiveShadow = true;
scene.add(floor);

const displayRing = new THREE.Mesh(
  new THREE.RingGeometry(2.85, 2.89, 128),
  new THREE.MeshBasicMaterial({ color: 0x52758c, transparent: true, opacity: 0.26, side: THREE.DoubleSide })
);
displayRing.rotation.x = -Math.PI / 2;
displayRing.position.y = 0.03;
scene.add(displayRing);

const vehicle = new THREE.Group();
vehicle.name = "Asterion13R_OriginalProceduralStudy";
scene.add(vehicle);

const bodyPaint = new THREE.MeshPhysicalMaterial({
  color: 0x143c56,
  metalness: 0.78,
  roughness: 0.23,
  clearcoat: 1,
  clearcoatRoughness: 0.13
});
const roofPaint = new THREE.MeshPhysicalMaterial({
  color: 0x0c2638,
  metalness: 0.68,
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.12
});
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x10232e,
  metalness: 0.12,
  roughness: 0.12,
  transmission: 0.18,
  transparent: true,
  opacity: 0.82,
  side: THREE.DoubleSide
});
const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x10161c, roughness: 0.52, metalness: 0.32 });
const lampMaterial = new THREE.MeshStandardMaterial({
  color: 0xbfe7ff, emissive: 0x75bde8, emissiveIntensity: 1.5, metalness: 0.25, roughness: 0.16
});
const tailMaterial = new THREE.MeshStandardMaterial({
  color: 0x5d1119, emissive: 0xb51d2a, emissiveIntensity: 0.75, metalness: 0.1, roughness: 0.2
});
const tireMaterial = new THREE.MeshStandardMaterial({ color: 0x101214, roughness: 0.9 });
const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x87939d, metalness: 0.92, roughness: 0.22 });
const brakeMaterial = new THREE.MeshStandardMaterial({ color: 0x3d454a, metalness: 0.82, roughness: 0.38 });
const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8d2534, roughness: 0.72 });

function loftGeometry(stations: BodyStation[], segments = 40, exponent = 0.88): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const rowLength = segments + 1;
  for (const station of stations) {
    for (let step = 0; step <= segments; step += 1) {
      const angle = (step / segments) * Math.PI * 2;
      const rawY = Math.cos(angle);
      const rawZ = Math.sin(angle);
      const shapedY = Math.sign(rawY) * Math.pow(Math.abs(rawY), exponent);
      const shapedZ = Math.sign(rawZ) * Math.pow(Math.abs(rawZ), exponent);
      positions.push(station.x, station.centerY + shapedY * station.halfHeight, shapedZ * station.halfWidth);
    }
  }
  for (let row = 0; row < stations.length - 1; row += 1) {
    for (let step = 0; step < segments; step += 1) {
      const a = row * rowLength + step;
      const b = a + rowLength;
      const c = b + 1;
      const d = a + 1;
      indices.push(a, b, d, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function addLoft(name: string, stations: BodyStation[], material: THREE.Material, segments = 40): THREE.Mesh {
  const mesh = new THREE.Mesh(loftGeometry(stations, segments), material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  vehicle.add(mesh);
  return mesh;
}

function addBox(name: string, size: THREE.Vector3, position: THREE.Vector3, material: THREE.Material, rotation = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.name = name;
  mesh.position.copy(position);
  mesh.rotation.y = rotation;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  vehicle.add(mesh);
  return mesh;
}

function addPanel(name: string, points: THREE.Vector3[], material: THREE.Material): THREE.Mesh {
  const vertices = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  vehicle.add(mesh);
  return mesh;
}

const bodyStations: BodyStation[] = [
  { x: -2.13, halfWidth: 0.63, centerY: 0.48, halfHeight: 0.18 },
  { x: -1.94, halfWidth: 0.72, centerY: 0.51, halfHeight: 0.23 },
  { x: -1.60, halfWidth: 0.79, centerY: 0.53, halfHeight: 0.27 },
  { x: -1.18, halfWidth: 0.82, centerY: 0.54, halfHeight: 0.29 },
  { x: -0.66, halfWidth: 0.80, centerY: 0.55, halfHeight: 0.30 },
  { x: 0.00, halfWidth: 0.79, centerY: 0.55, halfHeight: 0.31 },
  { x: 0.72, halfWidth: 0.78, centerY: 0.54, halfHeight: 0.29 },
  { x: 1.25, halfWidth: 0.75, centerY: 0.52, halfHeight: 0.27 },
  { x: 1.72, halfWidth: 0.70, centerY: 0.50, halfHeight: 0.23 },
  { x: 2.08, halfWidth: 0.62, centerY: 0.48, halfHeight: 0.17 }
];
addLoft("OriginalBodyShell_LongitudinalLoft", bodyStations, bodyPaint, 48);

const cabinStations: BodyStation[] = [
  { x: -0.82, halfWidth: 0.64, centerY: 0.91, halfHeight: 0.25 },
  { x: -0.57, halfWidth: 0.62, centerY: 1.00, halfHeight: 0.31 },
  { x: -0.22, halfWidth: 0.58, centerY: 1.06, halfHeight: 0.34 },
  { x: 0.36, halfWidth: 0.57, centerY: 1.05, halfHeight: 0.33 },
  { x: 0.73, halfWidth: 0.61, centerY: 0.99, halfHeight: 0.27 },
  { x: 0.99, halfWidth: 0.65, centerY: 0.88, halfHeight: 0.19 }
];
addLoft("OriginalCabinAndRoof_Loft", cabinStations, roofPaint, 40);

for (const side of [-1, 1]) {
  const z = side * 0.598;
  addPanel("SideGlass_Front_" + side, [
    new THREE.Vector3(-0.70, 0.99, z),
    new THREE.Vector3(-0.43, 1.285, side * 0.548),
    new THREE.Vector3(0.20, 1.31, side * 0.535),
    new THREE.Vector3(0.28, 1.00, z)
  ], glassMaterial);
  addPanel("SideGlass_Rear_" + side, [
    new THREE.Vector3(0.35, 1.30, side * 0.535),
    new THREE.Vector3(0.68, 1.24, side * 0.56),
    new THREE.Vector3(0.91, 0.93, side * 0.617),
    new THREE.Vector3(0.42, 0.99, z)
  ], glassMaterial);
  addBox("MirrorHousing_" + side, new THREE.Vector3(0.20, 0.09, 0.15), new THREE.Vector3(-0.55, 0.99, side * 0.79), trimMaterial, side * -0.12);
  addBox("SideSill_" + side, new THREE.Vector3(2.05, 0.10, 0.10), new THREE.Vector3(0.06, 0.32, side * 0.77), trimMaterial);
}

addPanel("FrontWindscreen_Original", [
  new THREE.Vector3(-0.90, 0.84, -0.65),
  new THREE.Vector3(-0.52, 1.27, -0.53),
  new THREE.Vector3(-0.52, 1.27, 0.53),
  new THREE.Vector3(-0.90, 0.84, 0.65)
], glassMaterial);
addPanel("RearGlass_Original", [
  new THREE.Vector3(0.40, 1.28, -0.53),
  new THREE.Vector3(0.40, 1.28, 0.53),
  new THREE.Vector3(1.02, 0.75, 0.63),
  new THREE.Vector3(1.02, 0.75, -0.63)
], glassMaterial);

for (const side of [-1, 1]) {
  addBox("FrontLamp_" + side, new THREE.Vector3(0.085, 0.075, 0.34), new THREE.Vector3(-1.97, 0.665, side * 0.47), lampMaterial, side * 0.08);
  addBox("RearLamp_" + side, new THREE.Vector3(0.075, 0.09, 0.42), new THREE.Vector3(1.98, 0.60, side * 0.39), tailMaterial, side * -0.06);
  addBox("DoorHandle_" + side, new THREE.Vector3(0.13, 0.025, 0.025), new THREE.Vector3(0.22, 0.70, side * 0.786), rimMaterial);
}

addBox("FrontLowerIntake", new THREE.Vector3(0.07, 0.13, 0.60), new THREE.Vector3(-2.02, 0.39, 0), trimMaterial);
addBox("RearDiffuser", new THREE.Vector3(0.08, 0.12, 0.78), new THREE.Vector3(1.98, 0.34, 0), trimMaterial);
addBox("RearDeckSpoiler", new THREE.Vector3(0.16, 0.055, 1.12), new THREE.Vector3(1.72, 0.78, 0), roofPaint);

for (const side of [-1, 1]) {
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.20, 20), rimMaterial);
  exhaust.name = "ExhaustTip_" + side;
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.set(2.08, 0.33, side * 0.24);
  exhaust.castShadow = true;
  vehicle.add(exhaust);
}

const wheelPositions = [
  { name: "FrontLeft", x: -1.29, z: -0.82 },
  { name: "FrontRight", x: -1.29, z: 0.82 },
  { name: "RearLeft", x: 1.23, z: -0.80 },
  { name: "RearRight", x: 1.23, z: 0.80 }
];

for (const wheelPosition of wheelPositions) {
  const wheelGroup = new THREE.Group();
  wheelGroup.name = "OriginalWheel_" + wheelPosition.name;
  wheelGroup.position.set(wheelPosition.x, 0.39, wheelPosition.z);
  vehicle.add(wheelGroup);

  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.095, 18, 48), tireMaterial);
  tire.name = "ProceduralTyre";
  tire.castShadow = true;
  wheelGroup.add(tire);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.115, 40), rimMaterial);
  hub.rotation.x = Math.PI / 2;
  hub.name = "ProceduralRim";
  wheelGroup.add(hub);

  const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 32), brakeMaterial);
  brakeDisc.rotation.x = Math.PI / 2;
  brakeDisc.name = "ProceduralBrakeDisc";
  brakeDisc.position.z = wheelPosition.z > 0 ? -0.004 : 0.004;
  wheelGroup.add(brakeDisc);

  for (let spoke = 0; spoke < 10; spoke += 1) {
    const angle = (spoke / 10) * Math.PI * 2;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.19, 0.055), rimMaterial);
    bar.position.set(Math.cos(angle) * 0.10, Math.sin(angle) * 0.10, 0.066);
    bar.rotation.z = angle;
    bar.castShadow = true;
    wheelGroup.add(bar);
  }

  const centerCap = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.125, 24), trimMaterial);
  centerCap.rotation.x = Math.PI / 2;
  centerCap.position.z = 0.012;
  wheelGroup.add(centerCap);
}

const driverSeat = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.56, 0.40), seatMaterial);
driverSeat.name = "OriginalCockpitDriverSeatStudy";
driverSeat.position.set(0.05, 0.91, 0.27);
driverSeat.rotation.z = -0.06;
vehicle.add(driverSeat);

const passengerSeat = driverSeat.clone();
passengerSeat.name = "OriginalCockpitPassengerSeatStudy";
passengerSeat.position.z = -0.27;
vehicle.add(passengerSeat);

const cockpitDash = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.11, 1.02), trimMaterial);
cockpitDash.name = "OriginalDashboardStudy";
cockpitDash.position.set(-0.53, 0.88, 0);
vehicle.add(cockpitDash);

const bounds = new THREE.Box3().setFromObject(vehicle);
const vehicleSize = bounds.getSize(new THREE.Vector3());
const nodeStats = { nodes: 0, meshes: 0, triangles: 0 };
vehicle.traverse((object) => {
  nodeStats.nodes += 1;
  if ((object as THREE.Mesh).isMesh) {
    const mesh = object as THREE.Mesh;
    nodeStats.meshes += 1;
    const position = mesh.geometry.getAttribute("position");
    const count = mesh.geometry.index?.count ?? position?.count ?? 0;
    nodeStats.triangles += Math.floor(count / 3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
});
modelInfo.textContent =
  "SOURCE       ORIGINAL PARAMETRIC GEOMETRY\n" +
  "NODES        " + nodeStats.nodes + "\n" +
  "MESHES       " + nodeStats.meshes + "\n" +
  "TRIANGLES    " + nodeStats.triangles.toLocaleString() + "\n" +
  "FORM EXTENT  " + vehicleSize.x.toFixed(2) + " × " + vehicleSize.y.toFixed(2) + " × " + vehicleSize.z.toFixed(2) + " m\n" +
  "REFERENCE    EXTERNAL / NOT EMBEDDED";
status.textContent = "ORIGINAL VEHICLE STUDY READY";

function syncCamera(): void {
  const offset = new THREE.Vector3().setFromSphericalCoords(radius, polar, azimuth);
  camera.position.copy(target).add(offset);
  camera.lookAt(target);
}
syncCamera();

let automaticRotation = true;
let pointerId: number | null = null;
let previousPointerX = 0;
let previousPointerY = 0;
renderer.domElement.addEventListener("pointerdown", (event) => {
  pointerId = event.pointerId;
  previousPointerX = event.clientX;
  previousPointerY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener("pointermove", (event) => {
  if (pointerId !== event.pointerId) return;
  const dx = event.clientX - previousPointerX;
  const dy = event.clientY - previousPointerY;
  previousPointerX = event.clientX;
  previousPointerY = event.clientY;
  azimuth -= dx * 0.006;
  polar = THREE.MathUtils.clamp(polar + dy * 0.005, 0.22, Math.PI - 0.22);
  syncCamera();
});
function releasePointer(event: PointerEvent): void {
  if (pointerId === event.pointerId) pointerId = null;
}
renderer.domElement.addEventListener("pointerup", releasePointer);
renderer.domElement.addEventListener("pointercancel", releasePointer);
renderer.domElement.addEventListener("wheel", (event) => {
  event.preventDefault();
  radius = THREE.MathUtils.clamp(radius * Math.exp(event.deltaY * 0.001), minimumRadius, maximumRadius);
  syncCamera();
}, { passive: false });

rotateButton.addEventListener("click", () => {
  automaticRotation = !automaticRotation;
  rotateButton.textContent = automaticRotation ? "PAUSE ROTATION" : "RESUME ROTATION";
});
resetButton.addEventListener("click", () => {
  azimuth = -0.72;
  polar = 1.16;
  radius = 7.9;
  syncCamera();
});

function resize(): void {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(width, height);
}
window.addEventListener("resize", resize);

let previousTime = 0;
function animate(time: number): void {
  requestAnimationFrame(animate);
  const deltaSeconds = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;
  if (automaticRotation && pointerId === null) vehicle.rotation.y += deltaSeconds * 0.075;
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
