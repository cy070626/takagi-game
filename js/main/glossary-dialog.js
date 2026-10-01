const dialog = $("#dialog");
function openDialog(title, body) {
  $("#dialog-title").textContent = title;
  $("#dialog-body").replaceChildren(body);
  dialog.showModal();
}
$("#close-dialog").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
function textEl(tag, text, cls) {
  const e = document.createElement(tag);
  e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function renderTermPreview() {
  const box = $("#term-preview");
  box.replaceChildren();
  const same = terms.filter((t) => t.scene === activeScene),
    featured = [
      ...same.filter((t) => t.tag === "日本青春"),
      ...same.filter((t) => t.tag !== "日本青春"),
    ].slice(0, 4);
  featured.forEach((t) => {
    const b = textEl("button", t.title, "term-card");
    b.dataset.tag = t.tag;
    b.append(textEl("small", t.tag), textEl("span", t.summary));
    b.onclick = () => openTerm(t);
    box.append(b);
  });
}
function openTerm(t) {
  const body = document.createElement("div");
  body.append(textEl("span", t.tag, "term-tag"), textEl("p", t.detail));
  if (t.source) body.append(link("查看官方资料 ↗", t.source));
  body.append(
    textEl("h3", "她会这样接话"),
    textEl("p", termOpening(t), "term-opening"),
  );
  const button = textEl("button", "从这个话题开始聊", "setting");
  button.onclick = () => startTermConversation(t);
  body.append(textEl("h3", "还能往这些方向聊"));
  const branches = document.createElement("div");
  branches.className = "suggestions";
  termPrompts(t).forEach((label) => {
    const chip = textEl("span", label, "term-branch-chip");
    branches.append(chip);
  });
  body.append(branches, button);
  const related = globalThis.TakagiTopicTree.related(t, terms);
  if (related.length) {
    body.append(textEl("h3", "也可以顺着聊到"));
    const links = document.createElement("div");
    links.className = "suggestions";
    related.forEach((title) => {
      const b = textEl("button", title);
      b.onclick = () => openTerm(terms.find((item) => item.title === title));
      links.append(b);
    });
    body.append(links);
  }
  openDialog(t.title, body);
}
function showGlossary() {
  const body = document.createElement("div");
  body.className = "term-dialog";
  body.append(
    textEl(
      "p",
      "这些词条区分原作背景、人物语气、生活文化、成年话题与原创情景。",
    ),
  );
  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = "搜索词条";
  search.setAttribute("aria-label", "搜索词条");
  body.append(search);
  const filters = document.createElement("div");
  filters.className = "term-filters";
  const list = document.createElement("div");
  list.className = "term-list";
  let filter = "全部";
  function render() {
    list.replaceChildren();
    const q = search.value.trim();
    const shown = terms.filter(
      (t) =>
        (filter === "全部" || t.tag === filter) &&
        (!q ||
          t.title.includes(q) ||
          t.summary.includes(q) ||
          t.detail.includes(q)),
    );
    shown.forEach((t) => {
      const b = textEl("button", t.title, "term-row");
      b.append(textEl("small", t.tag), textEl("span", t.summary));
      b.onclick = () => openTerm(t);
      list.append(b);
    });
    if (!shown.length) list.append(textEl("p", "没有找到相关词条。"));
  }
  [
    "全部",
    "校园小事",
    "日本青春",
    "原作背景",
    "人物语气",
    "中国校园",
    "成年日常",
    "关系与边界",
    "选择与计划",
    "兴趣与作品",
    "情绪整理",
    "学习与复盘",
    "中日饮食",
    "作息文化",
    "天气气候",
    "地理常识",
    "原创互动",
    "互动约定",
  ].forEach((f) => {
    const b = textEl("button", f);
    b.setAttribute("aria-pressed", String(filter === f));
    b.onclick = () => {
      filter = f;
      filters
        .querySelectorAll("button")
        .forEach((x) =>
          x.setAttribute("aria-pressed", String(x.textContent === f)),
        );
      render();
    };
    filters.append(b);
  });
  search.oninput = render;
  body.append(filters, list);
  render();
  openDialog("日常词条", body);
  search.focus();
}
$("#glossary-open").onclick = showGlossary;
$("#all-terms").onclick = showGlossary;
