'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const {parseHTML} = require('linkedom');
const csstree = require('css-tree');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

test('the page is text-led and keeps its main destinations', () => {
  const {document} = parseHTML(html);
  const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.match(document.querySelector('h1').textContent, /Electronics to\s*software/i);
  for (const id of ['work','about','contact','project-swift','project-fahari','project-tour']) assert.ok(document.getElementById(id));
  assert.equal(document.querySelectorAll('.project-panel').length, 3);
  assert.equal(document.querySelectorAll('.project-art,.circuit-scene,#circuit-canvas,.signature,#work-visuals').length, 0);
  assert.equal(document.querySelectorAll('script[src*="circuit.js"]').length, 0);
  assert.equal(document.querySelectorAll('video,iframe').length, 0);
  assert.equal(document.querySelectorAll('a[href="Raymond_Duma_CV.pdf"][download]').length, 3);
  assert.equal(document.querySelector('#contact-email').textContent, 'Raymonddjeff0502@gmail.com');
  assert.equal(document.querySelector('#contact-phone').textContent, '+255 710 964 117');
  assert.equal(document.querySelectorAll('#contact-email a,#contact-phone a,a[href^="mailto:"],a[href^="tel:"]').length, 0);
  const destinations = [
    ['swift','https://smart01-bot.github.io/swift-wakala-preview/','Swift Wakala'],
    ['fahari','https://smart01-bot.github.io/Fahari.io-preview/','Fahari.io'],
    ['tour','https://smart01-bot.github.io/tour-de-dar-preview/','Tour de Dar']
  ];
  for (const [id,url,label] of destinations) {
    assert.equal(document.querySelector('#project-'+id+' .project-primary').getAttribute('href'), url);
    assert.equal(document.querySelector('a[href="#project-'+id+'"] span').textContent, label);
  }
  assert.ok(document.querySelector('a[href="https://cardinformatics.tz/"]'));
  for (const el of document.querySelectorAll('[href],[src]')) {
    const url = el.getAttribute('href') || el.getAttribute('src');
    if (url.startsWith('#')) assert.ok(document.getElementById(url.slice(1)), url);
    else if (!/^https?:/.test(url)) assert.ok(fs.existsSync(path.join(root, url.split('?')[0])), url);
    if (el.getAttribute('target') === '_blank') assert.match(el.getAttribute('rel') || '', /noopener/);
  }
  assert.equal(document.querySelectorAll('script[defer]').length, 1);
});

test('existing font families, warm colors, and responsive CSS are preserved', () => {
  const errors = [];
  const ast = csstree.parse(css, {parseCustomProperty:true,onParseError:error=>errors.push(error.message)});
  csstree.walk(ast,node=>{if(node.type==='Raw')errors.push(node.value);});
  assert.deepEqual(errors,[]);
  for (const family of ['Inter','Open Sans','Poppins']) assert.ok(css.includes(family));
  for (const color of ['--paper:#f7f1e7','--ink:#26211d','--brown:#79543c']) assert.ok(css.includes(color));
  for (const query of ['max-width:760px','max-width:480px','prefers-reduced-motion:reduce','forced-colors:active','@media print',':focus-visible']) assert.ok(css.includes(query),query);
  assert.match(css,/body\{[^}]*font:400 16px\/1\.75 var\(--body\)/);
  for (const match of css.matchAll(/url\('([^']+)'\)/g)) assert.ok(fs.statSync(path.join(root,match[1])).size>1000,match[1]);
  for (const file of ['inter-OFL.txt','opensans-OFL.txt','poppins-OFL.txt']) assert.match(fs.readFileSync(path.join(root,'assets/fonts',file),'utf8'),/SIL OPEN FONT LICENSE/);
});

test('the script keeps the Dar es Salaam clock and accessible section navigation', () => {
  const {document} = parseHTML(html);
  const listeners = {};
  const window = {innerHeight:900,scrollY:0,addEventListener(type,fn){(listeners[type] ||= []).push(fn);}};
  const tops = {work:700,about:3400,contact:4600};
  for (const [id,top] of Object.entries(tops)) document.getElementById(id).getBoundingClientRect=()=>({top:top-window.scrollY});
  document.documentElement.scrollHeight=5400;
  document.hidden=false;
  vm.runInNewContext(js,{document,window,Intl,Date,setInterval:()=>1},{filename:'script.js'});
  assert.match(document.getElementById('dar-time').textContent,/\d{2}:\d{2} in Dar/);
  for (const [scroll,id] of [[800,'work'],[3500,'about'],[4500,'contact']]) {
    window.scrollY=scroll;
    listeners.scroll.forEach(fn=>fn());
    assert.equal(document.querySelector('[data-nav][aria-current]').dataset.nav,id);
  }
});

test('project and experience details use native disclosures and external links are safe', () => {
  const {document} = parseHTML(html);
  assert.equal(document.querySelectorAll('details.project-note').length,3);
  assert.equal(document.querySelectorAll('details.experience-item').length,4);
  for (const link of document.querySelectorAll('a[target="_blank"]')) {
    const rel=(link.getAttribute('rel')||'').split(/\s+/);
    assert.ok(rel.includes('noopener'));
    assert.ok(rel.includes('noreferrer'));
  }
});
