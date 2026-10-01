let activeScene = "classroom",
  activeTerm = null,
  localTopicTurns = 0,
  aiMode = "chat",
  busy = false,
  turn = 0,
  serious = false,
  challenge = 0,
  focusTimer = null,
  focusEnd = 0,
  focusTick = null;
const sceneEl = $("#scene"),
  log = $("#log"),
  input = $("#input"),
  send = $("#send");
function save(name, value) {
  try {
    localStorage.setItem(name, value);
  } catch {}
}
function load(name) {
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
}
const profileDefaults = {
  name: "",
  address: "同桌",
  identity: "学生",
  difficulty: "hard",
  difficultyVersion: 3,
  context: "",
  location: "",
  interests: [],
  needs: ["轻松陪伴"],
  modelPreference: "qwen-flash",
  chatStyle: "gentle",
  currentMood: "calm",
  startScene: "last",
  startMode: "last",
};
function readProfile() {
  try {
    const value = JSON.parse(load("takagi-profile") || "null");
    if (!value || typeof value !== "object") return { ...profileDefaults };
    const migrated =
      value.difficultyVersion === 3
        ? value
        : {
            ...value,
            difficulty: value.difficulty || "hard",
            difficultyVersion: 3,
          };
    return {
      ...profileDefaults,
      ...migrated,
      needs: Array.isArray(migrated.needs)
        ? migrated.needs.slice(0, 3)
        : profileDefaults.needs,
    };
  } catch {
    return { ...profileDefaults };
  }
}
let profile = readProfile();
if (load("takagi-engine-default-v761") !== "applied") {
  profile.modelPreference = "qwen-flash";
  save("takagi-profile", JSON.stringify(profile));
  save("takagi-engine-default-v761", "applied");
  globalThis.TakagiEngineSession?.reset();
}
if (String(profile.modelPreference || "").startsWith("gpt-")) {
  profile.modelPreference = "qwen-flash";
  save("takagi-profile", JSON.stringify(profile));
}
const savedMode = load("takagi-chat-mode");
aiMode =
  profile.startMode === "study"
    ? "study"
    : profile.startMode === "chat"
      ? "chat"
      : savedMode === "study"
        ? "study"
        : "chat";
document
  .querySelectorAll("[data-mode]")
  .forEach((item) =>
    item.setAttribute("aria-pressed", String(item.dataset.mode === aiMode)),
  );
function preferredAddress() {
  return profile.address?.trim() || profile.name?.trim() || "你";
}
function welcomeFor(scene) {
  const line = scene.welcome;
  return profile.address?.trim() ? `${preferredAddress()}，${line}` : line;
}
if (load("takagi-motion") === "off") sceneEl.classList.remove("alive");
if (load("takagi-pose") === "close") {
  $("#pose").value = "close";
  sceneEl.classList.add("closer");
}
function syncMotion() {
  const on = sceneEl.classList.contains("alive");
  $("#motion").textContent = on ? "Ⅱ" : "▷";
  $("#motion").setAttribute("aria-label", on ? "暂停动态" : "开启动态");
  $("#motion").setAttribute("aria-pressed", String(on));
  $(".scene-controls>span").textContent = on
    ? "轻轻摇晃，等你开口"
    : "动态已暂停";
}
syncMotion();
$("#motion").onclick = () => {
  sceneEl.classList.toggle("alive");
  syncMotion();
  save("takagi-motion", sceneEl.classList.contains("alive") ? "on" : "off");
};
function pose(value) {
  if (!["daily", "close", "portrait", "wide"].includes(value))
    throw Error("无效姿态");
  $("#pose").value = value;
  sceneEl.classList.toggle("closer", value === "close");
  sceneEl.dataset.pose = value;
  save("takagi-pose", value);
  return { pose: value };
}
$("#pose").onchange = (e) => pose(e.target.value);
