// Types for the build's JSON (scripts/dashboard/dashboard_build). Loose where the UI only forwards a value.

export type Status = "live" | "proposal" | "reused" | "gap";
export type StationState = "artifact" | "prose" | "absent" | "not_applicable" | "not_yet_detected";

export interface Sentence { mark: string; page: string }
export interface Slug { slug: string; label: string; catalogue?: string | null; href?: string }
export interface Hazard extends Slug { twin: string[]; outside_the_five: boolean; effect: "damage" | "performance"; effect_note?: string }

export interface Identity {
  kind: "cell" | "binding" | "gap";
  damage_code_id: string | null;
  binding_id?: string | null;
  model: string | null;
  docs: string | null;
  version_key: string | null;
  sha256: string | null;
  schema?: string;
  consumer_pin?: string | null;
  source_cell_id?: string | null;
}

export interface Review {
  entry_read_on: string | null;
  entry_read_by: string | null;
  entry_read_kind: "agent" | "person";
  release_review: string | null;
  release_review_code: string | null;
  review: { by: string | null; on: string | null; verdict: string | null } | null;
  tone: "ok" | "neutral" | "warn";
  label: string;
}

export interface Rail {
  exists: { status: Status; mark: string; label: string; qualifier: string | null };
  evidence: { shape: string; cost: string; occurrence: { mark: string; label: string } };
  review: Review;
}

export interface Tile {
  entry_id: string; kind: string; status: Status; title: string; asset: Slug; hazard: Slug;
  exists: Rail["exists"]; partial: boolean; tiers: Rail["evidence"]; occurrence: { mark: string; label: string };
  review: Review; identity: Identity; summary: string; no_evaluator: boolean; share_covered: number | null;
  n_curves: number; n_drawn: number; outside_checks: number; chain_core_as_files: number; generation: string;
  aria_label: string; href: string;
  /** G16: the one word a tile carries (the weaker half's), and both halves in words for its tooltip */
  word: string | null; halves: string | null;
}

export interface BuildCheck { id: string; name: string; ok: boolean; severity: "hard" | "data"; summary: string }

export interface Manifest {
  commit: string; commit_full: string;
  counts: Record<string, number>; summary: string;
  assets: (Slug & { n_entries: number })[]; hazards: Hazard[]; entries: Tile[];
  codes: Record<string, { entry_id: string; version_key: string | null; status: Status; sha256: string | null; model: string | null; docs: string | null }[]>;
  sentences: Record<string, Sentence>;
  marks: { exists: Record<Status, string>; partial: string; no_curve: string; left_out: string; twin_levels: Record<string, string> };
  tiers: Record<string, string>;
  stations: { id: string; label: string; gate: string }[];
  lenses: string[];
  repo: { url: string; blob: string };
  build_checks: BuildCheck[];
  all_checks_pass: boolean;
}

export interface FileRef { path: string; sha256: string | null; note?: string; pinned_sha256?: string; pin_ok?: boolean }
export interface Station {
  id: string; label: string; full_label?: string; gate: string; state: StationState; files: FileRef[];
  evidence: { kind: string; file: FileRef; matched: string[] }[]; fact: string; absent_sentence: string | null;
}
export interface GateItem { item: string; status: "proven" | "human" | "n/a"; basis: string | null }
export interface Chain {
  stations: Station[]; generation: string; core_as_files: number; core_total: number;
  dossier: FileRef | null; basics?: FileRef | null; workbook: FileRef | null; gates: { gate: string; label: string; items: GateItem[] }[];
}

export interface ValueBlock {
  covered_usd: number | null; total_usd: number | null; share_covered: number | null; covered_label: string;
  covered: { label: string; value_usd: number | null; curve_id?: string; share?: number }[];
  no_curve: { label: string; value_usd: number | null; sentence: string }[];
  left_out: { part: string; reason: string; decision: string }[]; source: string; basis: string;
}

