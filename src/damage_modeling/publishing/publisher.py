"""The durable artifact publisher — repo truth → the governed GCS namespace.

Standard: docs/contracts/standards/23_durable_publication_standard.md (the
why/what/how). Mechanics in one breath: read the machine-readable index →
fail-closed per cell (recomputed SHA must equal the index SHA; the artifact
must validate against its declared bundle schema) → write each publication
CREATE-ONLY to an absent prefix → upload ``manifest.json`` LAST (the only
completion marker) → re-verify every remote hash → emit a local receipt the
consumer registrar reads.

Ownership seam (deliberate): this package PUBLISHES (damage_modeling's release
act). It never touches the platform database — registry rows in
``damage_artifact_ref`` are written by the CONSUMER side (Hazard_modeling's
``scripts/governance/register_damage_artifacts.py``) from the published
manifests. publish → register → load, three hands, one artifact.

Address grammar (one publication = one immutable prefix):

    gs://<bucket>/damage_artifacts/<env>/<cell_id>/<version_tag>/
        curve_artifact.json            (always)
        known_answer_tests.json        (when the cell has one)
        changelog.json                 (when the cell has one)
        manifest.json                  (LAST — completion marker)
    gs://<bucket>/damage_artifacts/<env>/_schemas/<schema_file>
        (the bundle JSON-Schema, published once per schema version)

``version_tag`` is the consumer pin's version half, filesystem-safe:
``model v1.0`` + ``docs r7`` → ``model_v1_0__docs_r7``. A new documentation
revision or model version is a NEW prefix; an existing prefix is never
rewritten (a partial prefix is unreadable and is never auto-deleted — fix by
publishing the next revision, exactly like the Hazard canonical writers).
"""
from __future__ import annotations

import hashlib
import json
import subprocess
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import jsonschema

PUBLISHER_VERSION = "damage-publish/0.1.0"
MANIFEST_SCHEMA_VERSION = "damage-artifact-publication-manifest/v1"
DEFAULT_BUCKET = "infrasure-benchmark"
DEFAULT_ENV = "dev"
NAMESPACE = "damage_artifacts"

REPO_ROOT = Path(__file__).resolve().parents[3]
INDEX_PATH = REPO_ROOT / "docs/contracts/machine_readable_artifact_index.json"
SCHEMA_DIR = REPO_ROOT / "docs/contracts/schemas"

# artifact_schema_version → the schema file that validates it
_SCHEMA_FILES = {
    "damage_curve_record_bundle.v2": "curve_artifact_bundle.v2.schema.json",
}
# schemas the above cross-$ref — published alongside so a consumer can build
# a complete resolver registry from _schemas/ alone (no repo checkout)
_SCHEMA_SIBLINGS = [
    "capability_declaration.v2.schema.json",
    "cell_runtime_changelog.v1.schema.json",
    "damage_emit.schema.json",
]


def _validate_against_bundle_schema(instance: dict, schema_path: Path) -> None:
    """Validate with EVERY library schema pre-registered under its ``$id`` —
    the bundle schemas cross-``$ref`` siblings (e.g. the v2 bundle refs
    ``damage_curve_library.capability_declaration.v2``) by bare id, which a
    default resolver would try to fetch as a URL."""
    from referencing import Registry, Resource

    resources = []
    for p in SCHEMA_DIR.glob("*.json"):
        s = json.loads(p.read_text())
        if "$id" in s:
            resources.append((s["$id"], Resource.from_contents(s)))
    registry = Registry().with_resources(resources)
    schema = json.loads(schema_path.read_text())
    jsonschema.Draft202012Validator(schema, registry=registry).validate(instance)


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _git_sha() -> str:
    return subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=REPO_ROOT, check=True,
        capture_output=True, text=True,
    ).stdout.strip()


def _version_tag(semantic: str, docs_rev: str) -> str:
    """``model v1.0`` + ``docs r7`` → ``model_v1_0__docs_r7`` (pin-derived,
    filesystem/URI safe)."""
    return f"{semantic.replace(' ', '_').replace('.', '_')}__{docs_rev.replace(' ', '_')}"


@dataclass
class PlannedFile:
    local: Path
    name: str
    role: str
    sha256: str = ""
    bytes: int = 0


@dataclass
class PlannedPublication:
    cell_id: str
    damage_code_id: str
    semantic_damage_model_version: str
    documentation_revision: str
    artifact_schema_version: str
    index_sha256: str
    version_tag: str
    prefix: str                       # object prefix inside the bucket
    files: list[PlannedFile] = field(default_factory=list)
    problems: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.problems


