'use strict';
(() => {
  const copy = {
    sw: {
      "nav.work":"Kazi","nav.about":"Kuhusu","nav.contact":"Mawasiliano","nav.resume":"Wasifu",
      "hero.eyebrow":"Elektroniki, mawasiliano na programu","hero.location":"Dar es Salaam, Tanzania","hero.description":"Mimi ni Raymond. Nimesomea uhandisi wa elektroniki na mawasiliano, na ninavutiwa sana na uwezekano unaoletwa na programu za kompyuta.","hero.explore":"Tazama kazi",
      "work.heading":"Miradi iliyochaguliwa","work.caption":"Miradi na majaribio","project.swift.name":"Swift Wakala","project.fahari.name":"Fahari.io","project.tour.name":"Tour de Dar",
      "swift.description":"Kuwa na salio la wakala kwenye mtandao mmoja na kulihitaji kwenye mtandao mwingine. Ninaunda mtiririko wa maombi, akaunti na idhini kwa changamoto hiyo.","fahari.description":"Nyaraka, marejesho ya kodi na ripoti za fedha mara nyingi hutawanyika sehemu tofauti. Huu ulikuwa jaribio la kuviweka pamoja katika eneo moja rahisi kutumia.","tour.description":"Tovuti ya triathlon ya hisani jijini Dar es Salaam: mashindano, washiriki na jamii inayoyaunga mkono. Kuogelea, kuendesha baiskeli na kukimbia kwa lengo la kusaidia jamii.",
      "preview.disclosure":"Onyesho la kuona lililotengenezwa kwa AI. Linaiga mwonekano na baadhi ya skrini za programu inayokusudiwa; si programu halisi, si huduma inayofanya kazi moja kwa moja, wala uthibitisho kwamba miunganisho yake inafanya kazi.",
      "about.heading":"Kuhusu","about.lead":"Zana tofauti.<br>Shauku ileile.","about.p1":"Nilianza na elektroniki: kuelewa jinsi vitu vinavyounganishwa na kinachotokea vinaposhindwa kufanya kazi. Programu za kompyuta zilinipa njia nyingine ya kuchunguza maswali hayo.","about.p2":"Ninajifunza kwa kutengeneza vitu, kukutana na changamoto na kutafuta sababu zake. Miradi hii ni sehemu ya safari hiyo.",
      "resume.heading":"Pakua nakala yako.","contact.heading":"Tufanye<br>kitu chenye maana","contact.intro":"Mradi, nafasi ya kazi au swali zuri.<br>Ningependa kusikia kutoka kwako.","contact.email":"Barua pepe","contact.phone":"Simu","contact.city":"Dar es Salaam, Tanzania<br><span id=\"dar-time\">Saa za Afrika Mashariki · UTC+3</span>","footer.copyright":"© 2026 Raymond Duma","footer.top":"Rudi juu"
    },
    en: {}
  };
  const defaults = {
    "nav.work":"Work","nav.about":"About","nav.contact":"Contact","nav.resume":"Résumé",
    "hero.eyebrow":"Electronics Telecom & software","hero.location":"Dar es Salaam, Tanzania","hero.description":"I’m Raymond, trained in electronics and telecom engineering, but highly drawn to what software makes possible.","hero.explore":"Explore the work",
    "work.heading":"Selected work","work.caption":"Projects and experiments","project.swift.name":"Swift Wakala","project.fahari.name":"Fahari.io","project.tour.name":"Tour de Dar",
    "swift.description":"Having float on one network and needing it on another. I’m building the requests, accounts, and approval flows around that familiar problem.","fahari.description":"Documents, tax returns, and financial reports tend to end up in different places. This was my attempt at giving them one quieter, more useful workspace.","tour.description":"A home for a Dar es Salaam charity triathlon: the race, the people taking part, and the community around it. Swim, bike, run—with a reason to show up.",
    "preview.disclosure":"AI-generated visual preview. This demonstration imitates the intended application’s look and selected screens; it is not the actual application, a live service, or evidence that its integrations are operational.",
    "about.heading":"About","about.lead":"Different tools.<br>Same curiosity.","about.p1":"My starting point was electronics: understanding how things connect, and what happens when they don’t. Software gave me another way to work on those questions.","about.p2":"I learn by making things, getting stuck, and working out why. The projects here are part of that process.",
    "resume.heading":"Take a copy with you.","contact.heading":"Let’s make<br>something matter","contact.intro":"A project, a role, or a good question.<br>I’d like to hear it.","contact.email":"Email","contact.phone":"Phone","contact.city":"Dar es Salaam, Tanzania<br><span id=\"dar-time\">East Africa Time · UTC+3</span>","footer.copyright":"© 2026 Raymond Duma","footer.top":"Back to top"
  };
  copy.en = defaults;
  const languageButton = document.getElementById('language-toggle');
  const themeButton = document.getElementById('theme-toggle');
  const elements = [...document.querySelectorAll('[data-i18n]')];
  function applyLanguage(language) {
    const selected = language === 'sw' ? 'sw' : 'en';
    document.documentElement.lang = selected;
    elements.forEach(element => {
      const value = copy[selected][element.dataset.i18n] || defaults[element.dataset.i18n];
      if (value !== undefined) element.innerHTML = value;
    });
    languageButton.textContent = selected === 'en' ? 'EN / SW' : 'SW / EN';
    languageButton.setAttribute('aria-label', selected === 'en' ? 'Badili lugha kwenda Kiswahili' : 'Switch language to English');
    try { localStorage.setItem('portfolio-language', selected); } catch {}
  }
  function applyTheme(theme) {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    themeButton.textContent = selected === 'dark' ? 'Light mode' : 'Dark mode';
    themeButton.setAttribute('aria-label', selected === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    try { localStorage.setItem('portfolio-theme', selected); } catch {}
  }
  let language = 'en', theme = 'light';
  try { language = localStorage.getItem('portfolio-language') || 'en'; theme = localStorage.getItem('portfolio-theme') || 'light'; } catch {}
  applyLanguage(language); applyTheme(theme);
  languageButton.addEventListener('click', () => applyLanguage(document.documentElement.lang === 'en' ? 'sw' : 'en'));
  themeButton.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
})();
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