export interface Part {
  part: string; curves: string[]; failure_units: string[]; subsystems: string[]; bucket: string | null; variants: string | null;
  shape: string; shape_basis: string; cost: string; cost_basis: string; notes: { type: string; text: string }[];
  occurrence: { mark: string; state: string; sentence: string } | null; drawn: boolean;
}

export interface OccurrenceBucket {
  bucket: string; label?: string; state: string; mark: string; sentence: string; reports: Record<string, unknown>[];
  twin_lead: { level: string | null; nodes: { node: string; name: string; level: number; why: string }[] } | null;
}

export interface Cell {
  entry_id: string; kind: string; status: Status; title: string; asset: Slug; hazard: Slug; identity: Identity;
  pins: { what: string; file: string | null; expected: string | null; actual: string | null; ok: boolean }[];
  rail: Rail; summary: string; chain: Chain; no_evaluator: boolean; no_evaluator_sentence: string | null;
  answer: {
    axis_groups: { axis: Axis; curve_ids: string[] }[]; curve_ids: string[]; input: string | null;
    how_to_use: { share_of?: string; outputs?: Record<string, string>; conditions?: string[] } | null;
    value: ValueBlock | null; not_covered: string[];
    withheld_units: { failure_unit_id: string; subsystem: string; reasons: string[]; sentence: string }[];
    hazard_axis: unknown;
  };
  parts: Part[];
  evidence: {
    lineage: string | null; prose_sentence: string | null; paths: Record<string, string | null> | null;
    n_sources: number; n_claims: number; n_parameters: number; key_sources: string[]; sources_from: string | null;
    judgment: string[]; weakest_tier: string; pressure_test: FileRef | null;
    method: { type: string; summary: string } | null;
  };
  audit: { table: { source: string; columns: string[]; rows: string[][]; kind: string } | null; state: StationState; absent_sentence: string | null; site_adapter: FileRef | null };
  proof: {
    known_answers: { declared: number; run: number; reproduced: number; not_run: { kind: string; n: number; reason: string }[]; failed: unknown[]; negative_run: number; tolerance: number | null; tolerance_usd?: number | null; source: string | null; kinds: Record<string, number> };
    validation: { path: string; status: string | null; date: string | null; classification?: string | null; review_scope?: string | null } | null;
    outside_checks: { kind: string; name: string; link: string | null; hazard?: { state: string; words: string | null; path: string; moved_to?: string } }[];
    capability: Record<string, unknown> & { limitation_flags: string[] };
  } | null;
  seams: { open_items: string[]; missing_mechanisms: string[]; out_of_scope: string[]; next_version: string | null; update_triggers: { parameter: string; tier: string | null; update_trigger: string }[] };
  field_review: { register: { path: string; sha256: string; search_log: string | null; last_searched: string | null } | null; buckets: OccurrenceBucket[]; review: Review; absent_sentence: string | null };
  files: Record<string, string | null>; folder_files: FileRef[]; gap_reason: string | null;
  binding: { source_cell_id: string | null; source_entry_id: string | null; reused_curves: string[]; transfer_rationale: string | null; transfer_tier: string | null; status: string | null; limitations: unknown } | null;
  sampling_notes: string[];
  build_findings: { check: string; severity: string; items: unknown[]; sentence: string }[];
}

