#!/usr/bin/env node
/** Build and render the governed TC-wind x solar model-v1 review workbook. */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const artifactToolModule = process.env.ARTIFACT_TOOL_MODULE ?? "@oai/artifact-tool";
const { SpreadsheetFile, Workbook } = await import(artifactToolModule);

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const proposed = path.join(repo, "docs/cells/tropical_cyclone_wind_solar/proposed");
const outputDir = path.join(repo, "outputs/tropical_cyclone_wind_solar_v1_20260729");
const renderDir = path.join(outputDir, "rendered");
const workbookName = "damage_curve_records_tropical_cyclone_wind_solar__model_v1_0__docs_r1.xlsx";

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ""; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift();
  return rows.filter(r => r.some(v => v !== "")).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}

async function csv(name) {
  return parseCsv(await fs.readFile(path.join(proposed, name), "utf8"));
}

const sources = await csv("SOURCE_REGISTER_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const claims = await csv("CLAIM_PARAMETER_REGISTER_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const parameters = await csv("PARAMETER_TIER_TABLE_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const values = await csv("VALUE_CROSSWALK_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const stats = await csv("FIT_SUFFICIENT_STATISTICS_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const sensitivity = await csv("FIT_EVENT_SENSITIVITY_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const crossMatches = await csv("CROSS_METHOD_MATCH_AUDIT_tropical_cyclone_wind_solar__model_v1_0__docs_r1.csv");
const artifact = JSON.parse(await fs.readFile(path.join(proposed, "tropical_cyclone_wind_solar__model_v1_0__docs_r1__curve_artifact.json"), "utf8"));
const kats = JSON.parse(await fs.readFile(path.join(proposed, "known_answer_tests_tropical_cyclone_wind_solar__model_v1_0__docs_r1.json"), "utf8"));
const curve = artifact.pathways[0].curve_records[0];
const points = curve.parameters.points;

const wb = Workbook.create();
const names = [
  "README", "Scope_Coverage", "Source_Evidence", "Cohort_Fit", "PAVA_Curve",
  "Event_Sensitivity", "Failure_Units", "Value_Crosswalk", "KATs",
  "Source_Register", "Claim_Register", "Parameter_Tiers", "QA"
];
for (const name of names) wb.worksheets.add(name);

const C = {
  navy: "#17243B", teal: "#0F766E", pale: "#E7F3F1", blue: "#DCE8F7",
  gray: "#F2F4F7", gold: "#FCE8C5", green: "#DCF3E5", red: "#FBE0E0",
  ink: "#26364A", white: "#FFFFFF", line: "#CFD8E3"
};

function colName(index) {
  let name = "", n = index;
  while (n > 0) { n--; name = String.fromCharCode(65 + (n % 26)) + name; n = Math.floor(n / 26); }
  return name;
}

function setup(sheet, title, subtitle, lastCol = "H") {
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(4);
  sheet.getRange(`A1:${lastCol}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange(`A1:${lastCol}1`).format = { fill: C.navy, font: { bold: true, color: C.white, size: 16 }, rowHeight: 26 };
  sheet.getRange(`A2:${lastCol}2`).format = { fill: C.blue, font: { italic: true, color: "#556579", size: 10 }, rowHeight: 22 };
}

function header(range) {
  range.format = { fill: C.teal, font: { bold: true, color: C.white }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: C.line } };
}

function body(range) {
  range.format = { font: { color: C.ink, size: 10 }, wrapText: true, verticalAlignment: "top", borders: { insideHorizontal: { style: "thin", color: C.line } } };
}

function writeTable(sheet, startRow, headers, rows, widths) {
  const endCol = colName(headers.length);
  sheet.getRange(`A${startRow}:${endCol}${startRow}`).values = [headers];
  header(sheet.getRange(`A${startRow}:${endCol}${startRow}`));
  if (rows.length) {
    sheet.getRange(`A${startRow + 1}:${endCol}${startRow + rows.length}`).values = rows;
    body(sheet.getRange(`A${startRow + 1}:${endCol}${startRow + rows.length}`));
  }
  widths.forEach((width, i) => sheet.getRangeByIndexes(0, i, Math.max(startRow + rows.length, 1), 1).format.columnWidth = width);
}

function human(value) { return String(value ?? "").replaceAll("_", " "); }

{
  const s = wb.worksheets.getItem("README");
  setup(s, "Tropical-cyclone wind × solar — model-v1 review workbook", "Coverage-first noncanonical screening exception • one visible-module source atom • no Hazard cutover", "H");
  writeTable(s, 4, ["Identity", "Value", "Invariant"], [
    ["Cell ID", artifact.cell_id, "hazard × asset project-management cell"],
    ["Damage code", artifact.damage_code_id, "review implementation only"],
    ["Semantic model", artifact.semantic_damage_model_version, "first partial numerical proposal"],
    ["Documentation", artifact.documentation_revision, "governed proof trail"],
    ["Model grade", artifact.model_grade, "remote-sensing labels plus T4 economic bridge"],
    ["Supported atom", "PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT", "source-specific, not generic module field"],
    ["Runtime curve count", artifact.pathways[0].curve_records.length, "exactly one PAVA-derived screening record"],
    ["Canonical runtime artifact", artifact.canonical_runtime_artifact, "must remain false"],
    ["Package inclusion", artifact.package_inclusion_status, "no package or consumer pin"],
    ["Scenario loss", artifact.value_linkage.runtime_loss_status, "withheld before promotion"],
    ["Annual/tail metrics", "withheld", "consumer prerequisites unmet"],
  ], [30, 60, 68]);
  writeTable(s, 4, ["Order", "Sheet", "Purpose"], names.map((name, i) => [i + 1, name, [
    "Identity and strict gate", "Scope and coverage", "Primary-source conflict and provenance", "Frozen PAVA sufficient statistics",
    "Runtime knots and monotonicity", "Event clustering and leave-one-out sensitivity", "Failure-unit coverage", "Value denominator boundary",
    "Executable test inventory", "Sources and transfer limits", "Governed claims", "Parameter evidence tiers", "Formula-driven QA"
  ][i]]), [10, 28, 68]);
  s.getRange("D4:F17").copyFrom(s.getRange("A4:C17"), "all");
  s.getRange("A4:C17").clear({ applyTo: "all" });
  s.getRange("A4:C4").values = [["Identity", "Value", "Invariant"]]; header(s.getRange("A4:C4"));
  const identityRows = [
    ["Cell ID", artifact.cell_id, "hazard × asset project-management cell"],
    ["Damage code", artifact.damage_code_id, "review implementation only"],
    ["Semantic model", artifact.semantic_damage_model_version, "first partial numerical proposal"],
    ["Documentation", artifact.documentation_revision, "governed proof trail"],
    ["Model grade", artifact.model_grade, "remote-sensing labels plus T4 economic bridge"],
    ["Supported atom", "PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT", "source-specific, not generic module field"],
    ["Runtime curve count", artifact.pathways[0].curve_records.length, "exactly one PAVA-derived screening record"],
    ["Canonical runtime artifact", artifact.canonical_runtime_artifact, "must remain false"],
    ["Package inclusion", artifact.package_inclusion_status, "no package or consumer pin"],
    ["Scenario loss", artifact.value_linkage.runtime_loss_status, "withheld before promotion"],
    ["Annual/tail metrics", "withheld", "consumer prerequisites unmet"],
  ];
  s.getRange("A5:C15").values = identityRows; body(s.getRange("A5:C15"));
  [30,60,68,10,30,68].forEach((width, i) => s.getRangeByIndexes(0, i, 22, 1).format.columnWidth = width);
  s.getRange("A19:H22").merge();
  s.getRange("A19").values = [["Strict gate: current public evidence does not earn a field-calibrated economic-DR model. This v1 exists only as a deliberate coverage-first, noncanonical screening exception. It requires uniform module value and full replacement of visible/missing modules, excludes the lone severe-tail observation from runtime, and withholds every other failure unit, dollar loss, and annual/tail output."]];
  s.getRange("A19:H22").format = { fill: C.gold, font: { bold: true, color: C.ink }, wrapText: true, borders: { preset: "outside", style: "thin", color: "#D19A2B" }, rowHeight: 34 };
}

{
  const s = wb.worksheets.getItem("Scope_Coverage"); setup(s, "Scope and coverage", "The scalar is narrower than a generic module-field or whole-solar-plant damage ratio", "G");
  writeTable(s, 4, ["Layer", "Subject", "Status", "Reason / boundary", "Value basis", "Exposure grain", "Consumer treatment"], [
    ["Hazard", "Dataset-reported event maximum gust", "conditional", "provider/station/height/averaging/query unresolved", "n/a", "source site", "exact source-axis identifier only"],
    ["Source atom", "Visible/missing fixed ground module hardware", "conditional numeric", "remote-sensing-labeled source cohort", "uniform module hardware material value", "complete compatible site module population", "scalar DR only"],
    ["Generic module field", "All visible + hidden module damage", "withheld not zero", "source-specific atom cannot generalize", "same-unit in future", "module/row/block", "preserve null"],
    ["Tracker", "modules and SBOS", "withheld not zero", "only two tracking=true rows", "separate tracker value", "exact tracker system", "no fixed fallback"],
    ["Support/electrical/GSU/civil", "all non-module units", "withheld not zero", "endpoint does not cover them", "same-unit split required", "point/line/network/yard", "preserve null"],
    ["Spatial exposure", "additional array fraction", "prohibited", "observed response already includes realized site fraction", "n/a", "same source site", "no second multiplier"],
    ["Scenario loss", "DR × value", "withheld", "noncanonical and T4 economic bridge", "site-specific module value after promotion", "one physical module population", "not emitted"],
    ["Annual/tail", "EAL/PML/VaR/TVaR", "withheld", "frequency coupling and full coverage absent", "consumer-owned", "portfolio", "no result"],
  ], [18,42,24,60,52,40,38]);
}

{
  const s = wb.worksheets.getItem("Source_Evidence"); setup(s, "Source evidence and conflict", "The same-event/site methods disagree; they are correlated challenges, not poolable observations", "H");
  writeTable(s, 4, ["Source", "Population / locator", "Endpoint", "Runtime role", "Strength", "Blocker", "Pinned SHA / DOI", "Decision"], [
    ["Perry manual CSV", "47 total; 37 ground; 35 ground non-tracking", "labeled percent modules damaged", "fit source", "graded physical fraction", "mixed scale, source-axis ambiguity, no disposition/cost", "edb34e74...e00 / 10.21948/2562917", "adopt with limits"],
    ["Perry data description", "pp. 1-2", "manual polygons; aggregate modules blown away", "endpoint definition", "public DOE package", "manual/aggregate methods differ; full manual weather provider unresolved", "852ff012...19d5", "adopt with limits"],
    ["Ceferino supplement", "Table 2, p. 4", "approximate percent panels damaged", "cross-method audit", "14 Caribbean ground sites", "different reports/visual workflow; no paired site gust/cost", "6a9e9f36...6756", "audit only"],
    ["Ceferino threshold check", "paper Section 2.1 + supplement Table 2", "strict >50% gives 4/14; reported 36% implies 5/14 with 50% included", "endpoint-semantics audit", "directly reproducible from the governed sources", "binary inclusion convention unresolved", "TCWS-C118", "do not reproduce calibration count"],
    ["Apparent-coordinate comparison", "four Maria utility/ground pairs within 500 m", "Perry differs materially from Ceferino", "promotion challenge", "governed analyst match audit", "no authoritative shared site ID; correlated, not independent", "TCWS-C115", "do not pool"],
    ["Strict gate", "independent reviews", "no evidence-earned economic DR", "release decision", "prevents overclaiming", "T4 bridge and unstable tail", "TCWS-C116", "noncanonical exception only"],
  ], [28,44,44,28,34,62,38,28]);
  writeTable(s, 13, ["Audit match", "Ceferino row / %", "Perry line / %", "Distance (m)", "Absolute difference (pp)", "Confidence", "Method", "Status"], crossMatches.map(row => [
    row.audit_match_id,
    `Table 2 row ${row.ceferino_data_row} / ${row.ceferino_damage_pct}%`,
    `aggregate line ${row.perry_csv_line_number} / ${row.perry_damage_pct}%`,
    Number(row.great_circle_distance_m),
    Number(row.absolute_difference_percentage_points),
    row.match_confidence,
    "nearest Maria utility/ground coordinate <=500 m; identity unadjudicated",
    row.audit_status,
  ]), [20,30,34,20,30,18,66,18]);
  s.getRange(`D14:E${13 + crossMatches.length}`).format.numberFormat = "0.000000000";
}

{
  const s = wb.worksheets.getItem("Cohort_Fit"); setup(s, "Frozen PAVA sufficient statistics", "Equal-site weighting; runtime n=34; the one 48.2 m/s severe observation remains audit-only", "I");
  s.getRange("A4:I4").values = [["Block", "x low (m/s)", "x high (m/s)", "n sites", "sum DR", "Published mean DR", "Formula mean DR", "Absolute delta", "Fit role"]]; header(s.getRange("A4:I4"));
  s.getRange(`A5:F${4 + stats.length}`).values = stats.map(r => [r.block_id, Number(r.x_low_mps), Number(r.x_high_mps), Number(r.n_sites), Number(r.sum_damage_ratio), Number(r.mean_damage_ratio)]);
  s.getRange(`G5:G${4 + stats.length}`).formulas = stats.map((_, i) => [`=E${5+i}/D${5+i}`]);
  s.getRange(`H5:H${4 + stats.length}`).formulas = stats.map((_, i) => [`=ABS(F${5+i}-G${5+i})`]);
  s.getRange(`I5:I${4 + stats.length}`).values = stats.map(r => [r.fit_role]);
  body(s.getRange(`A5:I${4 + stats.length}`));
  s.getRange(`B5:H${4 + stats.length}`).format.numberFormat = "0.000000000000000";
  [18,18,18,16,22,24,24,20,36].forEach((w, i) => s.getRangeByIndexes(0, i, 4 + stats.length, 1).format.columnWidth = w);
  writeTable(s, 17, ["Cohort rule", "Value", "Why"], [
    ["Source filter", "mounting_type=ground AND tracking=false", "explicit source labels"],
    ["Runtime range", "17.4-39.1 m/s", "stops before 9.1 m/s sparse-tail gap"],
    ["Tail audit", "48.2 m/s, DR 0.4142383192, n=1", "strongest selected ground+nontracker source-cohort point; utility-scale status is unproven; exclusion biases high-end fit downward"],
    ["Weighting", "one equal weight per site", "module counts unavailable consistently"],
    ["Fit", "PAVA pooled means + block-edge linearization", "transparent monotone screening method; knots are derived, not source-published"],
  ], [30,54,86]);
}

{
  const s = wb.worksheets.getItem("PAVA_Curve"); setup(s, "Runtime screening knots", "PAVA-derived block-edge knots; linear interpolation only inside 17.4-39.1 m/s", "G");
  s.getRange("A4:G4").values = [["Knot", "Gust (m/s)", "Proxy DR", "Prior gust", "Prior DR", "Monotone check", "Source / method"]]; header(s.getRange("A4:G4"));
  s.getRange(`A5:C${4 + points.length}`).values = points.map(([x, dr], i) => [i + 1, x, dr]);
  s.getRange(`D5:E${4 + points.length}`).values = points.map(([x, dr], i) => i === 0 ? ["n/a", "n/a"] : [points[i-1][0], points[i-1][1]]);
  s.getRange("F5").values = [["PASS"]];
  s.getRange(`F6:F${4 + points.length}`).formulas = points.slice(1).map((_, i) => [`=IF(AND(B${6+i}>D${6+i},C${6+i}>=E${6+i}),"PASS","FAIL")`]);
  s.getRange(`G5:G${4 + points.length}`).values = points.map(() => ["TCWS-S020; PAVA-derived"]);
  body(s.getRange(`A5:G${4 + points.length}`)); s.getRange(`B5:E${4 + points.length}`).format.numberFormat = "0.000000000000000";
  [12,20,24,20,24,22,40].forEach((w, i) => s.getRangeByIndexes(0, i, 4 + points.length, 1).format.columnWidth = w);
  writeTable(s, 21, ["Sample gust", "Lower knot", "Upper knot", "Expected DR", "Formula DR", "Delta"], [
    [19.5,18.3,20.7,0.00013638328,"=(C22-B22)/(C22-B22)*0.00013638328","=ABS(D22-E22)"],
    [24.7,24.6,24.8,0.0006139711975,"=0.00027276656+(A23-B23)/(C23-B23)*(0.000955175835-0.00027276656)","=ABS(D23-E23)"],
    [30.75,29.8,31.7,0.0042346619775,"=0.004054775905+(A24-B24)/(C24-B24)*(0.00441454805-0.004054775905)","=ABS(D24-E24)"],
    [38.4,37.9,38.9,0.01134374284125,"=0.00441454805+(A25-B25)/(C25-B25)*(0.0182729376325-0.00441454805)","=ABS(D25-E25)"],
  ].map(row => row.slice(0,4).concat([null,null])), [18,18,18,24,24,20]);
  s.getRange("E22:E25").formulas = [["=0+(A22-B22)/(C22-B22)*(0.00027276656-0)"],["=0.00027276656+(A23-B23)/(C23-B23)*(0.000955175835-0.00027276656)"],["=0.004054775905+(A24-B24)/(C24-B24)*(0.00441454805-0.004054775905)"],["=0.00441454805+(A25-B25)/(C25-B25)*(0.0182729376325-0.00441454805)"]];
  s.getRange("F22:F25").formulas = [["=ABS(D22-E22)"],["=ABS(D23-E23)"],["=ABS(D24-E24)"],["=ABS(D25-E25)"]];
  body(s.getRange("A22:F25")); s.getRange("A22:F25").format.numberFormat = "0.000000000000000";
}

{
  const s = wb.worksheets.getItem("Event_Sensitivity"); setup(s, "Event clustering and sensitivity", "Rows are not iid; the high end is Maria-dependent and remains uncalibrated", "F");
  writeTable(s, 4, ["Event", "Fit rows", "Share", "Leave-one-event-out highest block DR", "Full-fit high block DR", "Interpretation"], sensitivity.map(row => [row.event_id,Number(row.n_runtime_fit_rows),null,Number(row.leave_one_event_out_highest_block_dr),Number(row.full_fit_highest_block_dr),row.interpretation]), [20,16,16,34,28,58]);
  s.getRange("C5:C10").formulas = sensitivity.map((_, i) => [`=B${5+i}/34`]);
  s.getRange("C5:E10").format.numberFormat = "0.000000000000";
  s.getRange("A13:F16").merge(); s.getRange("A13").values = [["No confidence interval is reported. Leave-one-event-out results are sensitivity diagnostics, not uncertainty bounds. The strong Maria dependence, Florence concentration, conflicting endpoint methods, and excluded severe tail block canonical promotion and any frequency/tail use."]];
  s.getRange("A13:F16").format = { fill: C.gold, font: { bold: true, color: C.ink }, wrapText: true, rowHeight: 32 };
}

{
  const s = wb.worksheets.getItem("Failure_Units"); setup(s, "Failure-unit coverage", "One source-specific module atom is conditional; every other unit remains withheld, not zero", "H");
  const rows = artifact.failure_units.map(u => [u.id, human(u.subsystem), human(u.component), human(u.treatment), u.y_axis, u.denominator, u.exposure_grain ?? "future exact unit", (u.withheld_reason_codes ?? []).join("; ")]);
  writeTable(s, 4, ["Failure unit", "Subsystem", "Component / boundary", "Treatment", "Y axis", "Denominator", "Exposure grain", "Withhold reasons"], rows, [48,30,58,24,30,66,48,62]);
}

{
  const s = wb.worksheets.getItem("Value_Crosswalk"); setup(s, "Value and denominator crosswalk", "Module material only; no full TIV, installed-cost benchmark, racking, labor, logistics, electrical, or GSU value", "K");
  const headers = Object.keys(values[0]);
  writeTable(s, 4, headers, values.map(row => headers.map(h => row[h])), headers.map(h => h.includes("notes") || h.includes("guardrail") || h.includes("allocation") ? 62 : h.includes("label") || h.includes("failure") ? 42 : 24));
}

{
  const s = wb.worksheets.getItem("KATs"); setup(s, "Known-answer and fail-closed test inventory", "The Python validator executes every listed formula, rejection, and withheld-unit fixture", "H");
  const formulaRows = kats.formula_known_answer_tests.map(t => [t.test_id,"formula",JSON.stringify(t.input),t.expected.status,t.expected.failure_unit_damage_ratio,t.expected.curve_id,"executed externally"]);
  const rejectRows = kats.rejection_tests.map(t => [t.test_id,"rejection",JSON.stringify(t.mutation ?? {remove_field:t.remove_field}),"rejected","null",t.expected_error_code,"executed externally"]);
  const withheldRows = kats.withheld_unit_tests.map(t => [t.test_id,"withheld_unit",t.failure_unit_id,"withheld","null",t.expected_reason_code,"executed externally"]);
  const rows = [...formulaRows, ...rejectRows, ...withheldRows];
  writeTable(s, 4, ["Test ID", "Class", "Input / mutation", "Expected status", "Expected DR", "Curve / reason", "Execution"], rows, [38,18,96,20,22,54,22]);
  const last = 4 + rows.length;
  s.getRange(`H4:H${last}`).format.columnWidth = 20; s.getRange("H4").values = [["Row complete?"]]; header(s.getRange("H4"));
  s.getRange(`H5:H${last}`).formulas = rows.map((_, i) => [`=IF(AND(A${5+i}<>"",D${5+i}<>"",F${5+i}<>""),"PASS","FAIL")`]); body(s.getRange(`H5:H${last}`));
}

function registrySheet(name, title, subtitle, headers, rows, widths) {
  const s = wb.worksheets.getItem(name); setup(s, title, subtitle, colName(headers.length)); writeTable(s, 4, headers, rows, widths);
}

registrySheet("Source_Register", "Source register", "Every source has a locator plus permitted and prohibited inference", ["Source ID","Citation","URL/path","Locator","Role","Tier","Endpoint","Permitted","Prohibited","Decision","Status","Notes"], sources.map(r => [r.source_id,r.citation,r.url,r.exact_locator,r.source_role,r.evidence_tier,r.measured_or_modeled_endpoint,r.permitted_inference,r.prohibited_inference,r.decision,r.status,r.notes]), [18,66,64,56,30,36,58,62,62,28,22,50]);
registrySheet("Claim_Register", "Claim register", "No load-bearing claim may outrun its source; the strict-gate dissent is retained", ["Claim ID","Claim","Type","Source IDs","Locator","Tier","Rule","Status","Permitted","Prohibited","Reasoning","Update trigger"], claims.map(r => [r.claim_id,r.claim_text,r.claim_type,r.source_ids,r.exact_locator,r.evidence_tier,r.parameter_or_rule,r.adoption_status,r.permitted_inference,r.prohibited_inference,r.reasoning,r.update_trigger]), [18,72,26,32,48,36,42,26,62,62,62,50]);
registrySheet("Parameter_Tiers", "Parameter and rule tiers", "Physical observations are Tier 1; fit and economic conversion remain screening/Tier 3-4", ["Parameter","Pathway","Curve","Value/rule","Role","Tier","Sources","Reasoning","Status","Update trigger"], parameters.map(r => [r.parameter,r.pathway_id,r.curve_id,r.value,r.param_role,r.tier,r.source_ids,r.reasoning,r.status,r.update_trigger]), [42,30,50,56,34,36,32,68,26,52]);

{
  const s = wb.worksheets.getItem("QA"); setup(s, "Workbook QA", "Formula assertions; external validator also executes schemas, evaluator KATs, source derivation, links, and canonical-index checks", "E");
  const lastSource=4+sources.length, lastClaim=4+claims.length, lastParam=4+parameters.length, lastValue=4+values.length, lastUnit=4+artifact.failure_units.length, lastKats=4+kats.formula_known_answer_tests.length+kats.rejection_tests.length+kats.withheld_unit_tests.length;
  const qa = [
    ["Runtime fit site count", "=IF(SUM('Cohort_Fit'!D5:D12)=34,\"PASS\",\"FAIL\")", 34, "Cohort_Fit", "Exact fit cohort"],
    ["Sparse tail audit count", "=IF('Cohort_Fit'!D13=1,\"PASS\",\"FAIL\")", 1, "Cohort_Fit", "Tail not discarded"],
    ["Sufficient-stat deltas zero", "=IF(COUNTIF('Cohort_Fit'!H5:H13,\"<0.000000001\")=9,\"PASS\",\"FAIL\")", 0, "Cohort_Fit", "Mean reproduction"],
    ["Runtime knot count", "=IF(COUNTA('PAVA_Curve'!A5:A17)=13,\"PASS\",\"FAIL\")", 13, "PAVA_Curve", "Exact artifact knots"],
    ["All runtime knots monotone", "=IF(COUNTIF('PAVA_Curve'!F5:F17,\"PASS\")=13,\"PASS\",\"FAIL\")", 13, "PAVA_Curve", "No decreasing x or DR"],
    ["Interpolation deltas zero", "=IF(COUNTIF('PAVA_Curve'!F22:F25,\"<0.000000001\")=4,\"PASS\",\"FAIL\")", 0, "PAVA_Curve", "Representative KATs"],
    ["Event rows sum to fit count", "=IF(SUM('Event_Sensitivity'!B5:B10)=34,\"PASS\",\"FAIL\")", 34, "Event_Sensitivity", "Cluster accounting"],
    ["Source register exact count", `=IF(COUNTA('Source_Register'!A5:A${lastSource})=${sources.length},"PASS","FAIL")`, sources.length, "Source_Register", "All governed sources"],
    ["Claim register exact count", `=IF(COUNTA('Claim_Register'!A5:A${lastClaim})=${claims.length},"PASS","FAIL")`, claims.length, "Claim_Register", "All governed claims"],
    ["Parameter table exact count", `=IF(COUNTA('Parameter_Tiers'!A5:A${lastParam})=${parameters.length},"PASS","FAIL")`, parameters.length, "Parameter_Tiers", "All governed parameters"],
    ["Value crosswalk exact count", `=IF(COUNTA('Value_Crosswalk'!A5:A${lastValue})=${values.length},"PASS","FAIL")`, values.length, "Value_Crosswalk", "No dropped value row"],
    ["Failure unit exact count", `=IF(COUNTA('Failure_Units'!A5:A${lastUnit})=${artifact.failure_units.length},"PASS","FAIL")`, artifact.failure_units.length, "Failure_Units", "Complete unit inventory"],
    ["One primary source atom", `=IF(COUNTIF('Failure_Units'!D5:D${lastUnit},"primary nonzero")=1,"PASS","FAIL")`, 1, "Failure_Units", "Partial coverage only"],
    ["Supported atom present once", `=IF(COUNTIF('Failure_Units'!A5:A${lastUnit},"PV_PERRY_GROUND_FIXED_VISIBLE_MODULE_HARDWARE_SOURCE_UNIT")=1,"PASS","FAIL")`, 1, "Failure_Units", "No genericization"],
    ["KAT rows complete", `=IF(COUNTIF('KATs'!H5:H${lastKats},"PASS")=${lastKats-4},"PASS","FAIL")`, lastKats-4, "KATs", "Every fixture represented"],
    ["Proposal remains noncanonical", "=IF('README'!B12=FALSE,\"PASS\",\"FAIL\")", false, "README", "No runtime cutover"],
    ["Package remains excluded", "=IF('README'!B13=\"not_included\",\"PASS\",\"FAIL\")", "not_included", "README", "No silent release"],
    ["Ceferino conflict source present", `=IF(COUNTIF('Source_Register'!A5:A${lastSource},"TCWS-S022")=1,"PASS","FAIL")`, 1, "Source_Register", "Cross-method challenge retained"],
  ];
  s.getRange("A4:E4").values = [["Check", "Status formula", "Expected", "Scope", "Why it matters"]]; header(s.getRange("A4:E4"));
  s.getRange(`A5:A${4+qa.length}`).values = qa.map(row => [row[0]]);
  s.getRange(`B5:B${4+qa.length}`).formulas = qa.map(row => [row[1]]);
  s.getRange(`C5:E${4+qa.length}`).values = qa.map(row => row.slice(2)); body(s.getRange(`A5:E${4+qa.length}`));
  s.getRange(`B5:B${4+qa.length}`).format = { fill: C.green, font: { bold: true, color: "#198754" } };
  [42,22,22,30,72].forEach((width, i) => s.getRangeByIndexes(0, i, 4+qa.length, 1).format.columnWidth = width);
}

await fs.mkdir(renderDir, { recursive: true });
for (const name of names) {
  const preview = await wb.render({ sheetName: name, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(path.join(renderDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const qaInspect = await wb.inspect({ kind: "table", range: "QA!A1:E22", include: "values,formulas", tableMaxRows: 30, tableMaxCols: 8, maxChars: 12000 });
console.log(qaInspect.ndjson);
const fitInspect = await wb.inspect({ kind: "table", range: "Cohort_Fit!D4:I13", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 10, maxChars: 8000 });
console.log(fitInspect.ndjson);
const interpolationInspect = await wb.inspect({ kind: "table", range: "PAVA_Curve!A21:F25", include: "values,formulas", tableMaxRows: 10, tableMaxCols: 8, maxChars: 5000 });
console.log(interpolationInspect.ndjson);
const errorInspect = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan", maxChars: 5000 });
console.log(errorInspect.ndjson);

const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path.join(outputDir, workbookName));
await out.save(path.join(proposed, workbookName));
for (const sidecar of [path.join(outputDir, `${workbookName}.inspect.ndjson`), path.join(proposed, `${workbookName}.inspect.ndjson`)]) await fs.rm(sidecar, { force: true });
console.log(JSON.stringify({ workbook: path.join(proposed, workbookName), output: path.join(outputDir, workbookName), rendered: renderDir, sheets: names.length, sources: sources.length, claims: claims.length, parameters: parameters.length, valueRows: values.length, statsRows: stats.length, crossMethodMatches: crossMatches.length }));
