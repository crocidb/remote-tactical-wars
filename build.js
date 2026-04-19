#!/usr/bin/env bun

import { join } from "path";
import { mkdirSync, cpSync, readFileSync, writeFileSync, rmSync, existsSync } from "fs";
import { minify } from "terser";

const ROOT = new URL(".", import.meta.url).pathname;
const BUILD_DIR = join(ROOT, "build");
const TMP_DIR = join(BUILD_DIR, ".tmp");

async function build() {
  console.log("Cleaning build dir...");
  if (existsSync(BUILD_DIR)) rmSync(BUILD_DIR, { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });

  console.log("Bundling JS...");
  const result = await Bun.build({
    entrypoints: [join(ROOT, "src/main.js")],
    outdir: TMP_DIR,
    minify: false,
    format: "iife",
  });

  if (!result.success) {
    console.error("JS build failed:");
    for (const log of result.logs) console.error(log);
    process.exit(1);
  }

  const pizzicato = readFileSync(join(ROOT, "node_modules/pizzicato/distr/Pizzicato.js"), "utf8");
  const jsfxr = readFileSync(join(ROOT, "src/jsfxr.js"), "utf8");
  const css = readFileSync(join(ROOT, "styles/style.css"), "utf8");
  const bundledJs = readFileSync(join(TMP_DIR, "main.js"), "utf8");

  const minCss = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;\}/g, "}")
    .trim();

  // Combine then minify everything together
  console.log("Minifying...");
  const combined = `${pizzicato}\n${jsfxr}\n${bundledJs}`;
  const { code: gameJs } = await minify(combined, { compress: true, mangle: true });
  writeFileSync(join(BUILD_DIR, "game.js"), gameJs);

  let html = readFileSync(join(ROOT, "index.html"), "utf8");

  // Remove stylesheet link → inline style
  html = html.replace(/<link rel="stylesheet" href="styles\/style\.css"\s*\/?>/, `<style>${minCss}</style>`);

  // Remove import map
  html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, "");

  // Remove Pizzicato, jsfxr, and module entry → single game.js
  html = html.replace(/<script src="\/node_modules\/pizzicato\/distr\/Pizzicato\.js"><\/script>/, "");
  html = html.replace(/<script src="\/src\/jsfxr\.js"><\/script>/, "");
  html = html.replace(
    /<script type="module" src="\/src\/main\.js"><\/script>/,
    `<script src="game.js"></script>`
  );

  // Collapse extra blank lines left by removals
  html = html.replace(/(\n\s*){3,}/g, "\n\n");

  writeFileSync(join(BUILD_DIR, "index.html"), html);

  console.log("Copying assets...");
  cpSync(join(ROOT, "assets"), join(BUILD_DIR, "assets"), { recursive: true });

  rmSync(TMP_DIR, { recursive: true });

  console.log("Done! Output: build/");
}

build().catch((e) => { console.error(e); process.exit(1); });
