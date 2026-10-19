'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const {parseHTML} = require('linkedom');
const csstree = require('css-tree');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const js=fs.readFileSync(path.join(root,'script.js'),'utf8');
const circuit=fs.readFileSync(path.join(root,'circuit.js'),'utf8');

function environment({desktop=true,reduced=false,clipboardFailure=false,context=null}={}) {
  const {document,Event}=parseHTML(html);
  const state={focus:null,copied:null,selected:null,timers:new Map(),frames:new Map(),listeners:{},media:{},id:0};
  Object.defineProperty(document,'activeElement',{get:()=>state.focus});
  document.querySelectorAll('a,button').forEach(el=>{el.focus=()=>{state.focus=el;};});
  function media(matches){return {matches,listeners:[],addEventListener(type,fn){this.listeners.push(fn);}};}
  state.media.motion=media(reduced);state.media.desktop=media(desktop);state.media.fine=media(true);
  const window={innerHeight:900,scrollY:0,devicePixelRatio:1,isSecureContext:true,performance:{now:()=>100},
    matchMedia:q=>q.includes('reduced-motion')?state.media.motion:q.includes('pointer')?state.media.fine:state.media.desktop,
    requestAnimationFrame:fn=>{const id=++state.id;state.frames.set(id,fn);return id;},
    cancelAnimationFrame:id=>state.frames.delete(id),
    addEventListener:(type,fn)=>(state.listeners[type]||=[]).push(fn),
    getSelection:()=>({removeAllRanges(){},addRange(){}}),
    setTimeout:fn=>{const id=++state.id;state.timers.set(id,fn);return id;},clearTimeout:id=>state.timers.delete(id)};
  document.documentElement.scrollHeight=5400;
  const positions={work:700,about:3400,contact:4600,'project-swift':900,'project-fahari':1700,'project-tour':2500};
  for(const [id,top] of Object.entries(positions)) document.getElementById(id).getBoundingClientRect=()=>({top:top-window.scrollY,bottom:top-window.scrollY+800,width:600,height:800,left:0});
  document.querySelector('.hero').getBoundingClientRect=()=>({top:-window.scrollY,bottom:800-window.scrollY,height:800,width:1200,left:0});
  document.getElementById('circuit-viewport').getBoundingClientRect=()=>({width:500,height:450,top:120,left:650});
  document.getElementById('circuit-canvas').getBoundingClientRect=()=>({width:500,height:450,top:120,left:650});
  document.getElementById('circuit-canvas').getContext=()=>context;
  document.querySelector('.signature').getBoundingClientRect=()=>({width:1200,height:300,top:0,left:0});
  document.createRange=()=>({selectNodeContents:el=>{state.selected=el.textContent;}});
  const navigator={clipboard:{writeText:async value=>{if(clipboardFailure)throw Error('Permission denied');state.copied=value;}}};
  const sandbox={document,window,navigator,Intl,Date,console,setTimeout:window.setTimeout,clearTimeout:window.clearTimeout,setInterval:()=>1};
  const flush=(time=100)=>{const pending=[...state.frames.values()];state.frames.clear();pending.forEach(fn=>fn(time));};
  const fire=(selector,type,props={})=>{const event=new Event(type,{bubbles:true,cancelable:true});Object.assign(event,props);document.querySelector(selector).dispatchEvent(event);return event;};
  const dispatch=(type)=>{(state.listeners[type]||[]).forEach(fn=>fn());flush();};
  const setMedia=(name,matches)=>{state.media[name].matches=matches;state.media[name].listeners.forEach(fn=>fn({matches}));flush();};
  return {document,window,state,sandbox,flush,fire,dispatch,setMedia};
}
function boot(options){const app=environment(options);vm.runInNewContext(js,app.sandbox,{filename:'script.js'});app.flush();return app;}
function visibleVisual(app){return app.document.querySelector('#work-visuals .project-art:not([hidden])');}

