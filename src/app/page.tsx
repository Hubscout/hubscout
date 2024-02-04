import { Suggestions } from "@/components/Suggestions";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { APIDisclaimer } from "@/components/APIDisclaimer";
import {
  Frame,
  FrameButton,
  FrameConfig,
  FrameImage,
  FrameInput,
} from "@devcaster/next/frames";

export async function generateMetadata({
  params,
}: {
  params: { match: string; turn: string };
}) {
  return {
    title: "Hubscout",
    description: "Semantic search for Farcaster",
    openGraph: {
      title: "Hubscout",
      images: [`/hubscout.png`],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `/hubscout.png`,
      "fc:frame:button:1": "SEARCH",
      "fc:frame:post_url": `${
        process.env.URL ?? "https://www.hubscout.xyz"
      }/api/frame`,
      "fc:frame:input:text": "Search",
    },
    metadataBase: new URL(process.env.URL ?? "https://www.hubscout.xyz"),
  };
}

export default async function Page() {
  return (
    <>
      <div
        className="w-screen h-screen p-2 col-fs-c bg-white"
        style={{ paddingTop: "5vw" }}
      >
        <div className="w-full col gap-2" style={{ maxWidth: 540 }}>
          <Title />
          <SearchBar initValue="" />
          <Suggestions />
          <APIDisclaimer />
        </div>
      </div>
    </>
  );
}
