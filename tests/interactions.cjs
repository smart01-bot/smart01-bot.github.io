'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { parseHTML } = require('linkedom');
const csstree = require('css-tree');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

// DOM-level regression checks, not a substitute for layout / real-device testing.
function boot({ reducedMotion = false, clipboardFailure = false, secure = true } = {}) {
  const { document, Event } = parseHTML(html);
  const state = { focused: null, copied: null, selected: null, timers: new Map(), listeners: {}, motion: { matches: reducedMotion } };
  let timerId = 0;
  const window = {
    innerHeight: 800, scrollY: 0, isSecureContext: secure,
    matchMedia: () => state.motion,
    requestAnimationFrame: callback => callback(),
    addEventListener: (type, callback) => { state.listeners[type] = callback; },
    getSelection: () => ({ removeAllRanges() {}, addRange() {} }),
  };
  document.documentElement.scrollHeight = 3000;
  ['work', 'about', 'contact'].forEach((id, i) => {
    document.getElementById(id).getBoundingClientRect = () => ({ top: [500, 1500, 2400][i] - window.scrollY });
  });
  document.querySelectorAll('[data-project]').forEach(tab => { tab.focus = () => { state.focused = tab.id; }; });
  document.createRange = () => ({ selectNodeContents: element => { state.selected = element.textContent; } });
  const navigator = { clipboard: { writeText: async value => {
    if (clipboardFailure) throw new Error('Permission denied');
    state.copied = value;
  } } };
  vm.runInNewContext(js, {
    document, window, navigator, Intl, Date, console,
    setTimeout: callback => { state.timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => state.timers.delete(id),
    setInterval: () => 1,
  }, { filename: 'script.js' });
  const fire = (selector, type, props = {}) => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, props);
    document.querySelector(selector).dispatchEvent(event);
    return event;
  };
  const selected = () => document.querySelector('[role="tab"][aria-selected="true"]').dataset.project;
  return { document, window, state, fire, selected };
}

test('the page works without JavaScript and keeps all three previews and the PDF', () => {
  const { document } = parseHTML(html);
  const ids = Array.from(document.querySelectorAll('[id]'), e => e.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(document.querySelectorAll('[data-panel]:not([hidden])').length, 3);
  assert.equal(document.querySelector('.project-tabs').hidden, true);
  for (const slug of ['swift-wakala-preview/', 'Fahari.io-preview/', 'tour-de-dar-preview/']) {
    assert.ok(document.querySelector('a[href="https://smart01-bot.github.io/' + slug + '"]'), slug);
  }
  assert.equal(document.querySelectorAll('a[href="Raymond_Duma_CV.pdf"][download]').length, 3);
  assert.ok(fs.statSync(path.join(root, 'Raymond_Duma_CV.pdf')).size > 1000);
  assert.equal(document.querySelectorAll('video, iframe, form, a[href^="mailto:"], a[href^="tel:"]').length, 0);
  assert.equal(document.querySelector('#contact-email').textContent, 'Raymonddjeff0502@gmail.com');
  assert.equal(document.querySelector('#contact-phone').textContent, '+255 710 964 117');
  for (const element of document.querySelectorAll('[href], [src]')) {
    const url = element.getAttribute('href') || element.getAttribute('src');
    if (url.startsWith('#')) assert.ok(document.getElementById(url.slice(1)), url);
    else if (!/^(https?:|data:)/.test(url)) assert.ok(fs.existsSync(path.join(root, url.split('?')[0])), url);
    if (element.getAttribute('target') === '_blank') assert.ok(element.getAttribute('rel').includes('noopener'));
  }
  for (const image of document.querySelectorAll('img')) assert.ok(image.alt && image.width && image.height);
  assert.equal(document.querySelectorAll('script').length, 1);
  assert.ok(document.querySelector('script[src^="script.js"][defer]'));
  assert.ok(fs.statSync(path.join(root, 'assets/social.png')).size > 1000);
});

test('CSS parses and contains mobile, reduced-motion, focus, and print fallbacks', () => {
  const errors = [];
  const ast = csstree.parse(css, { parseCustomProperty: true, onParseError: error => errors.push(error.message) });
  csstree.walk(ast, node => { if (node.type === 'Raw') errors.push('Unparsed CSS: ' + node.value); });
  assert.deepEqual(errors, []);
  for (const query of ['max-width:520px', 'max-width:359px', 'prefers-reduced-motion:reduce']) assert.ok(css.includes(query));
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media print/);
});

test('project controls start with one selected, accessible panel', () => {
  const app = boot();
  assert.equal(app.selected(), 'swift');
  assert.equal(app.document.querySelectorAll('[role="tabpanel"]:not([hidden])').length, 1);
  assert.equal(app.document.querySelector('.project-tabs').hidden, false);
  for (const tab of app.document.querySelectorAll('[role="tab"]')) {
    const panel = app.document.getElementById(tab.getAttribute('aria-controls'));
    assert.equal(panel.getAttribute('aria-labelledby'), tab.id);
    // LinkeDOM's tabIndex getter treats zero as falsy; inspect the reflected DOM attribute.
    assert.equal(tab.getAttribute('tabindex'), tab.getAttribute('aria-selected') === 'true' ? '0' : '-1');
  }
  assert.equal(app.document.getElementById('project-announcement').textContent, '');
});