test('all content, downloads, and preview links work without JavaScript',()=>{
  const {document}=parseHTML(html);
  const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
  assert.equal(new Set(ids).size,ids.length);assert.equal(document.querySelectorAll('h1').length,1);
  assert.equal(document.querySelectorAll('[data-panel]:not([hidden])').length,3);
  assert.equal(document.querySelector('#work-visuals').hidden,true);
  assert.equal(document.querySelectorAll('a[href="Raymond_Duma_CV.pdf"][download]').length,3);
  assert.equal(document.querySelectorAll('video,iframe,form,a[href^="mailto:"],a[href^="tel:"]').length,0);
  assert.equal(document.querySelector('#contact-email').textContent,'Raymonddjeff0502@gmail.com');
  assert.equal(document.querySelector('#contact-phone').textContent,'+255 710 964 117');
  for(const [id,url] of Object.entries({swift:'swift-wakala-preview/',fahari:'Fahari.io-preview/',tour:'tour-de-dar-preview/'})) {
    assert.equal(document.querySelector('#project-'+id+' .project-primary').getAttribute('href'),'https://smart01-bot.github.io/'+url);
    assert.ok(document.querySelector('a[href="#project-'+id+'"]'));
  }
  for(const el of document.querySelectorAll('[href],[src]')) {
    const url=el.getAttribute('href')||el.getAttribute('src');
    if(url.startsWith('#'))assert.ok(document.getElementById(url.slice(1)),url);
    else if(!/^https?:/.test(url))assert.ok(fs.existsSync(path.join(root,url.split('?')[0])),url);
    if(el.getAttribute('target')==='_blank')assert.ok(el.getAttribute('rel').includes('noopener'));
  }
  for(const image of document.querySelectorAll('img'))assert.ok(image.alt&&image.width&&image.height);
  assert.equal(document.querySelectorAll('script[defer]').length,2);
});

