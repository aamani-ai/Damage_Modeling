<!--
author: owner-directed (Divy) · agent-drafted
created: 2026-10-21
updated: 2026-10-21
status: draft
scope: The look review (discussion 06 §4) and the brief's acceptance checks (iteration_2_brief.md §5) for dashboard iteration 2, captured from the clean tree at d2cc634 — INCOMPLETE: the session that produced it ran out of budget after the first capture round; the captures predate one further build-side fix (the plain-text pass) and must be retaken.
-->

# Iteration 2 — look review at `d2cc634` (incomplete; to be retaken)

**State of this record.** The captures, the scrolled frames, the keyboard walk and the speed runs in this folder come
from one clean build at `d2cc634` on port 3213. After them, the mechanical acceptance scan (`acceptance_checks.py`)
found register IDs and bare tier codes still in the default view (inside the catalogue's own sentences, e.g.
*"…are T4"*, *"(BW-Q01)"*); a build-side `plain_text` pass was added (commit after `d2cc634`) that gives a bare code
its word and drops register IDs from the default view (the raw text stays in the ledger). The scan after that pass
reports 12 pages with a remaining hit (down from 28) and one station paragraph. **The captures were not retaken
after that fix, so the images here show the earlier wording.** The next session should: finish the last hits, rebuild
from a clean tree, retake this folder under the new commit, and complete this file.

| # (06 §4) | Check | Verdict at `d2cc634` | Evidence |
|---|---|---|---|
| 1 | Screens, two widths, both themes | captured — 15 routes × 1440/1024 × light/dark × viewport/full = 120 PNGs, plus greyscale and scrolled frames (139 files) | `d2cc634_*.png` |
| 2 | Greyscale | the one labelled curve, the ghosted parts and the words still read | `d2cc634_16_greyscale_*` |
| 3 | Screenshot escape | **pass** — the rail is in all 16 scrolled frames (cell pages, an asset view, a curve page) | `escape.json`, `d2cc634_13_escape_*` |
| 4 | Keyboard | **pass** — library → tile → *How this was built* (arrow keys) → step panel (Enter, Escape, focus returns) → part selector (`?part=1`) → the curve's own page → ⓘ → close; the 2 px accent ring at every step, both themes | `keywalk.json` |
| 5 | Copy | **not yet** — see the state above; the fixed sentences are unchanged | `acceptance_checks.txt` |
| 6 | Themes | both captured; the builder's eye only | the dark captures |
| 7 | Cold read | **pending** — needs a named reader: *which hazards affect solar farms, and how sure are we?* (Solar farm page) and *what does the PCS flood curve say and what is it based on?* (the PCS curve page), under two minutes each | — |
| 8 | Speed | **pass** — worst *usable* 510 ms at 4× slower CPU (cell page, budget 1,500); library 227 ms (budget 1,000) | `speed.json` |
| 9 | Owner review | open | the running app, `/v0` |

Brief §5: 3 (captions) **pass** — 104 of 104 drawn curves carry the four parts; 4 (sources) — 267 documents, 249
linked, 13 locator only, 5 with neither (named on the review queue); 5 (every asset) **pass** — all five render with
the *split differently* block; 6 (older cells) **pass** — hail × solar 21 sources (20 linked), flood × solar 8,
convective wind × solar 10, convective wind × wind 8, three tier-table IDs unmatched and reported; 1 (no code in the
default view), 2 (one curve at a time) and 7 (plain panels) need the retake described above.
