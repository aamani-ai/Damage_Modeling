#!/usr/bin/env python3
"""What the derivation dashboard can read from a cell today, and what it cannot.

For each cell, lists which facts about how a curve was derived are already machine-readable in the cell's own files
(so the dashboard can read them and never go stale) and which exist only as prose in the dossier.

  python3 derivation_dashboard/tools/inventory.py [cell ...]      # default: hail_solar flood_solar wildfire_solar
"""
import csv, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
CELLS = sys.argv[1:] or ['hail_solar', 'flood_solar', 'wildfire_solar']

def artifact(cell):
    cur = ROOT / 'docs/cells' / cell / 'current'
    f = sorted(cur.glob('*curve_artifact.json'))
    return (json.loads(f[-1].read_text()), cur) if f else (None, cur)

rows = []
for cell in CELLS:
    a, cur = artifact(cell)
    if not a: rows.append((cell, {'artifact': 'none'})); continue
    tiers = a.get('parameter_tier_table') or []
    names = [p.name.lower() for p in cur.iterdir()]
    has = lambda pat: any(re.search(pat, n) for n in names)
    dossier = next((p for p in cur.iterdir() if 'dossier' in p.name.lower() and p.suffix == '.md'), None)
    text = dossier.read_text() if dossier else ''
    rows.append((cell, {
        'curves and parameters': f"yes ({len(a.get('curve_records') or [])})",
        'what fails (failure units, roles)': 'yes' if a.get('failure_units') else 'no',
        'the hazard measure and its valid range': 'yes' if a.get('hazard_axis') else 'no',
        'tier of each parameter': f"yes ({len(tiers)} rows)" if tiers else 'no',
        'reason for each parameter': 'yes' if tiers and all(r.get('reasoning') for r in tiers) else 'partly' if tiers else 'no',
        'what would replace each parameter': 'yes' if tiers and all(r.get('update_trigger') for r in tiers) else 'partly' if tiers else 'no',
        'source ids on each parameter': 'yes' if tiers and all(r.get('source_ids') for r in tiers) else 'partly' if tiers else 'no',
        'why this shape, what was demoted': 'yes' if a.get('derivation_rationale') else 'no',
        'what shifts it (selector, conditioner, exposure)': 'yes' if a.get('selector_logic') is not None else 'no',
        'what it may say (capability)': 'yes' if a.get('capability_declaration') or has(r'capability') else 'no',
        'source register as a file': 'yes' if a.get('source_registers') or has(r'source_register') else 'prose only',
        'claim register as a file': 'yes' if a.get('claim_registers') or has(r'claim') else 'prose only',
        'the anchors (a point, its value, its source)': 'prose only' if re.search(r'anchor', text, re.I) else 'not found',
        'what each stretch of the curve rests on': 'not recorded',
        'alternatives considered and rejected': 'prose only' if re.search(r'reject|why not', text, re.I) else 'not found',
    }))

keys = list(rows[0][1].keys()) if rows else []
w = max(len(k) for k in keys) + 2
print(' ' * w + ''.join(c.ljust(18) for c, _ in rows))
for k in keys: print(k.ljust(w) + ''.join(str(d.get(k, '—')).ljust(18) for _, d in rows))