// `dodge`: exact states whose records share a class are drawn side by side inside the class (display only; the value is the record's).
// `note`: one sentence the build writes about how this axis is drawn, shown once under its plot.
export interface Axis { id: string; label: string; unit: string | null; input_field?: string | null; kind: "continuous" | "categorical"; valid_range?: (number | null)[] | null; classes?: Record<string, string>; bridge?: Record<string, unknown>; dodge?: boolean; note?: string }
// The build's style hints, where it writes them: colour = a palette slot or ink, line style and mark = slots; else a series takes its
// order. `end_label`: the words at the line's right end ("" = none, the legend names it); `legend_row`/`legend_col`: its cell in a grid legend;
// `dodge_group`: on a dodged class axis, a gap separates one group's marks from the next (e.g. the enclosure records from the PCS).
export interface Series { label: string; kind: "line" | "step" | "categorical"; points: [number, number][]; variant?: string; scenario?: string; beyond_last_knot_from?: number | null; continuation?: boolean; color_slot?: number; ink?: boolean; dash_slot?: number; symbol_slot?: number; end_label?: string; legend_row?: string; legend_col?: string; dodge_group?: string }
// `n`: cases that land on this same point (one ○ for them all); `series`: the label of the series it sits on.
export interface KnownAnswer { x: number; y: number; test: string; cost_usd?: number; n?: number; series?: string }

export interface Curve {
  curve_id: string; entry_id: string; damage_code_id: string | null; version_key: string | null; artifact_sha256: string | null;
  failure_unit_id: string | null; subsystem: string | null; component: string | null; treatment: string | null; part: string | null;
  pathway_id: string | null; curve_form: string | null; form_label?: string | null; x_axis_id: string | null; y_axis: string | null;
  parameters: Record<string, unknown> | null; record_extra: Record<string, unknown>;
  axis: Axis; domain: (number | null)[] | null; withheld_zones: { from: number; to: number | null; reason: string }[];
  knots: [number, number][]; series: Series[]; envelope: { lower: [number, number][]; upper: [number, number][]; label: string } | null;
  scenario_note: string | null; known_answers: KnownAnswer[]; source_points: [number, number][]; drawn: boolean; no_evaluator_sentence: string | null;
  evaluator: { module: string; function: string; note: string | null } | null;
  tiers: { shape: string | null; shape_basis: string | null; cost: string | null; cost_basis: string | null };
  row_notes: { type: string; text: string }[]; variants: string | null; notes: string[];
  selected_by: { by: string; when: string[] }[];
  title: string; asset: Slug; hazard: Slug; status: Status; rail: Rail;
  parameters_rows: { id: string; name: string; value: unknown; tier: string | null; source_ids: string[]; claim_ids: string[]; curve_id: string | null; role: string | null; status: string | null; reasoning: string | null; update_trigger: string | null }[];
  sources_for_curve: string[]; occurrence: (OccurrenceBucket & { bucket: string | null }) | null; review: Review; summary: string;
  versions: Record<string, unknown>[]; data_path: string;
}

export interface AssetCell {
  twin_lead: string | null; twin_nodes: { node: string; name: string; level: number; why: string }[];
  curve: { mark: string; state: string; label?: string; partial?: boolean; shape?: string; cost?: string; curves?: string[]; drawn?: boolean; sentence?: string } | null;
  entry_id: string | null; occurrence: (OccurrenceBucket & { bucket: string }) | null; effect: "damage" | "performance"; outside_the_five: boolean;
}
export interface AssetRow { key: string; label: string; value_usd: number | null; share: number | null; twin_targets: string[]; subsystems: string[]; cells: Record<string, AssetCell> }
export interface AssetView {
  asset: Slug; summary: string; reference: { label: string; source: string; total_usd: number } | null;
  hazards: (Hazard & { entry_id: string | null; status: Status | null; cell_title: string | null; occurrence_href: string | null; has_register: boolean })[];
  rows: AssetRow[]; entries: Tile[]; has_buckets: boolean; twin_crosswalk: { sha256: string | null; rows: number | null } | null;
}

export interface OccurrencePage {
  asset: Slug; hazard: Hazard; title: string; register: { path: string; sha256: string }; question: string | null; effect: string;
  search_log: string | null; last_searched: string | null; rule: string | null; summary: string;
  surfaces: { id: string; name: string; can_see_hazard: boolean | string; public: boolean | string; note: string; searched: string | null; queries: string[]; hits: number | null }[];
  buckets: (OccurrenceBucket & { key: string; label: string; value_usd: number | null })[];
  left_out: unknown[]; provenance: Record<string, unknown> | null;
  entry: { entry_id: string; status: Status; title: string; rail: Rail } | null; state_overall: string; suggested_next: string | null;
}