def plan_publications(
    *, env: str = DEFAULT_ENV, only_cell: Optional[str] = None,
    index_path: Path = INDEX_PATH,
) -> list[PlannedPublication]:
    """Pure planning + validation — NO network. Every gate that can fail
    offline fails here: file presence, SHA-vs-index equality, JSON-Schema
    validation, KAT/changelog resolution."""
    index = json.loads(index_path.read_text())
    plans: list[PlannedPublication] = []
    for entry in index["artifacts"]:
        if only_cell and entry["cell_id"] != only_cell:
            continue
        tag = _version_tag(entry["semantic_damage_model_version"],
                           entry["documentation_revision"])
        plan = PlannedPublication(
            cell_id=entry["cell_id"],
            damage_code_id=entry["damage_code_id"],
            semantic_damage_model_version=entry["semantic_damage_model_version"],
            documentation_revision=entry["documentation_revision"],
            artifact_schema_version=entry["artifact_schema_version"],
            index_sha256=entry["sha256"],
            version_tag=tag,
            prefix=f"{NAMESPACE}/{env}/{entry['cell_id']}/{tag}",
        )

        artifact_path = REPO_ROOT / entry["path"]
        if not artifact_path.exists():
            plan.problems.append(f"artifact file missing: {entry['path']}")
            plans.append(plan)
            continue

        actual_sha = _sha256_file(artifact_path)
        if actual_sha != entry["sha256"]:
            plan.problems.append(
                f"sha mismatch vs index: file {actual_sha[:12]}… != index {entry['sha256'][:12]}…"
            )

        schema_file = _SCHEMA_FILES.get(entry["artifact_schema_version"])
        if schema_file is None:
            plan.problems.append(
                f"no schema registered for {entry['artifact_schema_version']!r}"
            )
        else:
            try:
                _validate_against_bundle_schema(
                    json.loads(artifact_path.read_text()), SCHEMA_DIR / schema_file
                )
            except jsonschema.ValidationError as exc:  # fail-closed, named
                plan.problems.append(f"schema validation failed: {exc.message[:160]}")

        plan.files.append(PlannedFile(artifact_path, "curve_artifact.json",
                                      "canonical_damage_curve"))
        for key, name, role in (
            ("known_answer_tests_path", "known_answer_tests.json", "known_answer_contract"),
            ("changelog_path", "changelog.json", "cell_runtime_changelog"),
        ):
            rel = entry.get(key)
            if rel:
                p = REPO_ROOT / rel
                if p.exists():
                    plan.files.append(PlannedFile(p, name, role))
                else:
                    plan.problems.append(f"{key} points at a missing file: {rel}")

        for f in plan.files:
            f.sha256 = _sha256_file(f.local)
            f.bytes = f.local.stat().st_size
        plans.append(plan)
    return plans


def _manifest_for(plan: PlannedPublication, *, bucket: str, env: str,
                  generations: dict[str, int], index_revision: str) -> dict[str, Any]:
    gcs_uri = f"gs://{bucket}/{plan.prefix}/"
    return {
        "schema_version": MANIFEST_SCHEMA_VERSION,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "publisher": PUBLISHER_VERSION,
        "cell_id": plan.cell_id,
        "damage_code_id": plan.damage_code_id,
        "consumer_pin": {
            "cell_id": plan.cell_id,
            "semantic_damage_model_version": plan.semantic_damage_model_version,
            "documentation_revision": plan.documentation_revision,
            "artifact_schema_version": plan.artifact_schema_version,
            "sha256": plan.index_sha256,
        },
        "files": [
            {"name": f.name, "role": f.role, "sha256": f.sha256, "bytes": f.bytes,
             "gcs_generation": generations.get(f.name)}
            for f in plan.files
        ],
        "source": {
            "repository": "damage_modeling",
            "git_sha": _git_sha(),
            "index_contract_revision": index_revision,
        },
        "write_protocol": {
            "create_only": True,
            "manifest_uploaded_last": True,
            "manifest_is_completion_marker": True,
        },
        # What the consumer registrar writes into damage_artifact_ref —
        # emitted here so registration is a read of published truth, never
        # a re-derivation.
        "registry_row": {
            "artifact_id": plan.damage_code_id,
            "version": plan.version_tag,
            "sha256": plan.index_sha256,
            "gcs_uri": gcs_uri,
            "hazard_type": _hazard_type(plan.cell_id),
            "tech_class": _tech_class(plan.cell_id),
            "status": "active",
        },
    }


