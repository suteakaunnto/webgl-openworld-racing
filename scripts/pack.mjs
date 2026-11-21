/**
 * Build the single-file offline HTML distributable.
 * The source glTF and its local texture/binary dependencies are read-only inputs.
 * They are embedded as data URIs; no runtime network request is needed.
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const bundlePath = resolve(projectRoot, "dist/game.js");
const templatePath = resolve(projectRoot, "index.html");
const assetRoot = resolve(projectRoot, "mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com");
const modelPath = resolve(assetRoot, "scene.gltf");
const licensePath = resolve(assetRoot, "license.txt");
const outputPath = resolve(projectRoot, "dist/index.html");

function fail(message) {
  throw new Error("[pack] " + message);
}

async function readLocalAsset(uri, label) {
  if (typeof uri !== "string" || !uri || /^https?:/i.test(uri) || uri.startsWith("//")) {
    fail(label + " has an unsupported or remote URI: " + String(uri));
  }
  if (uri.startsWith("data:")) return uri;

  const decoded = decodeURIComponent(uri);
  const filePath = resolve(assetRoot, decoded);
  if (filePath !== assetRoot && !filePath.startsWith(assetRoot + sep)) {
    fail(label + " escapes the source asset directory.");
  }
  const bytes = await readFile(filePath);
  const extension = extname(filePath).toLowerCase();
  const mime = extension === ".png" ? "image/png"
    : extension === ".jpg" || extension === ".jpeg" ? "image/jpeg"
    : extension === ".webp" ? "image/webp"
    : extension === ".bin" ? "application/octet-stream"
    : null;
  if (!mime) fail("Unsupported embedded asset type: " + extension);
  return "data:" + mime + ";base64," + bytes.toString("base64");
}

const [bundle, template, modelText, licenseText] = await Promise.all([
  readFile(bundlePath, "utf8"),
  readFile(templatePath, "utf8"),
  readFile(modelPath, "utf8"),
  readFile(licensePath, "utf8")
]);

if (!licenseText.includes("CC-BY-4.0") || !licenseText.includes("vecarz")) {
  fail("The original asset license or required author credit could not be verified.");
}
const model = JSON.parse(modelText);
if (model.asset?.extras?.author?.toLowerCase().includes("vecarz") !== true) {
  fail("The glTF source author metadata does not match the expected attribution.");
}
if (!String(model.asset?.extras?.license || "").includes("CC-BY-4.0")) {
  fail("The glTF does not declare the expected CC BY 4.0 license.");
}

for (const buffer of model.buffers || []) {
  if (buffer.uri) buffer.uri = await readLocalAsset(buffer.uri, "glTF buffer");
}
for (const image of model.images || []) {
  if (image.uri) image.uri = await readLocalAsset(image.uri, "glTF image");
}

for (const buffer of model.buffers || []) {
  if (buffer.uri && !buffer.uri.startsWith("data:")) fail("A glTF buffer was not embedded.");
}
for (const image of model.images || []) {
  if (image.uri && !image.uri.startsWith("data:")) fail("A glTF image was not embedded.");
}

const bundlePlaceholder = "__APP_BUNDLE__";
const modelPlaceholder = "__EMBEDDED_MODEL_JSON__";
if (template.split(bundlePlaceholder).length - 1 !== 1) {
  fail("HTML template must contain exactly one application bundle placeholder.");
}
if (template.split(modelPlaceholder).length - 1 !== 1) {
  fail("HTML template must contain exactly one embedded model placeholder.");
}
if (/<script\s+src\s*=|<link[^>]+href\s*=\s*["']https?:|url\(\s*["']?https?:/i.test(template)) {
  fail("Production HTML template contains a remote runtime resource.");
}

const safeBundle = bundle.replace(/<\/script/gi, "<\\/script");
const safeModelJson = JSON.stringify(model)
  .replace(/</g, "\\u003c")
  .replace(/>/g, "\\u003e")
  .replace(/&/g, "\\u0026");
const html = template
  .replace(bundlePlaceholder, () => safeBundle)
  .replace(modelPlaceholder, () => safeModelJson);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html, "utf8");
await rm(bundlePath, { force: true });

console.log("[pack] Wrote dist/index.html (" + Buffer.byteLength(html, "utf8").toLocaleString() + " bytes).");
console.log("[pack] Embedded the CC BY 4.0 vehicle model, binary geometry, and local textures.");
console.log("[pack] All runtime model resources are inline; no model CDN or external asset request is used.");
