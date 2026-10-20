// Full-resolution captures for the look review: real Chrome (headless), both themes switched explicitly
// (prefers-color-scheme emulated AND next-themes' localStorage key set), viewport and full-page per size.
// usage: node shoot.mjs <baseUrl> <outDir> <routesJson> [--grey] [--only-viewport] [--1440-only] [--light-only|--dark-only]
// routesJson: [{"name", "path", "waitFor"?, "click"?: [selectors], "settle"?: ms}] — see routes.v0.json
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [, , base, outDir, routesJson, ...flags] = process.argv;
const routes = JSON.parse(routesJson);
const grey = flags.includes("--grey");
const onlyViewport = flags.includes("--only-viewport");
const sizes = flags.includes("--1440-only") ? [[1440, 900]] : [[1440, 900], [1024, 768]];
const themes = flags.includes("--light-only") ? ["light"] : flags.includes("--dark-only") ? ["dark"] : ["light", "dark"];
mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars", "--font-render-hinting=none"] });
const results = [];
for (const r of routes) {
  for (const [w, h] of sizes) {
    for (const theme of themes) {
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }]);
      await page.evaluateOnNewDocument((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
      const t0 = Date.now();
      await page.goto(base + r.path, { waitUntil: "networkidle0", timeout: 60000 });
      if (r.waitFor) await page.waitForSelector(r.waitFor, { timeout: 15000 }).catch(() => {});
      if (r.click) { for (const sel of r.click) { await page.click(sel).catch(() => {}); } }
      await new Promise((res) => setTimeout(res, r.settle ?? 700));
      if (grey) await page.addStyleTag({ content: "html{filter:grayscale(1)!important}" });
      const name = `${r.name}__${w}x${h}__${theme}${grey ? "__grey" : ""}`;
      await page.screenshot({ path: `${outDir}/${name}.png` });
      if (!onlyViewport) await page.screenshot({ path: `${outDir}/${name}__full.png`, fullPage: true });
      results.push({ name, ms: Date.now() - t0 });
      await ctx.close();
    }
  }
}
await browser.close();
console.log(JSON.stringify(results));
