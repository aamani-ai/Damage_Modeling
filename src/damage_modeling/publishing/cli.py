"""``damage-publish`` — the release CLI over the durable publisher.

Two subcommands, dry-first by design:

    damage-publish plan  [--cell CELL] [--env dev]
        offline: read the index, run every fail-closed gate, print the table.
    damage-publish run   [--cell CELL] [--env dev] [--bucket infrasure-benchmark]
        plan again, then execute create-only publication (manifest last) and
        write the local receipt under outputs/publications/.

Standard: docs/contracts/standards/23_durable_publication_standard.md.
"""
from __future__ import annotations

import argparse
import sys

from damage_modeling.publishing.publisher import (
    DEFAULT_BUCKET, DEFAULT_ENV, plan_publications, publish,
)


def _print_plan(plans) -> bool:
    ok = True
    for p in plans:
        state = "OK " if p.ok else "FAIL"
        if not p.ok:
            ok = False
        files = ", ".join(f.name for f in p.files) or "-"
        print(f"[{state}] {p.cell_id:<20} {p.version_tag:<24} sha {p.index_sha256[:12]}…  files: {files}")
        for prob in p.problems:
            print(f"       ! {prob}")
        print(f"       → {p.prefix}/")
    return ok


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="damage-publish", description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)
    for name in ("plan", "run"):
        s = sub.add_parser(name)
        s.add_argument("--cell", default=None, help="publish one cell only")
        s.add_argument("--env", default=DEFAULT_ENV)
        if name == "run":
            s.add_argument("--bucket", default=DEFAULT_BUCKET)
    sch = sub.add_parser("schemas", help="publish/verify the _schemas/ set only")
    sch.add_argument("--env", default=DEFAULT_ENV)
    sch.add_argument("--bucket", default=DEFAULT_BUCKET)
    args = parser.parse_args(argv)

    if args.cmd == "schemas":
        from damage_modeling.publishing.publisher import publish_schemas
        uploaded = publish_schemas(bucket=args.bucket, env=args.env)
        print(f"schemas verified; newly uploaded: {uploaded or 'none (all present, byte-identical)'}")
        return 0

    plans = plan_publications(env=args.env, only_cell=args.cell)
    if not plans:
        print("no matching index entries", file=sys.stderr)
        return 2
    ok = _print_plan(plans)
    if args.cmd == "plan":
        return 0 if ok else 1
    if not ok:
        print("refusing to run with planning failures", file=sys.stderr)
        return 1
    receipt = publish(plans, bucket=args.bucket, env=args.env)
    print(f"\npublished {len(receipt['publications'])} cell(s); receipt: {receipt['receipt_path']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
