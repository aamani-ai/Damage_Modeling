// Keyboard-only walk for check 4 of the look review (06 §4), iteration 2: library → tile → cell page → "How this was
// built" strip (arrow keys) → a step's side panel (Enter, Escape) → the part selector (ArrowRight switches the part)
// → the curve's own page → ⓘ → close, keys only, recording the focused element and its computed outline at every step.
// usage: node keywalk.mjs <baseUrl> [tile title] [curve id]   — default: Flood × Battery storage → BESS_PCS_INUNDATION_PROXY
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
    return { tag: a.tagName.toLowerCase(), label: a.getAttribute("aria-label"), text: (a.textContent || "").trim().slice(0, 60),
      href: a.getAttribute("href"), rc: a.getAttribute("data-rc"), expanded: a.getAttribute("aria-expanded"), controls: a.getAttribute("aria-controls"),
      pressed: a.getAttribute("aria-pressed"), checked: a.getAttribute("aria-checked"), role: a.getAttribute("role"),
      ring: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, focusVisible: a.matches(":focus-visible"), url: location.pathname + location.search,
      accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(), dialog: !!document.querySelector('[role="dialog"][aria-modal="true"]') };
  });
  const press = async (key, n = 1) => { for (let i = 0; i < n; i++) { await page.keyboard.press(key); await new Promise((r) => setTimeout(r, 40)); } };
  const tabUntil = async (pred, max = 90) => { for (let i = 1; i <= max; i++) { await press("Tab"); const a = await active(); if (pred(a)) return [i, a]; } throw new Error("tab target not reached"); };
  const record = (step, keys, a) => steps.push({ step, keys, focus: a.label || a.text || a.tag, ring: a.ring, focusVisible: a.focusVisible, url: a.url, dialog: a.dialog, expanded: a.expanded, ...(a.pressed != null ? { pressed: a.pressed } : {}), ...(a.checked != null ? { checked: a.checked } : {}) });
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
  [n, a] = await tabUntil((x) => x.label != null && /^What it covers/.test(x.label)); record("How this was built: first step (What it covers)", `Tab ×${n}`, a);
  let k = 0; while (!/^Where the numbers come from/.test(a.label || "") && k < 10) { await press("ArrowRight"); k++; a = await active(); }
  record("How this was built: Where the numbers come from", `ArrowRight ×${k}`, a);
  await press("Enter"); await page.waitForSelector('[role="dialog"][aria-modal="true"]', { timeout: 5000 }); await new Promise((r) => setTimeout(r, 300));
  a = await active(); record("Step panel open; focus on Close", "Enter", a);
  await press("Escape"); await new Promise((r) => setTimeout(r, 300));
  a = await active(); record("Panel closed; focus back on the step", "Escape", a);
  if (await page.$('[role="radiogroup"][aria-label="Part of the plant"]')) {
    [n, a] = await tabUntil((x) => x.role === "radio" && x.checked === "true"); record("Part selector: the selected part", `Tab ×${n}`, a);
    await press("Tab"); await press("Enter"); await new Promise((r) => setTimeout(r, 250)); a = await active(); record("Next part selected (the URL carries ?part=)", "Tab, Enter", a);
  }
  [n, a] = await tabUntil((x) => (x.href || "").includes(`/curves/${curveId}`) || (x.href || "").includes("/curves/")); record(`Cell page: the curve's own page link`, `Tab ×${n}`, a);
  const dossierHref = a.href;
  await press("Enter"); await waitPath(dossierHref.split("?")[0]); await hydrated(); await new Promise((r) => setTimeout(r, 300));
  a = await active(); record("Curve page opened; focus on the page body", "Enter", a);
  [n, a] = await tabUntil((x) => x.text === "i" && !!x.controls); record("Curve page: first ⓘ button", `Tab ×${n}`, a);
  await press("Enter"); await new Promise((r) => setTimeout(r, 200)); a = await active(); record("ⓘ open", "Enter", a);
  await press("Escape"); await new Promise((r) => setTimeout(r, 200)); a = await active(); record("ⓘ closed; focus stays on the button", "Escape", a);
  all[theme] = steps;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(all, null, 1));