export interface Citations { cells: Record<string, { entry_id: string; lineage: string; sources: Source[]; claims: Claim[]; parameters: Parameter[]; edges: { from: string; to: string; kind: string }[]; unresolved_source_ids: string[]; prose_sentence: string | null; paths: Record<string, string | null> }> }
export interface Source { id: string; citation: string; url: string | null; locator: string | null; role: string | null; tier: string | null; permitted: string | null; prohibited: string | null; decision: string | null; accessed_on: string | null }
export interface Claim { id: string; text: string; type: string | null; source_ids: string[]; locator: string | null; tier: string | null; parameter_or_rule: string | null; status: string | null; update_trigger: string | null }
export interface Parameter { id: string; name: string; value: unknown; tier: string | null; source_ids: string[]; claim_ids: string[]; curve_id: string | null; pathway_id: string | null; role: string | null; status: string | null; reasoning: string | null; update_trigger: string | null }

// ─── iteration 2: the plain layer (DCD-D19), written by the build ────────────────────────────────────────────

export interface SourceLink { title?: string | null; link?: string | null; link_kind?: string; locator?: string | null; no_link_sentence?: string | null; doi?: string | null }
export type SourceRow = Source & Omit<SourceLink, "locator"> & {
  provenance?: string; kind?: string | null; aliases?: string[]; from?: { file?: string; sheet?: string; section?: string }; repo_path?: string; source_type?: string | null;
};
export interface KeyReference extends SourceLink { text: string; ids: string[]; source_id: string | null }
export interface Capability { key: string; mark: "✓" | "◐" | "✗"; label: string; short: string; detail: string }
export interface PlainStation { id: string; name: string; meaning: string; paragraph: string; plain_fact: string }
export interface PlainChip { words: string; code: string; tiers?: string[] }
export interface ParameterPlain {
  id: string; name: string; value_text: string; tier: string | null; tier_word: string;
  sources: { id: string; title: string; link: string | null; link_kind: string; resolved: boolean }[];
  claim_ids: string[]; curve_id: string | null; reasoning: string | null; update_trigger: string | null; role: string | null;
}
export interface ExtractionInfo {
  status: string | null; sentence: string | null; dossier: string | null; workbook: string | null; sheets_read: string[] | null; dossier_sections: string[] | null;
  files: FileRef[] | null; assumptions: { id: string; text: string; status: string; confidence: string; trigger: string; effect: string; from: { file: string; sheet: string } }[] | null;
  open_seams: { id: string; name: string; description: string; severity: string; status: string; resolution: string; from: { file: string; sheet: string } }[] | null;
  matched: Record<string, string> | null; unmatched: string[] | null;
}
export interface Step { id: string; name: string; meaning: string; fact: string; paragraphs: string[]; holds: string[]; written: boolean }
export interface HazardPath { id: string | null; title: string | null; path: string; state: "moved" | "on_branch"; moved_to?: string; link: string | null; words: string }
export interface Plain {
  rail: { exists: PlainChip; evidence: PlainChip; occurrence: PlainChip; review: PlainChip };
  main_logic: string[]; steps: Step[]; for_hazard: string[]; word: string | null; halves: string | null; hazard_paths: HazardPath[];
  capabilities: Capability[];
  blocks: {
    covered: { value: ValueBlock | null; not_covered: string[]; withheld: Cell["answer"]["withheld_units"] };
    assumed: string[]; missing: { mechanisms: string[]; out_of_scope: string[] }; open_questions: string[]; next_version: string | null;
  };
  stations: PlainStation[];
  key_references: KeyReference[];
  sources: SourceRow[]; claims: (Claim & { provenance?: string; strength?: string | null; how_used?: string | null; source_name?: string | null; numeric?: string | null; from?: { file?: string; sheet?: string; section?: string } })[];
  parameters: Parameter[]; parameters_plain: ParameterPlain[];
  evidence_provenance: { kind: "register" | "extracted" | "not_yet_extracted"; sheets: string[]; sections: string[]; unmatched: string[]; sentence: string | null; dossier: string | null; workbook: string | null };
  link_counts: { total: number; linked: number; locator_only: number; neither: number; markers: number; placeholders: number };
  extraction: ExtractionInfo | null;
  tier_words: { shape: string; cost: string };
}
export interface Caption {
  what_it_says: string;
  how_sure: { shape: { tier: string | null; word: string; basis: string | null }; cost: { tier: string | null; word: string; basis: string | null }; parameters: string; weakest: string | null; word: string };
  seen_in_field: { sentence: string; state: string; href: string | null; words: string };
  main_references: KeyReference[]; references_from: string;
}
export type CellV2 = Cell & { plain: Plain };
export type CurveV2 = Curve & { caption: Caption; sources_resolved: SourceRow[]; plain_tiers: { shape: string; cost: string }; rail_plain: Plain["rail"] };

