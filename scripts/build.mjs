/**
 * M0 browser bundle build.
 * Keeps dependency code inside a temporary bundle that pack.mjs folds into index.html.
 */
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputDirectory = resolve(root, "dist");
await mkdir(outputDirectory, { recursive: true });

await build({
  absWorkingDir: root,
  entryPoints: ["src/main.ts"],
  outfile: "dist/game.js",
  bundle: true,
  platform: "browser",
  format: "iife",
  target: ["es2020"],
  minify: true,
  sourcemap: false,
  legalComments: "eof",
  treeShaking: true,
  logLevel: "info"
});

console.log("Browser bundle created at dist/game.js");
