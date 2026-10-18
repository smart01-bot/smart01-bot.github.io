"use strict";
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const root = document.documentElement;
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = motionQuery.matches;
let savedMotion = null;
try {
  savedMotion = localStorage.getItem("rd-motion");
  const theme = localStorage.getItem("rd-theme");
  if (theme === "light") root.dataset.theme = theme;
} catch {}
if (savedMotion !== null) reduced = savedMotion === "off";
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3200);
}
function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}
function updateMotion() {
  root.classList.toggle("motion-off", reduced);
  $("#motion-button").textContent = `Motion: ${reduced ? "off" : "on"} ◉`;
  $("#motion-button").setAttribute("aria-pressed", String(reduced));
}
updateMotion();
$("#motion-button").addEventListener("click", () => {
  reduced = !reduced;
  savedMotion = reduced ? "off" : "on";
  save("rd-motion", savedMotion);
  updateMotion();
});
motionQuery.addEventListener("change", (e) => {
  if (savedMotion === null) {
    reduced = e.matches;
    updateMotion();
  }
});
function updateTheme() {
  const light = root.dataset.theme === "light";
  $("#theme-button").textContent = `Switch to ${light ? "dark" : "light"} ◐`;
  $("#theme-button").setAttribute("aria-pressed", String(light));
}
function toggleTheme() {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  save("rd-theme", root.dataset.theme);
  updateTheme();
}
$("#theme-button").addEventListener("click", toggleTheme);
updateTheme();
function clock() {
  $("#local-time").textContent =
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Dar_es_Salaam",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()) + " EAT";
}
clock();
setInterval(clock, 60000);
$("#year").textContent = new Date().getFullYear();
let scrollQueued = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $(".reading-progress").style.width =
    `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  scrollQueued = false;
}
addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
updateScroll();
const navObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries)
      if (entry.isIntersecting)
        $$(".header nav a").forEach((a) =>
          a.classList.toggle("active", a.hash === "#" + entry.target.id),
        );
  },
  { rootMargin: "-20% 0px -55% 0px" },
);
$$("main section[id]").forEach((s) => navObserver.observe(s));
// A small, dependency-free 3D renderer. Geometry is projected, depth-sorted, and drawn on canvas.
const signal = $("#signal"),
  sctx = signal.getContext("2d"),
  wave = $("#wave"),
  wctx = wave.getContext("2d");
let sw = 0,
  sh = 0,
  ww = 0,
  wh = 0,
  rotationX = -0.25,
  rotationY = 0.4,
  pulse = 0,
  shape = 0;
let drag = null,
  signalVisible = true,
  waveVisible = false,
  waveType = "sine",
  frequency = 3,
  amplitude = 0.5;
const shapeNames = ["Sphere", "Torus", "Wave"];
function sizeCanvas(canvas) {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  return [r.width, r.height];
}
function resize() {
  [sw, sh] = sizeCanvas(signal);
  [ww, wh] = sizeCanvas(wave);
}
new ResizeObserver(resize).observe(signal);
new ResizeObserver(resize).observe(wave);
resize();
const canvasObserver = new IntersectionObserver((entries) =>
  entries.forEach((e) => {
    if (e.target === signal) signalVisible = e.isIntersecting;
    else waveVisible = e.isIntersecting;
  }),
);
canvasObserver.observe(signal);
canvasObserver.observe(wave);
signal.addEventListener("pointerdown", (e) => {
  drag = { x: e.clientX, y: e.clientY };
  signal.setPointerCapture(e.pointerId);
});
signal.addEventListener("pointermove", (e) => {
  if (!drag) return;
  rotationY += (e.clientX - drag.x) * 0.008;
  rotationX += (e.clientY - drag.y) * 0.008;
  drag = { x: e.clientX, y: e.clientY };
});
["pointerup", "pointercancel", "lostpointercapture"].forEach((name) =>
  signal.addEventListener(name, () => {
    drag = null;
  }),
);
signal.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
    rotationY +=
      e.key === "ArrowLeft" ? -0.15 : e.key === "ArrowRight" ? 0.15 : 0;
    rotationX += e.key === "ArrowUp" ? -0.15 : e.key === "ArrowDown" ? 0.15 : 0;
  }
});
function burst() {
  pulse = 1;
  if (reduced)
    toast("Signal sent. Animation is paused in reduced motion mode.");
}
$("#burst-button").addEventListener("click", burst);
$("#shape-button").addEventListener("click", () => {
  shape = (shape + 1) % 3;
  $("#shape-name").textContent = shapeNames[shape];
});
function point(a, b, t) {
  const u = (a / 28) * Math.PI * 2,
    v = (b / 16) * Math.PI;
  if (shape === 1) {
    const ring = 1 + 0.36 * Math.cos(v * 2);
    return [
      Math.cos(u) * ring * 0.72,
      Math.sin(v * 2) * 0.36 * 0.72,
      Math.sin(u) * ring * 0.72,
    ];
  }
  if (shape === 2)
    return [
      (a / 28 - 0.5) * 2,
      (Math.sin(a / 3 + t) + Math.cos(b / 2 + t)) * 0.22,
      (b / 16 - 0.5) * 2,
    ];
  return [Math.sin(v) * Math.cos(u), Math.cos(v), Math.sin(v) * Math.sin(u)];
}
function drawSignal(t) {
  if (!sctx || !sw) return;
  sctx.clearRect(0, 0, sw, sh);
  const light = root.dataset.theme === "light",
    color = light ? "168,68,31" : "242,153,99";
  const size = Math.min(sw * 0.36, sh * 0.39);
  const nodes = [];
  const grid = [];
  const cx = Math.cos(rotationX),
    sx = Math.sin(rotationX),
    cy = Math.cos(rotationY),
    sy = Math.sin(rotationY);
  for (let a = 0; a < 28; a++) {
    grid[a] = [];
    for (let b = 0; b <= 16; b++) {
      let [x, y, z] = point(a, b, t);
      const y1 = y * cx - z * sx,
        z1 = y * sx + z * cx,
        x1 = x * cy + z1 * sy,
        z2 = -x * sy + z1 * cy;
      const expansion = 1 + (reduced ? 0 : pulse * 0.2);
      const scale = 3.8 / (3.8 + z2);
      const p = {
        x: sw / 2 + x1 * size * scale * expansion,
        y: sh / 2 + y1 * size * scale * expansion,
        z: z2,
      };
      grid[a][b] = p;
      nodes.push(p);
    }
  }
  sctx.lineWidth = 0.55;
  for (let a = 0; a < 28; a++)
    for (let b = 0; b < 16; b++) {
      const p = grid[a][b];
      sctx.strokeStyle = `rgba(${color},${0.09 + (1 - p.z) * 0.09})`;
      sctx.beginPath();
      sctx.moveTo(p.x, p.y);
      sctx.lineTo(grid[(a + 1) % 28][b].x, grid[(a + 1) % 28][b].y);
      sctx.lineTo(grid[(a + 1) % 28][b + 1].x, grid[(a + 1) % 28][b + 1].y);
      sctx.stroke();
    }
  nodes
    .sort((a, b) => b.z - a.z)
    .forEach((p) => {
      sctx.fillStyle = `rgba(${color},${0.28 + (1 - p.z) * 0.32})`;
      sctx.beginPath();
      sctx.arc(p.x, p.y, Math.max(0.6, 1.6 - p.z * 0.65), 0, Math.PI * 2);
      sctx.fill();
    });
  sctx.strokeStyle = `rgba(${color},.14)`;
  sctx.lineWidth = 1;
  sctx.beginPath();
  sctx.ellipse(sw / 2, sh / 2, size * 1.28, size * 0.31, -0.35, 0, Math.PI * 2);
  sctx.stroke();
  sctx.setLineDash([2, 6]);
  sctx.beginPath();
  sctx.arc(sw / 2, sh / 2, size * 1.22, 0, Math.PI * 2);
  sctx.stroke();
  sctx.setLineDash([]);
  if (pulse > 0.01 && !reduced) {
    sctx.strokeStyle = `rgba(${color},${pulse * 0.6})`;
    sctx.beginPath();
    sctx.arc(sw / 2, sh / 2, size * (1 + (1 - pulse) * 1.3), 0, Math.PI * 2);
    sctx.stroke();
  }
}
function drawWave(t) {
  if (!wctx || !ww) return;
  wctx.clearRect(0, 0, ww, wh);
  wctx.strokeStyle = "#273222";
  wctx.lineWidth = 0.7;
  for (let x = 0; x < ww; x += 22) {
    wctx.beginPath();
    wctx.moveTo(x, 0);
    wctx.lineTo(x, wh);
    wctx.stroke();
  }
  for (let y = 0; y < wh; y += 22) {
    wctx.beginPath();
    wctx.moveTo(0, y);
    wctx.lineTo(ww, y);
    wctx.stroke();
  }
  wctx.strokeStyle = "#b4ce8b";
  wctx.lineWidth = 1.8;
  wctx.shadowColor = "#b4ce8b";
  wctx.shadowBlur = 6;
  wctx.beginPath();
  for (let x = 0; x <= ww; x++) {
    const phase = (x / ww) * Math.PI * 2 * frequency - t * 2;
    const y =
      waveType === "square"
        ? Math.sin(phase) >= 0
          ? 1
          : -1
        : waveType === "triangle"
          ? (Math.asin(Math.sin(phase)) * 2) / Math.PI
          : Math.sin(phase);
    const py = wh / 2 - y * amplitude * (wh * 0.42);
    x === 0 ? wctx.moveTo(x, py) : wctx.lineTo(x, py);
  }
  wctx.stroke();
  wctx.shadowBlur = 0;
}
let last = 0,
  elapsed = 0,
  lastSignalState = "",
  lastWaveState = "";
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (!document.hidden) {
    if (!reduced) {
      elapsed += dt;
      if (!drag && signalVisible) rotationY += dt * 0.12;
      pulse = Math.max(0, pulse - dt * 0.65);
    }
    const signalState = [
      sw,
      sh,
      rotationX,
      rotationY,
      shape,
      root.dataset.theme,
      reduced,
    ].join();
    const waveState = [ww, wh, waveType, frequency, amplitude, reduced].join();
    if (signalVisible && (!reduced || signalState !== lastSignalState)) {
      drawSignal(reduced ? 0 : elapsed * 0.3);
      lastSignalState = signalState;
    }
    if (waveVisible && (!reduced || waveState !== lastWaveState)) {
      drawWave(reduced ? 0 : elapsed);
      lastWaveState = waveState;
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
$("#frequency").addEventListener("input", (e) => {
  frequency = Number(e.target.value);
  $("#frequency-value").textContent = frequency + " Hz";
});
$("#amplitude").addEventListener("input", (e) => {
  amplitude = Number(e.target.value) / 100;
  $("#amplitude-value").textContent = e.target.value + "%";
});
$$("[data-wave]").forEach((b) =>
  b.addEventListener("click", () => {
    waveType = b.dataset.wave;
    $$("[data-wave]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)),
    );
  }),
);
function selectProject(id, focus = false) {
  $$("[data-project]").forEach((b) => {
    const active = b.dataset.project === id;
    b.setAttribute("aria-selected", String(active));
    b.tabIndex = active ? 0 : -1;
    if (active && focus) b.focus();
  });
  $$(".project-panel").forEach((p) => (p.hidden = p.id !== "panel-" + id));
}
$$("[data-project]").forEach((b, i, arr) => {
  b.addEventListener("click", () => selectProject(b.dataset.project));
  b.addEventListener("keydown", (e) => {
    let next;
    if (e.key === "ArrowRight") next = (i + 1) % arr.length;
    if (e.key === "ArrowLeft") next = (i + arr.length - 1) % arr.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = arr.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      selectProject(arr[next].dataset.project, true);
    }
  });
});
let transferTimer;
$("#transfer-button").addEventListener("click", () => {
  const button = $("#transfer-button");
  button.disabled = true;
  button.textContent = "Running…";
  $(".flow-map").classList.add("running");
  let step = 0;
  const messages = [
    "A request starts with an agent.",
    "A main agent reviews the request.",
    "Capacity is reserved before proceeding.",
    "Coordination complete in this simulation.",
  ];
  const advance = () => {
    $$("#transfer-steps li").forEach((li, i) =>
      li.classList.toggle("active", i <= step),
    );
    $("#transfer-status").textContent = messages[step];
    if (step === 3) {
      button.disabled = false;
      button.textContent = "Replay ↻";
      $(".flow-map").classList.remove("running");
      clearInterval(transferTimer);
    }
    step++;
  };
  advance();
  transferTimer = setInterval(advance, 950);
});
$$("[data-task]").forEach((b) =>
  b.addEventListener("click", () => {
    const state = (Number(b.dataset.task) + 1) % 3;
    b.dataset.task = state;
    $("small", b).textContent = ["To do", "In progress", "Done ✓"][state];
    const count = $$('[data-task="2"]').length;
    $("#task-progress").style.width = (count / 3) * 100 + "%";
    $("#task-summary").textContent =
      `${count} of 3 complete${count === 3 ? " — a little more clarity." : ""}`;
  }),
);
$$("[data-sport]")
  .filter((b) => b.tagName === "BUTTON")
  .forEach((b) =>
    b.addEventListener("click", () => {
      $("#race-art").dataset.sport = b.dataset.sport;
      $("#sport-title").textContent = b.dataset.sport.toUpperCase();
      $$(".sport-controls button").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
    }),
  );
const skillNotes = {
  Flutter:
    "Flutter → cross-platform mobile development during my C.A.R.D. internship.",
  React: "React / React Native → interfaces for web and mobile projects.",
  TypeScript:
    "TypeScript / JavaScript → application logic and interactive interfaces, including this page.",
  PHP: "PHP → maintaining web applications at C.A.R.D. Informatics.",
  Node: "Node.js → server-side JavaScript and API development.",
  Java: "Java → part of my development toolbox.",
  PostgreSQL:
    "PostgreSQL / MySQL → relational data, application records, and queries.",
  Supabase:
    "Supabase → data and application integrations in my web development work.",
  APIs: "REST APIs → connecting the mobile screen to the systems behind it.",
  Redis: "Redis → a data infrastructure tool in my toolbox.",
  Diagnostics:
    "Circuit diagnostics → tracing faults from symptoms to their source.",
  Oscilloscopes:
    "Oscilloscopes → making electrical signals visible. Try the signal lab below.",
  Maintenance:
    "Preventive maintenance → inspection and care before systems fail.",
  Consensus:
    "Consensus concepts → exploring Proof of Work, Proof of Stake, gossip protocols, and distributed consistency.",
};
$$("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    $$("[data-filter]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)),
    );
    $$("[data-skill]").forEach(
      (x) =>
        (x.hidden =
          b.dataset.filter !== "all" &&
          x.dataset.category !== b.dataset.filter),
    );
    $("#skill-note").textContent = "Pick a tool to see where it fits.";
  }),
);
$$("[data-skill]").forEach((b) =>
  b.addEventListener("click", () => {
    $$("[data-skill]").forEach((x) => x.classList.toggle("selected", x === b));
    $("#skill-note").textContent = skillNotes[b.dataset.skill];
  }),
);
const projectNotes = {
  silverstone: {
    title: "Silverstone",
    body: [
      [
        "The problem",
        "Agents need a clear way to coordinate float requests, identities, and their progress across a shared system.",
      ],
      [
        "The approach",
        "A mobile and web interface backed by an Express API and PostgreSQL, with role-based access and a request lifecycle.",
      ],
      [
        "What you’re seeing",
        "The on-page demo illustrates a request moving through review and reservation. It is a simulation, not evidence of live payments or a provider integration.",
      ],
    ],
  },
  fahari: {
    title: "Fahari",
    body: [
      [
        "The problem",
        "Operations information can become fragmented across customer records, products, returns, and compliance deadlines.",
      ],
      [
        "The approach",
        "A React and TypeScript dashboard using Vite, Tailwind CSS, and shadcn/ui, with role-based authentication.",
      ],
      [
        "What you’re seeing",
        "The sample task list is a small interactive concept for organizing work. It uses illustrative data and does not connect to fahari.io.",
      ],
    ],
  },
  tour: {
    title: "Tour de Rotary DSM",
    body: [
      [
        "The idea",
        "An event web application for the Rotary DSM tour, bringing an event and its community into a shared digital experience.",
      ],
      [
        "The approach",
        "Next.js, TypeScript, and Tailwind CSS for the web interface.",
      ],
      [
        "What you’re seeing",
        "A visual exploration of swim, bike, and run. It does not represent a live schedule, route, or registration system.",
      ],
    ],
  },
};
const detailDialog = $("#detail-dialog");
$$("[data-detail]").forEach((b) =>
  b.addEventListener("click", () => {
    const data = projectNotes[b.dataset.detail];
    $("#detail-title").textContent = data.title;
    $("#detail-body").replaceChildren();
    for (const [heading, copy] of data.body) {
      const h = document.createElement("h3"),
        p = document.createElement("p");
      h.textContent = heading;
      p.textContent = copy;
      $("#detail-body").append(h, p);
    }
    detailDialog.showModal();
  }),
);
$$("[data-close]").forEach((b) =>
  b.addEventListener("click", () => b.closest("dialog").close()),
);
$$("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  }),
);
async function copyEmail() {
  try {
    await navigator.clipboard.writeText("Raymonddjeff0502@gmail.com");
    toast("Email copied. Let’s build something.");
  } catch {
    toast("Copy unavailable. Email: Raymonddjeff0502@gmail.com");
  }
}
$("#copy-email").addEventListener("click", copyEmail);
const terminalOutput = $("#terminal-output");
let history = [],
  historyIndex = 0;
const terminalResponses = {
  help: "Available commands:\n  whoami    Meet Raymond\n  projects  Explore the work\n  skills    Open the toolbox\n  contact   Get in touch\n  cv        Download my résumé\n  theme     Switch light / dark\n  pulse     Send a signal\n  surprise  A small discovery\n  clear     Clear this terminal\n\nTip: ↑ / ↓ recalls your commands. Ctrl / ⌘ K opens navigation.",
  whoami:
    "Raymond Jefa Duma.\nSoftware developer with a foundation in Electronics & Telecommunications Engineering.\nBased in Dar es Salaam, Tanzania.\nCurious about what happens underneath.",
  projects:
    "01 Silverstone — mobile-money float coordination\n02 Fahari — compliance and operations\n03 Tour de Rotary DSM — event web experience\n\nSelect a project in the Work section to explore it.",
  skills:
    "Software: Flutter, React, TypeScript, PHP, Java, Node.js\nData: PostgreSQL, Supabase, MySQL, REST APIs, Redis\nHardware: circuit diagnostics, oscilloscopes, preventive maintenance",
  contact:
    "Email: Raymonddjeff0502@gmail.com\nPhone: +255 710 964 117\nGitHub: github.com/smart01-bot",
  sudo: "Nice try. Curiosity doesn’t need root access.",
  hello: "Hey! Or as we say here: karibu. Make yourself at home.",
  ls: "about/  projects/  playground/  contact/  Raymond_Duma_CV.pdf",
  pwd: "~/dar-es-salaam/raymond",
  surprise:
    "✳ Hidden frequency found.\nA signal is just a story waiting for the right receiver.\nTry switching the sculpture to a torus and dragging it sideways.",
};
function runCommand(raw) {
  const input = raw.trim();
  if (!input) return;
  history.push(input);
  historyIndex = history.length;
  if (history.length > 100) {
    history.shift();
    historyIndex = history.length;
  }
  const command = input.toLowerCase();
  if (command === "clear") {
    terminalOutput.replaceChildren();
    return;
  }
  const line = document.createElement("p");
  line.className = "prompt";
  line.textContent = "guest ~ $ " + input;
  const response = document.createElement("p");
  let result = terminalResponses[command];
  if (command === "theme") {
    toggleTheme();
    result = "Theme switched. Same curiosity, different light.";
  }
  if (command === "pulse") {
    burst();
    result = "Pulse sent to the sculpture at the top.";
  }
  if (command === "cv") {
    const link = document.createElement("a");
    link.href = "Raymond_Duma_CV.pdf";
    link.download = "Raymond_Duma_CV.pdf";
    link.click();
    result = "Résumé download requested.";
  }
  if (command === "surprise") {
    shape = 1;
    $("#shape-name").textContent = shapeNames[shape];
    burst();
  }
  response.textContent =
    result || `Command not found: ${input}\nType help to see what’s available.`;
  terminalOutput.append(line, response);
  while (terminalOutput.children.length > 80)
    terminalOutput.firstElementChild.remove();
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
$("#terminal-form").addEventListener("submit", (e) => {
  e.preventDefault();
  runCommand($("#terminal-input").value);
  $("#terminal-input").value = "";
});
$("#terminal-input").addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    historyIndex = Math.max(
      0,
      Math.min(history.length, historyIndex + (e.key === "ArrowUp" ? -1 : 1)),
    );
    e.target.value = history[historyIndex] || "";
  }
});
$$("[data-terminal]").forEach((b) =>
  b.addEventListener("click", () => {
    runCommand(b.dataset.terminal);
    $("#terminal-input").focus({ preventScroll: true });
  }),
);
$("#terminal-clear").addEventListener("click", () =>
  terminalOutput.replaceChildren(),
);
const commandDialog = $("#command-dialog");
let commandIndex = 0,
  filtered = [];
const commands = [
  ...["home", "projects", "about", "playground", "contact"].map((id) => ({
    label: {
      home: "Back to the beginning",
      projects: "Explore selected work",
      about: "Meet Raymond",
      playground: "Open the playground",
      contact: "Get in touch",
    }[id],
    type: "Navigate",
    action: () =>
      $("#" + id).scrollIntoView({ behavior: reduced ? "instant" : "smooth" }),
  })),
  ...["silverstone", "fahari", "tour"].map((id) => ({
    label: projectNotes[id].title,
    type: "Project",
    action: () => {
      selectProject(id);
      $("#projects").scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
      });
    },
  })),
  { label: "Switch light / dark theme", type: "Action", action: toggleTheme },
  {
    label: "Toggle motion",
    type: "Action",
    action: () => $("#motion-button").click(),
  },
  { label: "Copy email address", type: "Action", action: copyEmail },
  {
    label: "Download résumé / CV",
    type: "File",
    action: () => {
      const a = document.createElement("a");
      a.href = "Raymond_Duma_CV.pdf";
      a.download = "Raymond_Duma_CV.pdf";
      a.click();
    },
  },
  {
    label: "Send a pulse",
    type: "Experiment",
    action: () => {
      $("#home").scrollIntoView();
      burst();
    },
  },
];
function renderCommands() {
  const query = $("#command-search").value.toLowerCase();
  filtered = commands.filter((c) => c.label.toLowerCase().includes(query));
  commandIndex = 0;
  $("#command-results").replaceChildren();
  if (!filtered.length) {
    const p = document.createElement("p");
    p.textContent = "No matches. Try “work”, “theme”, or “CV”.";
    p.style.padding = "14px";
    $("#command-results").append(p);
  }
  filtered.forEach((c, i) => {
    const b = document.createElement("button"),
      s = document.createElement("span"),
      small = document.createElement("small");
    s.textContent = c.label;
    small.textContent = c.type + " ↗";
    b.append(s, small);
    b.classList.toggle("active", i === commandIndex);
    b.addEventListener("click", () => {
      commandDialog.close();
      c.action();
    });
    $("#command-results").append(b);
  });
}
function openCommands() {
  if (detailDialog.open) detailDialog.close();
  if (!commandDialog.open) commandDialog.showModal();
  $("#command-search").value = "";
  renderCommands();
  $("#command-search").focus();
}
$$("[data-command]").forEach((b) => b.addEventListener("click", openCommands));
$("#command-search").addEventListener("input", renderCommands);
$("#command-search").addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown"].includes(e.key) && filtered.length) {
    e.preventDefault();
    commandIndex =
      (commandIndex + (e.key === "ArrowDown" ? 1 : -1) + filtered.length) %
      filtered.length;
    $$("#command-results button").forEach((b, i) => {
      b.classList.toggle("active", i === commandIndex);
      if (i === commandIndex) b.scrollIntoView({ block: "nearest" });
    });
  }
  if (e.key === "Enter" && filtered.length) {
    e.preventDefault();
    commandDialog.close();
    filtered[commandIndex].action();
  }
});
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    commandDialog.open ? commandDialog.close() : openCommands();
  }
});
