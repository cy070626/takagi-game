(() => {
  const KEY = 'takagi-engine-session-v1';
  const DURATION = 5 * 60 * 1000;
  const VALID = new Set(['qwen-max', 'qwen-flash', 'deepseek-pro', 'deepseek-flash']);
  let state;
  try { state = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch { state = {}; }
  const persist = () => { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const reset = () => { state = {}; persist(); };
  const preference = selected => state.preferred === selected && state.until > Date.now() && VALID.has(state.engine) ? state.engine : selected;
  const accept = (selected, data) => {
    if (!VALID.has(selected) || !VALID.has(data.engine)) return;
    if (data.engine !== selected && (state.engine !== data.engine || state.preferred !== selected || state.until <= Date.now())) {
      state = { preferred: selected, engine: data.engine, until: Date.now() + DURATION };
      persist();
    } else if (data.engine === selected) reset();
  };
  globalThis.TakagiEngineSession = Object.freeze({ preference, accept, reset, remaining: () => Math.max(0, Math.ceil((state.until - Date.now()) / 60000)) || 0 });
})();
