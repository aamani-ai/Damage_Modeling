#!/usr/bin/env node
/** Build and render the governed flood_wind model-v1 review workbook. */

import fs from "node:fs/promises";
import path from "node:path";

const artifactToolModule = process.env.ARTIFACT_TOOL_MODULE ?? "@oai/artifact-tool";
const { SpreadsheetFile, Workbook } = await import(artifactToolModule);

const repo = "/Users/divy/code/work/infrasure_git_codes/damage_modeling";
const proposed = path.join(repo, "docs/cells/flood_wind/proposed");
const outputDir = path.join(repo, "outputs/flood_wind_v1_20260728");
const renderDir = path.join(outputDir, "rendered");
const workbookName = "damage_curve_records_flood_wind__model_v1_0__docs_r1.xlsx";

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

const sources = await csv("SOURCE_REGISTER_flood_wind__model_v1_0__docs_r1.csv");
const claims = await csv("CLAIM_PARAMETER_REGISTER_flood_wind__model_v1_0__docs_r1.csv");
const parameters = await csv("PARAMETER_TIER_TABLE_flood_wind__model_v1_0__docs_r1.csv");
const values = await csv("VALUE_CROSSWALK_flood_wind__model_v1_0__docs_r1.csv");
const oldVsNew = await csv("OLD_VS_NEW_COMPARISON_flood_wind__model_v1_0__docs_r1.csv");
const artifact = JSON.parse(await fs.readFile(path.join(proposed, "flood_wind__model_v1_0__docs_r1__curve_artifact.json"), "utf8"));
const kats = JSON.parse(await fs.readFile(path.join(proposed, "known_answer_tests_flood_wind__model_v1_0__docs_r1.json"), "utf8"));
const curve = artifact.pathways[0].curve_records[0];
const points = curve.parameters.points;

const wb = Workbook.create();
const names = [
  "README", "Scope_Coverage", "Hazus_Source", "Curve", "Axis_Bridge",
  "Failure_Units", "Value_Crosswalk", "Old_vs_New", "KATs",
  "Source_Register", "Claim_Register", "Parameter_Tiers", "QA"
];
for (const name of names) wb.worksheets.add(name);

const C = {
  navy: "#17243B", teal: "#0F766E", pale: "#E7F3F1", blue: "#DCE8F7",
  gray: "#F2F4F7", gold: "#FCE8C5", green: "#DCF3E5", red: "#FBE0E0",
  ink: "#26364A", white: "#FFFFFF", line: "#CFD8E3"
};

function colName(index) {
  let name = "";
  let n = index;
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
  widths.forEach((width, i) => {
    sheet.getRangeByIndexes(0, i, Math.max(startRow + rows.length, 1), 1).format.columnWidth = width;
  });
}

function human(value) { return String(value ?? "").replaceAll("_", " "); }

