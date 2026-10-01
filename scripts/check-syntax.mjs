import { readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
async function walk(folder) {
  const entries = await readdir(folder, {withFileTypes:true});
  return (await Promise.all(entries.map(entry => {
    const path = resolve(folder, entry.name);
    return entry.isDirectory() ? walk(path) : /\.(?:js|mjs)$/.test(entry.name) ? [path] : [];
  }))).flat();
}
const files = (await Promise.all(['js','netlify/functions','scripts'].map(folder => walk(resolve(root, folder))))).flat();
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {encoding:'utf8'});
  if (result.error || result.status !== 0) {
    process.stderr.write(result.stderr || String(result.error || 'Syntax check failed'));
    process.exit(1);
  }
}
console.log(`Syntax checked ${files.length} JavaScript files.`);
