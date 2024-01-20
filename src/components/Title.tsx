import { search } from "@/svg";
import Link from "next/link";

export function Title() {
  return (
    <Link
      href="/"
      style={{ color: "#8562CE" }}
      className="row w-full gap-2 text-xl select-none font-bold text-slate-700 pl-4 pr-4 border-2 border-transparent"
    >
      Hubscout
    </Link>
  );
}