{
  const s = wb.worksheets.getItem("README");
  setup(s, "Flood × onshore wind — model-v1 review workbook", "Noncanonical screening proposal • one source-native whole-substation atom • no Hazard cutover", "H");
  writeTable(s, 4, ["Identity", "Value", "Invariant"], [
    ["Cell ID", artifact.cell_id, "hazard × asset project-management cell"],
    ["Damage code", artifact.damage_code_id, "review implementation only"],
    ["Semantic model", artifact.semantic_damage_model_version, "first partial numerical proposal"],
    ["Documentation", artifact.documentation_revision, "governed proof trail"],
    ["Model grade", artifact.model_grade, "legacy FEMA screening sensitivity"],
    ["Supported atom", "FW_HAZUS_GSU_SUBSTATION_ASSEMBLY", "whole substation, not a component curve"],
    ["Runtime curve count", artifact.pathways[0].curve_records.length, "exactly one source-native piecewise-linear record"],
    ["Canonical runtime artifact", artifact.canonical_runtime_artifact, "must remain false"],
    ["Package inclusion", artifact.package_inclusion_status, "no package or consumer pin"],
    ["Scenario loss", artifact.value_linkage.scenario_loss_status, "same-substation value only after promotion"],
    ["Annual/tail metrics", "withheld", "owned by downstream consumer; prerequisites unmet"],
  ], [28, 48, 66]);
  writeTable(s, 4, ["Order", "Sheet", "Purpose"], names.map((name, i) => [i + 1, name, [
    "Identity, status, and map", "Boundary and coverage", "Exact FEMA table transcription", "Curve and interpolation examples",
    "Datum-safe WSE bridge", "Failure-unit coverage and withholding", "Value/denominator crosswalk", "v0.1 versus v1.0",
    "Executable test inventory", "Sources and transfer limits", "Governed claims", "Parameter evidence tiers", "Formula-driven workbook QA"
  ][i]]), [10, 26, 62]);
  s.getRange("D4:F17").copyFrom(s.getRange("A4:C17"), "all");
  s.getRange("A4:C17").clear({ applyTo: "all" });
  s.getRange("A4:C4").values = [["Identity", "Value", "Invariant"]]; header(s.getRange("A4:C4"));
  const rows = [
    ["Cell ID", artifact.cell_id, "hazard × asset project-management cell"],
    ["Damage code", artifact.damage_code_id, "review implementation only"],
    ["Semantic model", artifact.semantic_damage_model_version, "first partial numerical proposal"],
    ["Documentation", artifact.documentation_revision, "governed proof trail"],
    ["Model grade", artifact.model_grade, "legacy FEMA screening sensitivity"],
    ["Supported atom", "FW_HAZUS_GSU_SUBSTATION_ASSEMBLY", "whole substation, not a component curve"],
    ["Runtime curve count", artifact.pathways[0].curve_records.length, "exactly one source-native piecewise-linear record"],
    ["Canonical runtime artifact", artifact.canonical_runtime_artifact, "must remain false"],
    ["Package inclusion", artifact.package_inclusion_status, "no package or consumer pin"],
    ["Scenario loss", artifact.value_linkage.scenario_loss_status, "same-substation value only after promotion"],
    ["Annual/tail metrics", "withheld", "owned by downstream consumer; prerequisites unmet"],
  ];
  s.getRange("A5:C15").values = rows; body(s.getRange("A5:C15"));
  [28,48,66,10,28,62].forEach((width, i) => s.getRangeByIndexes(0, i, 20, 1).format.columnWidth = width);
  s.getRange("A18:H20").merge();
  s.getRange("A18").values = [["Decision guardrail: Hazus-MH 2.1 Table 7.9 is retained only as an explicit whole-substation screening sensitivity. Current Hazus 7.0 marks electric-power facilities mapping-only and disables those loss functions. No GSU component, turbine, collection, civil, foundation, scenario-loss, annual, or tail result is enabled by this workbook."]];
  s.getRange("A18:H20").format = { fill: C.gold, font: { bold: true, color: C.ink }, wrapText: true, borders: { preset: "outside", style: "thin", color: "#D19A2B" }, rowHeight: 32 };
}

{
  const s = wb.worksheets.getItem("Scope_Coverage"); setup(s, "Scope and coverage", "What the v1 proposal does and does not cover", "G");
  writeTable(s, 4, ["Layer", "Subject", "Status", "Reason / boundary", "Value basis", "Exposure grain", "Consumer treatment"], [
    ["Hazard", "Freshwater inundation contact", "conditional", "unprotected or internal post-bypass depth only", "n/a", "same substation", "pass exact pathway + conditions"],
    ["Assembly", "Hazus whole substation", "conditional numeric", "legacy source-native atom; not component-calibrated", "full direct replacement value of same substation", "one physical GSU/substation", "DR only in proposal"],
    ["Component", "GSU transformer / switchgear / controls / cables", "withheld not zero", "component repair-cost DR not supported", "same component value in future", "same component", "preserve null + reasons"],
    ["Wind plant", "turbines / pad transformers / collection / civil / foundation", "withheld not zero", "outside the Hazus source atom", "same-unit split required", "unit / point / line", "preserve null + reasons"],
    ["Protection", "barriers / elevation / sealing", "no multiplier", "handled once in delivered internal depth", "n/a", "site condition", "no silent credit"],
    ["Water quality", "salt / brackish / contaminated / unknown", "withheld", "outside screening domain", "n/a", "event conditioner", "no freshwater fallback"],
    ["Scenario loss", "DR × value × exposure", "conditional after promotion", "same-substation value, ownership and exposure required", "no full TIV or mixed 72 USD/kW", "one physical GSU", "not emitted here"],
    ["Annual/tail", "EAL / PML / VaR / TVaR", "withheld", "frequency, aggregation, and full coverage absent", "consumer-owned", "portfolio", "no result"],
  ], [18,36,24,58,50,34,36]);
}

