"""The catalogue as the data layer: entries, their artifacts, status, identity and every SHA pin."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .common import INDEX, ROOT, load_json, sha256, version_key  # puts scripts/reference_helpers on sys.path

import build_damage_curve_catalogue as cat  # noqa: E402


@dataclass
class Entry:
    data: dict[str, Any]
    status: str                      # live | proposal | reused | gap
    artifact: dict[str, Any] | None  # the curve artifact or binding.json
    artifact_path: str | None
    artifact_sha: str | None
    index_row: dict[str, Any] | None
    pins: list[dict[str, Any]] = field(default_factory=list)

    @property
    def id(self) -> str:
        return self.data["entry_id"]

    @property
    def kind(self) -> str:
        return self.data["kind"]

    @property
    def folder(self) -> Path | None:
        return (ROOT / self.artifact_path).parent if self.artifact_path else None

    @property
    def cell_root(self) -> Path | None:
        p = ROOT / "docs" / "cells" / self.id
        return p if p.is_dir() else None

    @property
    def identity(self) -> dict[str, Any]:
        a = self.artifact or {}
        if self.kind == "binding":
            pin = a.get("source_pin") or {}
            return {
                "kind": "binding",
                "binding_id": a.get("binding_id"),
                "damage_code_id": None,
                "model": pin.get("semantic_damage_model_version"),
                "docs": pin.get("documentation_revision"),
                "version_key": version_key(pin.get("semantic_damage_model_version"), pin.get("documentation_revision")),
                "source_cell_id": pin.get("cell_id"),
                "source_artifact_sha256": pin.get("artifact_sha256"),
                "sha256": self.artifact_sha,
            }
        if self.kind == "gap":
            return {"kind": "gap", "damage_code_id": None, "model": None, "docs": None, "version_key": None, "sha256": None}
        return {
            "kind": "cell",
            "damage_code_id": a.get("damage_code_id"),
            "model": a.get("semantic_damage_model_version"),
            "docs": a.get("documentation_revision"),
            "version_key": version_key(a.get("semantic_damage_model_version"), a.get("documentation_revision")),
            "schema": a.get("schema_version"),
            "sha256": self.artifact_sha,
            "consumer_pin": (self.index_row or {}).get("consumer_pin"),
        }


def load_entries() -> tuple[list[Entry], dict[str, Any], dict[str, Any]]:
    """Every catalogue entry with its artifact loaded and its pins checked (not yet asserted)."""
    index_doc = load_json(INDEX)
    index = {a["cell_id"]: a for a in index_doc["artifacts"]}
    entries: list[Entry] = []
    for raw in cat.load_entries():
        facts = cat.facts(raw, index)
        artifact = None
        path = raw.get("artifact")
        sha = None
        if path:
            artifact = load_json(ROOT / path)
            sha = sha256(ROOT / path)
        row = index.get(raw["entry_id"]) if raw["kind"] == "cell" else None
        if row and row["path"] != path:
            row = None  # the entry describes a proposal while another version is live (validator forbids; keep honest)
        e = Entry(data=raw, status=facts["status"], artifact=artifact, artifact_path=path, artifact_sha=sha, index_row=row)
        e.pins = pin_checks(e, entries_by_cell_id=None)
        entries.append(e)
    by_cell = {e.id: e for e in entries}
    for e in entries:
        e.pins = pin_checks(e, by_cell)
    return entries, index, index_doc


def pin_checks(e: Entry, entries_by_cell_id: dict[str, Entry] | None) -> list[dict[str, Any]]:
    """Every SHA pin this entry carries, with the actual value beside it."""
    checks: list[dict[str, Any]] = []
    if e.kind == "gap":
        return checks
    checks.append({"what": "catalogue entry artifact_sha256", "file": e.artifact_path,
                   "expected": e.data.get("artifact_sha256"), "actual": e.artifact_sha,
                   "ok": e.data.get("artifact_sha256") == e.artifact_sha})
    if e.index_row:
        checks.append({"what": "runtime artifact index sha256", "file": e.artifact_path,
                       "expected": e.index_row.get("sha256"), "actual": e.artifact_sha,
                       "ok": e.index_row.get("sha256") == e.artifact_sha})
    a = e.artifact or {}
    vl = a.get("value_linkage") or {}
    if vl.get("value_binding_path") and vl.get("value_binding_sha256"):
        p = ROOT / vl["value_binding_path"]
        actual = sha256(p) if p.exists() else None
        checks.append({"what": "value_linkage.value_binding_sha256", "file": vl["value_binding_path"],
                       "expected": vl["value_binding_sha256"], "actual": actual, "ok": actual == vl["value_binding_sha256"]})
    dr = a.get("derivation_rationale") or {}
    if dr.get("source_artifact_path") and dr.get("source_artifact_sha256"):
        p = ROOT / dr["source_artifact_path"]
        actual = sha256(p) if p.exists() else None
        checks.append({"what": "derivation_rationale.source_artifact_sha256", "file": dr["source_artifact_path"],
                       "expected": dr["source_artifact_sha256"], "actual": actual, "ok": actual == dr["source_artifact_sha256"]})
    if e.kind == "binding" and entries_by_cell_id is not None:
        pin = a.get("source_pin") or {}
        src = entries_by_cell_id.get(pin.get("cell_id"))
        actual = src.artifact_sha if src else None
        checks.append({"what": "binding source_pin.artifact_sha256", "file": src.artifact_path if src else None,
                       "expected": pin.get("artifact_sha256"), "actual": actual, "ok": actual == pin.get("artifact_sha256")})
    return checks


def curve_records(artifact: dict[str, Any]) -> list[dict[str, Any]]:
    return cat.curve_records(artifact)


def pathway_of(artifact: dict[str, Any], record: dict[str, Any]) -> dict[str, Any] | None:
    for pw in artifact.get("pathways") or []:
        if record in (pw.get("curve_records") or []) or pw.get("pathway_id") == record.get("pathway_id"):
            return pw
    return None


def row_for_curve(entry: Entry, curve_id: str) -> dict[str, Any] | None:
    from fnmatch import fnmatchcase
    for r in entry.data.get("rows") or []:
        if any(fnmatchcase(curve_id, p) for p in r.get("curves", [])):
            return r
    return None


def failure_unit(artifact: dict[str, Any], fu_id: str) -> dict[str, Any]:
    for fu in artifact.get("failure_units") or []:
        if fu.get("id") == fu_id:
            return fu
    return {"id": fu_id}
