// Loaded only when a complete message contains a math delimiter.
const TakagiMathDisplay = (() => {
  let loading;
  const hasMath = /\\\(|\\\[|\$\$[\s\S]+?\$\$|\$(?=[^\s$])[^$\n]+?\$|\\begin\{/;
  function script(path) {
    return new Promise((resolve, reject) => {
      const tag = document.createElement('script'); tag.src = path;
      tag.onload = resolve; tag.onerror = () => { tag.remove(); reject(new Error('公式资源加载失败')); };
      document.head.append(tag);
    });
  }
  function load() {
    if (!loading) loading = (async () => {
      let css = document.getElementById('takagi-math-css');
      if (!css) {
        css = document.createElement('link'); css.id = 'takagi-math-css';
        css.rel = 'stylesheet'; css.href = './assets/vendor/katex/katex.min.css';
        document.head.append(css);
      }
      if (!globalThis.katex) await script('./assets/vendor/katex/katex.min.js');
      if (!globalThis.renderMathInElement) await script('./assets/vendor/katex/contrib/auto-render.min.js');
    })().catch(error => { loading = null; throw error; });
    return loading;
  }
  async function render(node) {
    const raw = node.dataset.rawText || node.textContent;
    node.dataset.rawText = raw;
    if (!hasMath.test(raw)) return;
    try {
      await load();
      if (!node.isConnected || node.dataset.rawText !== raw) return;
      globalThis.renderMathInElement(node, {
        delimiters: [
          {left:'$$',right:'$$',display:true},
          {left:'\\[',right:'\\]',display:true},
          {left:'\\(',right:'\\)',display:false},
          {left:'$',right:'$',display:false},
        ],
        throwOnError:false, trust:false, strict:'ignore', maxExpand:500, maxSize:20,
        errorColor:'#765b45', macros:{},
      });
    } catch { /* Keep readable source when local resources fail. Chat continues. */ }
  }
  return {render};
})();