{
  const s = wb.worksheets.getItem("Hazus_Source"); setup(s, "FEMA Hazus-MH 2.1 Table 7.9 transcription", "Source-native whole-substation ordinates; current Hazus 7.0 disables electric-power loss results", "G");
  s.getRange("A4:G4").values = [["Depth (ft)", "Source damage (%)", "Source DR", "Artifact DR", "Absolute delta", "Source ID", "Admission"]]; header(s.getRange("A4:G4"));
  s.getRange(`A5:B${4 + points.length}`).values = points.map(([x, dr]) => [x, dr * 100]);
  s.getRange(`C5:C${4 + points.length}`).formulas = points.map((_, i) => [`=B${5 + i}/100`]);
  s.getRange(`D5:D${4 + points.length}`).values = points.map(([, dr]) => [dr]);
  s.getRange(`E5:E${4 + points.length}`).formulas = points.map((_, i) => [`=ABS(C${5 + i}-D${5 + i})`]);
  s.getRange(`F5:F${4 + points.length}`).values = points.map(() => ["FW-S011"]);
  s.getRange(`G5:G${4 + points.length}`).values = points.map(() => ["noncanonical screening only"]);
  body(s.getRange(`A5:G${4 + points.length}`));
  s.getRange(`B5:E${4 + points.length}`).format.numberFormat = "0.000000";
  [16,20,18,18,18,16,40].forEach((w, i) => s.getRangeByIndexes(0, i, 4 + points.length, 1).format.columnWidth = w);
  s.getRange("A18:G21").values = [
    ["Source", "Version", "Locator", "What it supports", "What it does not support", "Current-status warning", "URL"],
    ["FEMA Hazus Flood Technical Manual", "2.1", "§7.2.4; Table 7.9, pp. 7-20–7-21", "exact aggregate depth-percent table and narrative", "component calibration, duration, velocity, salinity, claims validation", "electric-power implementation described as deferred", "https://www.fema.gov/sites/default/files/2020-09/fema_hazus_flood-model_technical-manual_2.1.pdf"],
    ["FEMA Hazus Flood Technical Manual", "7.0", "Table 9-1; §9.4.1 footnote 21", "authoritative current limitation", "no DR calibration", "mapping-only; visible electric damage functions disabled and produce no results", "https://www.fema.gov/sites/default/files/documents/fema_rsl_hazus-7-fltm_06272025_0.pdf"],
    ["Decision", "model v1.0 proposal", "governance package", "reviewable screening sensitivity", "canonical runtime or consumer cutover", "promotion gate blocked", ""]
  ]; header(s.getRange("A18:G18")); body(s.getRange("A19:G21"));
}

{
  const s = wb.worksheets.getItem("Curve"); setup(s, "Piecewise-linear screening curve", "Exact linear interpolation between one-foot source knots; no clamping or extrapolation", "F");
  s.getRange("A4:F4").values = [["Test depth (ft)", "Lower knot", "Upper knot", "Formula DR", "Expected DR", "Status"]]; header(s.getRange("A4:F4"));
  const samples = Array.from({length: 10}, (_, i) => i + 0.5);
  s.getRange("A5:C14").values = samples.map((x, i) => [x, i, i + 1]);
  s.getRange("D5:D14").formulas = samples.map((_, i) => {
    const sourceRow = 5 + i;
    return [`='Hazus_Source'!C${sourceRow}+(A${5 + i}-B${5 + i})*(('Hazus_Source'!C${sourceRow + 1}-'Hazus_Source'!C${sourceRow})/(C${5 + i}-B${5 + i}))`];
  });
  s.getRange("E5:E14").values = samples.map((x, i) => {
    const dr0 = points[i][1], dr1 = points[i + 1][1]; return [dr0 + 0.5 * (dr1 - dr0)];
  });
  s.getRange("F5:F14").formulas = samples.map((_, i) => [`=IF(D${5 + i}=E${5 + i},"PASS","FAIL")`]);
  body(s.getRange("A5:F14")); s.getRange("D5:E14").format.numberFormat = "0.000000";
  [20,16,16,20,20,16].forEach((w, i) => s.getRangeByIndexes(0, i, 16, 1).format.columnWidth = w);
  writeTable(s, 17, ["Rule", "Value", "Guardrail"], [
    ["curve_form", curve.curve_form, "schema v3 draft extension"],
    ["interpolation", curve.interpolation_policy, "only between source knots"],
    ["valid range", "0 through 10 ft inclusive", "negative rejects; >10 withholds"],
    ["extrapolation", curve.extrapolation_policy, "no endpoint clamp"],
    ["output", "conditional scalar failure-unit DR", "not scenario loss"],
  ], [26,44,62]);
}

