/* Autoplaying tour of the standalone, no-login Swift browser preview.
   Only original demo navigation controls are activated. No payments or external APIs. */
(() => {
  'use strict';
  const host = document.getElementById('swift-walkthrough');
  if (!host) return;
  const frame = document.getElementById('swift-demo-frame');
  const viewport = host.querySelector('.walk-viewport');
  const toggle = document.getElementById('walk-toggle');
  const label = document.getElementById('walk-scene');
  const splash = host.querySelector('.walk-intro');
  const fallback = host.querySelector('.walk-fallback');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stages = [
    { name: '00 / Opening Swift', delay: 2400 },
    { name: '01 / Agent home', delay: 3100, role: 'agent', screen: 'home' },
    { name: '02 / Creating a request', delay: 3700, screen: 'request', sample: true },
    { name: '03 / Request history', delay: 3100, screen: 'history' },
    { name: '04 / Agent profile', delay: 3000, screen: 'profile' },
    { name: '05 / Main-agent overview', delay: 3400, role: 'main', screen: 'overview' },
    { name: '06 / Review queue', delay: 3300, screen: 'queue' },
    { name: '07 / Transfers', delay: 3300, screen: 'transfers' },
    { name: '08 / Agent records', delay: 3500, screen: 'agents' }
  ];
  let ready = false, playing = false, visible = true, scene = 0, timer = null;
  const doc = () => { try { return frame.contentDocument; } catch (_) { return null; } };
  const click = selector => {
    const node = doc()?.querySelector(selector);
    if (!node) return false;
    node.click(); return true;
  };
  const measure = () => {
    const phone = doc()?.querySelector('.phone');
    if (!phone) return false;
    const b = phone.getBoundingClientRect();
    if (!(b.width > 0 && b.height > 0)) return false;
    const s = viewport.clientWidth / b.width;
    viewport.style.aspectRatio = b.width + ' / ' + b.height;
    frame.style.transform = 'translate(' + (-b.x*s) + 'px,' + (-b.y*s) + 'px) scale(' + s + ')';
    return true;
  };
  const visit = next => {
    if (!ready) return;
    const stage = stages[next];
    if (next === 0) { click('[data-action="reset"]'); click('[data-action="role"][data-role="agent"]'); }
    else if (stage.role) click('[data-action="role"][data-role="' + stage.role + '"]');
    if (stage.screen) click('[data-nav="' + stage.screen + '"]');
    if (stage.sample) click('[data-action="sample"]');
    scene = next;
    host.dataset.scene = String(scene);
    label.textContent = stage.name;
    splash.setAttribute('aria-hidden', String(next !== 0));
    requestAnimationFrame(measure);
  };
  const schedule = () => {
    clearTimeout(timer);
    if (!playing || !visible || !ready) return;
    timer = setTimeout(() => { visit((scene + 1) % stages.length); schedule(); }, stages[scene].delay);
  };
  const setPlaying = next => {
    playing = Boolean(next);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.textContent = playing ? 'Pause Ⅱ' : 'Play ▶';
    schedule();
  };
  toggle.addEventListener('click', () => setPlaying(!playing));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = Boolean(entries[0]?.isIntersecting);
      schedule();
    }, { threshold: 0.08 }).observe(host);
  }
  frame.addEventListener('load', () => {
    try {
      const phone = doc()?.querySelector('.phone');
      if (!phone) throw Error('Preview not available');
      ready = true;
      host.dataset.ready = 'true';
      fallback.hidden = true;
      visit(0);
      if (!reduced.matches) setPlaying(true);
    } catch (_) {
      ready = false;
      host.dataset.ready = 'false';
      label.textContent = 'The demo could not be embedded';
      fallback.hidden = false;
      setPlaying(false);
    }
  });
  window.addEventListener('resize', () => { if (ready) measure(); });
  // Both GitHub Pages apps share an origin; this allows reading the real public demo.
  frame.src = '/swift-wakala-preview/';
})();