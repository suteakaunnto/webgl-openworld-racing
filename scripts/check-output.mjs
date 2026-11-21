/**
 * Verifies the packaged HTML artifact without launching a browser.
 * Browser rendering and offline-open tests remain separate manual/CI browser checks.
 */
import { readFile, stat, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(root, "dist/index.html");
const html = await readFile(outputPath, "utf8");
const info = await stat(outputPath);
const distEntries = await readdir(resolve(root, "dist"));

const required = [
  "data:application/json;base64,",
  "WebGL2",
  "GLTF SCENE LOADED"
];

for (const marker of required) {
  if (!html.includes(marker)) {
    throw new Error("Packaged HTML is missing required marker: " + marker);
  }
}
if (html.includes("__APP_BUNDLE__") || html.includes("__RX7_GLTF_DATA_URI__")) {
  throw new Error("Packaged HTML still contains an unexpanded placeholder.");
}
if (/<script\s+src\s*=|<link[^>]+href\s*=\s*["']https?:/i.test(html)) {
  throw new Error("Packaged HTML contains an external script or stylesheet reference.");
}
if (info.size < 1000000) {
  throw new Error("Packaged HTML is unexpectedly small; model data may not be embedded.");
}
if (distEntries.some((entry) => entry !== "index.html")) {
  throw new Error("dist must contain only index.html after packing. Found: " + distEntries.join(", "));
}

console.log("[check-output] PASS — " + info.size.toLocaleString() + " bytes; dist contains only index.html.");
