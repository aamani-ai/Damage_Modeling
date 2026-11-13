#!/usr/bin/env python3
"""Build the derivation dashboard from this repository's own files.

Every solar and wind cell in `docs/cells/` is read at build time. For each curve in a cell's current runtime artifact
it writes one case to `site/data/cases.js`: the curve itself, its hazard measure, what fails, each parameter's grade,
reason and what would replace it, the cell's sources, what shifts it and what it may say, all taken from the artifact
and the cell's source register. Where a cell has a derivation record (`derivation_dashboard/records/<cell>.json`), the
curve that record explains also carries the record's reading of the dossier: what pins it, what each stretch rests on,
the reasoning step by step.

A record that disagrees with its artifact stops the build:
  - it was written against another artifact (SHA-256);
  - a curve it names is not in the artifact;
  - a boundary or data point does not lie on the curve the artifact defines;
  - the stretches it says the curve rests on leave a gap or stop short of the curve's range.

  python3 derivation_dashboard/tools/build.py            # build
  python3 derivation_dashboard/tools/build.py --check    # check only, write nothing
"""
import csv, datetime, hashlib, json, math, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SITE = HERE.parent / 'site'
CHECK = '--check' in sys.argv
BLOB = 'https://github.com/aamani-ai/Damage_Modeling/blob/main/'
ASSETS = {'solar': 'Solar', 'wind': 'Wind'}
HAZARDS = {'hail': 'Hail', 'flood': 'Flood', 'wildfire': 'Wildfire', 'strong_wind': 'Strong wind', 'tropical_cyclone_wind': 'Tropical cyclone wind', 'wind_tornado': 'Wind and tornado', 'winter_storm': 'Winter storm'}
FSIM = ['No fire', 'Under 2 ft', '2 to 4 ft', '4 to 6 ft', '6 to 8 ft', '8 to 12 ft', '12 ft and over']
words = lambda s: re.sub(r'\s+', ' ', str(s or '').replace('_', ' ')).strip()
cap = lambda s: s[:1].upper() + s[1:] if s else s
tier2 = lambda t: str(t or '')[:2] if re.match(r'T[1-4]', str(t or '')) else ''


# ---- curves: one evaluator per form the library uses, each as the cell's own documents state it
def normal(rec):
    """The curve in the page's shape: logistic, piecewise, states (by class), weibull, or none (not drawn here)."""
    p, f = rec.get('parameters') or {}, rec.get('curve_form')
    if f == 'logistic': return {'form': 'logistic', 'params': {'D50_mm': p['D50_mm'], 'k_per_mm': p['k_per_mm'], 'max_DR': p.get('max_DR', 1)}}
    if f == 'thresholded_logistic_demand':   # strong_wind_solar dossier: DR = 0 if R_eff < R0, else max_DR / (1 + exp(-k (R_eff - R50)))
        return {'form': 'logistic', 'params': {'D50_mm': p['R50'], 'k_per_mm': p['k'], 'max_DR': p['max_DR'], 'R0': p['R0']}}
    if f == 'wind_tornado_logistic_ratio':   # wind_tornado_wind dossier: DR = max_DR / (1 + exp(-k (V/Ve50 - D50_ratio))), straight-line
        return {'form': 'logistic', 'params': {'D50_mm': p['D50_ratio_straight_line'], 'k_per_mm': p['k_ratio'], 'max_DR': p['max_DR']}}
    if f == 'thresholded_weibull_expected_damage':   # tropical_cyclone_wind_wind basics: DR = 1 - 0.5^(((V - V0)/delta)^rho) for V > V0
        return {'form': 'weibull', 'params': {'V0': p['V_zero_kmh'], 'delta': p['delta_V50_kmh'], 'rho': p['rho'], 'max_DR': p.get('max_dr', 1)}}
    if f == 'piecewise_linear' and p.get('points'): return {'form': 'piecewise', 'points': p['points']}
    if f == 'ordered_damage_state_lognormal':
        return {'form': 'none', 'about': 'a set of ordered damage states with lognormal capacities', 'table': [[cap(words(x.get('description') or x.get('state_id')))[:110], x.get('cost_ratio')] for x in p.get('damage_states') or []], 'scenarios': len(p.get('capacity_scenarios') or [])}
    return {'form': 'none', 'about': 'a ' + words(f)}