test('the three self-hosted font families and responsive CSS are complete',()=>{
  const errors=[];const ast=csstree.parse(css,{parseCustomProperty:true,onParseError:e=>errors.push(e.message)});
  csstree.walk(ast,node=>{if(node.type==='Raw')errors.push(node.value);});assert.deepEqual(errors,[]);
  for(const query of ['max-width:520px','max-width:359px','prefers-reduced-motion:reduce','@media print',':focus-visible'])assert.ok(css.includes(query),query);
  for(const name of ['Inter','Open Sans','Poppins'])assert.ok(css.includes(name));
  for(const match of css.matchAll(/url\('([^']+)'\)/g))assert.ok(fs.statSync(path.join(root,match[1])).size>1000);
  for(const name of ['inter','opensans','poppins'])assert.ok(fs.readFileSync(path.join(root,'assets/fonts/'+name+'-OFL.txt'),'utf8').includes('SIL OPEN FONT LICENSE'));
});

test('desktop scroll changes the visual and its destination without hiding article content',()=>{
  const app=boot();assert.equal(app.document.documentElement.classList.contains('chapters-ready'),true);
  assert.equal(visibleVisual(app).dataset.visual,'swift');
  app.window.scrollY=1300;app.dispatch('scroll');
  assert.equal(visibleVisual(app).dataset.visual,'fahari');
  assert.match(visibleVisual(app).getAttribute('href'),/Fahari.io-preview/);
  assert.equal(app.document.querySelector('[data-project][aria-current]').dataset.project,'fahari');
  app.window.scrollY=2200;app.dispatch('scroll');assert.equal(visibleVisual(app).dataset.visual,'tour');
  app.window.scrollY=500;app.dispatch('scroll');assert.equal(visibleVisual(app).dataset.visual,'swift');
  assert.equal(app.document.querySelectorAll('[data-panel]:not([hidden])').length,3);
});

test('keyboard focus is not hidden by passive scrolling',()=>{
  const app=boot();app.state.focus=visibleVisual(app);
  app.window.scrollY=2200;app.dispatch('scroll');assert.equal(visibleVisual(app).dataset.visual,'swift');
  app.state.focus=null;app.fire('#work-visuals','focusout');app.flush();assert.equal(visibleVisual(app).dataset.visual,'tour');
});

test('mobile and reduced-motion layouts keep all native chapters available',()=>{
  for(const options of [{desktop:false},{reduced:true}]) {
    const app=boot(options);assert.equal(app.document.querySelector('#work-visuals').hidden,true);
    assert.equal(app.document.documentElement.classList.contains('chapters-ready'),false);
    assert.equal(app.document.querySelectorAll('[data-panel]:not([hidden])').length,3);
  }
  const app=boot();app.state.focus=visibleVisual(app);app.setMedia('desktop',false);
  assert.equal(app.state.focus,app.document.querySelector('#project-swift .project-primary'));
  app.setMedia('desktop',true);assert.equal(app.document.querySelector('#work-visuals').hidden,false);
  app.setMedia('motion',true);assert.equal(app.document.querySelector('#work-visuals').hidden,true);
});

test('project jump links keep their native click and keyboard behavior',()=>{
  const app=boot();for(const link of app.document.querySelectorAll('[data-project]')) {
    assert.equal(link.tagName,'A');assert.ok(link.getAttribute('href').startsWith('#project-'));
    assert.equal(app.fire('[data-project="'+link.dataset.project+'"]','click').defaultPrevented,false);
  }
});

test('copy success is truthful and denied clipboard access falls back to selected text',async()=>{
  const app=boot();app.fire('[data-copy="contact-email"]','click');await new Promise(setImmediate);
  assert.equal(app.state.copied,'Raymonddjeff0502@gmail.com');assert.match(app.document.querySelector('#copy-status').textContent,/Email address copied/);
  app.fire('[data-copy="contact-phone"]','click');await new Promise(setImmediate);
  assert.equal(app.state.copied,'+255 710 964 117');assert.equal(app.state.timers.size,1);
  const denied=boot({clipboardFailure:true});denied.fire('[data-copy="contact-email"]','click');await new Promise(setImmediate);
  assert.equal(denied.state.copied,null);assert.equal(denied.state.selected,'Raymonddjeff0502@gmail.com');
  assert.match(denied.document.querySelector('#copy-status').textContent,/Text selected/);
  assert.equal(denied.document.querySelector('[data-copy]').disabled,false);
});

test('reading progress and section navigation follow the document',()=>{
  const app=boot();assert.equal(app.document.querySelectorAll('[data-nav][aria-current]').length,0);
  for(const [y,id] of [[800,'work'],[3500,'about'],[4500,'contact']]) {app.window.scrollY=y;app.dispatch('scroll');assert.equal(app.document.querySelector('[data-nav][aria-current]').dataset.nav,id);}
  assert.equal(app.document.querySelector('.reading-line').style.transform,'scaleX(1)');
  assert.match(app.document.querySelector('#dar-time').textContent,/\d{2}:\d{2} in Dar/);
});

test('no Canvas support keeps the static sculpture and hides the inactive pulse control',()=>{
  const app=environment();vm.runInNewContext(circuit,app.sandbox);app.flush();
  assert.equal(app.document.querySelector('#circuit-scene').classList.contains('circuit-ready'),false);
  assert.equal(app.document.querySelector('#send-signal').hidden,true);
  assert.ok(app.document.querySelector('.circuit-fallback').getAttribute('src'));
});

function canvasContext(){return new Proxy({}, {get:(target,name)=>{
  if(name==='createRadialGradient')return ()=>({addColorStop(){}});
  if(name in target)return target[name];return ()=>{};
},set:(target,name,value)=>{target[name]=value;return true;}});}

test('the sculpture stops scheduling frames for reduced motion and when off screen',()=>{
  const app=environment({reduced:true,context:canvasContext()});vm.runInNewContext(circuit,app.sandbox);app.flush();
  assert.equal(app.document.querySelector('#send-signal').hidden,false);assert.equal(app.state.frames.size,0);
  app.fire('#send-signal','click');assert.equal(app.document.querySelector('#signal-status').textContent,'Signal connected.');
  app.setMedia('motion',false);assert.equal(app.state.frames.size,1);
  app.fire('#send-signal','click');assert.match(app.document.querySelector('#signal-status').textContent,/Signal sent/);
  app.window.scrollY=1000;app.dispatch('scroll');assert.equal(app.state.frames.size,0);
  app.window.scrollY=0;app.dispatch('scroll');assert.equal(app.state.frames.size,1);
  app.setMedia('motion',true);assert.equal(app.state.frames.size,0);
});
