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
}

export interface BuildCheck { id: string; name: string; ok: boolean; severity: "hard" | "data"; summary: string }

export interface Manifest {
  built_at: string; commit: string; commit_full: string;
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
  bucket: string; state: string; mark: string; sentence: string; reports: Record<string, unknown>[];
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
    known_answers: { declared: number; run: number; reproduced: number; not_run: { kind: string; n: number; reason: string }[]; failed: unknown[]; negative_run: number; tolerance: number | null; source: string | null; kinds: Record<string, number> };
    validation: { path: string; status: string | null; date: string | null; classification?: string | null; review_scope?: string | null } | null;
    outside_checks: { kind: string; name: string; link: string }[];
    capability: Record<string, unknown> & { limitation_flags: string[] };
  } | null;
  seams: { open_items: string[]; missing_mechanisms: string[]; out_of_scope: string[]; next_version: string | null; update_triggers: { parameter: string; tier: string | null; update_trigger: string }[] };
  field_review: { register: { path: string; sha256: string; search_log: string | null; last_searched: string | null } | null; buckets: OccurrenceBucket[]; review: Review; absent_sentence: string | null };
  files: Record<string, string | null>; folder_files: FileRef[]; gap_reason: string | null;
  binding: { source_cell_id: string | null; source_entry_id: string | null; reused_curves: string[]; transfer_rationale: string | null; transfer_tier: string | null; status: string | null; limitations: unknown } | null;
  sampling_notes: string[];
  build_findings: { check: string; severity: string; items: unknown[]; sentence: string }[];
}

export interface Axis { id: string; label: string; unit: string | null; input_field?: string | null; kind: "continuous" | "categorical"; valid_range?: (number | null)[] | null; classes?: Record<string, string>; bridge?: Record<string, unknown> }
export interface Series { label: string; kind: "line" | "step" | "categorical"; points: [number, number][]; variant?: string; scenario?: string; beyond_last_knot_from?: number | null; continuation?: boolean }
export interface KnownAnswer { x: number; y: number; test: string; cost_usd?: number }

export interface Curve {
  curve_id: string; entry_id: string; damage_code_id: string | null; version_key: string | null; artifact_sha256: string | null;
  failure_unit_id: string | null; subsystem: string | null; component: string | null; treatment: string | null; part: string | null;
  pathway_id: string | null; curve_form: string | null; x_axis_id: string | null; y_axis: string | null;
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