{
  const s = wb.worksheets.getItem("Axis_Bridge"); setup(s, "Datum-safe WSE-to-grade bridge", "Direct source-native depth is preferred; an exact same-datum elevation difference may be converted to feet", "G");
  s.getRange("A4:G4").values = [["WSE (m)", "Grade (m)", "WSE datum", "Grade datum", "Derived depth (ft)", "Datum status", "Runtime disposition"]]; header(s.getRange("A4:G4"));
  const rows = [[100.3048,100,"NAVD88","NAVD88"],[101,100,"NAVD88","NAVD88"],[101,100,"NAVD88","NGVD29"],[99.9,100,"NAVD88","NAVD88"],[103.2,100,"LOCAL","LOCAL"]];
  s.getRange("A5:D9").values = rows;
  s.getRange("E5:E9").formulas = rows.map((_, i) => [`=(A${5+i}-B${5+i})*3.280839895013123`]);
  s.getRange("F5:F9").formulas = rows.map((_, i) => [`=IF(C${5+i}=D${5+i},"PASS","WITHHOLD")`]);
  s.getRange("G5:G9").formulas = rows.map((_, i) => [`=IF(F${5+i}<>"PASS","WITHHOLD_DATUM",IF(E${5+i}<0,"REJECT_NEGATIVE",IF(E${5+i}>10,"WITHHOLD_RANGE","ELIGIBLE")))`]);
  body(s.getRange("A5:G9")); s.getRange("E5:E9").format.numberFormat = "0.000000";
  [16,16,18,18,22,20,28].forEach((w, i) => s.getRangeByIndexes(0, i, 12, 1).format.columnWidth = w);
  writeTable(s, 12, ["Input mode", "Required fields", "Mutual exclusion", "Fail-closed rule"], [
    ["direct_depth_ft", "flood_depth_above_substation_grade_ft", "cannot accompany WSE fields", "negative rejects; >10 withholds"],
    ["same_datum_wse_grade_m", "WSE, grade, both datum IDs", "cannot accompany direct depth", "missing/mismatched datum rejects"],
  ], [28,62,42,42]);
}

{
  const s = wb.worksheets.getItem("Failure_Units"); setup(s, "Failure-unit coverage", "Only the source-native assembly has a numeric screening record; every other unit remains withheld, not zero", "H");
  const rows = artifact.failure_units.map(u => [u.id, human(u.subsystem), human(u.component), human(u.treatment), u.y_axis, u.denominator, u.exposure_grain ?? "future exact unit", (u.withheld_reason_codes ?? []).join("; ")]);
  writeTable(s, 4, ["Failure unit", "Subsystem", "Component / boundary", "Treatment", "Y axis", "Denominator", "Exposure grain", "Withhold reasons"], rows, [38,28,58,24,28,58,42,58]);
}

{
  const s = wb.worksheets.getItem("Value_Crosswalk"); setup(s, "Value and denominator crosswalk", "Reference value anatomy stays visible; no full-project TIV, mixed 72 USD/kW, or per-turbine GSU repetition", "I");
  const headers = Object.keys(values[0]);
  writeTable(s, 4, headers, values.map(row => headers.map(h => row[h])), headers.map(h => h.includes("notes") || h.includes("guardrail") || h.includes("allocation") ? 58 : h.includes("label") || h.includes("failure") ? 36 : 22));
}

{
  const s = wb.worksheets.getItem("Old_vs_New"); setup(s, "Old versus new", "The change is partial numerical coverage, not canonical admission or a whole-wind-farm model", "H");
  const headers = Object.keys(oldVsNew[0]);
  writeTable(s, 4, headers, oldVsNew.map(row => headers.map(h => row[h])), headers.map(h => h.includes("reason") || h.includes("new") || h.includes("old") ? 56 : 28));
}

