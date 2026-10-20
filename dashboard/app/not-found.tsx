import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10 text-sm">
      <h2 className="text-[15px] font-semibold">Nothing here</h2>
      <p className="mt-1 text-muted-foreground">This address does not match a cell, curve, asset or register in the manifest.</p>
      <Link href="/" className="mt-3 inline-block text-accent hover:underline">Back to the library</Link>
    </div>
  );
}
