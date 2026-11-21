/**
 * Validate the one-file offline build and asset-attribution requirements.
 */
import { readFile, stat, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const distDirectory = resolve(root, "dist");
const outputPath = resolve(distDirectory, "index.html");
const html = await readFile(outputPath, "utf8");
const info = await stat(outputPath);
const entries = await readdir(distDirectory);

if (!html.includes('id="embedded-model-json"')) {
  throw new Error("Standalone HTML is missing the embedded vehicle model.");
}
if (!html.includes("Mazda RX-7 Spirit R Type A 2002 | www.vecarz.com")) {
  throw new Error("Standalone HTML is missing the original model title attribution.");
}
if (!html.includes("vecarz")) {
  throw new Error("Standalone HTML is missing the original creator attribution.");
}
if (!html.includes("https://creativecommons.org/licenses/by/4.0/")) {
  throw new Error("Standalone HTML is missing the CC BY 4.0 license link.");
}
if (!html.includes("全メッシュ・素材・テクスチャ") || !html.includes("all source meshes, materials and textures")) {
  throw new Error("Standalone HTML is missing the full-model usage disclosure in both languages.");
}
if (html.includes("hasSourceBadgeInAncestry")) {
  throw new Error("A source badge visibility filter remains in the production viewer.");
}
if (/__APP_BUNDLE__|__EMBEDDED_MODEL_JSON__/.test(html)) {
  throw new Error("Packaged HTML contains an unexpanded placeholder.");
}
for (const required of ["VEHICLE PART MOTION TEST", "wheel-test-toggle", "popup-toggle", "headlight-toggle", "brake-toggle", "indicator-left", "indicator-right", "indicator-hazard", "steering-slider", "MotionPivot_", "PopupHeadlightPivot_", "HeadlightBeam_"]) {
  if (!html.includes(required)) throw new Error("Motion test output is missing: " + required);
}
if (/<script\s+src\s*=|<link[^>]+href\s*=\s*["']https?:|url\(\s*["']?https?:|(?:fetch|import)\s*\(\s*["']https?:/i.test(html)) {
  throw new Error("Packaged HTML contains a remote runtime resource or network-loading call.");
}
if (entries.length !== 1 || entries[0] !== "index.html") {
  throw new Error("dist must contain only index.html after packing. Found: " + entries.join(", "));
}
if (info.size < 1000000) {
  throw new Error("Packaged HTML is unexpectedly small; the vehicle geometry and engine may be missing.");
}

console.log("[check-output] PASS — " + info.size.toLocaleString() + " bytes.");
console.log("[check-output] PASS — dist contains only index.html.");
console.log("[check-output] PASS — vehicle geometry, binary buffer and textures are embedded.");
console.log("[check-output] PASS — creator attribution, license link and modification disclosure are present.");
console.log("[check-output] PASS — no remote runtime dependencies are declared.");
