/**
 * M0 vehicle viewer for KITEBOUND: ROADS OF VEYRA.
 * Loads the supplied CC BY 4.0 source model as a modifiable vehicle base.
 * The source asset is embedded by scripts/pack.mjs so runtime use is fully offline.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { getLanguage, setLanguage, t, type Language } from "./i18n";

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(t("errorMarkup") + selector);
  return element;
}

const viewport = requireElement<HTMLElement>("#viewport");
const status = requireElement<HTMLElement>("#status");
const modelInfo = requireElement<HTMLElement>("#model-info");
const errorPanel = requireElement<HTMLElement>("#error");
const rotateButton = requireElement<HTMLButtonElement>("#rotate-toggle");
const resetButton = requireElement<HTMLButtonElement>("#reset-view");
const languageButton = requireElement<HTMLButtonElement>("#language-toggle");
const modelData = document.querySelector<HTMLScriptElement>("#embedded-model-json");

let currentStatus: "loading" | "ready" | "failed" = "loading";
let automaticRotation = true;
let azimuth = -0.72;
let polar = 1.16;
let radius = 8.1;
let minimumRadius = 3.2;
let maximumRadius = 22;
let pointerId: number | null = null;
let previousPointerX = 0;
let previousPointerY = 0;
let modelRoot: THREE.Object3D | null = null;
let modelSize = new THREE.Vector3();
let stats = { nodes: 0, meshes: 0, triangles: 0 };

let target = new THREE.Vector3(0, 0.65, 0);

function applyLanguage(): void {
  const language = getLanguage();
  document.documentElement.lang = language;
  document.title = t("documentTitle");
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) meta.content = t("metaDescription");

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) element.textContent = t(key as Parameters<typeof t>[0]);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (key) element.setAttribute("aria-label", t(key as Parameters<typeof t>[0]));
  });

  languageButton.textContent = language === "ja" ? t("languageToEnglish") : t("languageToJapanese");
  languageButton.setAttribute("aria-label", language === "ja" ? t("switchToEnglish") : t("switchToJapanese"));
  status.textContent = t(currentStatus);

  if (modelRoot) renderModelInfo();
}

function renderModelInfo(): void {
  const numberLocale = getLanguage() === "ja" ? "ja-JP" : "en-US";
  modelInfo.textContent = [
    t("modelStatsTitle"),
    `${t("modelNodes")}: ${stats.nodes.toLocaleString(numberLocale)}`,
    `${t("modelMeshes")}: ${stats.meshes.toLocaleString(numberLocale)}`,
    `${t("modelTriangles")}: ${stats.triangles.toLocaleString(numberLocale)}`,
    `${t("modelDimensions")}: ${modelSize.x.toFixed(2)} × ${modelSize.y.toFixed(2)} × ${modelSize.z.toFixed(2)} m`
  ].join("\\n");
}

languageButton.addEventListener("click", () => {
  const nextLanguage: Language = getLanguage() === "ja" ? "en" : "ja";
  setLanguage(nextLanguage);
  applyLanguage();
});

applyLanguage();

let renderer: THREE.WebGLRenderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
} catch (error) {
  currentStatus = "failed";
  status.textContent = t(currentStatus);
  errorPanel.style.display = "block";
  errorPanel.textContent = t("errorWebgl") + "\\n" + String(error);
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
scene.add(new THREE.HemisphereLight(0xb9d9ef, 0x17202b, 1.55));

const keyLight = new THREE.DirectionalLight(0xffecd4, 4.1);
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

const vehiclePivot = new THREE.Group();
vehiclePivot.name = "Asterion13R_VehiclePivot";
scene.add(vehiclePivot);

function hasSourceBadgeInAncestry(object: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = object;
  while (current) {
    if (/badge|mazda.?logo|manufacturer.?logo/i.test(current.name)) return true;
    current = current.parent;
  }
  return false;
}

function recolorMaterial(material: THREE.Material): THREE.Material {
  if (!(material instanceof THREE.MeshStandardMaterial) || !/carpaint/i.test(material.name)) return material;
  const paint = material.clone();
  paint.color.set(0x174f69);
  paint.metalness = 0.72;
  paint.roughness = 0.24;
  if (paint instanceof THREE.MeshPhysicalMaterial) {
    paint.clearcoat = 1;
    paint.clearcoatRoughness = 0.16;
  }
  paint.needsUpdate = true;
  return paint;
}

function prepareVehicle(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (hasSourceBadgeInAncestry(object)) {
      object.visible = false;
      return;
    }
    if (!(object as THREE.Mesh).isMesh) return;

    const mesh = object as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(recolorMaterial);
    } else if (mesh.material) {
      mesh.material = recolorMaterial(mesh.material);
    }

    stats.meshes += 1;
    const position = mesh.geometry.getAttribute("position");
    const indexCount = mesh.geometry.index?.count ?? position?.count ?? 0;
    stats.triangles += Math.floor(indexCount / 3);
  });

  root.traverse(() => { stats.nodes += 1; });

  // Normalize the imported model to a 4.285 m display length while preserving its proportions.
  let bounds = new THREE.Box3().setFromObject(root);
  let size = bounds.getSize(new THREE.Vector3());
  if (size.z > size.x) root.rotation.y = Math.PI / 2;
  root.updateMatrixWorld(true);

  bounds = new THREE.Box3().setFromObject(root);
  size = bounds.getSize(new THREE.Vector3());
  const length = Math.max(size.x, size.z);
  if (!Number.isFinite(length) || length <= 0) throw new Error("Invalid vehicle bounds.");

  const uniformScale = 4.285 / length;
  root.scale.multiplyScalar(uniformScale);
  root.updateMatrixWorld(true);

  bounds = new THREE.Box3().setFromObject(root);
  size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= bounds.min.y;
  root.updateMatrixWorld(true);

  modelSize = size;
  modelRoot = root;

  vehiclePivot.add(root);
  target.set(0, Math.max(modelSize.y * 0.47, 0.55), 0);
  radius = Math.max(7.1, Math.max(modelSize.x, modelSize.z) * 1.85);
  minimumRadius = Math.max(2.8, radius * 0.42);
  maximumRadius = radius * 3.6;
  syncCamera();
  renderModelInfo();
  currentStatus = "ready";
  status.textContent = t(currentStatus);
}

function syncCamera(): void {
  const offset = new THREE.Vector3().setFromSphericalCoords(radius, polar, azimuth);
  camera.position.copy(target).add(offset);
  camera.lookAt(target);
}

function showModelError(error: unknown): void {
  currentStatus = "failed";
  status.textContent = t(currentStatus);
  errorPanel.style.display = "block";
  errorPanel.textContent = t("errorParseModel") + "\\n" + String(error);
}

if (!modelData?.textContent?.trim()) {
  showModelError(t("errorEmbeddedModel"));
} else {
  const loader = new GLTFLoader();
  try {
    loader.parse(
      modelData.textContent,
      "",
      (gltf) => {
        try {
          prepareVehicle(gltf.scene);
        } catch (error) {
          showModelError(error);
        }
      },
      (error) => showModelError(error)
    );
  } catch (error) {
    showModelError(error);
  }
}

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
  rotateButton.textContent = automaticRotation ? t("pauseRotation") : t("resumeRotation");
});

resetButton.addEventListener("click", () => {
  azimuth = -0.72;
  polar = 1.16;
  radius = Math.max(7.1, Math.max(modelSize.x, modelSize.z) * 1.85);
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
  if (automaticRotation && pointerId === null && modelRoot) vehiclePivot.rotation.y += deltaSeconds * 0.075;
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
