// Run with jsdom installed externally: NODE_PATH=/path/to/node_modules node tests/interactions.cjs
const { JSDOM } = require("jsdom");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
const base = path.resolve(__dirname, "..");
const dom = new JSDOM(fs.readFileSync(path.join(base, "index.html"), "utf8"), {
  url: "https://portfolio.example",
  runScripts: "outside-only",
  pretendToBeVisual: true,
});
const { window: w } = dom,
  d = w.document;
const intervals = [];
w.matchMedia = () => ({ matches: false, addEventListener() {} });
w.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ target, isIntersecting: true }]);
  }
};
w.ResizeObserver = class {
  observe() {}
};
w.HTMLCanvasElement.prototype.getContext = () =>
  new Proxy({}, { get: (_, name) => () => {}, set: () => true });
w.HTMLElement.prototype.scrollIntoView = function () {};
w.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
w.HTMLDialogElement.prototype.close = function () {
  this.open = false;
};
w.requestAnimationFrame = () => 0;
w.setInterval = (callback) => {
  intervals.push(callback);
  return intervals.length;
};
w.clearInterval = () => {};
w.eval(fs.readFileSync(path.join(base, "script.js"), "utf8"));
const click = (s) => d.querySelector(s).click();
let checks = 0;
const check = (value, message) => {
  assert.ok(value, message);
  checks++;
};
check(d.querySelector("#panel-fahari").hidden, "Inactive panel hidden");
click("#tab-fahari");
check(
  !d.querySelector("#panel-fahari").hidden &&
    d.querySelector("#panel-silverstone").hidden,
  "Project tabs swap content",
);
check(
  d.querySelector("#tab-fahari").getAttribute("aria-selected") === "true",
  "Tab selection exposed",
);
d.querySelector("#tab-fahari").dispatchEvent(
  new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
);
check(
  !d.querySelector("#panel-tour").hidden,
  "Arrow navigation changes project",
);
click('[data-sport="bike"]');
check(
  d.querySelector("#sport-title").textContent === "BIKE",
  "Sport demo updates",
);
click("#tab-fahari");
click("[data-task]");
check(d.querySelector("[data-task]").dataset.task === "1", "Task advances");
click("[data-task]");
check(
  d.querySelector("#task-summary").textContent === "1 of 3 complete",
  "Completion is counted",
);
click("[data-task]");
check(d.querySelector("[data-task]").dataset.task === "0", "Task can reset");
click("#tab-silverstone");
click("#transfer-button");
check(
  d.querySelector("#transfer-button").disabled,
  "Transfer blocks duplicate starts",
);
intervals[1]();
intervals[1]();
intervals[1]();
check(
  !d.querySelector("#transfer-button").disabled &&
    d.querySelectorAll("#transfer-steps .active").length === 4,
  "Transfer reaches replay state",
);
click('[data-filter="hardware"]');
check(
  d.querySelector('[data-skill="Flutter"]').hidden &&
    !d.querySelector('[data-skill="Diagnostics"]').hidden,
  "Skill filter works",
);
click('[data-skill="Diagnostics"]');
check(
  d.querySelector("#skill-note").textContent.includes("tracing faults"),
  "Skill explanation works",
);
click("#shape-button");
check(
  d.querySelector("#shape-name").textContent === "Torus",
  "Shape control cycles",
);
click("#motion-button");
check(
  d.documentElement.classList.contains("motion-off"),
  "Motion can be disabled",
);
click("#theme-button");
check(d.documentElement.dataset.theme === "light", "Light theme toggles");
click('[data-wave="square"]');
check(
  d.querySelector('[data-wave="square"]').getAttribute("aria-pressed") ===
    "true",
  "Wave control is selected",
);
const frequency = d.querySelector("#frequency");
frequency.value = 8;
frequency.dispatchEvent(new w.Event("input"));
check(
  d.querySelector("#frequency-value").textContent === "8 Hz",
  "Slider output updates",
);
click('[data-detail="silverstone"]');
check(
  d.querySelector("#detail-dialog").open &&
    d.querySelector("#detail-title").textContent === "Swift Wakala",
  "Project details open",
);
click("#detail-dialog [data-close]");
check(!d.querySelector("#detail-dialog").open, "Details close");
const input = d.querySelector("#terminal-input");
input.value = "whoami";
d.querySelector("#terminal-form").dispatchEvent(
  new w.Event("submit", { cancelable: true }),
);
check(
  d
    .querySelector("#terminal-output")
    .textContent.includes("Based in Dar es Salaam"),
  "Terminal responds",
);
input.value = "<img src=x onerror=alert(1)>";
d.querySelector("#terminal-form").dispatchEvent(
  new w.Event("submit", { cancelable: true }),
);
check(
  !d.querySelector("#terminal-output img"),
  "Terminal safely treats commands as text",
);
input.dispatchEvent(new w.KeyboardEvent("keydown", { key: "ArrowUp" }));
check(input.value.includes("<img"), "Command history works");
click("[data-command]");
check(d.querySelector("#command-dialog").open, "Palette opens");
const search = d.querySelector("#command-search");
search.value = "theme";
search.dispatchEvent(new w.Event("input"));
check(
  d.querySelectorAll("#command-results button").length === 1,
  "Palette search filters",
);
search.dispatchEvent(
  new w.KeyboardEvent("keydown", { key: "Enter", cancelable: true }),
);
check(
  !d.querySelector("#command-dialog").open &&
    d.documentElement.dataset.theme === "dark",
  "Palette executes action",
);
click("[data-command]");
search.value = "zzzzzz";
search.dispatchEvent(new w.Event("input"));
check(
  d.querySelector("#command-results").textContent.includes("No matches"),
  "Empty search handled",
);
for (const a of d.querySelectorAll('a[href^="#"]'))
  check(
    !!d.querySelector(a.getAttribute("href")),
    "Internal link resolves " + a.hash,
  );
const ids = [...d.querySelectorAll("[id]")].map((e) => e.id);
check(new Set(ids).size === ids.length, "IDs unique");
check(
  fs.existsSync(path.join(base, "Raymond_Duma_CV.pdf")),
  "Original CV retained",
);
console.log(
  `${checks} interaction and structure checks passed. Canvas drawing and browser layout require visual QA.`,
);
w.close();