test('switching projects exposes the correct content and announces it', () => {
  const app = boot();
  app.fire('#tab-fahari', 'click');
  assert.equal(app.selected(), 'fahari');
  assert.equal(app.document.querySelector('[data-panel="fahari"]').hidden, false);
  assert.equal(app.document.querySelector('#current-project').textContent, '02');
  assert.match(app.document.querySelector('#project-announcement').textContent, /Fahari.io, project 2 of 3/);
  app.fire('#tab-tour', 'click');
  assert.equal(app.selected(), 'tour');
  assert.equal(app.document.querySelectorAll('[role="tabpanel"]:not([hidden])').length, 1);
});

test('keyboard navigation wraps, moves focus, and supports Home and End', () => {
  const app = boot();
  const event = app.fire('#tab-swift', 'keydown', { key: 'ArrowLeft' });
  assert.equal(event.defaultPrevented, true);
  assert.equal(app.selected(), 'tour');
  assert.equal(app.state.focused, 'tab-tour');
  app.fire('#tab-tour', 'keydown', { key: 'ArrowRight' });
  assert.equal(app.selected(), 'swift');
  app.fire('#tab-swift', 'keydown', { key: 'End' });
  assert.equal(app.selected(), 'tour');
  app.fire('#tab-tour', 'keydown', { key: 'Home' });
  assert.equal(app.selected(), 'swift');
  assert.equal(app.fire('#tab-swift', 'keydown', { key: 'Tab' }).defaultPrevented, false);
});

test('previous / next navigation wraps and never leaves two panels visible', () => {
  const app = boot();
  app.fire('#previous-project', 'click');
  assert.equal(app.selected(), 'tour');
  app.fire('#next-project', 'click');
  assert.equal(app.selected(), 'swift');
  for (let i = 0; i < 10; i++) app.fire('#next-project', 'click');
  assert.equal(app.selected(), 'fahari');
  assert.equal(app.document.querySelectorAll('[role="tabpanel"]:not([hidden])').length, 1);
});

test('reduced motion is respected, including a preference change during the visit', () => {
  const app = boot({ reducedMotion: true });
  app.fire('#tab-fahari', 'click');
  assert.equal(app.document.querySelectorAll('.is-entering').length, 0);
  app.state.motion.matches = false;
  app.fire('#tab-tour', 'click');
  assert.equal(app.document.querySelector('[data-panel="tour"]').classList.contains('is-entering'), true);
  app.fire('[data-panel="tour"]', 'animationend');
  assert.equal(app.document.querySelectorAll('.is-entering').length, 0);
});

test('a horizontal swipe switches the project and does not launch the preview', () => {
  const app = boot();
  const origin = { pointerType: 'touch', isPrimary: true, pointerId: 1, clientX: 250, clientY: 150 };
  app.fire('.art-swift', 'pointerdown', origin);
  app.fire('.art-swift', 'pointerup', { ...origin, clientX: 120, clientY: 160 });
  assert.equal(app.selected(), 'fahari');
  assert.equal(app.fire('.art-fahari', 'click').defaultPrevented, true);
});

test('vertical gestures and cancelled gestures do not switch projects', () => {
  const app = boot();
  const origin = { pointerType: 'touch', isPrimary: true, pointerId: 1, clientX: 250, clientY: 150 };
  app.fire('.art-swift', 'pointerdown', origin);
  app.fire('.art-swift', 'pointerup', { ...origin, clientX: 170, clientY: 350 });
  assert.equal(app.selected(), 'swift');
  app.fire('.art-swift', 'pointerdown', origin);
  app.fire('.art-swift', 'pointercancel', origin);
  app.fire('.art-swift', 'pointerup', { ...origin, clientX: 120 });
  assert.equal(app.selected(), 'swift');
  assert.equal(app.fire('.art-swift', 'click').defaultPrevented, false);
});

test('copy buttons report success only after the clipboard accepts the text', async () => {
  const app = boot();
  app.fire('[data-copy="contact-email"]', 'click');
  await new Promise(setImmediate);
  assert.equal(app.state.copied, 'Raymonddjeff0502@gmail.com');
  assert.equal(app.document.querySelector('#copy-status').textContent, 'Email address copied.');
  assert.equal(app.document.querySelector('[data-copy="contact-email"]').disabled, false);
  app.fire('[data-copy="contact-phone"]', 'click');
  await new Promise(setImmediate);
  assert.equal(app.state.copied, '+255 710 964 117');
  assert.equal(app.state.timers.size, 1, 'Replace, rather than stack, toast dismissal timers');
});

test('denied clipboard access selects plain text and reports the fallback', async () => {
  const app = boot({ clipboardFailure: true });
  app.fire('[data-copy="contact-email"]', 'click');
  await new Promise(setImmediate);
  assert.equal(app.state.copied, null);
  assert.equal(app.state.selected, 'Raymonddjeff0502@gmail.com');
  assert.match(app.document.querySelector('#copy-status').textContent, /Text selected/);
  assert.equal(app.document.querySelector('[data-copy="contact-email"]').disabled, false);
});

test('the active navigation and reading progress track the visible section', () => {
  const app = boot();
  assert.equal(app.document.querySelectorAll('nav [aria-current]').length, 0);
  app.window.scrollY = 500;
  app.state.listeners.scroll();
  assert.equal(app.document.querySelector('nav [aria-current]').dataset.nav, 'work');
  app.window.scrollY = 1600;
  app.state.listeners.scroll();
  assert.equal(app.document.querySelector('nav [aria-current]').dataset.nav, 'about');
  app.window.scrollY = 2200;
  app.state.listeners.scroll();
  assert.equal(app.document.querySelector('nav [aria-current]').dataset.nav, 'contact');
  assert.equal(app.document.querySelector('.reading-line').style.transform, 'scaleX(1)');
  assert.match(app.document.getElementById('dar-time').textContent, /\d{2}:\d{2} in Dar/);
});
