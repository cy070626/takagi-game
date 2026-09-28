import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function bundle(output, inputs) {
  const parts = await Promise.all(inputs.map(async (input) => {
    const source = await readFile(resolve(root, input), "utf8");
    return `/* ${input} */\n${source.trim()}\n`;
  }));
  await writeFile(resolve(root, output), `${parts.join("\n")}\n`, "utf8");
}

await bundle("js/games-bundle.js", [
  "js/puzzles.js",
  "js/puzzles-extra.js",
  "js/leisure.js",
  "js/arcade-v2.js",
]);

await bundle("js/sidebar-bundle.js", [
  "js/omikuji.js",
  "js/memories.js",
]);
