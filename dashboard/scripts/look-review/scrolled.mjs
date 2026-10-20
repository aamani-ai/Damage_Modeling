// Screenshot-escape check (06 §4 check 3): capture each screen scrolled to its middle and its bottom; the sticky
// status rail (or the library's title row with the build commit) must still be in the frame.
// usage: node scrolled.mjs <baseUrl> <outDir> <routesJson>   — prints whether the rail is in frame per capture
import puppeteer from "puppeteer-core";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [, , base, outDir, routesJson] = process.argv;
const routes = JSON.parse(routesJson);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });
const res = [];
for (const r of routes) {
  for (const [w, h] of [[1440, 900], [1024, 768]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
    await page.evaluateOnNewDocument(() => { try { localStorage.setItem("theme", "light"); } catch {} });
    await page.goto(base + r.path, { waitUntil: "networkidle0" });
    await new Promise((x) => setTimeout(x, 600));
    for (const where of ["middle", "bottom"]) {
      const info = await page.evaluate((where) => {
        const max = document.documentElement.scrollHeight - innerHeight;
        window.scrollTo(0, where === "middle" ? Math.round(max / 2) : max);
        return { max };
      }, where);
      await new Promise((x) => setTimeout(x, 250));
      const rail = await page.evaluate(() => {
        const el = document.querySelector("main .sticky.top-0");
        if (!el) return null; const b = el.getBoundingClientRect();
        return { top: Math.round(b.top), bottom: Math.round(b.bottom), inFrame: b.top >= 0 && b.bottom <= window.innerHeight, text: el.textContent.trim().slice(0, 90) };
      });
      const name = `13_escape_${r.name}__${w}x${h}__light__${where}`;
      if (info.max > 0) await page.screenshot({ path: `${outDir}/${name}.png` });
      res.push({ name, scrollable_px: info.max, rail_in_frame: !!rail && rail.inFrame, rail });
    }
    await page.close();
  }
}
await browser.close();
console.log(JSON.stringify(res, null, 1));