def evaluate(c, x):
    if c['form'] == 'logistic':
        p = c['params']
        if p.get('R0') is not None and x < p['R0']: return 0.0
        return p['max_DR'] / (1 + math.exp(-p['k_per_mm'] * (x - p['D50_mm'])))
    if c['form'] == 'weibull':
        p = c['params']; return 0.0 if x <= p['V0'] else p['max_DR'] * (1 - 0.5 ** (((x - p['V0']) / p['delta']) ** p['rho']))
    pts = c.get('points') or [[0, 0]]
    if x <= pts[0][0]: return pts[0][1]
    for (a, va), (b, vb) in zip(pts, pts[1:]):
        if x <= b: return va + (vb - va) * (x - a) / (b - a)
    return pts[-1][1]


def domain(c, ax):
    if c['form'] == 'piecewise': return [c['points'][0][0], c['points'][-1][0]]
    vr = ax.get('valid_range')
    if c['form'] == 'logistic' and (c['params'].get('R0') is not None or not vr): return [0, round(max(2.0, c['params']['D50_mm'] * 1.6), 2)]
    return vr or [0, 1]


def ticks(lo, hi):
    step = [s for s in (0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100) if (hi - lo) / s <= 6][0]
    out, v = [], math.ceil(lo / step) * step
    while v <= hi + 1e-9: out.append(round(v, 4)); v += step
    return out


# ---- the cell
def artifact(cell):
    f = sorted((ROOT / 'docs/cells' / cell / 'current').glob('*curve_artifact.json'))
    if not f: return None, None, None
    raw = f[-1].read_bytes(); return json.loads(raw), hashlib.sha256(raw).hexdigest(), f[-1]


def pathways(a):
    """(axis, curve records, selectors, conditioners, exposure) per pathway; a single-pathway cell is one."""
    if a.get('pathways'):
        return [(p.get('hazard_axis') or {}, p.get('curve_records') or [], p.get('selector_logic') or [], p.get('conditioner_logic') or [], p.get('exposure_contract') or p.get('exposure_logic'), p.get('pathway_id')) for p in a['pathways']]
    return [(a.get('hazard_axis') or {}, a.get('curve_records') or [], a.get('selector_logic') or [], a.get('conditioner_logic') or [], a.get('exposure_logic'), None)]


def registers(a):
    out, files = {}, []
    for key in ('source_registers', 'source_register'):
        v = a.get(key); files += v if isinstance(v, list) else [v] if isinstance(v, str) else []
    for rel in files:
        f = ROOT / rel
        if not f.exists() or f.suffix != '.csv': continue
        for r in csv.DictReader(f.open()):
            sid = r.get('source_id') or r.get('id')
            if sid: out[sid] = {'title': r.get('full_citation') or r.get('title') or sid, 'url': r.get('primary_url') or r.get('url') or '', 'supports': r.get('direct_support') or r.get('supports') or '',
                                'not': r.get('prohibited_support') or r.get('does_not_support') or '', 'tier': tier2(r.get('tier')), 'role': r.get('evidence_role') or ''}
    return out


