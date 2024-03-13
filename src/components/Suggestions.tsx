import { search } from "@/svg";
import Link from "next/link";

export function Suggestions() {
  return (
    <div className="border-2 border-slate-100 w-full p-2 rounded-xl">
      <span className="text-sm font-medium text-slate-400 p-2">
        Not sure what to search? Try these suggestions!
      </span>
      <div className="h-1" />
      {suggestions.map((text: string, i: number) => (
        <Link
          href={`/${encodeURIComponent(text)}`}
          key={i}
          className="rounded-md hover:bg-slate-50 cursor-pointer row-fs-c gap-1 svg-small h-8 row-fs-c pl-2"
        >
          <div className="fill-slate-400">{search}</div>
          <span className="text-sm font-medium text-slate-600">{text}</span>
        </Link>
      ))}
    </div>
  );
}

const suggestions = [
  "How should I start learning to code?",
  "$DEGEN airdrop one million reward",
  "how to be an angel investor",
  "What is the best VR headset to get?",
  "is farcaster better than bluesky",
  "How can I get around the 30 percent fee on the app store?",
];
