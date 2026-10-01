(() => {
  const header = document.querySelector('#site-header');
  const toggle = document.querySelector('#nav-toggle');
  const nav = document.querySelector('#site-nav');
  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    header.dataset.navOpen = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开导航');
  };
  const openMenu = () => {
    header.dataset.navOpen = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '关闭导航');
  };

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  nav.addEventListener('click', (event) => {
    const item = event.target.closest('button');
    if (!item) return;
    nav.querySelectorAll('button[aria-current]').forEach((button) => button.removeAttribute('aria-current'));
    item.setAttribute('aria-current', 'page');
    closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (header.dataset.navOpen === 'true' && !header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.dataset.navOpen === 'true') {
      closeMenu();
      toggle.focus();
    }
  });

  const root = document.documentElement;
  const viewport = window.visualViewport;
  const syncViewport = () => {
    const height = viewport?.height || window.innerHeight;
    root.style.setProperty('--app-viewport-height', `${Math.round(height)}px`);
    root.style.setProperty('--site-header-height', `${Math.round(header.getBoundingClientRect().height)}px`);
    document.body.classList.toggle('keyboard-open', Boolean(viewport && height < window.innerHeight * 0.78));
    if (window.innerWidth > 1024) closeMenu();
  };
  viewport?.addEventListener('resize', syncViewport, { passive: true });
  viewport?.addEventListener('scroll', syncViewport, { passive: true });
  window.addEventListener('resize', syncViewport, { passive: true });
  syncViewport();

  const composer = document.querySelector('.composer');
  document.querySelector('#input')?.addEventListener('focus', () => {
    setTimeout(() => composer?.scrollIntoView({ block: 'end', behavior: 'smooth' }), 180);
  });
})();

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function assist(selector, vertical, label) {
    const area = document.querySelector(selector);
    if (!area) return;
    const controls = document.createElement('div');
    controls.className = 'scroll-assist' + (selector === '#scene-rail' ? ' scene-scroll-assist' : '');
    controls.hidden = true;
    const back = document.createElement('button');
    const next = document.createElement('button');
    const hint = document.createElement('span');
    hint.textContent = label;
    [back, next].forEach((button, i) => {
      button.type = 'button';
      button.textContent = vertical ? (i ? '↓' : '↑') : (i ? '→' : '←');
      button.setAttribute('aria-label', vertical ? (i ? '向下翻阅聊天' : '向上翻阅聊天') : (i ? '向右查看更多' : '向左查看更多'));
      button.addEventListener('click', () => area.scrollBy({
        [vertical ? 'top' : 'left']: (i ? 1 : -1) * (vertical ? area.clientHeight : area.clientWidth) * .75,
        behavior: reduced.matches ? 'auto' : 'smooth'
      }));
    });
    controls.append(back, hint, next);
    area.after(controls);
    let pending = false;
    function update() {
      pending = false;
      const max = vertical ? area.scrollHeight - area.clientHeight : area.scrollWidth - area.clientWidth;
      const position = vertical ? area.scrollTop : area.scrollLeft;
      controls.hidden = max <= 3;
      back.disabled = position <= 2;
      next.disabled = position >= max - 2;
    }
    function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
    area.addEventListener('scroll', schedule, {passive:true});
    new ResizeObserver(schedule).observe(area);
    new MutationObserver(schedule).observe(area, {childList:true,subtree:true,characterData:true});
    update();
  }
  assist('.scene-picker', false, '左右滑动选择情境');
  assist('#suggestions', false, '左右滑动查看更多回应');

  assist('#scene-rail', false, '左右滑动切换场景');
})();
