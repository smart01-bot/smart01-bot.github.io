'use strict';

/* Original orthographic artwork. Canvas 2D projects the geometry, so the
   sculpture needs neither a WebGL context nor a runtime 3D dependency. */
(() => {
  const TAU = Math.PI * 2;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const traces = [
    [[-124,-72],[-88,-72],[-64,-48],[-42,-48]],
    [[-124,-36],[-96,-36],[-74,-14],[-42,-14]],
    [[-124,32],[-84,32],[-65,14],[-42,14]],
    [[-124,75],[-92,75],[-65,48],[-42,48]],
    [[-69,-116],[-69,-87],[-28,-87],[-15,-72],[-15,-42]],
    [[20,-116],[20,-88],[42,-66],[42,-42]],
    [[87,-116],[87,-72],[61,-46],[42,-46]],
    [[124,-63],[104,-63],[84,-42],[42,-42]],
    [[124,0],[82,0],[62,20],[42,20]],
    [[124,65],[104,65],[83,44],[42,44]],
    [[60,116],[60,86],[26,52],[26,42]],
    [[8,116],[8,77],[-17,52],[-17,42]],
    [[-72,116],[-72,86],[-45,59],[-45,42]]
  ];

  function renderCircuit(ctx, width, height, state = {}) {
    const yaw = state.yaw ?? -.54;
    const pitch = state.pitch ?? .58;
    const spread = clamp(state.spread ?? .5, 0, 1.5);
    const time = state.time ?? 0;
    const pulse = state.pulse ?? -1;
    const scale = Math.min(width / 480, height / 440);
    const centerX = width * .5;
    const centerY = height * .58;
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const project = ([x,y,z]) => {
      const u = x * cy - z * sy;
      const d = x * sy + z * cy;
      return [centerX + u * scale, centerY + (d * sp - y * cp) * scale, d * cp + y * sp];
    };
    function path(points, fill, stroke, lineWidth = 1, close = true) {
      const screen = points.map(project);
      ctx.beginPath();
      screen.forEach((p,i) => i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]));
      if (close) ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth * scale; ctx.stroke(); }
    }
    function line(points, color, thickness = 1) { path(points, null, color, thickness, false); }
    function ring(x,y,z,r,fill,stroke,thickness = .7) {
      const pts = Array.from({length:32}, (_,i) => [x+Math.cos(i/32*TAU)*r,y,z+Math.sin(i/32*TAU)*r]);
      path(pts,fill,stroke,thickness);
    }
    function box(x,y,z,w,d,h,colors,bevel = 0) {
      const b = Math.min(bevel,w/4,d/4);
      const outline = b ? [[-w/2+b,-d/2],[w/2-b,-d/2],[w/2,-d/2+b],[w/2,d/2-b],[w/2-b,d/2],[-w/2+b,d/2],[-w/2,d/2-b],[-w/2,-d/2+b]] : [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]];
      const top = outline.map(([a,c]) => [x+a,y,z+c]);
      const bottom = outline.map(([a,c]) => [x+a,y-h,z+c]);
      const sides = top.map((a,i) => {
        const j=(i+1)%top.length;
        const points=[a,top[j],bottom[j],bottom[i]];
        return {points, depth:points.reduce((sum,p)=>sum+project(p)[2],0)/4, color:i%2 ? colors[1] : colors[2]};
      }).sort((a,b)=>a.depth-b.depth);
      sides.forEach(face=>path(face.points,face.color,null));
      path(top,colors[0],colors[3] || colors[1],.7);
      return top;
    }
    function pin(x,y,z,w,d) { box(x,y,z,w,d,3,['#cfaa78','#8e7051','#b48e64']); }

    ctx.clearRect(0,0,width,height);
    ctx.lineJoin='round';ctx.lineCap='round';
    // The ground grid and a soft contact shadow give the object a place to sit.
    for(let a=-200;a<=200;a+=40) {
      line([[a,-88,-190],[a,-88,190]],'#dfdcd1',.45);
      line([[-190,-88,a],[190,-88,a]],'#dfdcd1',.45);
    }
    const shadow = project([0,-82,10]);
    ctx.save();ctx.translate(shadow[0],shadow[1]);ctx.scale(1,.38);
    const shade=ctx.createRadialGradient(0,0,10*scale,0,0,190*scale);
    shade.addColorStop(0,'rgba(48,44,35,.20)');shade.addColorStop(.65,'rgba(48,44,35,.07)');shade.addColorStop(1,'rgba(48,44,35,0)');
    ctx.fillStyle=shade;ctx.beginPath();ctx.arc(0,0,190*scale,0,TAU);ctx.fill();ctx.restore();
    const bottomY=-50;
    const boardY=3+spread*35;
    const chipY=66+spread*46;
    const lift=state.breathe ? Math.sin(time*.0007)*2 : 0;

    // Graphite base, fine copper rails and mounting points.
    box(0,bottomY,0,302,286,12,['#393936','#222321','#51514c','#69685f'],8);
    for(const z of [-124,124]) {
      for(let x=-106;x<=106;x+=14) pin(x,bottomY+.8,z,7,5);
    }
    for(const x of [-137,137]) for(let z=-92;z<=92;z+=20) pin(x,bottomY+.8,z,5,8);
    path([[-125,bottomY+1,-105],[125,bottomY+1,-105],[125,bottomY+1,105],[-125,bottomY+1,105]],null,'#727064',.7);
    for(const [x,z] of [[-132,-124],[132,-124],[-132,124],[132,124]]) {
      ring(x,bottomY+1,z,5,'#cab995','#9b8b6d');ring(x,bottomY+1.2,z,2.2,'#292923',null);
      line([[x,bottomY+2,z],[x,boardY-2,z]],'#c9b590',1.1);
    }
    // Dashed construction guides link the separated layers.
    ctx.save();ctx.setLineDash([2*scale,4*scale]);
    for(const [x,z] of [[-132,-124],[132,-124],[-132,124],[132,124]]) line([[x,boardY,z],[x,chipY+18,z]],'#bfb9aa',.6);
    ctx.restore();

    // Ceramic signal board.
    box(0,boardY+lift,0,278,264,7,['#eee8d9','#c3bcaa','#ded6c5','#b7b09e'],7);
    for(const [x,z] of [[-127,-119],[127,-119],[-127,119],[127,119]]) {
      ring(x,boardY+lift+.5,z,4.2,'#c5bca7','#a69d88');ring(x,boardY+lift+.7,z,1.8,'#777565',null);
    }
    const surface = boardY+lift+1;
    traces.forEach((trace,i) => {
      const points = trace.map(([x,z])=>[x,surface,z]);
      line(points,'#c3ae8c',1.1);
      if(i%3===0) line(points,'#a66b43',1.25);
      const [sx,sz]=trace[0];ring(sx,surface+.1,sz,2.5,'#ae8656',null);
      ring(sx,surface+.15,sz,.9,'#eee8d9',null);
      if(pulse>=0 && pulse<1) {
        const local=clamp(pulse*1.5-i*.024,0,1);
        if(local>0 && local<1) {
          const distances=points.slice(1).map((p,j)=>Math.hypot(p[0]-points[j][0],p[2]-points[j][2]));
          let remaining=distances.reduce((a,b)=>a+b,0)*local;
          let position=points[points.length-1];
          for(let j=0;j<distances.length;j++) {
            if(remaining<=distances[j]) {const t=remaining/distances[j];position=points[j].map((v,k)=>v+(points[j+1][k]-v)*t);break;}
            remaining-=distances[j];
          }
          const p=project(position);ctx.save();ctx.shadowColor='#c77a40';ctx.shadowBlur=10*scale;
          ctx.fillStyle='#dc914f';ctx.beginPath();ctx.arc(p[0],p[1],2.7*scale,0,TAU);ctx.fill();ctx.restore();
        }
      }
    });
    // Small components retain enough asymmetry to feel designed, not tiled.
    const parts=[[-98,-93,19,13,9],[-106,87,13,24,11],[91,83,24,14,8],[96,-23,14,25,9],[-94,4,11,19,8],[53,-100,20,11,7]];
    parts.sort((a,b)=>project([a[0],0,a[1]])[2]-project([b[0],0,b[1]])[2]).forEach(([x,z,w,d,h])=>{
      pin(x-w/2-3,surface+1,z,5,d*.7);pin(x+w/2+3,surface+1,z,5,d*.7);
      box(x,surface+h,z,w,d,h,['#605e56','#3d3d37','#79776c','#737165'],1.5);
      line([[x-w/2+4,surface+h+.2,z],[x+w/2-4,surface+h+.2,z]],'#aba696',.7);
    });
    // A suspended processor connects back to the board through copper pins.
    for(let i=-30;i<=30;i+=12) {
      for(const side of [-1,1]) {
        line([[side*49,surface+2,i],[side*49,chipY-20,i],[side*43,chipY-20,i]],'#a78a62',1.7);
        line([[i,surface+2,side*49],[i,chipY-20,side*49],[i,chipY-20,side*43]],'#a78a62',1.7);
      }
    }
    box(0,chipY,0,91,91,22,['#373834','#252622','#55564d','#69695e'],4);
    path([[-31,chipY+.3,-31],[31,chipY+.3,-31],[31,chipY+.3,31],[-31,chipY+.3,31]],null,'#96917f',.65);
    for(let i=0;i<3;i++) line([[-18,chipY+.5,-12+i*12],[18-i*8,chipY+.5,-12+i*12]],'#d2cbb6',2.1);
    ring(29,chipY+.7,29,3,pulse>.38&&pulse<.9?'#f2b56b':'#b87c4e',null);
    // As the hero leaves, extra planes open into the language of interfaces.
    if(spread>.7) {
      ctx.save();ctx.globalAlpha=clamp((spread-.7)*1.6,0,.85);
      const y=chipY+30+(spread-.7)*26;
      for(const side of [-1,1]) {
        const x=side*(67+(spread-.7)*34), z=side*24;
        box(x,y,z,76,54,2,['#faf7ed','#c8c3b7','#ded8ca'],2);
        for(let i=0;i<3;i++) line([[x-25,y+.5,z-13+i*11],[x+21-i*7,y+.5,z-13+i*11]],i===0?'#ad6f47':'#c2c0b3',i===0?2:1);
      }
      ctx.restore();
    }
    return {scale,boardY,chipY};
  }

  // Export only for deterministic artwork generation and renderer smoke checks.
  if(typeof module !== 'undefined' && module.exports) module.exports={renderCircuit};
  if(typeof document === 'undefined') return;
  const canvas=document.getElementById('circuit-canvas');
  const viewport=document.getElementById('circuit-viewport');
  const scene=document.getElementById('circuit-scene');
  const button=document.getElementById('send-signal');
  if(!canvas || !viewport || !button) return;
  let ctx;
  try {ctx=canvas.getContext('2d',{alpha:true});} catch {return;}
  if(!ctx) return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(pointer: fine)');
  const hero=document.querySelector('.hero');
  const xLabel=document.getElementById('scene-x');
  const yLabel=document.getElementById('scene-y');
  const status=document.getElementById('signal-status');
  let width=0,height=0,visible=true,frame=0,lastFrame=-Infinity,pulseStarted=-Infinity;
  let pointerX=0,pointerY=0,yaw=-.54,pitch=.58,spread=.5,scrollAmount=0;
  let buttonTimer;
  const now=()=>window.performance.now();
  function draw(time) {
    frame=0;
    if(!visible || document.hidden) return;
    if(!motion.matches && time-lastFrame<32) {frame=window.requestAnimationFrame(draw);return;}
    lastFrame=time;
    const reduced=motion.matches;
    const targetYaw=-.54+(reduced?0:pointerX*.24);
    const targetPitch=.58+(reduced?0:pointerY*.10);
    yaw+=(targetYaw-yaw)*.09;pitch+=(targetPitch-pitch)*.09;
    spread+=((reduced?.5:.5+scrollAmount*.9)-spread)*.075;
    renderCircuit(ctx,width,height,{yaw:reduced?-.54:yaw,pitch:reduced?.58:pitch,spread:reduced?.5:spread,time,breathe:!reduced,pulse:reduced?-1:(time-pulseStarted)/1600});
    scene.classList.add('circuit-ready');button.hidden=false;
    if(!reduced) frame=window.requestAnimationFrame(draw);
  }
  function requestDraw() {if(!frame && visible && !document.hidden) frame=window.requestAnimationFrame(draw);}
  function stop() {if(frame) window.cancelAnimationFrame(frame);frame=0;}
  function resize() {
    const box=viewport.getBoundingClientRect();
    if(box.width<=0 || box.height<=0) return;
    width=box.width;height=box.height;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);requestDraw();
  }
  function measureScroll() {
    const box=hero.getBoundingClientRect();
    scrollAmount=clamp(-box.top/Math.max(1,box.height*.7),0,1);
    if(!('IntersectionObserver' in window)) {
      visible=box.bottom>0 && box.top<window.innerHeight;
      if(!visible) stop();else requestDraw();
    }
  }
  function sendSignal() {
    if(motion.matches) {status.textContent='Signal connected.';return;}
    pulseStarted=now();button.classList.add('is-sending');
    status.textContent='Signal sent through the circuit.';
    window.clearTimeout(buttonTimer);
    buttonTimer=window.setTimeout(()=>button.classList.remove('is-sending'),1700);
    requestDraw();
  }
  button.addEventListener('click',sendSignal);
  canvas.addEventListener('pointermove',event=>{
    if(motion.matches || !fine.matches || event.pointerType==='touch') return;
    const box=canvas.getBoundingClientRect();
    pointerX=clamp((event.clientX-box.left)/box.width*2-1,-1,1);
    pointerY=clamp((event.clientY-box.top)/box.height*2-1,-1,1);
    xLabel.textContent=String(Math.round(Math.abs(pointerX)*180)).padStart(3,'0');
    yLabel.textContent=String(Math.round(Math.abs(pointerY)*180)).padStart(3,'0');
  },{passive:true});
  canvas.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;xLabel.textContent='000';yLabel.textContent='000';},{passive:true});
  // A click activates a pulse; vertical touch scrolling remains entirely native.
  canvas.addEventListener('click',sendSignal);
  window.addEventListener('scroll',measureScroll,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else requestDraw();});
  if('ResizeObserver' in window) new window.ResizeObserver(resize).observe(viewport);
  if('IntersectionObserver' in window) new window.IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;if(visible)requestDraw();else stop();
  },{rootMargin:'80px'}).observe(scene);
  if(motion.addEventListener) motion.addEventListener('change',()=>{stop();button.classList.remove('is-sending');requestDraw();});
  resize();measureScroll();
})();