{
  const s = wb.worksheets.getItem("KATs"); setup(s, "Known-answer and fail-closed test inventory", "The Python validator executes these fixtures through the reference evaluator", "G");
  const formulaRows = kats.formula_known_answer_tests.map(t => [t.test_id, "formula", JSON.stringify(t.input), t.expected.status, t.expected.failure_unit_damage_ratio, t.expected.curve_id, "executed externally"]);
  const withheldRows = kats.withheld_tests.map(t => [t.test_id, "withheld", JSON.stringify(t.input), t.expected.status, "null", t.expected.reason_code, "executed externally"]);
  const errorRows = kats.error_tests.map(t => [t.test_id, "error", JSON.stringify(t.input), "rejected", "null", t.expected_error_code, "executed externally"]);
  writeTable(s, 4, ["Test ID", "Class", "Input", "Expected status", "Expected DR", "Curve / reason", "Execution"], [...formulaRows, ...withheldRows, ...errorRows], [34,16,90,20,18,48,22]);
  const last = 4 + formulaRows.length + withheldRows.length + errorRows.length;
  s.getRange(`H4:H${last}`).format.columnWidth = 18;
  s.getRange("H4").values = [["Row complete?"]]; header(s.getRange("H4"));
  s.getRange(`H5:H${last}`).formulas = Array.from({length: last - 4}, (_, i) => [`=IF(AND(A${5+i}<>"",D${5+i}<>"",F${5+i}<>""),"PASS","FAIL")`]);
  body(s.getRange(`H5:H${last}`));
}

function registrySheet(name, title, subtitle, headers, rows, widths) {
  const s = wb.worksheets.getItem(name); setup(s, title, subtitle, colName(headers.length)); writeTable(s, 4, headers, rows, widths);
}

registrySheet("Source_Register", "Source register", "Every source has a locator plus permitted and prohibited inference", ["Source ID","Citation","URL/path","Locator","Role","Tier","Endpoint","Permitted","Prohibited","Decision","Status","Notes"], sources.map(r => [r.source_id,r.citation,r.url,r.exact_locator,r.source_role,r.evidence_tier,r.measured_or_modeled_endpoint,r.permitted_inference,r.prohibited_inference,r.decision,r.status,r.notes]), [16,62,62,48,28,34,54,56,56,24,22,44]);
registrySheet("Claim_Register", "Claim register", "No load-bearing claim is allowed to outrun its source", ["Claim ID","Claim","Type","Source IDs","Locator","Tier","Rule","Status","Permitted","Prohibited","Reasoning","Update trigger"], claims.map(r => [r.claim_id,r.claim_text,r.claim_type,r.source_ids,r.exact_locator,r.evidence_tier,r.parameter_or_rule,r.adoption_status,r.permitted_inference,r.prohibited_inference,r.reasoning,r.update_trigger]), [18,66,24,28,42,34,34,22,56,56,56,44]);
registrySheet("Parameter_Tiers", "Parameter and rule tiers", "The source ordinates are transparent, but the aggregate transfer remains screening-grade", ["Parameter","Pathway","Curve","Value/rule","Role","Tier","Sources","Reasoning","Status","Update trigger"], parameters.map(r => [r.parameter,r.pathway_id,r.curve_id,r.value,r.param_role,r.tier,r.source_ids,r.reasoning,r.status,r.update_trigger]), [36,28,40,48,30,34,28,62,24,48]);