def generated(cell, a, sha, fpath, hazard, asset, ax, rec, siblings, sel, con, exp, pathway):
    """A case for a curve with no derivation record: everything from the artifact, and the record's parts said to be missing."""
    cid, unit = rec['curve_id'], next((u for u in a.get('failure_units') or [] if u.get('id') == rec.get('failure_unit_id')), {})
    c = normal(rec); cat = 'categorical' in str(ax.get('unit', '')) or 'native_class_map' in ax
    lo, hi = ([1, 6] if cat else domain(c, ax)) if c['form'] != 'none' else [0, 1]
    part = cap(words(unit.get('component') or rec.get('failure_unit_id') or cid).lower()).replace(' + ', ' and ')
    rows = [t for t in a.get('parameter_tier_table') or [] if cid in str(t.get('curve_id', '')).split(';') or rec.get('failure_unit_id') in str(t.get('curve_id', '')) or str(t.get('curve_id', '')).startswith('all')]
    tiers = sorted({tier2(t.get('tier')) for t in rows if tier2(t.get('tier'))}); weakest = tiers[-1] if tiers else 'T4'
    regs = registers(a); ids = list(dict.fromkeys(s for t in rows for s in t.get('source_ids') or []))
    srcs = [(s, regs.get(s)) for s in ids]
    rat = a.get('derivation_rationale') or {}; capd = a.get('capability_declaration') or {}; emit = capd.get('vulnerability_emit') or {}
    may = [cap(words(k).lower()) for k, v in emit.items() if isinstance(v, str) and v.startswith('supported')]
    held = [cap(words(k).lower()) for k, v in emit.items() if isinstance(v, str) and v.startswith('not')] + [cap(words(f).lower()) for f in ((capd.get('consumer_annual_metrics') or {}).get('limitation_flags') or [])]
    step_of = lambda t: 'adjust' if 'conditioner' in str(t.get('param_role')) else 'axis' if 'axis' in str(t.get('parameter')) or 'transform' in str(t.get('parameter')) else 'form'
    label = words(ax.get('internal_axis') or ax.get('id') or rec.get('x_axis')).lower()
    ratio = c['form'] == 'logistic' and (c['params'].get('R0') is not None or '/' in str(rec.get('x_axis')) or 'ratio' in label)
    if cat and 'FSIM' in str(ax.get('id')): label = 'flame-length class from the US Forest Service fire simulation (FSim)'
    if c['form'] in ('logistic',) and (c['params'].get('R0') is not None or ax.get('formula')): label = words(rec.get('x_axis')) + (f" ({ax['formula']})" if ax.get('formula') else '')
    nb = [s for s in siblings if s['curve_id'] != cid and normal(s)['form'] == c['form'] and normal(s)['form'] != 'none' and (c['form'] != 'piecewise' or domain(normal(s), ax) == [lo, hi])][:3]
    units = []
    for u in a.get('failure_units') or []:
        t = str(u.get('treatment', '')); k = 'primary' if u.get('id') == rec.get('failure_unit_id') else 'zero' if 'withheld' in t or 'zero' in t else 'low' if 'low' in t else 'cond' if 'condition' in t or 'secondary' in t else 'other'
        units.append([cap(words(u.get('component') or u.get('id')).lower())[:40], k])
    fmt = c['form']
    formula = {'logistic': 'share lost = max ÷ (1 + e^(−k × (x − x50)))' + ('   and 0 below the threshold R0' if c.get('params', {}).get('R0') is not None else ''), 'weibull': 'share lost = 1 − 0.5^(((x − x0) ÷ Δ)^ρ) above the onset x0', 'piecewise': 'a table of points, joined by straight lines'}.get(fmt, '')
    pars = c.get('params') or {}
    nm = lambda s: (s[1]['title'] if s[1] else s[0])
    return {
        'title': f"{HAZARDS.get(hazard, cap(words(hazard)))} on a {asset} plant", 'part': part, 'asset': asset, 'hazard': hazard, 'cell': cell, 'curve_id': cid, 'pathway': pathway,
        'unrecorded': True, 'type': 'unrecorded', 'weakest': weakest, 'weakestNote': 'from the cell’s parameter grades', 'drawable': fmt != 'none',
        'says': f"The share of the {part.lower()}’s value lost, by {label}." if fmt != 'none' else f"A {words(rec.get('curve_form'))} for the {part.lower()}: not drawn on this page yet.",
        'level': {'kind': 'Failure unit', 'path': [f'{cap(asset)} plant', cap(words(unit.get('subsystem', '')).lower()), part], 'of': f"One of {len(a.get('failure_units') or [])} failure units in this cell."},
        'typeNote': (rat.get('form_reasoning') or rat.get('adopted_form') or '') + ' No derivation record yet: what pins this curve and what each stretch rests on are not recorded.',
        'pinnedBy': 'Not recorded yet', 'use': cap(words(a.get('model_grade') or a.get('lifecycle_state') or 'see what it may say').lower()), 'notFor': '; '.join(held[:2]) or 'See what it withholds',
        'dossier': ['The cell’s derivation dossier', BLOB + str(a.get('source_dossier') or fpath.parent.relative_to(ROOT))],
        'question': {'not': ['The hazard at the site', 'Whole-plant loss'], 'yes': [cap(label)[:34], f'Share of the {part.lower()}'[:34]]},
        'axis': {'kind': 'cat' if cat else 'cont', 'label': cap(label), 'unit': '' if cat or ratio else words(ax.get('unit')), 'min': lo, 'max': hi,
                 'ticks': ticks(lo, hi), 'step': 1 if cat else round((hi - lo) / 100, 4), 'start': 4 if cat else round(lo + (hi - lo) * 0.45, 3), 'dp': 0 if cat else (2 if hi - lo <= 5 else 1 if hi - lo <= 50 else 0), 'states': FSIM if cat else None},
        'curves': [{'id': cid, 'name': part, 'role': 'adopted', 'tier': weakest, **c}] + [{'id': s['curve_id'], 'name': cap(words(s.get('failure_unit_id') or s['curve_id']).lower()), 'role': 'neighbour', **normal(s)} for s in nb],
        'ground': [[lo, hi, 'unrec', 'No derivation record yet: what each stretch rests on is not recorded']], 'marks': [],
        'empty': {k: 'Not recorded yet for this curve.' for k in ('bridge', 'boundary', 'data', 'reference', 'rule')},
        'trail': [[', '.join(nm(s) for s in srcs if s[0] in (t.get('source_ids') or []))[:90] or 'No source named', words(t.get('reasoning'))[:160], 'unassigned', cap(words(t.get('parameter'))) + (f" = {t['value']}" if isinstance(t.get('value'), (int, float, str)) else ''), step_of(t)] for t in rows],
        'assumptions': [{'step': step_of(t), 't': cap(words(t.get('parameter'))), 'd': t.get('reasoning') or '', 'tier': tier2(t.get('tier')) or 'T4', 'trigger': t.get('update_trigger') or 'Not stated'} for t in rows],
        'evid': [{'reports': (s[1] or {}).get('role') or 'Cited by the cell', 'supports': (s[1] or {}).get('supports') or 'Not recorded as a file for this cell', 'not': (s[1] or {}).get('not') or 'Not recorded as a file for this cell', 'tier': (s[1] or {}).get('tier') or '—',
                  'links': [[nm(s)[:60], s[1]['url']]] if s[1] and s[1].get('url') else []} for s in srcs[:4]],
        'flow': flow([(nm(s)[:30], (s[1] or {}).get('tier') or 'cited by the cell') for s in srcs[:4]],
                     [('What fails', f"{len(a.get('failure_units') or [])} failure units"), ('What drives it', label[:30]), ('The shape', words(rec.get('curve_form'))[:30]), ('What shifts it', f"{len(sel)} selector, {len(con)} conditioner")],
                     ('Not recorded yet', f'weakest grade {weakest}'), [('What it may say', f'{len(may)} supported'), ('Withheld', f'{len(held)} limits')]),
        'steps': {
            'question': {'a': f'{cap(label)} against the share of the {part.lower()}’s value lost.', 'points': ['Physical damage only: repair cost ÷ replacement value.']},
            'evidence': {'a': f'{len(srcs)} sources are cited by this curve’s parameters. Their jobs are not recorded yet.', 'table': [[nm(s)[:80], 'unassigned', (s[1] or {}).get('supports') or '—', (s[1] or {}).get('not') or '—', (s[1] or {}).get('tier') or '—'] for s in srcs[:6]]},
            'grain': {'a': f"{len(units)} failure units in this cell; this curve is one of them.", 'units': units},
            'axis': {'a': cap(label) + '.', 'chain': [['What the hazard source reports', words(ax.get('preferred_input_field') or ax.get('input_field') or '—')[:34]], ['The bridge', (ax.get('formula') or 'as supplied')[:34]], [cap(label)[:30], 'the axis']],
                     'points': [p for p in [f"Valid range: {ax.get('valid_range')}" if ax.get('valid_range') else None, f"Outside it: {words(ax.get('extrapolation_policy'))}" if ax.get('extrapolation_policy') else None] if p]},
            'form': {'a': cap(words(rec.get('curve_form'))) + '.', 'formula': formula + ('\n' + '   '.join(f'{k} = {v}' for k, v in pars.items()) if pars else ''), 'points': [p for p in [rat.get('form_reasoning'), rat.get('demoted_sources'), rat.get('tier_mix')] if p]},
            'adjust': {'a': f"{len(sel)} selector, {len(con)} conditioner." if (sel or con) else 'Nothing else shifts it.', 'table3': [['Selector', words(s.get('field')), words(s.get('effect')), '—'] for s in sel[:4]] + [['Conditioner', words(x.get('field') or x.get('adjustment_id')), (x.get('reasoning') or words(x.get('adjustment_type')))[:120], tier2(x.get('tier')) or '—'] for x in con[:3]]},
            'emit': {'a': 'What the cell declares it may say, and what it withholds.', 'yes': may or ['Not declared'], 'no': held or ['Nothing declared']}},
        'sources': [[nm(s)[:90], s[1]['url']] for s in srcs if s[1] and s[1].get('url')][:6],
        'pin': f"{cell}@{words(a.get('semantic_damage_model_version')).replace(' ', '_').replace('.', '_')}__{words(a.get('documentation_revision')).replace(' ', '_')}", 'file': str(fpath.relative_to(ROOT)), 'sha256': sha,
    }


