import Link from "next/link";

export function APIDisclaimer() {
  return (
    <div className="opacity-75 col w-full border-2 border-transparent">
      <div className="h-1" />
      <span className="pl-4 text-xs font-semibold uppercase text-slate-400">
        DC{" "}
        <Link
          style={{ color: "#8562CE" }}
          target="_blank"
          href="https://warpcast.com/gregfromstl"
        >
          Greg
        </Link>{" "}
        or{" "}
        <Link
          style={{ color: "#8562CE" }}
          target="_blank"
          href="https://warpcast.com/kevinoconnell"
        >
          Kevin
        </Link>{" "}
        for API
      </span>
    </div>
  );
}
