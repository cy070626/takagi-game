import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(resolve(root, 'build.config.json'), 'utf8'));
if (!Number.isSafeInteger(config.release) || config.release < 1) throw new Error('release must be a positive integer');
function versionText(text) {
  return text.replace(/\?v=\d+/g, `?v=${config.release}`).replace(/(src|href)=(["'])([^"'?:]+\.(?:js|css))\2/g, (_, attr, quote, url) => `${attr}=${quote}${url}?v=${config.release}${quote}`);
}
async function writeChanged(path, text) {
  let previous;
  try { previous = await readFile(path, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (previous !== text) await writeFile(path, text, 'utf8');
}
async function syncVersions(folder) {
  for (const entry of await readdir(folder, {withFileTypes:true})) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) await syncVersions(path);
    else if (/\.(?:html|js|css)$/.test(entry.name)) {
      const before = await readFile(path, 'utf8');
      const after = versionText(before);
      if (before !== after) await writeFile(path, after, 'utf8');
    }
  }
}
for (const folder of ['js','css','pages','games']) await syncVersions(resolve(root,folder));
const index = resolve(root,'index.html');
await writeChanged(index,versionText(await readFile(index,'utf8')));
for (const [kind, outputs] of Object.entries({js:config.javascript, css:config.css})) {
  for (const [output, inputs] of Object.entries(outputs)) {
    const parts = await Promise.all(inputs.map(input => readFile(resolve(root,input),'utf8')));
    const result = await transform(parts.join('\n'), {
      loader:kind, target:'esnext', charset:'utf8',
      minifyWhitespace:true, minifyIdentifiers:false, minifySyntax:output === "js/experience.js",
      legalComments:'inline'
    });
    const header = `/* Generated from ${inputs.join(', ')}. Edit sources; run npm run build:bundles. */\n`;
    await writeChanged(resolve(root,output),header+result.code);
  }
}
console.log(`Built ${Object.keys(config.javascript).length} JavaScript and ${Object.keys(config.css).length} CSS files; release ${config.release}.`);