def flow(ev, de, res, out):
    nodes = [{'id': f'e{i}', 'label': f'{a}\n{b}', 'col': 0, 'row': i, 'tone': 'input', 'step': ['grain', 'axis', 'form', 'adjust'][i]} for i, (a, b) in enumerate(ev)]
    nodes += [{'id': f'd{i}', 'label': f'{a}\n{b}', 'col': 1, 'row': i, 'tone': 'model', 'step': ['grain', 'axis', 'form', 'adjust'][i]} for i, (a, b) in enumerate(de)]
    nodes += [{'id': 'r', 'label': f'{res[0]}\n{res[1]}', 'col': 2, 'row': 0, 'span': 4, 'tone': 'result', 'step': 'form'},
              {'id': 'o0', 'label': '\n'.join(out[0]), 'col': 3, 'row': 1, 'tone': 'use', 'step': 'emit'}, {'id': 'o1', 'label': '\n'.join(out[1]), 'col': 3, 'row': 2, 'tone': 'held', 'step': 'emit'}]
    edges = [{'from': f'e{i}', 'to': f'd{i}'} for i in range(len(ev))] + [{'from': f'd{i}', 'to': 'r'} for i in range(len(de))] + [{'from': 'r', 'to': 'o0'}, {'from': 'r', 'to': 'o1', 'dashed': True}]
    return {'columns': ['EVIDENCE', 'DECISIONS', 'THE RESULT', 'WHAT IT GIVES'], 'nodes': nodes, 'edges': edges}


