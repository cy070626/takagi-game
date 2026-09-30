(() => {
  const KEY = 'takagi-visit-memory-v1';
  const clean = (value, limit = 160) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit);
  const fresh = () => ({
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    startedAt: Date.now(),
    events: [],
  });
  const read = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      return value && Array.isArray(value.events) ? value : fresh();
    } catch {
      return fresh();
    }
  };
  const state = read();
  const persist = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  };
  const record = (type, text, details = '') => {
    const event = { type: clean(type, 32), text: clean(text), details: clean(details, 100), at: Date.now() };
    if (!event.type || !event.text) return;
    const previous = state.events.at(-1);
    if (previous?.type === event.type && previous?.text === event.text) return;
    state.events.push(event);
    state.events.splice(0, Math.max(0, state.events.length - 36));
    persist();
  };
  state.highlights ||= {};
  const originalRecord = record;
  const remember = (type, text, details = '') => {
    originalRecord(type, text, details);
    const event = state.events.at(-1);
    if (event && event.type !== '对话') {
      state.highlights[event.type] = event;
      const keys = Object.keys(state.highlights);
      keys.slice(0, Math.max(0, keys.length - 8)).forEach(key => delete state.highlights[key]);
      persist();
    }
  };
  for (const event of state.events) if (event.type !== '对话') state.highlights[event.type] = event;
  const context = () => {
    const milestones = Object.values(state.highlights).slice(-6);
    const dialogue = state.events.filter(event => event.type === '对话');
    const olderTopics = dialogue.slice(0, -6).slice(-2);
    const latestTopic = dialogue.slice(-1);
    const selected = [...milestones, ...olderTopics, ...latestTopic].sort((a, b) => a.at - b.at);
    return '本次访问摘要，仅作为对话背景：\n' + selected.map(event => `${event.type}：${clean(event.text, 72)}${event.details ? `（${clean(event.details, 72)}）` : ''}`).join('\n').slice(0, 1200);
  };
  const summary = () => ({ id: state.id, startedAt: state.startedAt, eventCount: state.events.length, context: context() });
  globalThis.TakagiVisitMemory = Object.freeze({ record: remember, context, summary });
  document.addEventListener('takagi:memory', (event) => remember(event.detail?.type, event.detail?.text, event.detail?.details));
  if (!state.events.length) remember('到访', '打开了“放学后”页面');
})();
