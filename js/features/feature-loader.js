const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      reject(new Error("功能脚本加载失败，请再次点击重试。"));
    };
    document.body.append(script);
  });
let gamesPromise = null,
  sidebarPromise = null,
  sidebarReady = false;
const loadGames = () =>
  gamesPromise ||
  (gamesPromise = loadScript("./js/games-bundle.js?v=92").catch((error) => {
    gamesPromise = null;
    throw error;
  }));
const loadSidebar = () =>
  sidebarPromise ||
  (sidebarPromise = loadScript("./js/sidebar-bundle.js?v=92")
    .then(() => {
      sidebarReady = true;
    })
    .catch((error) => {
      sidebarPromise = null;
      throw error;
    }));
globalThis.TakagiSiteFeatures = Object.freeze({ loadGames });
const warmGames = () => loadGames().catch(() => {});
const warmSidebar = () => loadSidebar().catch(() => {});
const gameAnchor = document.querySelector(".interactions");
if (gameAnchor && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        warmGames();
      }
    },
    { rootMargin: "700px" },
  );
  observer.observe(gameAnchor);
} else setTimeout(warmGames, 1200);
if (matchMedia("(min-width:1025px)").matches) setTimeout(warmGames, 6000);
const arcadeTrigger = document.getElementById("arcade-open");
if (arcadeTrigger) {
  arcadeTrigger.addEventListener("pointerenter", warmGames, { once: true });
  arcadeTrigger.addEventListener("focus", warmGames, { once: true });
  arcadeTrigger.addEventListener("click", () => {
    arcadeTrigger.disabled = true;
    loadGames()
      .then(() => {
        const shelf = document.querySelector(".arcade-shelf");
        if (!shelf) return;
        shelf.open = true;
        shelf.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
        shelf.querySelector("summary")?.focus();
      })
      .catch((error) => speak(error.message, "warm"))
      .finally(() => {
        arcadeTrigger.disabled = false;
      });
  });
}
["omikuji-open", "memories-open"].forEach((id) => {
  const trigger = document.getElementById(id);
  if (!trigger) return;
  trigger.addEventListener("pointerenter", warmSidebar, { once: true });
  trigger.addEventListener("focus", warmSidebar, { once: true });
  trigger.addEventListener(
    "click",
    function resume(event) {
      if (sidebarReady) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      loadSidebar()
        .then(() => trigger.click())
        .catch((error) => speak(error.message, "warm"));
    },
    { capture: true },
  );
});
if (matchMedia("(min-width:1025px)").matches) setTimeout(warmSidebar, 9000);
