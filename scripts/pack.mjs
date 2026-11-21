/**
 * Packages the offline game application into one HTML file.
 *
 * Important policy: the RX-7 glTF folder is development-only reference material.
 * This packer never reads it, never embeds its buffer or images, and fails if reference
 * asset markers or external runtime references leak into the distributable HTML.
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const bundlePath = resolve(projectRoot, "dist/game.js");
const templatePath = resolve(projectRoot, "index.html");
const outputPath = resolve(projectRoot, "dist/index.html");

function fail(message) {
  throw new Error("[pack] " + message);
}

const [bundle, template] = await Promise.all([
  readFile(bundlePath, "utf8"),
  readFile(templatePath, "utf8")
]);

if (!template.includes("__APP_BUNDLE__")) fail("HTML template is missing the application bundle placeholder.");
if (/__RX7_GLTF_DATA_URI__|scene\.bin|GLTFLoader|mazda_rx-7_spirit_r_type_a|vecarz|sketchfab/i.test(bundle + template)) {
  fail("Reference-model content or loader code leaked into the production HTML template or bundle.");
}
if (/<script\s+src\s*=|<link[^>]+href\s*=\s*["']https?:|https?:\/\//i.test(template)) {
  fail("Production HTML template contains an external runtime dependency.");
}

const safeBundle = bundle.replace(/<\/script/gi, "<\\/script");
const html = template.replace("__APP_BUNDLE__", safeBundle);
if (html.includes("__APP_BUNDLE__")) fail("Application bundle placeholder was not replaced.");

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
await rm(bundlePath, { force: true });

console.log("[pack] Wrote dist/index.html (" + Buffer.byteLength(html, "utf8").toLocaleString() + " bytes).");
console.log("[pack] Standalone build contains only original game code and bundled Three.js.");
console.log("[pack] Reference glTF, its binary buffer, textures, and source marks were NOT embedded.");
