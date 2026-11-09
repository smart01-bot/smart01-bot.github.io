'use strict';
(() => {
  const text = {
    en: {
      "skip.content":"Skip to content","hero.title":"<span>Electronics, Telecom &amp;</span> <span class=\"secondary-line\">software<span class=\"copper-period\">.</span></span>",
      "nav.work":"Work","nav.about":"About","nav.contact":"Contact","nav.resume":"Résumé",
      "hero.eyebrow":"Electronics Telecom & software","hero.location":"Dar es Salaam, Tanzania","hero.description":"I’m Raymond, trained in electronics and telecom engineering, but highly drawn to what software makes possible.","hero.explore":"Explore the work",
      "work.heading":"Selected work","work.caption":"Projects and experiments","project.test.name":"TEST.MOBILE","project.swift.name":"Swift Wakala","project.fahari.name":"Fahari.io","project.tour.name":"Tour de Dar",
      "test.type":"Mobile application","test.status":"Standalone demo","swift.type":"Mobile application","status.development":"In development","fahari.type":"Web application","status.earlier":"Earlier work","tour.type":"Event website","status.community":"Community project",
      "test.title":"A lending<br>marketplace.","swift.title":"A little more<br>flow.","fahari.title":"Everything,<br>in its place.","tour.title":"One city.<br>Three disciplines.",
      "test.description":"A Flutter-based lending marketplace demo with separate personal and business journeys. It brings together account onboarding, credit offers, loan applications, and application-status views in one mobile experience.","test.stack":"Flutter / Dart / Android","test.disclosure":"Standalone demonstration using fictional sample data. Card Informatics backend services and Firebase are disconnected. The browser preview is a separate HTML, CSS, and JavaScript recreation; it does not accept real applications or process transactions.","test.status.detail":"The Flutter project is configured for standalone demonstration. Its browser preview is a separate front-end recreation and does not connect to a live lending backend.","test.link.preview":"Open interactive preview","test.link.source":"View Flutter source","test.link.preview.source":"View preview source","swift.description":"Having float on one network and needing it on another. I’m building the requests, accounts, and approval flows around that familiar problem.","fahari.description":"Documents, tax returns, and financial reports tend to end up in different places. This was my attempt at giving them one quieter, more useful workspace.","tour.description":"A home for a Dar es Salaam charity triathlon: the race, the people taking part, and the community around it. Swim, bike, run—with a reason to show up.",
      "swift.stack":"React Native / TypeScript / Express / PostgreSQL","fahari.stack":"React / TypeScript / Vite","tour.stack":"Next.js / TypeScript / Supabase",
      "preview.disclosure":"AI-generated visual preview. This demonstration imitates the intended application’s look and selected screens; it is not the actual application, a live service, or evidence that its integrations are operational.",
      "link.apk":"Download Android test APK","apk.meta":"Android only · Test build v1.0.0 (build 2) · 75.8 MB","apk.details":"Build details & checksum","apk.hash.label":"SHA-256","apk.safety":"Test version only. Do not use real funds or sensitive live-account credentials while testing.","apk.release":"Release page and notes","link.try":"Open AI preview","link.source":"View source","link.demo":"Open AI preview","link.site":"Open AI preview","project.status":"Where it stands",
      "live.label":"Live site","live.description":"A live website I worked on.","work.disclaimer":"Previews use demonstration data.",
      "about.heading":"About","about.lead":"Different tools.<br>Same curiosity.","about.p1":"My starting point was electronics: understanding how things connect, and what happens when they don’t. Software gave me another way to work on those questions.","about.p2":"I learn by making things, getting stuck, and working out why. The projects here are part of that process.",
      "experience.role":"Software Developer","experience.card":"Flutter development, PHP web applications, Supabase, and REST APIs. Working on the practical details of applications people use.","experience.training":"Industrial practical training","experience.tanesco":"Electrical and telecommunications installation, maintenance, and troubleshooting.","experience.education":"Electronics &amp; telecommunications","experience.dit":"Diploma in Electronics and Telecommunications Engineering. The foundation behind my interest in systems and how they work together.","experience.tools":"Tools","experience.toolkit":"A growing toolkit","experience.toolkit.sub":"Languages, frameworks, and the rest.",
      "credential.kicker":"Award Verification Certificate · NACTVET · Issued 29 October 2026","credential.title":"Ordinary Diploma in Electronics and Telecommunication Engineering","credential.detail":"Dar es Salaam Institute of Technology · Award year 2024","credential.number":"Award verification no.","credential.verify":"Verify certificate with NACTVET","credential.download":"Download AVN certificate",
      "resume.kicker":"The short version, on paper.","resume.heading":"Take a copy with you.","resume.link":"The résumé version","resume.download":"Download résumé",
      "contact.heading":"Let’s make<br>something matter","contact.intro":"A project, a role, or a good question.<br>I’d like to hear it.","contact.email":"Email","contact.phone":"Phone","contact.city":"Dar es Salaam, Tanzania<br><span id=\"dar-time\">East Africa Time · UTC+3</span>",
      "footer.copyright":"© 2026 Raymond Duma","footer.top":"Back to top"
    },
    sw: {
      "skip.content":"Ruka hadi kwenye maudhui","hero.title":"<span>Elektroniki, mawasiliano na</span> <span class=\"secondary-line\">programu<span class=\"copper-period\">.</span></span>",
      "nav.work":"Kazi","nav.about":"Kuhusu","nav.contact":"Mawasiliano","nav.resume":"Wasifu",
      "hero.eyebrow":"Elektroniki, mawasiliano na programu","hero.location":"Dar es Salaam, Tanzania","hero.description":"Mimi ni Raymond. Nimesomea uhandisi wa elektroniki na mawasiliano, na ninavutiwa sana na uwezekano unaoletwa na programu za kompyuta.","hero.explore":"Tazama kazi",
      "work.heading":"Miradi iliyochaguliwa","work.caption":"Miradi na majaribio","project.test.name":"TEST.MOBILE","project.swift.name":"Swift Wakala","project.fahari.name":"Fahari.io","project.tour.name":"Tour de Dar",
      "test.type":"Programu ya simu","test.status":"Onyesho linalojitegemea","swift.type":"Programu ya simu","status.development":"Inaendelezwa","fahari.type":"Programu ya wavuti","status.earlier":"Mradi wa awali","tour.type":"Tovuti ya tukio","status.community":"Mradi wa jamii",
      "test.title":"Soko la<br>mikopo.","swift.title":"Mtiririko<br>bora zaidi.","fahari.title":"Kila kitu,<br>mahali pake.","tour.title":"Jiji moja.<br>Michezo mitatu.",
      "test.description":"Onyesho la soko la mikopo lililotengenezwa kwa Flutter, lenye mtiririko tofauti kwa watumiaji binafsi na biashara. Linajumuisha usajili wa akaunti, ofa za mikopo, maombi ya mkopo na ufuatiliaji wa hali ya maombi.","test.stack":"Flutter / Dart / Android","test.disclosure":"Onyesho la kujitegemea linalotumia data za mfano. Huduma za mfumo wa nyuma wa Card Informatics na Firebase hazijaunganishwa. Onyesho la kivinjari ni toleo tofauti lililotengenezwa kwa HTML, CSS na JavaScript; halipokei maombi halisi wala kuchakata miamala.","test.status.detail":"Mradi wa Flutter umeandaliwa kwa matumizi ya onyesho la kujitegemea. Onyesho la kivinjari ni toleo tofauti la kiolesura na haliunganishwi na mfumo halisi wa mikopo.","test.link.preview":"Fungua onyesho shirikishi","test.link.source":"Angalia msimbo wa Flutter","test.link.preview.source":"Angalia msimbo wa onyesho","swift.description":"Kuwa na salio la wakala kwenye mtandao mmoja na kulihitaji kwenye mtandao mwingine. Ninaunda mtiririko wa maombi, akaunti na idhini kwa changamoto hiyo.","fahari.description":"Nyaraka, marejesho ya kodi na ripoti za fedha mara nyingi hutawanyika sehemu tofauti. Huu ulikuwa jaribio la kuviweka pamoja katika eneo moja rahisi kutumia.","tour.description":"Tovuti ya triathlon ya hisani jijini Dar es Salaam: mashindano, washiriki na jamii inayoyaunga mkono. Kuogelea, kuendesha baiskeli na kukimbia kwa lengo la kusaidia jamii.",
      "swift.stack":"React Native / TypeScript / Express / PostgreSQL","fahari.stack":"React / TypeScript / Vite","tour.stack":"Next.js / TypeScript / Supabase",
      "preview.disclosure":"Onyesho la kuona lililotengenezwa kwa AI. Linaiga mwonekano na baadhi ya skrini za programu inayokusudiwa; si programu halisi, si huduma inayofanya kazi moja kwa moja, wala uthibitisho kwamba miunganisho yake inafanya kazi.",
      "link.apk":"Pakua APK ya majaribio ya Android","apk.meta":"Android pekee · Toleo la majaribio 1.0.0 (build 2) · 75.8 MB","apk.details":"Maelezo ya toleo na checksum","apk.hash.label":"SHA-256","apk.safety":"Toleo la majaribio pekee. Usitumie fedha halisi au taarifa nyeti za akaunti halisi wakati wa kujaribu.","apk.release":"Ukurasa wa toleo na maelezo","link.try":"Fungua onyesho la AI","link.source":"Angalia msimbo","link.demo":"Fungua onyesho la AI","link.site":"Fungua onyesho la AI","project.status":"Hali ya mradi",
      "live.label":"Tovuti inayofanya kazi","live.description":"Tovuti hai niliyoshiriki kuitengeneza.","work.disclaimer":"Maonyesho yanatumia data za mfano.",
      "about.heading":"Kuhusu","about.lead":"Zana tofauti.<br>Shauku ileile.","about.p1":"Nilianza na elektroniki: kuelewa jinsi vitu vinavyounganishwa na kinachotokea vinaposhindwa kufanya kazi. Programu za kompyuta zilinipa njia nyingine ya kuchunguza maswali hayo.","about.p2":"Ninajifunza kwa kutengeneza vitu, kukutana na changamoto na kutafuta sababu zake. Miradi hii ni sehemu ya safari hiyo.",
      "experience.role":"Msanidi programu","experience.card":"Utengenezaji wa programu kwa Flutter, mifumo ya wavuti ya PHP, Supabase na REST APIs. Kushughulikia mahitaji halisi ya programu zinazotumiwa na watu.","experience.training":"Mafunzo kwa vitendo viwandani","experience.tanesco":"Usakinishaji, matengenezo na utatuzi wa hitilafu za mifumo ya umeme na mawasiliano.","experience.education":"Elektroniki na mawasiliano","experience.dit":"Stashahada ya Uhandisi wa Elektroniki na Mawasiliano. Msingi wa shauku yangu katika mifumo na jinsi inavyoshirikiana.","experience.tools":"Zana","experience.toolkit":"Seti ya zana inayoendelea kukua","experience.toolkit.sub":"Lugha, mifumo ya ujenzi na mengineyo.",
      "credential.kicker":"Cheti cha Uhakiki wa Tuzo · NACTVET · Kimetolewa 29 Oktoba 2026","credential.title":"Stashahada ya Kawaida ya Uhandisi wa Elektroniki na Mawasiliano","credential.detail":"Taasisi ya Teknolojia Dar es Salaam · Mwaka wa tuzo 2024","credential.number":"Nambari ya uhakiki wa tuzo:","credential.verify":"Hakiki cheti kupitia NACTVET","credential.download":"Pakua cheti cha AVN",
      "resume.kicker":"Muhtasari mfupi kwenye karatasi.","resume.heading":"Pakua nakala yako.","resume.link":"Toleo la wasifu","resume.download":"Pakua wasifu",
      "contact.heading":"Tufanye<br>kitu chenye maana","contact.intro":"Mradi, nafasi ya kazi au swali zuri.<br>Ningependa kusikia kutoka kwako.","contact.email":"Barua pepe","contact.phone":"Simu","contact.city":"Dar es Salaam, Tanzania<br><span id=\"dar-time\">Saa za Afrika Mashariki · UTC+3</span>",
      "footer.copyright":"© 2026 Raymond Duma","footer.top":"Rudi juu"
    }
  };
  const languageButton = document.getElementById('language-toggle');
  const themeButton = document.getElementById('theme-toggle');
  const elements = [...document.querySelectorAll('[data-i18n]')];
  function applyLanguage(language) {
    const selected = language === 'sw' ? 'sw' : 'en';
    document.documentElement.lang = selected;
    elements.forEach(element => {
      const value = text[selected][element.dataset.i18n];
      if (value !== undefined) element.innerHTML = value;
    });
    languageButton.textContent = selected === 'en' ? 'EN / SW' : 'SW / EN';
    languageButton.setAttribute('aria-label', selected === 'en' ? 'Badili lugha kwenda Kiswahili' : 'Switch language to English');
    themeButton.textContent = document.documentElement.dataset.theme === 'dark' ? (selected === 'sw' ? 'Mandhari mepesi' : 'Light mode') : (selected === 'sw' ? 'Mandhari meusi' : 'Dark mode');
    try { localStorage.setItem('portfolio-language', selected); } catch {}
  }
  function applyTheme(theme) {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selected;
    const swahili = document.documentElement.lang === 'sw';
    themeButton.textContent = selected === 'dark' ? (swahili ? 'Mandhari mepesi' : 'Light mode') : (swahili ? 'Mandhari meusi' : 'Dark mode');
    themeButton.setAttribute('aria-label', selected === 'dark' ? (swahili ? 'Badili kwenda mandhari mepesi' : 'Switch to light mode') : (swahili ? 'Badili kwenda mandhari meusi' : 'Switch to dark mode'));
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
