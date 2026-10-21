import { notFound } from "next/navigation";
import { CodeResolver } from "@/components/code-resolver";
import { manifest } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(manifest().codes).map((code) => ({ code }));
}

export default async function CodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const m = manifest();
  const matches = m.codes[code];
  if (!matches) notFound();
  return <CodeResolver code={code} matches={matches} />;
}
