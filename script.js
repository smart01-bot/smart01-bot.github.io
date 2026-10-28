'use strict';
(() => {
  const timeElement = document.getElementById('dar-time');
  function updateDarTime() {
    if (!timeElement) return;
    try {
      const time = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Dar_es_Salaam', hour: '2-digit', minute: '2-digit', hour12: false
      }).format(new Date());
      timeElement.textContent = time + ' in Dar · East Africa Time';
    } catch {
      // Keep the static UTC+3 label if time-zone data is unavailable.
    }
  }
  updateDarTime();
  setInterval(() => { if (!document.hidden) updateDarTime(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDarTime(); });

  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks.map(link => document.getElementById(link.dataset.nav)).filter(Boolean);
  function updateActiveNav() {
    let current = '';
    const threshold = Math.min(200, window.innerHeight * 0.3);
    sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) current = section.id; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2 && sections.length) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach(link => {
      if (link.dataset.nav === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', updateActiveNav, {passive:true});
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();
})();
