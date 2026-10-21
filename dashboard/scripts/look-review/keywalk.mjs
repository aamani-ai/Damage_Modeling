// Keyboard-only walk for check 4 of the look review (06 §4): library → tile → cell page → trail drawer →
// [legend grid: switch a line off and on] → dossier → ⓘ → close, keys only, recording the focused element and
// its computed outline at every step.
// usage: node keywalk.mjs <baseUrl> [tile title] [curve id]   — prints each step's focused element, ring and URL,
// light and dark. Default: V0's walk, Flood × Battery storage → BESS_PCS_INUNDATION_PROXY. A cell page whose plot
// has a grid legend also gets the legend step.
import puppeteer from "puppeteer-core";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , base, tileTitle = "Flood × Battery storage", curveId = "BESS_PCS_INUNDATION_PROXY"] = process.argv;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const all = {};
for (const theme of ["light", "dark"]) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
  await page.evaluateOnNewDocument((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  const steps = [];
  const active = () => page.evaluate(() => {
    const a = document.activeElement; const cs = getComputedStyle(a);
    return { tag: a.tagName.toLowerCase(), label: a.getAttribute("aria-label"), text: (a.textContent || "").trim().slice(0, 50),
      href: a.getAttribute("href"), rc: a.getAttribute("data-rc"), expanded: a.getAttribute("aria-expanded"), controls: a.getAttribute("aria-controls"),
      pressed: a.getAttribute("aria-pressed"), inLegendGrid: !!a.closest('[aria-label="Legend — show or hide a series"] table'),
      ring: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, focusVisible: a.matches(":focus-visible"), url: location.pathname + location.search,
      accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(), dialog: !!document.querySelector('[role="dialog"]') };
  });
  const press = async (key, n = 1) => { for (let i = 0; i < n; i++) { await page.keyboard.press(key); await new Promise((r) => setTimeout(r, 40)); } };
  const tabUntil = async (pred, max = 80) => { for (let i = 1; i <= max; i++) { await press("Tab"); const a = await active(); if (pred(a)) return [i, a]; } throw new Error("tab target not reached"); };
  const record = (step, keys, a) => steps.push({ step, keys, focus: a.label || a.text || a.tag, ring: a.ring, focusVisible: a.focusVisible, url: a.url, dialog: a.dialog, expanded: a.expanded, ...(a.pressed != null ? { pressed: a.pressed } : {}) });
  const waitPath = (p) => page.waitForFunction((x) => location.pathname === x, { timeout: 15000 }, p);
  const hydrated = () => page.waitForSelector('button[aria-label^="Switch to the"]', { timeout: 15000 });

  await page.goto(base + "/", { waitUntil: "networkidle0" }); await hydrated();
  let [n, a] = await tabUntil((x) => !!x.rc); record("Library: first tile", `Tab ×${n}`, a);
  const target = await page.evaluate((t) => document.querySelector(`[data-rc][aria-label^="${t},"]`)?.getAttribute("data-rc"), tileTitle);
  const [r0, c0] = a.rc.split("-").map(Number); const [r1, c1] = target.split("-").map(Number);
  await press(r1 > r0 ? "ArrowDown" : "ArrowUp", Math.abs(r1 - r0)); await press(c1 > c0 ? "ArrowRight" : "ArrowLeft", Math.abs(c1 - c0));
  a = await active(); record(`Library: ${tileTitle} tile`, `${r1 > r0 ? "ArrowDown" : "ArrowUp"} ×${Math.abs(r1 - r0)}, ${c1 > c0 ? "ArrowRight" : "ArrowLeft"} ×${Math.abs(c1 - c0)}`, a);
  await press("Enter"); await page.waitForFunction(() => location.pathname.startsWith("/cells/"), { timeout: 15000 }); await hydrated(); await new Promise((r) => setTimeout(r, 300));
  const cellPath = await page.evaluate(() => location.pathname);
  a = await active(); record("Cell page opened; focus on the page body", "Enter", a);
  [n, a] = await tabUntil((x) => x.label != null && /^Scope/.test(x.label)); record("Trail: first station (Scope)", `Tab ×${n}`, a);
  let k = 0; while (!/^Evidence/.test(a.label || "") && k < 10) { await press("ArrowRight"); k++; a = await active(); }
  record("Trail: Evidence station", `ArrowRight ×${k}`, a);
  await press("Enter"); await page.waitForSelector('[role="dialog"][aria-modal="true"]', { timeout: 5000 }); await new Promise((r) => setTimeout(r, 300));
  a = await active(); record("Evidence drawer open; focus on Close", "Enter", a);
  await press("Escape"); await new Promise((r) => setTimeout(r, 300));
  a = await active(); record("Drawer closed; focus back on the station", "Escape", a);
  if (await page.$('[aria-label="Legend — show or hide a series"] table')) {
    [n, a] = await tabUntil((x) => x.inLegendGrid); record("Legend grid: first line", `Tab ×${n}`, a);
    await press("Enter"); await new Promise((r) => setTimeout(r, 200)); a = await active(); record("Line switched off", "Enter", a);
    await press("Enter"); await new Promise((r) => setTimeout(r, 200)); a = await active(); record("Line switched on again", "Enter", a);
  }
  [n, a] = await tabUntil((x) => (x.href || "").includes(`/curves/${curveId}`)); record(`Cell page: ${curveId} curve link`, `Tab ×${n}`, a);
  await press("Enter"); await waitPath(`${cellPath}/curves/${curveId}`); await hydrated(); await new Promise((r) => setTimeout(r, 300));
  a = await active(); record("Dossier opened; focus on the page body", "Enter", a);
  [n, a] = await tabUntil((x) => x.text === "i" && !!x.controls); record("Dossier: first ⓘ button", `Tab ×${n}`, a);
  await press("Enter"); await new Promise((r) => setTimeout(r, 200)); a = await active(); record("ⓘ open", "Enter", a);
  await press("Escape"); await new Promise((r) => setTimeout(r, 200)); a = await active(); record("ⓘ closed; focus stays on the button", "Escape", a);
  all[theme] = steps;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(all, null, 1));
