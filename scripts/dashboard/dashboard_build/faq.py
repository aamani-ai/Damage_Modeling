"""The FAQ (DCD-D24): docs/faq.md parsed into sections and questions, every Read more link checked."""
from __future__ import annotations

import re
from typing import Any

from .common import ROOT

FAQ = ROOT / "docs" / "faq.md"
MAX_SENTENCES = 4  # discussion 09 §4: at most four sentences, one example, one Read more link
SENTENCE_END = re.compile(r"(?<=[.?!])\s+(?=[A-Z*\"(])")


def sentences(text: str) -> list[str]:
    return [x for x in SENTENCE_END.split(text.strip()) if x.strip()]


META = re.compile(r"^\*Updated (\d{4}-\d{2}-\d{2}) · owner: ([^*]+)\*$")
READ_MORE = re.compile(r"^Read more: \[([^\]]+)\]\(([^)]+)\)$")


def build_faq(repo_blob_url: str) -> dict[str, Any]:
    """{"sections": [{"title", "questions": [{"id", "q", "updated", "owner", "answer": [para], "example", "read_more": {"label", "path", "href"}}]}],
    "errors": [...]}"""
    text = FAQ.read_text(encoding="utf-8")
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    sections: list[dict[str, Any]] = []
    errors: list[str] = []
    q: dict[str, Any] | None = None
    para: list[str] = []

    def flush_para() -> None:
        nonlocal para
        if q is not None and para:
            p = " ".join(s.strip() for s in para).strip()
            if p.startswith("**Example.**"):
                q["example"] = p[len("**Example.**"):].strip()
            elif p:
                q["answer"].append(p)
        para = []

    for line in text.splitlines():
        if line.startswith("## "):
            flush_para()
            sections.append({"title": line[3:].strip(), "questions": []})
            q = None
        elif line.startswith("### "):
            flush_para()
            if not sections:
                errors.append("a question appears before the first section")
                continue
            title = line[4:].strip()
            q = {"id": re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-"), "q": title, "updated": None, "owner": None, "answer": [], "example": None, "read_more": None}
            sections[-1]["questions"].append(q)
        elif q is not None and META.match(line.strip()):
            m = META.match(line.strip())
            q["updated"], q["owner"] = m.group(1), m.group(2).strip()
        elif q is not None and READ_MORE.match(line.strip()):
            flush_para()
            m = READ_MORE.match(line.strip())
            target = m.group(2).split("#")[0]
            path = (FAQ.parent / target).resolve()
            try:
                rel = str(path.relative_to(ROOT.resolve()))
            except ValueError:
                rel = None
            if not rel or not path.exists():
                errors.append(f"{q['q']}: Read more link {m.group(2)} does not resolve")
            q["read_more"] = {"label": m.group(1), "path": rel, "href": f"{repo_blob_url}/{rel}" if rel else None}
        elif not line.strip():
            flush_para()
        elif q is not None:
            para.append(line)
    flush_para()
    for s in sections:
        for qq in s["questions"]:
            if not qq["updated"] or not qq["owner"]:
                errors.append(f"{qq['q']}: missing its *Updated … · owner: …* line")
            if not qq["read_more"]:
                errors.append(f"{qq['q']}: missing its Read more link")
            if not qq["answer"]:
                errors.append(f"{qq['q']}: no answer")
            n = len(sentences(" ".join(qq["answer"])))
            if n > MAX_SENTENCES:
                errors.append(f"{qq['q']}: the answer has {n} sentences; at most {MAX_SENTENCES} (09 §4)")
            if not qq["example"]:
                errors.append(f"{qq['q']}: no example")
    return {"schema": "damage_dashboard_faq.v1", "source": "docs/faq.md", "sections": sections, "n_questions": sum(len(s["questions"]) for s in sections), "errors": errors}
