'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const projects = [
  { id: 'test-mobile', title: 'TEST.MOBILE', frame: 'phone', src: 'https://smart01-bot.github.io/TEST.MOBILE.preview/' },
  { id: 'swift', title: 'Swift Wakala', frame: 'phone', src: 'https://smart01-bot.github.io/swift-wakala-preview/' },
  { id: 'fahari', title: 'Fahari.io', frame: 'pc', src: 'https://smart01-bot.github.io/Fahari.io-preview/' },
  { id: 'tour', title: 'Tour de Dar', frame: 'pc', src: 'https://smart01-bot.github.io/tour-de-dar-preview/' }
];

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]])
  );
}

test('the original portfolio content and destinations are preserved', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML IDs should be unique');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, 'the page should have one primary heading');
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&');
  assert.match(heading, /Electronics,Telecom &\s*software/i);

  for (const id of ['work', 'about', 'contact', 'project-test-mobile', 'project-swift', 'project-fahari', 'project-tour', 'credentials']) {
    assert.match(html, new RegExp('id="' + id + '"'), 'missing section or project: ' + id);
  }
  assert.equal((html.match(/class="project-panel"/g) || []).length, 4);
  assert.match(html, /https:\/\/cardinformatics\.tz\//);
  assert.match(html, /AVN%20Certificate\.pdf/);
  assert.match(html, /CURRICULUM_VITAE%20\%281\%29\.pdf/);
  assert.ok(fs.existsSync(path.join(root, 'AVN Certificate.pdf')));
  assert.ok(fs.existsSync(path.join(root, 'CURRICULUM_VITAE (1).pdf')));
});

test('each of the four projects has the matching responsive live preview', () => {
  const stages = [...html.matchAll(/<div class="preview-stage" data-live-preview data-frame="(phone|pc)"[^>]*>/g)];
  const frames = stages.map((match) => match[1]);
  assert.deepEqual(frames, projects.map((project) => project.frame));

  const iframeTags = [...html.matchAll(/<iframe\b[^>]*><\/iframe>/g)].map((match) => attributes(match[0]));
  assert.equal(iframeTags.length, projects.length);
  iframeTags.forEach((iframe, index) => {
    const project = projects[index];
    assert.equal(iframe['data-preview-src'], project.src);
    assert.equal(iframe.title, project.title + ' interactive preview');
    assert.equal(iframe.loading, 'lazy');
    assert.equal(iframe.referrerpolicy, 'no-referrer');
    assert.equal(iframe.src, undefined, 'iframe sources should be assigned only near the viewport');
    assert.match(html, new RegExp('id="project-' + project.id + '"'));
  });

  for (const project of projects) assert.ok(html.includes(project.src));
});

test('local assets and external links remain valid and safe', () => {
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (value.startsWith('#') || /^(?:https?:|mailto:|tel:|data:)/i.test(value)) continue;
    const localPath = decodeURIComponent(value.split('?')[0]);
    assert.ok(fs.existsSync(path.join(root, localPath)), 'missing local asset: ' + value);
  }

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    const attrs = attributes(match[0]);
    assert.match(attrs.rel || '', /noopener/);
    assert.match(attrs.rel || '', /noreferrer/);
  }
});

test('portfolio styles preserve the established visual system and support device frames', () => {
  let depth = 0;
  for (const character of css) {
    if (character === '{') depth += 1;
    if (character === '}') depth -= 1;
    assert.ok(depth >= 0, 'CSS closing brace without a matching opening brace');
  }
  assert.equal(depth, 0, 'CSS braces should be balanced');

  for (const family of ['Inter', 'Open Sans', 'Poppins']) assert.ok(css.includes(family));
  for (const color of ['--paper:#f7f1e7', '--ink:#26211d', '--brown:#79543c']) assert.ok(css.includes(color));
  for (const rule of [
    '.preview-stage', '.device-phone', '.device-pc', '.device-screen iframe',
    'max-width:760px', 'max-width:480px', 'prefers-reduced-motion:reduce',
    'forced-colors:active', '@media print', ':focus-visible'
  ]) assert.ok(css.includes(rule), 'missing CSS rule: ' + rule);
});

test('preview behavior is responsive, lazy-loaded, and JavaScript remains syntactically valid', () => {
  assert.doesNotThrow(() => new vm.Script(js, { filename: 'script.js' }));
  assert.match(js, /const sizes = \{[\s\S]*phone: \{ width: 390, height: 844 \}/);
  assert.match(js, /pc: \{ width: 1280, height: 800 \}/);
  assert.match(js, /new ResizeObserver\(fit\)/);
  assert.match(js, /new IntersectionObserver/);
  assert.match(js, /rootMargin: '400px 0px'/);
  assert.match(js, /iframe\.setAttribute\('src', source\)/);
  assert.match(js, /portfolio-language/);
  assert.match(js, /portfolio-theme/);
  assert.match(js, /Africa\/Dar_es_Salaam/);
  assert.match(js, /aria-current/);
});
