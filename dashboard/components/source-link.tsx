// A source is a link when its register row has a URL, DOI or repository file; otherwise its title and locator with
// the build's words "no link in the register" (brief §3.2). Never an ID alone in the default view.
import type { SourceLink } from "@/lib/types";

export function SourceRef({ s, id, className = "", showLocator = true }: { s: SourceLink & { title?: string | null; citation?: string | null }; id?: string | null; className?: string; showLocator?: boolean }) {
  const title = s.title || s.citation || id || "untitled source";
  const kindWord = s.link_kind === "repo_file" ? "a file in this repository" : s.link_kind === "hazard_file" ? "a file in the Hazard repository (its main branch, not pinned)" : s.link_kind === "doi" ? "DOI" : s.link_kind === "url" ? "web page" : "";
  return (
    <span className={className}>
      {s.link ? (
        <a href={s.link} target="_blank" rel="noreferrer" title={kindWord ? `Opens ${kindWord}` : undefined} className="text-accent hover:underline">
          {title} <span aria-hidden className="text-[10px]">↗</span>
        </a>
      ) : (
        <span>{title}</span>
      )}
      {showLocator && s.locator ? <span className="text-muted-foreground"> · {s.locator}</span> : null}
      {!s.link && s.no_link_sentence ? <span className="italic text-muted-foreground"> · {s.no_link_sentence}</span> : null}
    </span>
  );
}

/** A tier as words with the code secondary: "transferred · T3". */
export function TierWord({ code, words, className = "" }: { code: string | null | undefined; words: Record<string, string>; className?: string }) {
  if (!code || code === "–") return <span className={`text-muted-foreground ${className}`}>no tier stated</span>;
  return (
    <span className={className}>
      {words[code] ?? code} <span className="font-mono text-[10px] text-muted-foreground">· {code}</span>
    </span>
  );
}