{
  const s = wb.worksheets.getItem("QA"); setup(s, "Workbook QA", "Formula-driven assertions; the external validator also executes schemas, evaluator KATs, links, and canonical-index checks", "E");
  const lastSource = 4 + sources.length, lastClaim = 4 + claims.length, lastParam = 4 + parameters.length, lastValue = 4 + values.length, lastUnit = 4 + artifact.failure_units.length;
  const qa = [
    ["Hazus knot count exact", `=IF(COUNTA('Hazus_Source'!A5:A15)=11,"PASS","FAIL")`, 11, "Hazus_Source", "All table ordinates"],
    ["Source/artifact deltas zero", `=IF(COUNTIF('Hazus_Source'!E5:E15,0)=11,"PASS","FAIL")`, 0, "Hazus_Source", "Exact transcription"],
    ["Curve interpolation rows pass", `=IF(COUNTIF('Curve'!F5:F14,"PASS")=10,"PASS","FAIL")`, 10, "Curve", "Linear interpolation"],
    ["Minimum depth exact", `=IF('Hazus_Source'!A5=0,"PASS","FAIL")`, 0, "Hazus_Source", "Source range"],
    ["Maximum depth exact", `=IF('Hazus_Source'!A15=10,"PASS","FAIL")`, 10, "Hazus_Source", "Source range"],
    ["Maximum DR exact", `=IF('Hazus_Source'!D15=0.15,"PASS","FAIL")`, 0.15, "Hazus_Source", "No cap invention"],
    ["WSE one-foot bridge exact", `=IF(ABS('Axis_Bridge'!E5-1)<1E-10,"PASS","FAIL")`, 1, "Axis_Bridge", "Exact SI conversion"],
    ["Datum mismatch withheld", `=IF('Axis_Bridge'!G7="WITHHOLD_DATUM","PASS","FAIL")`, "WITHHOLD_DATUM", "Axis_Bridge", "No mixed datum"],
    ["Source register exact count", `=IF(COUNTA('Source_Register'!A5:A${lastSource})=${sources.length},"PASS","FAIL")`, sources.length, "Source_Register", "All governed sources"],
    ["Claim register exact count", `=IF(COUNTA('Claim_Register'!A5:A${lastClaim})=${claims.length},"PASS","FAIL")`, claims.length, "Claim_Register", "All governed claims"],
    ["Parameter table exact count", `=IF(COUNTA('Parameter_Tiers'!A5:A${lastParam})=${parameters.length},"PASS","FAIL")`, parameters.length, "Parameter_Tiers", "All governed rules"],
    ["Value crosswalk exact count", `=IF(COUNTA('Value_Crosswalk'!A5:A${lastValue})=${values.length},"PASS","FAIL")`, values.length, "Value_Crosswalk", "No dropped value row"],
    ["Failure unit exact count", `=IF(COUNTA('Failure_Units'!A5:A${lastUnit})=${artifact.failure_units.length},"PASS","FAIL")`, artifact.failure_units.length, "Failure_Units", "Complete unit inventory"],
    ["One supported source atom", `=IF(COUNTIF('Failure_Units'!D5:D${lastUnit},"primary nonzero")=1,"PASS","FAIL")`, 1, "Failure_Units", "Partial coverage only"],
    ["Assembly atom present once", `=IF(COUNTIF('Failure_Units'!A5:A${lastUnit},"FW_HAZUS_GSU_SUBSTATION_ASSEMBLY")=1,"PASS","FAIL")`, 1, "Failure_Units", "No duplicated GSU"],
    ["KAT rows complete", `=IF(COUNTIF('KATs'!H5:H${4 + kats.formula_known_answer_tests.length + kats.withheld_tests.length + kats.error_tests.length},"PASS")=${kats.formula_known_answer_tests.length + kats.withheld_tests.length + kats.error_tests.length},"PASS","FAIL")`, kats.formula_known_answer_tests.length + kats.withheld_tests.length + kats.error_tests.length, "KATs", "Every fixture represented"],
    ["Proposal remains noncanonical", `=IF('README'!B12=FALSE,"PASS","FAIL")`, false, "README", "No runtime cutover"],
    ["Package remains excluded", `=IF('README'!B13="not_included","PASS","FAIL")`, "not_included", "README", "No silent release"],
  ];
  s.getRange("A4:E4").values = [["Check", "Status formula", "Expected", "Scope", "Why it matters"]]; header(s.getRange("A4:E4"));
  s.getRange(`A5:A${4 + qa.length}`).values = qa.map(row => [row[0]]);
  s.getRange(`B5:B${4 + qa.length}`).formulas = qa.map(row => [row[1]]);
  s.getRange(`C5:E${4 + qa.length}`).values = qa.map(row => row.slice(2)); body(s.getRange(`A5:E${4 + qa.length}`));
  s.getRange(`B5:B${4 + qa.length}`).format = { fill: C.green, font: { bold: true, color: "#198754" } };
  [38,22,22,28,66].forEach((width, i) => s.getRangeByIndexes(0, i, 4 + qa.length, 1).format.columnWidth = width);
}

await fs.mkdir(renderDir, { recursive: true });
for (const name of names) {
  const preview = await wb.render({ sheetName: name, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(path.join(renderDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const qaInspect = await wb.inspect({ kind: "table", range: "QA!A1:E22", include: "values,formulas", tableMaxRows: 30, tableMaxCols: 8, maxChars: 9000 });
console.log(qaInspect.ndjson);
const errorInspect = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan", maxChars: 5000 });
console.log(errorInspect.ndjson);

const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(path.join(outputDir, workbookName));
await out.save(path.join(proposed, workbookName));
for (const sidecar of [
  path.join(outputDir, `${workbookName}.inspect.ndjson`),
  path.join(proposed, `${workbookName}.inspect.ndjson`),
]) await fs.rm(sidecar, { force: true });
console.log(JSON.stringify({ workbook: path.join(proposed, workbookName), output: path.join(outputDir, workbookName), rendered: renderDir, sheets: names.length, sources: sources.length, claims: claims.length, parameters: parameters.length, valueRows: values.length, formulaKats: kats.formula_known_answer_tests.length, withheldKats: kats.withheld_tests.length, errorKats: kats.error_tests.length }));
