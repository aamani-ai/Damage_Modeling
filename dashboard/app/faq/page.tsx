// The FAQ (G23, DCD-D24): one Markdown file, docs/faq.md, parsed by the data build (which checks every Read more link)
// and rendered here. Each question carries its date and owner; each answer is short, with one example.
import { notFound } from "next/navigation";
import { FileLink } from "@/components/ui";
import { blobUrl, faq, manifest } from "@/lib/data";

export default function FaqPage() {
  const m = manifest();
  const f = faq();
  if (!f) notFound();
  return (
    <div className="mx-auto max-w-[980px]">
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[15px] font-semibold tracking-tight">Frequently asked questions</h2>
          <span className="text-[11px] text-muted-foreground">{f.n_questions} questions · kept in <FileLink href={blobUrl(m, f.source)}>{f.source}</FileLink></span>
        </div>
        <nav aria-label="Sections" className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11.5px]">
          {f.sections.map((s) => <a key={s.title} href={`#${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-accent hover:underline">{s.title}</a>)}
        </nav>
      </div>
      <div className="mt-3 space-y-5">
        {f.sections.map((s) => (
          <section key={s.title} id={s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-24">
            <h3 className="mb-2 border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.title}</h3>
            <div className="space-y-3">
              {s.questions.map((q) => (
                <article key={q.id} id={q.id} className="scroll-mt-24 rounded-lg border border-border bg-card px-4 py-3">
                  <h4 className="text-[13.5px] font-semibold leading-snug">{q.q}</h4>
                  <div className="mt-1 space-y-1.5 text-[12.5px] leading-relaxed">
                    {q.answer.map((p, i) => <p key={i}>{p.replace(/\*([^*]+)\*/g, "$1")}</p>)}
                  </div>
                  {q.example ? (
                    <p className="mt-2 rounded-md bg-muted px-2.5 py-1.5 text-[12px] leading-snug"><span className="font-medium">Example. </span>{q.example.replace(/\*([^*]+)\*/g, "$1")}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 text-[10.5px] text-muted-foreground">
                    {q.read_more?.href ? <a href={q.read_more.href} target="_blank" rel="noreferrer" className="text-accent hover:underline">Read more: {q.read_more.label} ↗</a> : null}
                    <span className="ml-auto">updated {q.updated} · {q.owner}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="mt-4 border-t border-border pt-2 text-[10.5px] text-muted-foreground">A question asked twice in review becomes a new entry. Built from {m.source.label}.</footer>
    </div>
  );
}
