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
  const context = () => state.events.slice(-18).map((event) => {
    const time = new Date(event.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${time} ${event.type}：${event.text}${event.details ? `（${event.details}）` : ''}`;
  }).join('\n').slice(-1600);
  const summary = () => ({ id: state.id, startedAt: state.startedAt, eventCount: state.events.length, context: context() });
  globalThis.TakagiVisitMemory = Object.freeze({ record, context, summary });
  document.addEventListener('takagi:memory', (event) => record(event.detail?.type, event.detail?.text, event.detail?.details));
  if (!state.events.length) record('到访', '打开了“放学后”页面');
})();
