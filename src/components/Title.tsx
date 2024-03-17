import { search } from "@/svg";
import Link from "next/link";

export function Title() {
  return (
    <Link
      href="/"
      style={{ color: "#8562CE", paddingTop: "1.5vw" }}
      className="row gap-2 w-full justify-center items-center text-xl select-none font-bold text-slate-700 border-2 border-transparent"
    >
      Hubscout
    </Link>
  );
}