def recorded(R, a, sha, fpath, ax, recs, errs):
    """The case a derivation record explains: the record's reading, joined to the artifact's own curves, and checked."""
    cell, cid = R['cell_id'], R['curve_id']
    if sha != R.get('artifact_sha256'): errs.append(f'{cell}: the record was written against another artifact ({str(R.get("artifact_sha256"))[:12]}… ≠ {sha[:12]}…)')
    by = {r['curve_id']: r for r in recs}; curves = []
    for c in R['curves']:
        if c['id'] not in by: errs.append(f'{cell}: curve {c["id"]} is not in the artifact'); continue
        curves.append({**c, **normal(by[c['id']])})
    C = {**R['case'], 'cell': cell, 'curve_id': cid, 'curves': curves, 'pin': f"{cell}@{words(a.get('semantic_damage_model_version')).replace(' ', '_').replace('.', '_')}__{words(a.get('documentation_revision')).replace(' ', '_')}",
         'file': str(fpath.relative_to(ROOT)), 'sha256': sha, 'asset': cell.split('_')[-1], 'drawable': True, 'record': f'derivation_dashboard/records/{cell}.json', 'record_status': R['status']}
    if curves:
        ad = curves[0]; cat = bool(C['axis'].get('states')); lo, hi = ([1, 6] if cat else domain(ad, ax))
        C['axis'] = {**C['axis'], 'kind': 'cat' if cat else 'cont', 'min': 0 if cat else lo, 'max': 6 if cat else hi}
        for m in C.get('marks', []):
            if m['tag'] in ('boundary', 'data') and abs(evaluate(ad, m['x']) - m['y']) > 0.006: errs.append(f'{cell} {cid}: "{m["label"]}" is not on the curve: the artifact gives {evaluate(ad, m["x"]):.4f} at {m["x"]}')
        g = C.get('ground') or []
        if not g or any(b[0] != a_[1] for a_, b in zip(g, g[1:])) or g[-1][1] != hi or g[0][0] > lo + (1 if cat else 0): errs.append(f'{cell} {cid}: what the curve rests on does not cover {lo} to {hi} without a gap')
    return C


