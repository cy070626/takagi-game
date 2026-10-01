import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const release = JSON.parse(readFileSync(new URL("../build.config.json", import.meta.url), "utf8")).release;
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
      const browserBase = /music-theater(?:-runtime)?\.js$/.test(source)
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

test("Netlify AI 路由和入口文件存在", () => {
  assert.equal(existsSync(join(root, "index.html")), true);
  assert.equal(existsSync(join(root, "netlify", "functions", "chat.js")), true);
  assert.equal(existsSync(join(root, "netlify", "functions", "game.js")), true);
  const redirects = readFileSync(join(root, "_redirects"), "utf8");
  assert.match(redirects, /^\/api\/chat\s+\/\.netlify\/functions\/chat\s+200/m);
  assert.match(redirects, /^\/api\/game\s+\/\.netlify\/functions\/game\s+200/m);
});

test("V75 响应式入口与独立页面样式已接入", () => {
  const index = readFileSync(join(root, "index.html"), "utf8");
  const responsive = readFileSync(join(root, "css", "responsive.css"), "utf8");
  const responsiveGames = readFileSync(join(root, "css", "responsive-games.css"), "utf8");
  const eraser = readFileSync(join(root, "games", "eraser-duel.html"), "utf8");
  const mind = readFileSync(join(root, "games", "mind-duel.html"), "utf8");
  const theater = readFileSync(join(root, "pages", "music-theater.html"), "utf8");

  assert.match(index, /viewport-fit=cover/);
  assert.match(index, /id="nav-toggle"/);
  assert.match(index, /id="site-nav"/);
  assert.match(index, /id="arcade-open"/);
  assert.match(index, new RegExp("css\\/responsive\\.css\\?v=" + release));
  assert.match(index, new RegExp("js\\/responsive\\.js\\?v=" + release));
  assert.match(responsive, /@media\s*\(max-width:\s*1024px\)/);
  assert.match(responsive, /min-height:\s*44px/);
  assert.match(responsiveGames, /@media \(max-width: 650px\)/);
  assert.match(eraser, new RegExp("responsive-games\\.css\\?v=" + release));
  assert.match(mind, new RegExp("responsive-games\\.css\\?v=" + release));
  assert.match(theater, new RegExp("responsive-games\\.css\\?v=" + release));
});

test("橡皮对决使用低重绘动画路径", () => {
  const source = readFileSync(join(root, "games", "eraser-duel.html"), "utf8");
  assert.match(source, /FRAME_MS=1000\/30/);
  assert.match(source, /translate3d\(/);
  assert.doesNotMatch(source, /getBoundingClientRect\(/);
  assert.doesNotMatch(source, /backdrop-filter\s*:/);
  assert.doesNotMatch(source, /data:image\/png;base64/);
});

test("首屏场景与猜心对决使用轻量资源", () => {
  const index = readFileSync(join(root, "index.html"), "utf8");
  const experience = readFileSync(join(root, "js", "experience.js"), "utf8");
  const extras = readFileSync(join(root, "js", "extras.js"), "utf8");
  const mind = readFileSync(join(root, "games", "mind-duel.html"), "utf8");

  assert.ok(Buffer.byteLength(experience) < 100_000, "experience.js 应小于 100KB");
  assert.ok(Buffer.byteLength(mind) < 100_000, "mind-duel.html 应小于 100KB");
  assert.match(index, /assets\/takagi\.webp/);
  assert.match(index, /assets\/takagi-avatar\.webp/);
  assert.doesNotMatch(index, /assets\/takagi\.png/);
  assert.doesNotMatch(experience, /Object\.values\(scenes\).*new Image/);
  assert.doesNotMatch(mind, /data:image\//);
  assert.match(mind, /assets\/mind-duel-v42-bg\.webp/);
  assert.match(extras, /IntersectionObserver/);
  assert.match(index, new RegExp("visit-memory\\.js\\?v=" + release));
  assert.match(extras, new RegExp("games-bundle\\.js\\?v=" + release));
  assert.match(extras, new RegExp("sidebar-bundle\\.js\\?v=" + release));
  assert.match(extras, /arcade-open/);
  assert.doesNotMatch(experience, /\/api\/transcribe/);
  assert.doesNotMatch(extras, /supplement\.open=true/);
});

test("合并脚本由构建脚本生成且可以直接部署", () => {
  const games = readFileSync(join(root, "js", "games-bundle.js"), "utf8");
  const sidebar = readFileSync(join(root, "js", "sidebar-bundle.js"), "utf8");
  assert.match(games, /js\/puzzles\.js/);
  assert.match(games, /js\/arcade-v2\.js/);
  assert.match(sidebar, /js\/omikuji\.js/);
  assert.match(sidebar, /js\/memories\.js/);
});



