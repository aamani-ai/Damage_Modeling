"""A source's link points only at a file of this repository that git sees (plan DCD-D30). A path through a gitignored link
to another checkout (infrasure-damage-curves/ → the old repository) or out of the repository is no link, so a preview
build never writes a path on this machine into a GitHub link; a main build, read from an export, never had one."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "dashboard"))

from dashboard_build import common, sources  # noqa: E402

REPO = "https://github.com/aamani-ai/Damage_Modeling"


def _link(**src):
    return sources.resolve_link({"id": "S-001", "citation": "a source", **src}, REPO, "abc1234")


def test_a_path_out_of_the_repository_is_no_link():
    # LEG-TCWS-001 in the hurricane × solar registers names a memo in the old repository through the gitignored link
    for path in ("infrasure-damage-curves/research/HURRICANE_x_SOLAR.md", "../Hazard_modeling/README.md"):
        for field in ("url", "locator"):
            s = _link(**{field: path})
            assert s["link"] is None and s["link_kind"] == "none" and s["no_link_sentence"] == sources.NO_LINK, (field, path)


def test_a_file_or_folder_git_sees_is_linked_at_the_commit():
    s = _link(url="docs/cells/README.md")
    assert s["link"] == f"{REPO}/blob/abc1234/docs/cells/README.md" and s["repo_path"] == "docs/cells/README.md"
    assert _link(url="docs/cells/strong_wind_solar/current")["link"] == f"{REPO}/tree/abc1234/docs/cells/strong_wind_solar/current"


def test_a_gitignored_link_to_another_checkout_is_refused(tmp_path, monkeypatch):
    # the same layout as this checkout, built where every machine has it: a repository with a gitignored link to a folder
    # outside it, beside a tracked file
    repo, outside = tmp_path / "repo", tmp_path / "old_checkout"
    (outside / "research").mkdir(parents=True)
    (outside / "research" / "memo.md").write_text("an old memo\n")
    (repo / "docs").mkdir(parents=True)
    (repo / "docs" / "kept.md").write_text("a tracked file\n")
    (repo / ".gitignore").write_text("/old\n")
    (repo / "old").symlink_to(outside, target_is_directory=True)
    subprocess.run(["git", "init", "-q", str(repo)], check=True)
    subprocess.run(["git", "-C", str(repo), "add", "."], check=True)
    for module in (common, sources):
        monkeypatch.setattr(module, "ROOT", repo)
    monkeypatch.setattr(sources, "CHECKOUT", repo)
    sources._git_visible.cache_clear()
    try:
        assert (repo / "old" / "research" / "memo.md").exists()  # reachable on disk, so only the rule stops it
        for field in ("url", "locator"):
            assert _link(**{field: "old/research/memo.md"})["link"] is None
        assert _link(url="memo.md")["link"] is None  # nor found by its name
        assert _link(url="docs/kept.md")["link"] == f"{REPO}/blob/abc1234/docs/kept.md"
    finally:
        sources._git_visible.cache_clear()