export interface AssetCellV2 {
  entry_id: string | null; effect: "damage" | "performance"; outside_the_five: boolean;
  twin_lead: string | null; twin_nodes: { node: string; name: string; level: number; why: string }[];
  occurrence: (OccurrenceBucket & { bucket: string }) | null;
  state: string | null; words: string; mark: string; parts: string[]; tier_span: string | null; share: number | null; dollars: number | null;
  spans?: string[]; drawn?: boolean; sentence?: string; no_curve_text?: string;
}
export interface AssetRowV2 { key: string; label: string; value_usd: number | null; share: number | null; twin_targets: string[]; subsystems: string[]; cells: Record<string, AssetCellV2> }
export interface PartOfCell {
  failure_unit_id: string | null; subsystem: string | null; component: string | null; treatment: string; part: string; state: string; rows: string[]; spans: boolean;
  share: number | null; share_basis: string | null; dollars: number | null; shape: string | null; cost: string | null; curves: string[]; drawn: boolean; withheld_reasons: string[];
  whole_building?: boolean; whole_station?: boolean; modeled_row_ids?: string[];
}
export interface PartsByCell { entry_id: string; hazard: Slug; status: Status; title: string; parts: PartOfCell[]; share_basis: string | null; n_named: number; n_curve: number; n_withheld: number; not_covered: string[] }
export interface Split {
  differs: boolean; sentence: string; details: string[];
  columns: { entry_id: string; hazard: Slug; n_named: number; n_curve: number; n_withheld: number; share_basis: string | null; title: string }[];
  table: { key: string; label: string; by_cell: Record<string, string[]> }[];
}
export interface TwinBlock { available: boolean; sentence: string; sha256: string | null; rows: number | null; nodes: Record<string, { node: string; name: string; disposition: string; why: string }[]>; leads?: boolean }
export interface AssetViewV2 extends Omit<AssetView, "rows"> {
  rows: AssetRowV2[]; parts_by_cell: Record<string, PartsByCell>; split: Split; twin: TwinBlock; summary_v0: string;
  reference: (AssetView["reference"] & { note?: string; link?: string | null }) | null;
  value_source: { label: string; path: string; sha256?: string | null; pin_ok?: boolean | null } | null;
}
export interface ReviewQueueItem { kind: string; entry_id: string; text: string; href: string; words: string }
export type ManifestV2 = Manifest & {
  tier_words: Record<string, string>; tier_plain: Record<string, string>; tier_meaning: Record<string, string>;
  stations: { id: string; label: string; gate: string; name: string; meaning: string }[];
  no_link_words: string; not_yet_extracted_sentence: string;
  review_queue: { items: ReviewQueueItem[]; counts: Record<string, number> };
};

