"use client";

// /code/<damage_code_id>?v=<version_key>: consumers hold the code and version, not our entry ID (05 §5).
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type { Manifest } from "@/lib/types";

function Inner({ code, matches }: { code: string; matches: Manifest["codes"][string] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const v = sp.get("v");
  const exact = v ? matches.find((x) => x.version_key === v) : null;
  const target = exact ?? (matches.length === 1 && !v ? matches[0] : null);
  useEffect(() => {
    if (target) router.replace(`/cells/${target.entry_id}`);
  }, [target, router]);
  return (
    <div className="py-6 text-[12px]">
      <h2 className="text-[15px] font-semibold tracking-tight">Resolving a damage code</h2>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{code}{v ? ` · ${v}` : ""}</p>
      {target ? (
        <p className="mt-2">Opening <Link href={`/cells/${target.entry_id}`} className="text-accent hover:underline">{target.entry_id}</Link> ({target.model} · {target.docs}) …</p>
      ) : (
        <div className="mt-2">
          <p className="text-muted-foreground">{v ? `No entry carries version ${v} of this code at the build commit.` : "Several entries carry this code; pass ?v=<version key> or pick one."} The versions the build knows:</p>
          <ul className="mt-1 list-disc pl-5">
            {matches.map((x) => (
              <li key={x.entry_id + x.version_key}><Link href={`/cells/${x.entry_id}`} className="text-accent hover:underline">{x.entry_id}</Link> <span className="font-mono text-[10.5px] text-muted-foreground">{x.version_key} · {x.status} · sha {x.sha256?.slice(0, 7)}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CodeResolver(props: { code: string; matches: Manifest["codes"][string] }) {
  return (
    <Suspense fallback={<div className="py-6 text-[12px] text-muted-foreground">Resolving…</div>}>
      <Inner {...props} />
    </Suspense>
  );
}