def main():
    commit = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True).stdout.strip()
    records = {json.loads(p.read_text())['cell_id']: json.loads(p.read_text()) for p in sorted((HERE.parent / 'records').glob('*.json'))}
    cases, library, errs = {}, {k: {} for k in ASSETS}, []
    for d in sorted((ROOT / 'docs/cells').iterdir()):
        m = re.match(r'(.+)_(solar|wind)$', d.name)
        if not m or not d.is_dir(): continue
        hazard, asset = m.group(1), m.group(2); a, sha, fpath = artifact(d.name)
        entry = {'cell': d.name, 'label': HAZARDS.get(hazard, cap(words(hazard))), 'curves': [], 'status': 'no current runtime artifact' if not a else words(a.get('lifecycle_state') or a.get('promotion_status') or 'current')}
        if a:
            for ax, recs, sel, con, exp, pw in pathways(a):
                R = records.get(d.name)
                for rec in recs:
                    if R and rec['curve_id'] == R['curve_id']:
                        key = R['case_id']; cases[key] = recorded(R, a, sha, fpath, ax, recs, errs)
                    else:
                        key = f"{d.name}~{rec['curve_id']}"; cases[key] = generated(d.name, a, sha, fpath, hazard, asset, ax, rec, recs, sel, con, exp, pw)
                    entry['curves'].append({'key': key, 'name': cases[key]['part'], 'type': cases[key]['type'], 'drawable': cases[key]['drawable'], 'curve_id': rec['curve_id']})
            withheld = [u for u in a.get('failure_units') or [] if 'withheld' in str(u.get('treatment'))]
            entry['withheld'] = [cap(words(u.get('component') or u.get('id')).lower()) for u in withheld]
            entry['dossier'] = BLOB + str(a.get('source_dossier') or fpath.parent.relative_to(ROOT))
        library[asset][hazard] = entry
    for e in errs: print('FAIL', e)
    n = sum(len(h['curves']) for v in library.values() for h in v.values())
    print(f"{'checked' if CHECK else 'built'}: {sum(len(v) for v in library.values())} cells, {n} curves, {len(records)} with a derivation record" + (f", {len(errs)} errors" if errs else ''))
    if errs: sys.exit(1)
    if CHECK: return
    meta = {'commit': commit, 'date': datetime.date.today().isoformat(), 'cells_changed_since': bool(subprocess.run(['git', '-C', str(ROOT), 'status', '--porcelain', 'docs/cells'], capture_output=True, text=True).stdout.strip())}
    (SITE / 'data').mkdir(parents=True, exist_ok=True)
    (SITE / 'data' / 'cases.js').write_text('/* Generated by derivation_dashboard/tools/build.py from docs/cells. Do not edit. */\nwindow.DD = ' + json.dumps({'meta': meta, 'assets': ASSETS, 'library': library, 'cases': cases}, ensure_ascii=False) + ';\n')


if __name__ == '__main__':
    main()
