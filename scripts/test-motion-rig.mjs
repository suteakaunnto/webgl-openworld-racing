import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
const root = process.cwd();
const entry = resolve(root, "tests/vehicle-motion-rig.test.ts");
const output = resolve(root, "dist/vehicle-motion-rig.test.mjs");
await build({ entryPoints: [entry], outfile: output, bundle: true, platform: "node", format: "esm", target: "node22", packages: "external" });
try {
  const result = spawnSync(process.execPath, [output], { cwd: root, encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error("Vehicle motion rig unit test failed with exit code " + result.status);
} finally {
  await rm(output, { force: true });
}