def _hazard_type(cell_id: str) -> str:
    for prefix, hazard in (
        ("hail", "hail"), ("flood", "flood"), ("wildfire", "wildfire"),
        ("wind_tornado", "convective_wind"), ("strong_wind", "convective_wind"),
    ):
        if cell_id.startswith(prefix):
            return hazard
    raise ValueError(f"cannot map cell_id {cell_id!r} to a hazard_type")


def _tech_class(cell_id: str) -> str:
    if cell_id.endswith("_solar"):
        return "solar"
    if cell_id.endswith("_wind"):
        return "wind"
    raise ValueError(f"cannot map cell_id {cell_id!r} to a tech_class")


def publish_schemas(*, client=None, bucket: str = DEFAULT_BUCKET,
                    env: str = DEFAULT_ENV) -> list[str]:
    """Publish the bundle schemas + their cross-$ref'd siblings to
    ``_schemas/`` (create-only; an existing file must be byte-identical —
    a schema version is never rewritten). Returns the uploaded names."""
    from google.cloud import storage

    client = client or storage.Client()
    bucket_obj = client.bucket(bucket)
    uploaded = []
    for schema_file in list(_SCHEMA_FILES.values()) + _SCHEMA_SIBLINGS:
        schema_path = SCHEMA_DIR / schema_file
        blob = bucket_obj.blob(f"{NAMESPACE}/{env}/_schemas/{schema_file}")
        if blob.exists():
            remote = blob.download_as_bytes()
            if hashlib.sha256(remote).hexdigest() != _sha256_file(schema_path):
                raise RuntimeError(
                    f"_schemas/{schema_file} exists with DIFFERENT bytes — "
                    "a schema version must never be rewritten"
                )
        else:
            blob.upload_from_filename(str(schema_path), if_generation_match=0)
            uploaded.append(schema_file)
    return uploaded


def publish(plans: list[PlannedPublication], *, bucket: str = DEFAULT_BUCKET,
            env: str = DEFAULT_ENV) -> dict[str, Any]:
    """Execute the planned publications. Create-only; absent-prefix preflight;
    manifest last; remote SHAs re-verified. Raises on ANY partial state rather
    than repairing it (a partial prefix is fixed by publishing the next
    revision, never by deletion)."""
    from google.cloud import storage  # imported here so planning stays offline

    bad = [p for p in plans if not p.ok]
    if bad:
        raise ValueError(
            "refusing to publish — planning problems: "
            + "; ".join(f"{p.cell_id}: {p.problems}" for p in bad)
        )
    index = json.loads(INDEX_PATH.read_text())
    index_revision = index.get("repository_contract_revision", "unknown")

    client = storage.Client()
    bucket_obj = client.bucket(bucket)
    receipt: dict[str, Any] = {
        "published_at": datetime.now(timezone.utc).isoformat(),
        "bucket": bucket, "env": env, "publisher": PUBLISHER_VERSION,
        "publications": [],
    }

    publish_schemas(client=client, bucket=bucket, env=env)

    for plan in plans:
        # absent-prefix preflight — any object under the prefix is a hard stop
        existing = list(client.list_blobs(bucket_obj, prefix=plan.prefix + "/",
                                          max_results=1))
        if existing:
            raise RuntimeError(
                f"{plan.cell_id}: destination not absent "
                f"(gs://{bucket}/{plan.prefix}/ already has objects) — a "
                "publication prefix is immutable; publish the next revision instead"
            )
        generations: dict[str, int] = {}
        for f in plan.files:
            blob = bucket_obj.blob(f"{plan.prefix}/{f.name}")
            blob.upload_from_filename(str(f.local), if_generation_match=0)
            blob.reload()
            generations[f.name] = blob.generation
            remote_sha = hashlib.sha256(blob.download_as_bytes()).hexdigest()
            if remote_sha != f.sha256:
                raise RuntimeError(
                    f"{plan.cell_id}/{f.name}: remote sha {remote_sha[:12]}… "
                    f"!= local {f.sha256[:12]}… after upload"
                )
        manifest = _manifest_for(plan, bucket=bucket, env=env,
                                 generations=generations,
                                 index_revision=index_revision)
        mblob = bucket_obj.blob(f"{plan.prefix}/manifest.json")
        mblob.upload_from_string(
            json.dumps(manifest, indent=2, sort_keys=True),
            content_type="application/json", if_generation_match=0,
        )
        mblob.reload()
        manifest["manifest_gcs_generation"] = mblob.generation
        receipt["publications"].append(manifest)

    out_dir = REPO_ROOT / "outputs" / "publications"
    out_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    receipt_path = out_dir / f"{stamp}_publication_receipt.json"
    receipt_path.write_text(json.dumps(receipt, indent=2, sort_keys=True))
    receipt["receipt_path"] = str(receipt_path)
    return receipt
