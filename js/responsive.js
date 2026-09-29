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