// ─── iteration 3: the spine, the coverage picture, the Review page, the source, the FAQ (DCD-D20…D30) ───────────

export type CoverageState = "curve" | "conditioner" | "no_curve" | "no_direct_damage" | "outside";
export interface SpineType {
  slug: string; label: string; profile?: string | null; building?: string | null; also_buildings?: string[] | null; picture_note?: string | null;
  planned?: boolean | null; catalogue_asset?: string | null; href: string | null; entries: Record<string, string>;
}
export interface SpineCategory { slug: string; label: string; rule?: string | null; planned: boolean; types: SpineType[] }
export type LibraryTile = Tile & { building?: string; building_parts?: string[] };
export interface LibraryType { slug: string; label: string; building: string | null; profile: string | null; picture_note: string | null; href: string; tiles: Record<string, LibraryTile> }
export interface LibraryCategory { slug: string; label: string; rule: string | null; planned: boolean; planned_types: string[]; types: LibraryType[] }
export interface ReviewTask { kind: string; text: string; items: string[]; href: string }
export interface ReviewCell {
  entry_id: string; title: string; status: Status; href: string; types: string[]; category: string | null;
  read: { kind: "agent" | "person"; by: string | null; on: string | null }; review: Review["review"]; release_review: string | null;
  field: string; words: string; tasks: ReviewTask[];
}
export interface SourceInfo { mode: "main" | "preview"; ref: string; commit: string; commit_full: string; dirty: boolean; label: string }
export type ManifestV3 = ManifestV2 & {
  source: SourceInfo;
  hazard_main: { available: boolean; ref: string; commit: string | null; behind: boolean | null; sentence: string };
  spine: { categories: SpineCategory[]; source: string };
  library: LibraryCategory[];
  review: { cells: ReviewCell[]; n_tasks: number; n_cells_with_tasks: number; n_person_reviews: number; kinds: string[] };
  state_words: Record<CoverageState, string>;
};

export interface CoverageRow { s: CoverageState; part?: string; parts?: string[]; note?: string; basis: string }
export interface SystemPart { node: string; name: string; part?: string; note?: string }
export interface SystemRow { node: string; name: string; state: CoverageState; by_state: { state: CoverageState; words: string; parts: SystemPart[] }[] }
export interface CoverageHazard {
  hazard: { slug: string; label: string }; entry_id: string | null; status: Status | null; gap: boolean; href: string | null;
  rows: Record<string, CoverageRow>; states: Record<string, Record<string, string>>; systems: Record<string, SystemRow[]>;
  counts: Record<CoverageState, number>; curve_parts: string[]; unmapped: string[];
}
export interface TwinTree { root: string; nodes: Record<string, { n: string; p?: string | null }> }
export interface MatrixRow { tree: string; node: string; name: string; cells: Record<string, { state: CoverageState; words: string; curve_parts: string[]; mixed: boolean; states: CoverageState[] }> }
export interface Coverage {
  type: { slug: string; label: string; category: string; category_label: string; profile: string | null; building: string | null; also_buildings: string[] | null; picture_note: string | null; catalogue_asset: string };
  twin: { asset: string; name: string; model: string; root: string; plant_model: string | null; plant_root: string | null; plant_name: string | null; commit: string; crosswalk: string };
  trees: Record<string, TwinTree>; hazards: CoverageHazard[]; matrix: MatrixRow[];
  state_words: Record<CoverageState, string>; state_short: Record<CoverageState, string>;
}
export interface TwinViewerManifest { twin_repo: string; twin_commit: string; three: string; load_order: string[] }

export interface FaqQuestion { id: string; q: string; updated: string | null; owner: string | null; answer: string[]; example: string | null; read_more: { label: string; path: string | null; href: string | null } | null }
export interface Faq { sections: { title: string; questions: FaqQuestion[] }[]; n_questions: number; source: string; errors: string[] }
