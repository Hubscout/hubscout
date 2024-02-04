export const dynamic = "force-dynamic";

import { Suggestions } from "@/components/Suggestions";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { APIDisclaimer } from "@/components/APIDisclaimer";
import { headers } from "next/headers";

export async function generateMetadata({ params }: { params: any }) {
  const headersList = headers();

  const host = headersList.get("host"); // to get domain

  console.log({ host });

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
      "fc:frame:post_url": `${host ?? "https://www.hubscout.xyz"}/api/frame`,
      "fc:frame:input:text": "Search",
    },
    metadataBase: new URL(host ?? "https://www.hubscout.xyz"),
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
