/**
 * Responsibility: M0 WebGL2 showroom and embedded glTF proof of integration.
 * Public API: application bootstrap only; later milestones will extract renderer, camera, and asset services.
 * Dependencies: three, GLTFLoader, the data URI injected by scripts/pack.mjs.
 * Data: the original RX-7 glTF scene is loaded as supplied; no source nodes or materials are removed here.
 * Relations: later car rigging will consume the inspected scene graph after wheel pivots are verified.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error("M0 viewer markup is missing required element: " + selector);
  }
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
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
} catch (error) {
  errorPanel.style.display = "block";
  errorPanel.textContent = "WebGL2 initialization failed.\n" + String(error);
  status.textContent = "WEBGL2 UNAVAILABLE";
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b121b);
scene.fog = new THREE.Fog(0x0b121b, 24, 90);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.05, 500);
const target = new THREE.Vector3(0, 0, 0);
let azimuth = 0.78;
let polar = 1.18;
let radius = 8;
let minimumRadius = 3;
let maximumRadius = 45;

const hemisphere = new THREE.HemisphereLight(0xb9d9ef, 0x17202b, 1.35);
scene.add(hemisphere);

const keyLight = new THREE.DirectionalLight(0xffecd4, 4.0);
keyLight.position.set(7, 10, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = -12;
keyLight.shadow.camera.right = 12;
keyLight.shadow.camera.top = 12;
keyLight.shadow.camera.bottom = -12;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x80bce8, 2.1);
fillLight.position.set(-8, 4, -4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xf0f5ff, 2.6);
rimLight.position.set(0, 5, -10);
scene.add(rimLight);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x111b26,
  roughness: 0.78,
  metalness: 0.12
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.visible = false;
scene.add(floor);

const ring = new THREE.Mesh(
  new THREE.RingGeometry(3.7, 3.76, 128),
  new THREE.MeshBasicMaterial({ color: 0x52758c, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.006;
ring.visible = false;
scene.add(ring);

let vehicleRoot: THREE.Object3D | null = null;
let automaticRotation = true;
let pointerId: number | null = null;
let previousPointerX = 0;
let previousPointerY = 0;
let triangleCount = 0;
let nodeCount = 0;
let meshCount = 0;
let materialCount = 0;

function syncCamera(): void {
  const offset = new THREE.Vector3().setFromSphericalCoords(radius, polar, azimuth);
  camera.position.copy(target).add(offset);
  camera.lookAt(target);
}

function reportError(message: string): void {
  status.textContent = "ASSET LOAD FAILED";
  errorPanel.style.display = "block";
  errorPanel.textContent = message;
}

function inspectScene(root: THREE.Object3D): void {
  const materials = new Set<THREE.Material>();
  triangleCount = 0;
  nodeCount = 0;
  meshCount = 0;

  root.traverse((object: THREE.Object3D) => {
    nodeCount += 1;
    if (!(object as THREE.Mesh).isMesh) return;

    const mesh = object as THREE.Mesh;
    meshCount += 1;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const position = mesh.geometry.getAttribute("position");
    if (position) {
      const elementCount = mesh.geometry.index ? mesh.geometry.index.count : position.count;
      triangleCount += Math.floor(elementCount / 3);
    }
    if (Array.isArray(mesh.material)) {
      for (const material of mesh.material) materials.add(material);
    } else if (mesh.material) {
      materials.add(mesh.material);
    }
  });

  materialCount = materials.size;
}

function frameVehicle(root: THREE.Object3D): void {
  root.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(root);
  if (bounds.isEmpty()) throw new Error("The loaded glTF scene contains no measurable geometry.");

  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.updateMatrixWorld(true);

  target.set(0, 0, 0);
  radius = Math.max(size.length() * 1.45, 4.5);
  minimumRadius = Math.max(size.length() * 0.42, 1.8);
  maximumRadius = Math.max(size.length() * 5.5, 20);
  floor.position.y = -size.y * 0.5 - 0.025;
  ring.position.y = floor.position.y + 0.008;
  floor.visible = true;
  ring.visible = true;
  syncCamera();

  modelInfo.textContent =
    "NODES       " + nodeCount + "\n" +
    "MESHES      " + meshCount + "\n" +
    "MATERIALS   " + materialCount + "\n" +
    "TRIANGLES   " + triangleCount.toLocaleString() + "\n" +
    "BOUNDS      " + size.x.toFixed(3) + " × " + size.y.toFixed(3) + " × " + size.z.toFixed(3) + " raw units";
}

const embeddedAsset = window.__RX7_GLTF_DATA_URI__;
if (!embeddedAsset || !embeddedAsset.startsWith("data:application/json;base64,")) {
  reportError("Embedded glTF data URI is missing. Run npm run build so scripts/pack.mjs can inline the model.");
} else {
  status.textContent = "LOADING EMBEDDED GLTF";
  const loader = new GLTFLoader();

  loader.load(
    embeddedAsset,
    (gltf) => {
      vehicleRoot = gltf.scene;
      inspectScene(vehicleRoot);
      scene.add(vehicleRoot);
      frameVehicle(vehicleRoot);
      status.textContent = "GLTF SCENE LOADED";
    },
    (event) => {
      if (event.total > 0) {
        const percent = Math.round((event.loaded / event.total) * 100);
        status.textContent = "LOADING " + percent + "%";
      }
    },
    (error: unknown) => {
      reportError("The embedded glTF could not be parsed.\n" + String(error));
    }
  );
}

renderer.domElement.addEventListener("pointerdown", (event: PointerEvent) => {
  pointerId = event.pointerId;
  previousPointerX = event.clientX;
  previousPointerY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return;
  const deltaX = event.clientX - previousPointerX;
  const deltaY = event.clientY - previousPointerY;
  previousPointerX = event.clientX;
  previousPointerY = event.clientY;
  azimuth -= deltaX * 0.006;
  polar = THREE.MathUtils.clamp(polar + deltaY * 0.005, 0.22, Math.PI - 0.22);
  syncCamera();
});

function releasePointer(event: PointerEvent): void {
  if (pointerId !== event.pointerId) return;
  pointerId = null;
}

renderer.domElement.addEventListener("pointerup", releasePointer);
renderer.domElement.addEventListener("pointercancel", releasePointer);
renderer.domElement.addEventListener("wheel", (event: WheelEvent) => {
  event.preventDefault();
  radius = THREE.MathUtils.clamp(radius * Math.exp(event.deltaY * 0.001), minimumRadius, maximumRadius);
  syncCamera();
}, { passive: false });

rotateButton.addEventListener("click", () => {
  automaticRotation = !automaticRotation;
  rotateButton.textContent = automaticRotation ? "PAUSE ROTATION" : "RESUME ROTATION";
});

resetButton.addEventListener("click", () => {
  azimuth = 0.78;
  polar = 1.18;
  if (vehicleRoot) {
    const bounds = new THREE.Box3().setFromObject(vehicleRoot);
    radius = Math.max(bounds.getSize(new THREE.Vector3()).length() * 1.45, 4.5);
  }
  syncCamera();
});

function resize(): void {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height);
}
window.addEventListener("resize", resize);

let previousTime = 0;
function animate(time: number): void {
  requestAnimationFrame(animate);
  const deltaSeconds = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;

  if (vehicleRoot && automaticRotation && pointerId === null) {
    vehicleRoot.rotation.y += deltaSeconds * 0.105;
  }

  renderer.render(scene, camera);
}
syncCamera();
requestAnimationFrame(animate);
