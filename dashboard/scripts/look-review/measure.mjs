// Speed budget (06 §2.9): library ≤ 1 s, cell page ≤ 1.5 s to usable, on the static export over localhost.
// "Usable" = the page is hydrated (the theme toggle becomes a real button) and, on pages with a plot, the plot's
// canvas exists. Each run is a fresh browser context (cold cache). Runs with no throttle and with 4x CPU slowdown.
// usage: node measure.mjs <baseUrl> <pagesJson> [runs]   — pagesJson: speed.v0.json ([{name, path, canvas?, budget}])
import puppeteer from "puppeteer-core";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , base, pagesJson, runsArg] = process.argv;
const pages = JSON.parse(pagesJson);
const runs = Number(runsArg ?? 5);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const out = [];
for (const cpu of [1, 4]) {
  for (const p of pages) {
    const samples = [];
    for (let i = 0; i < runs; i++) {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      if (cpu > 1) await page.emulateCPUThrottling(cpu);
      await page.goto(base + p.path, { waitUntil: "domcontentloaded" });
      await page.waitForFunction((needsCanvas) => {
        const hydrated = !!document.querySelector('button[aria-label^="Switch to the"]');
        const canvas = !needsCanvas || !!document.querySelector("main canvas");
        if (hydrated && canvas && !window.__usable) window.__usable = performance.now();
        return !!window.__usable;
      }, { timeout: 30000, polling: "raf" }, !!p.canvas);
      const m = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        const fcp = performance.getEntriesByName("first-contentful-paint")[0];
        return { ttfb: nav.responseStart, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd, fcp: fcp ? fcp.startTime : null, usable: window.__usable };
      });
      samples.push(m);
      await ctx.close();
    }
    const med = (k) => { const v = samples.map((s) => s[k]).filter((x) => x != null).sort((a, b) => a - b); return v.length ? Math.round(v[Math.floor(v.length / 2)]) : null; };
    const max = (k) => Math.round(Math.max(...samples.map((s) => s[k] ?? 0)));
    out.push({ page: p.name, cpu: `${cpu}x`, runs, fcp_median_ms: med("fcp"), usable_median_ms: med("usable"), usable_max_ms: max("usable"), dcl_median_ms: med("dcl"), budget_ms: p.budget, pass: max("usable") <= p.budget });
  }
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
