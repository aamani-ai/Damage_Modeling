// The coverage picture's checks (DCD-D21, D34), against the static export, headless:
//   1 every asset type's block and plant views load the twin's model with no console error;
//   2 the toolbar carries the twin's six tools;
//   3 the picture and the list end level (within 2 px at 1440 px);
//   4 every curve part in the list carries its miniature;
//   5 a click in the systems × hazards table writes ?hazard= and ?sel=, selects that system in the viewer, names it
//     under the picture and keeps the whole model in view (the camera stays at home);
//   6 full screen opens as a dialog on an asset page and on a cell page, and Esc closes it.
// usage: node picture.mjs <baseUrl>   prints JSON and a RESULT line; exit code 1 when a check fails
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = process.argv[2] ?? "http://localhost:3211";
const TOOLS = ["Focus", "Isolate", "Fade others", "Explode", "See inside", "Reset"];
const TOOLBAR = "[aria-label=\"The Digital Twin's tools\"]";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });

async function open(path) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
  await page.goto(base + path, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector(TOOLBAR, { timeout: 20000 }).catch(() => errs.push("the model did not load"));
  await wait(1200);
  return { page, errs };
}

// what one coverage card shows: the model, the tools, the two columns' bottoms, the curve links and their miniatures
const inspect = (root) => {
  const card = document.querySelector(root);
  const el = card?.querySelector("subsystem-viewer");
  const left = el?.closest(".grid > div");
  const list = left?.nextElementSibling?.querySelector("ul.thin-scroll");
  const links = [...(list?.querySelectorAll("a[title^='open the curve for'], button[title^='show the curve for']") ?? [])];
  return {
    loaded: !!el?._loaded, meshes: el?._meshes?.length ?? 0,
    tools: [...(card?.querySelectorAll("[aria-label=\"The Digital Twin's tools\"] button") ?? [])].map((b) => b.textContent),
    gap_px: left && list ? Math.round(Math.abs(left.getBoundingClientRect().bottom - list.getBoundingClientRect().bottom)) : null,
    curve_links: links.length, without_miniature: links.filter((a) => !a.querySelector("svg")).map((a) => a.textContent),
  };
};

const views = [];
for (const t of ["solar", "wind", "bess", "residential", "commercial", "industrial", "substation"]) {
  for (const view of [null, "plant"]) {
    if (t === "substation" && view) continue; // the substation has one model
    const path = `/assets/${t}${view ? `?view=${view}` : ""}`;
    const { page, errs } = await open(path);
    const r = await page.evaluate(inspect, "#asset-coverage");
    const pass = r.loaded && r.meshes > 0 && !errs.length && TOOLS.every((x) => r.tools.includes(x)) && r.gap_px != null && r.gap_px <= 2 && !r.without_miniature.length;
    views.push({ path, pass, ...r, errs });
    await page.close();
  }
}

// a click in the table: Electrical Collection × Flood on the solar farm
const { page, errs } = await open("/assets/solar");
const home = await page.evaluate(() => { const el = document.querySelector("#asset-coverage subsystem-viewer"); return { r: el._sphT.r, x: el._tgtT.x, z: el._tgtT.z }; });
const cell = await page.$("section[aria-label='Which hazard has a curve for which system'] tbody button[aria-label^='Electrical Collection × Flood']");
await cell.evaluate((b) => b.scrollIntoView({ block: "center" }));
await cell.click();
await wait(3500);
const picked = await page.evaluate(() => {
  const el = document.querySelector("#asset-coverage subsystem-viewer");
  const u = new URL(location.href);
  return { hazard: u.searchParams.get("hazard"), sel: u.searchParams.get("sel"), viewer_sel: el._st.sel, line: document.querySelector("#asset-coverage [aria-live]")?.textContent?.slice(0, 120), r: el._sphT.r, x: el._tgtT.x, z: el._tgtT.z };
});
const kept = Math.abs(picked.r - home.r) < 1e-6 && Math.abs(picked.x - home.x) < 1e-6 && Math.abs(picked.z - home.z) < 1e-6;
const table = { ...picked, whole_model_in_view: kept, errs, pass: picked.hazard === "flood" && !!picked.sel && picked.viewer_sel === picked.sel && /Electrical Collection/.test(picked.line ?? "") && kept && !errs.length };
await page.close();

// full screen opens as a dialog and Esc closes it, on an asset page and a cell page
const full = [];
for (const [path, root] of [["/assets/bess", "#asset-coverage"], ["/cells/hail_solar", "#card-coverage"]]) {
  const { page: p, errs: e } = await open(path);
  const btn = await p.$(`${root} button[title="Show the picture full screen"]`);
  await btn.click();
  await wait(1500);
  const opened = await p.evaluate(() => !!document.querySelector("[role=dialog][aria-modal=true][aria-label^='What the curve covers']"));
  await p.keyboard.press("Escape");
  await wait(500);
  const closed = await p.evaluate(() => !document.querySelector("[role=dialog][aria-modal=true][aria-label^='What the curve covers']"));
  full.push({ path, opened, closed, errs: e, pass: opened && closed && !e.length });
  await p.close();
}
await browser.close();

const ok = views.every((v) => v.pass) && table.pass && full.every((f) => f.pass);
console.log(JSON.stringify({ views, table, full }, null, 1));
console.log(`1-4 views: ${views.filter((v) => v.pass).length} of ${views.length} pass (model loaded, six tools, columns level, a miniature per curve part, no console error)`);
console.log(`5 table click: ${table.pass ? "pass" : "FAIL"} (?hazard=${table.hazard}&sel=${table.sel}; selected in the viewer: ${table.viewer_sel === table.sel}; whole model in view: ${table.whole_model_in_view})`);
console.log(`6 full screen: ${full.map((f) => `${f.path} ${f.pass ? "pass" : "FAIL"}`).join(" · ")}`);
console.log("RESULT:", ok ? "all picture checks pass" : "a check failed");
process.exit(ok ? 0 : 1);
