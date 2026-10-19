'use strict';
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 961px) and (min-height: 620px)');
  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const chapterLinks = Array.from(document.querySelectorAll('[data-project]'));
  const stage = document.getElementById('work-visuals');
  let selected = -1;
  let enhanced = false;
  const artLinks = panels.map(panel => {
    const art = panel.querySelector('.project-art').cloneNode(true);
    art.hidden = true;
    art.dataset.visual = panel.dataset.panel;
    stage.appendChild(art);
    return art;
  });

  function selectChapter(index) {
    if (index === selected) return;
    // Reading and keyboard focus take priority over passive scroll animation.
    if (stage.contains(document.activeElement)) return;
    selected = index;
    artLinks.forEach((art, i) => { art.hidden = i !== index; });
    chapterLinks.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function configureChapters() {
    const next = desktop.matches && !motion.matches;
    if (!next && stage.contains(document.activeElement) && selected >= 0) {
      panels[selected].querySelector('.project-primary').focus({ preventScroll: true });
    }
    enhanced = next;
    stage.hidden = !enhanced;
    document.documentElement.classList.toggle('chapters-ready', enhanced);
    scheduleScrollState();
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
    let index = 0;
    const threshold = window.innerHeight * .5;
    panels.forEach((panel, i) => { if (panel.getBoundingClientRect().top <= threshold) index = i; });
    selectChapter(index);
  }
  function scheduleScrollState() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateScrollState);
  }
  window.addEventListener('scroll', scheduleScrollState, { passive: true });
  window.addEventListener('resize', scheduleScrollState, { passive: true });
  window.addEventListener('load', scheduleScrollState);
  window.addEventListener('hashchange', scheduleScrollState);
  document.addEventListener('toggle', scheduleScrollState, true);
  stage.addEventListener('focusout', scheduleScrollState);
  if (desktop.addEventListener) desktop.addEventListener('change', configureChapters);
  if (motion.addEventListener) motion.addEventListener('change', configureChapters);
  configureChapters();

  const signature = document.querySelector('.signature');
  signature.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType === 'touch') return;
    const box = signature.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    signature.style.setProperty('--signature-x', x.toFixed(3));
    signature.style.setProperty('--signature-y', y.toFixed(3));
    signature.classList.add('is-reacting');
  }, { passive: true });
  signature.addEventListener('pointerleave', () => signature.classList.remove('is-reacting'), { passive: true });
  if (motion.addEventListener) motion.addEventListener('change', () => signature.classList.remove('is-reacting'));
})();
