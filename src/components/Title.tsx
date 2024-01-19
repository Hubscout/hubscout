import Link from "next/link";

export function Title() {
  return (
    <Link
      href="/"
      className="row gap-1 text-xl select-none font-semibold text-slate-700 pl-4 border-2 border-transparent"
    >
      <span style={{ color: "#8562CE50" }}>Farcaster</span>
      <span style={{ color: "#8562CE80" }}>Semantic</span>
      <span style={{ color: "#8562CE" }}>Search</span>
    </Link>
  );
}
