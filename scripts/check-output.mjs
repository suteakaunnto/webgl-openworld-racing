/**
 * Verifies that the distribution is a single self-contained game HTML file.
 * Reference-model exclusion is a hard requirement, not a warning.
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

if (!html.includes("ORIGINAL PARAMETRIC GEOMETRY")) {
  throw new Error("Standalone HTML is missing the original procedural vehicle marker.");
}
if (!html.includes("EXTERNAL / NOT EMBEDDED")) {
  throw new Error("Standalone HTML is missing the reference exclusion marker.");
}
if (/scene\.gltf|scene\.bin|GLTFLoader|mazda_rx-7_spirit_r_type_a|vecarz|sketchfab/i.test(html)) {
  throw new Error("Reference-model data or attribution leaked into the distributable HTML.");
}
if (/__APP_BUNDLE__|__RX7_GLTF_DATA_URI__/.test(html)) {
  throw new Error("Packaged HTML contains an unexpanded placeholder.");
}
if (/<script\s+src\s*=|<link[^>]+href\s*=\s*["']https?:|https?:\/\//i.test(html)) {
  throw new Error("Packaged HTML contains an external runtime dependency.");
}
if (entries.length !== 1 || entries[0] !== "index.html") {
  throw new Error("dist must contain only index.html after packing. Found: " + entries.join(", "));
}
if (info.size < 100000) {
  throw new Error("Packaged HTML is unexpectedly small; the bundled game engine may be missing.");
}

console.log("[check-output] PASS — " + info.size.toLocaleString() + " bytes.");
console.log("[check-output] PASS — dist contains only index.html.");
console.log("[check-output] PASS — no RX-7 reference meshes, textures, binary, or GLTFLoader are included.");
