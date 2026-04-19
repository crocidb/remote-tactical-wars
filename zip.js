#!/usr/bin/env bun

import { existsSync } from "fs";
import { spawnSync } from "bun";

if (!existsSync("./build")) {
  console.error("No build/ directory found. Run `bun run build` first.");
  process.exit(1);
}

const out = "ld59.zip";
if (existsSync(out)) spawnSync(["rm", out]);

const { exitCode } = spawnSync(["zip", "-r", `../${out}`, "."], {
  cwd: "./build",
  stdout: "inherit",
  stderr: "inherit",
});

if (exitCode !== 0) {
  console.error("zip failed");
  process.exit(1);
}

console.log(`Created ${out}`);
