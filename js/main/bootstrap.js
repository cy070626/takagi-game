const continuityScript = document.createElement("script");
continuityScript.src = "./js/continuity.js?v=98";
document.body.append(continuityScript);
let extrasPromise = null;
const loadExtras = () =>
  extrasPromise ||
  (extrasPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "./js/extras.js?v=98";
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      extrasPromise = null;
      reject(Error("功能入口加载失败，请重试。"));
    };
    document.body.append(script);
  }));
const queueExtras = () => {
  "requestIdleCallback" in window
    ? requestIdleCallback(() => loadExtras().catch(() => {}), { timeout: 900 })
    : setTimeout(() => loadExtras().catch(() => {}), 250);
};
document.readyState === "loading"
  ? addEventListener("DOMContentLoaded", queueExtras, { once: true })
  : queueExtras();
