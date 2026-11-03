"""Hazard's internal dashboard, layer by layer: which Damage artifact each layer was computed with.

Run while signed in to Google Cloud; it only reads (GCS objects and git):

    .venv/bin/python scripts/dashboard/hazard_dashboard_snapshot.py

It writes scripts/dashboard/snapshots/hazard_dashboard.json, which the dashboard build reads, so the build itself never
needs credentials. The layer list is the one Hazard's main deploys (dashboard/data.real-estate.sync.json names the
release whose manifest lists every layer, base and overlay). For each layer, the Damage artifact comes from the most
direct record there is, and the record says which:
  layer_record      the layer's own manifest names the artifact (a version string or a SHA-256 per view)
  run_receipt       the receipts in the layer's run folder pin the artifact's SHA-256
  producer_code     the run names the Hazard commit that produced it, and that commit's code pins the artifact's SHA-256
  release_runs      the layer names only a local file; the stored release runs for that asset and hazard pin it
A SHA-256 is resolved to a version from this tree, Damage's branches, or Hazard's own copies.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from dashboard_build import hazard_main, hazard_use  # noqa: E402
from dashboard_build.common import CHECKOUT  # noqa: E402

OUT = Path(__file__).resolve().parent / "snapshots" / "hazard_dashboard.json"
BUCKET = "gs://infrasure-benchmark/hazard_conus_grid/"
SYNC = "dashboard/data.real-estate.sync.json"
SERVICE = "hazard-grid-resiliency-internal"
HEX64 = re.compile(r"\b[0-9a-f]{64}\b")
VERSIONED = re.compile(r"([a-z0-9_]+)@model_v(\d+)_(\d+)_{1,2}docs_r(\d+)", re.I)
HAZARD_CELL = {"hurricane": "tropical_cyclone_wind"}
ASSET_CELL = {"solar": "solar", "wind_farm": "wind", "bess": "bess"}
BESS_DIRS = {"flood": "flood/combined", "hurricane": "hurricane", "wildfire": "wildfire"}


def gcs(uri: str) -> bytes:
    done = subprocess.run(["gcloud", "storage", "cat", uri], capture_output=True)
    if done.returncode:
        raise SystemExit(f"cannot read {uri}: {done.stderr.decode()[:300]}")
    return done.stdout


def gcs_ls(uri: str) -> list[str]:
    done = subprocess.run(["gcloud", "storage", "ls", uri], capture_output=True, text=True)
    return [l for l in done.stdout.splitlines() if l.strip()] if done.returncode == 0 else []


def cell_of(layer: dict[str, Any]) -> str | None:
    hz, asset = str(layer.get("hazard") or ""), str(layer.get("asset") or "").lower()
    if layer["id"].startswith("real_estate_"):
        return None if layer["id"] == "real_estate_review_audit" else f"{HAZARD_CELL.get(hz, hz)}_real_estate"
    if hz == "total" or asset not in ASSET_CELL:
        return None
    if hz == "convective_wind":
        return {"solar": "strong_wind_solar", "wind_farm": "wind_tornado_wind"}[asset]
    return f"{HAZARD_CELL.get(hz, hz)}_{ASSET_CELL[asset]}"


def damage_files(cell: str) -> dict[str, dict[str, Any]]:
    """Every curve artifact of a cell this script can see, by SHA-256: this tree, Damage's branches, Hazard's copies."""
    out: dict[str, dict[str, Any]] = {}
    for sha, v in hazard_use._ours(cell).items():
        out[sha] = {"model": v["model"], "docs": v["docs"], "where": f"in this repository at {v['path']}"}
    for c in hazard_use.copies():
        if c["cell_id"] == cell and c["sha256"] not in out:
            out[c["sha256"]] = {"model": c["model"], "docs": c["docs"], "where": hazard_use._damage_where(cell, c["sha256"])}
    for ref in hazard_use._refs(CHECKOUT):
        for line in hazard_use._git(CHECKOUT, "ls-tree", "-r", ref, f"docs/cells/{cell}/").stdout.decode().splitlines():
            meta, path = line.split("\t", 1)
            if path.endswith("curve_artifact.json"):
                raw = hazard_use._git(CHECKOUT, "cat-file", "blob", meta.split()[2]).stdout
                sha = hashlib.sha256(raw).hexdigest()
                if sha not in out:
                    d = json.loads(raw)
                    out[sha] = {"model": d.get("semantic_damage_model_version"), "docs": d.get("documentation_revision"),
                                "where": hazard_use._damage_where(cell, sha)}
    return out


def _strings(v: Any) -> list[str]:
    """Source paths, whether a layer lists them, maps them by view, or names one."""
    if isinstance(v, str):
        return [v]
    if isinstance(v, dict):
        return [s_ for x in v.values() for s_ in _strings(x)]
    if isinstance(v, list):
        return [s_ for x in v for s_ in _strings(x)]
    return []


def run_root(path: str) -> str | None:
    m = re.match(r"data/hazard_conus_grid/(.+?/run_id=[^/]+)/", path or "")
    return f"{BUCKET}dev/{m.group(1)}/" if m else None


def evidence(layer: dict[str, Any], cell: str, known: dict[str, dict[str, Any]]) -> dict[str, Any]:
    """The Damage artifacts this layer was computed with, and the record that says so."""
    text = json.dumps(layer)
    rb = layer.get("reference_building") or {}
    shas = sorted({p.get("damage_sha256") for p in (rb.get("policies") or {}).values() if p.get("damage_sha256")})
    if shas:
        return {"how": "layer_record", "sha256": shas, "versions": []}
    # a version may be named by the cell or by the damage-code ID; the layer is one cell either way
    versions = sorted({(f"model v{m.group(2)}.{m.group(3)}", f"docs r{m.group(4)}") for m in VERSIONED.finditer(text)})
    if versions:
        found = []
        for model, docs in versions:
            same = [sha for sha, f in known.items() if f["model"] == model and f["docs"] == docs]
            # a version string, not a hash: prefer the file in this repository, then Hazard main's own copy
            mine = [sha for sha in same if known[sha]["where"].startswith("in this repository")]
            on_main = [sha for sha in same if sha in {c["sha256"] for c in hazard_use.copies() if c["on_main"]}]
            found += mine[:1] or on_main[:1] or same[:1]
        return {"how": "layer_record", "sha256": sorted(set(found)), "versions": [{"model": m, "docs": d} for m, d in versions]}
    sources = [s_ for s_ in _strings(layer.get("source_parquets")) + _strings(layer.get("source_parquet")) if s_]
    root = next((r for r in (run_root(s) for s in sources) if r), None)
    if root:
        texts = [gcs(root + "manifest.json").decode("utf-8", "replace")]
        texts += [gcs(u).decode("utf-8", "replace") for u in gcs_ls(root + "receipts/") if u.endswith(".json")]
        hits = sorted({h for t in texts for h in HEX64.findall(t) if h in known})
        if hits:
            return {"how": "run_receipt", "sha256": hits, "versions": [], "run": root.removeprefix(BUCKET)}
        commits = sorted({c for t in texts for c in re.findall(r'"git_sha"\s*:\s*"([0-9a-f]{40})"', t)})
        for commit in commits:
            code = [p for p in hazard_use._git(hazard_main.repo(), "ls-tree", "-r", "--name-only", commit).stdout.decode().splitlines()
                    if hazard_use.CODE_FILES.match(p)]
            found = sorted({h for p in code for h in HEX64.findall(hazard_use._git(hazard_main.repo(), "show", f"{commit}:{p}").stdout.decode("utf-8", "replace"))
                            if h in known})
            if found:
                return {"how": "producer_code", "sha256": found, "versions": [], "run": root.removeprefix(BUCKET), "commit": commit}
        return {"how": "unresolved", "sha256": [], "versions": [], "run": root.removeprefix(BUCKET)}
    if any(str(s).startswith("/") for s in sources) and str(layer.get("asset", "")).lower() == "bess":
        hz = str(layer.get("hazard"))
        hits: set[str] = set()
        runs: list[str] = []
        for grid in gcs_ls(f"{BUCKET}dev/hazards/{BESS_DIRS.get(hz, hz)}/bess/m2_m4/version_1/conus_grid/"):
            for run in gcs_ls(grid):
                manifest = json.loads(gcs(run + "manifest.json"))
                uri = ((manifest.get("domain_metadata") or {}).get("input_commitment") or {}).get("uri")
                if uri:
                    hits |= {h for h in HEX64.findall(gcs(uri).decode("utf-8", "replace")) if h in known}
                    runs.append(run.removeprefix(BUCKET))
        return {"how": "release_runs", "sha256": sorted(hits), "versions": [], "runs": sorted(set(runs))}
    return {"how": "unresolved", "sha256": [], "versions": []}


def main() -> None:
    if hazard_main.repo() is None:
        raise SystemExit("Hazard's main could not be read")
    sync = json.loads(hazard_main.read(SYNC) or b"{}")
    manifest_uri = sync["prefix"].rstrip("/") + "/manifest.json"
    raw = gcs(manifest_uri)
    manifest = json.loads(raw)
    cells: dict[str, dict[str, Any]] = {}
    for layer in manifest["layers"]:
        cell = cell_of(layer)
        if not cell:
            continue
        known = damage_files(cell)
        ev = evidence(layer, cell, known)
        entry = cells.setdefault(cell, {"layers": [], "artifacts": {}, "how": [], "notes": []})
        entry["layers"].append({"id": layer["id"], "label": layer.get("label") or layer["id"], "how": ev["how"]})
        if ev["how"] not in entry["how"]:
            entry["how"].append(ev["how"])
        for sha in ev["sha256"]:
            entry["artifacts"][sha] = {**known.get(sha, {}), "sha256": sha}
        if ev["how"] == "release_runs":
            note = ("The layer's own record names only a local file and run "
                    f"{layer.get('run_id')}; the stored release runs for this asset and hazard pin the artifact.")
            if note not in entry["notes"]:
                entry["notes"].append(note)
    for entry in cells.values():
        entry["artifacts"] = sorted(entry["artifacts"].values(), key=lambda a: (str(a.get("model")), str(a.get("docs"))))
    snapshot = {
        "schema": "hazard-dashboard-snapshot/v1",
        "checked_on": dt.datetime.now(dt.timezone.utc).date().isoformat(),
        "dashboard": SERVICE,
        "hazard_main": hazard_main.state().get("commit"),
        "manifest": {"uri": manifest_uri.removeprefix(BUCKET), "sha256": hashlib.sha256(raw).hexdigest(), "layers": len(manifest["layers"])},
        "cells": dict(sorted(cells.items())),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(snapshot, indent=1) + "\n", encoding="utf-8")
    for cell, e in snapshot["cells"].items():
        print(f"{cell:36} {len(e['layers']):2} layers  {', '.join(e['how']):28} "
              + "; ".join(f"{a.get('model')} {a.get('docs')}" for a in e["artifacts"]))
    print(f"wrote {OUT.relative_to(CHECKOUT)}")


if __name__ == "__main__":
    main()
