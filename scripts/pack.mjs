/**
 * Builds the final offline HTML.
 * Verifies each external glTF resource before replacing its URI with a data URI.
 * The source glTF, binary, and texture files are never modified.
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, relative, isAbsolute, dirname, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const assetRoot = resolve(projectRoot, "mazda_rx-7_spirit_r_type_a_2002__www.vecarz.com");
const gltfPath = resolve(assetRoot, "scene.gltf");
const binaryBundlePath = resolve(projectRoot, "dist/game.js");
const templatePath = resolve(projectRoot, "index.html");
const outputPath = resolve(projectRoot, "dist/index.html");

const mimeByExtension = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".bin", "application/octet-stream"]
]);

function fail(message) {
  throw new Error("[pack] " + message);
}

async function toDataUri(uri, label) {
  if (typeof uri !== "string" || uri.length === 0) fail(label + " has no URI.");
  if (uri.startsWith("data:")) return uri;

  let decoded;
  try {
    decoded = decodeURIComponent(uri).replaceAll("\\", "/");
  } catch {
    fail(label + " contains an invalid URI encoding: " + uri);
  }

  if (/^(?:[a-z][a-z0-9+.-]*:|\/|\\)/i.test(decoded)) {
    fail(label + " must use a project-relative URI, not an absolute or remote URI: " + decoded);
  }

  const absolutePath = resolve(assetRoot, decoded);
  const relativePath = relative(assetRoot, absolutePath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    fail(label + " resolves outside the source asset directory: " + decoded);
  }

  const extension = extname(absolutePath).toLowerCase();
  const mime = mimeByExtension.get(extension);
  if (!mime) fail("Unsupported MIME type for " + label + ": " + extension);

  let bytes;
  try {
    bytes = await readFile(absolutePath);
  } catch (error) {
    fail("Missing resource " + decoded + " (" + label + "): " + String(error));
  }

  return "data:" + mime + ";base64," + bytes.toString("base64");
}

const [gltfText, bundleText, htmlTemplate] = await Promise.all([
  readFile(gltfPath, "utf8"),
  readFile(binaryBundlePath, "utf8"),
  readFile(templatePath, "utf8")
]);

let gltf;
try {
  gltf = JSON.parse(gltfText);
} catch (error) {
  fail("scene.gltf is not valid JSON: " + String(error));
}

if (gltf.asset?.version !== "2.0") fail("Expected glTF 2.0.");
if (!Array.isArray(gltf.buffers) || gltf.buffers.length === 0) fail("No glTF buffers were found.");
if (!Array.isArray(gltf.images) || gltf.images.length === 0) fail("No glTF images were found.");

for (let index = 0; index < gltf.buffers.length; index += 1) {
  const buffer = gltf.buffers[index];
  const originalUri = buffer.uri;
  const dataUri = await toDataUri(originalUri, "buffer " + index);
  if (typeof originalUri === "string" && !originalUri.startsWith("data:")) {
    const decoded = decodeURIComponent(originalUri);
    const absolutePath = resolve(assetRoot, decoded);
    const bytes = await readFile(absolutePath);
    if (bytes.byteLength < buffer.byteLength) {
      fail("Buffer " + originalUri + " is shorter than its declared byteLength.");
    }
  }
  buffer.uri = dataUri;
}

for (let index = 0; index < gltf.images.length; index += 1) {
  const image = gltf.images[index];
  if (!image.uri) fail("Image " + index + " uses a bufferView or an unsupported URI layout.");
  image.uri = await toDataUri(image.uri, "image " + index);
}

if (gltf.images.length !== gltf.textures.length) {
  console.warn("[pack] Image count and texture count differ; preserving the source glTF mapping.");
}

const gltfDataUri = "data:application/json;base64," + Buffer.from(JSON.stringify(gltf), "utf8").toString("base64");
const safeBundle = bundleText.replace(/<\/script/gi, "<\\/script");

if (!htmlTemplate.includes("__RX7_GLTF_DATA_URI__")) fail("HTML template is missing the glTF data placeholder.");
if (!htmlTemplate.includes("__APP_BUNDLE__")) fail("HTML template is missing the application bundle placeholder.");

let finalHtml = htmlTemplate
  .replace("__RX7_GLTF_DATA_URI__", gltfDataUri)
  .replace("__APP_BUNDLE__", safeBundle);

if (finalHtml.includes("__RX7_GLTF_DATA_URI__") || finalHtml.includes("__APP_BUNDLE__")) {
  fail("A build placeholder was not replaced.");
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, finalHtml, "utf8");
await rm(binaryBundlePath, { force: true });

console.log("[pack] Wrote dist/index.html (" + Buffer.byteLength(finalHtml, "utf8").toLocaleString() + " bytes).");
console.log("[pack] Embedded " + gltf.buffers.length + " buffer(s) and " + gltf.images.length + " image(s).");
console.log("[pack] Original source asset files were not modified.");
