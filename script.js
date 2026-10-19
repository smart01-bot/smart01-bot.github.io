'use strict';

(() => {
  const tabList = document.querySelector('.project-tabs');
  const tabs = Array.from(document.querySelectorAll('[data-project]'));
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const names = panels.map(panel => panel.querySelector('h3').textContent.replace(/\.$/, ''));
  const announcement = document.getElementById('project-announcement');
  const counter = document.getElementById('current-project');
  const pagination = document.querySelector('.project-pagination');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;

  function selectProject(index, { focus = false, announce = true, animate = true } = {}) {
    selected = ((index % panels.length) + panels.length) % panels.length;
    tabs.forEach((tab, i) => {
      const active = i === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
      panels[i].classList.remove('is-entering');
    });
    const panel = panels[selected];
    if (animate && !motionPreference.matches) panel.classList.add('is-entering');
    counter.textContent = String(selected + 1).padStart(2, '0');
    if (announce) announcement.textContent = names[selected] + ', project ' + (selected + 1) + ' of ' + panels.length + '.';
    if (focus) tabs[selected].focus({ preventScroll: true });
  }

  if (tabList && tabs.length === panels.length && panels.length > 0) {
    tabList.setAttribute('role', 'tablist');
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id);
      panels[i].tabIndex = 0;
      tab.addEventListener('click', () => selectProject(i));
      tab.addEventListener('keydown', event => {
        let next = null;
        if (event.key === 'ArrowRight') next = selected + 1;
        if (event.key === 'ArrowLeft') next = selected - 1;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        selectProject(next, { focus: true });
      });
      panels[i].addEventListener('animationend', () => panels[i].classList.remove('is-entering'));
    });
    selectProject(0, { announce: false, animate: false });
    tabList.hidden = false;
    pagination.hidden = false;
    document.documentElement.classList.add('projects-ready');
    document.getElementById('previous-project').addEventListener('click', () => selectProject(selected - 1));
    document.getElementById('next-project').addEventListener('click', () => selectProject(selected + 1));

    // Horizontal touch gestures change work; vertical movement stays native scrolling.
    let suppressClickUntil = 0;
    const stage = document.querySelector('.project-stage');
    stage.addEventListener('click', event => {
      if (Date.now() < suppressClickUntil) event.preventDefault();
    }, true);
    panels.forEach(panel => {
      const art = panel.querySelector('.project-art');
      let origin = null;
      art.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'touch' || !event.isPrimary) return;
        origin = { x: event.clientX, y: event.clientY, id: event.pointerId };
      }, { passive: true });
      art.addEventListener('pointercancel', () => { origin = null; }, { passive: true });
      art.addEventListener('pointerup', event => {
        if (!origin || event.pointerId !== origin.id) return;
        const dx = event.clientX - origin.x;
        const dy = event.clientY - origin.y;
        origin = null;
        if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
        suppressClickUntil = Date.now() + 500;
        selectProject(selected + (dx < 0 ? 1 : -1));
      }, { passive: true });
    });
  }

  // Contact details remain plain text. Copying is an optional enhancement.
  let toastTimer;
  const toast = document.getElementById('copy-status');
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', async () => {
      const element = document.getElementById(button.dataset.copy);
      const text = element.textContent.trim();
      button.disabled = true;
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        showToast(button.dataset.copy === 'contact-email' ? 'Email address copied.' : 'Phone number copied.');
      } catch {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
          showToast('Text selected. Use your device’s Copy command.');
        } else {
          showToast('Select the contact text to copy it.');
        }
      } finally {
        button.disabled = false;
      }
    });
  });

  const timeElement = document.getElementById('dar-time');
  function updateDarTime() {
    try {
      const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Dar_es_Salaam', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
      timeElement.textContent = time + ' in Dar · East Africa Time';
    } catch { /* Static UTC+3 label stays usable without timezone support. */ }
  }
  updateDarTime();
  setInterval(() => { if (!document.hidden) updateDarTime(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDarTime(); });

  const progress = document.querySelector('.reading-line');
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks.map(link => document.getElementById(link.dataset.nav));
  let scheduled = false;
  function updateScrollState() {
    scheduled = false;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
    progress.style.transform = 'scaleX(' + fraction + ')';
    let current = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= 155) current = section.id; });
    if (fraction > .99 && height > 0) current = sections[sections.length - 1].id;
    navLinks.forEach(link => {
      if (link.dataset.nav === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScrollState() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateScrollState);
  }
  window.addEventListener('scroll', scheduleScrollState, { passive: true });
  window.addEventListener('resize', scheduleScrollState, { passive: true });
  window.addEventListener('load', scheduleScrollState);
  document.addEventListener('toggle', scheduleScrollState, true);
  tabList.addEventListener('click', scheduleScrollState);
  tabList.addEventListener('keydown', scheduleScrollState);
  pagination.addEventListener('click', scheduleScrollState);
  updateScrollState();
})();
