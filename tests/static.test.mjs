import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function filesUnder(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

test("HTML、CSS 与 JavaScript 中的相对资源路径均存在", () => {
  const sources = filesUnder(root).filter((path) => /\.(?:html|css|js)$/i.test(path));
  const missing = [];
  for (const source of sources) {
    const text = readFileSync(source, "utf8");
    const references = [...text.matchAll(/["'`](\.\.?\/[^"'`?#]+)(?:[?#][^"'`]*)?["'`]/g)].map((match) => match[1]);
    for (const reference of references) {
      if (reference.includes("${") || reference.startsWith("../.netlify")) continue;
      const browserBase = source.endsWith("music-theater.js")
        ? join(root, "pages")
        : source.endsWith(".js")
          ? root
          : dirname(source);
      const target = resolve(browserBase, reference);
      if (!existsSync(target)) missing.push(`${relative(root, source)} -> ${reference}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("Netlify 聊天路由和入口文件存在", () => {
  assert.equal(existsSync(join(root, "index.html")), true);
  assert.equal(existsSync(join(root, "netlify", "functions", "chat.js")), true);
  const redirects = readFileSync(join(root, "_redirects"), "utf8");
  assert.match(redirects, /^\/api\/chat\s+\/\.netlify\/functions\/chat\s+200/m);
});
