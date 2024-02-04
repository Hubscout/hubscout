export const dynamic = "force-dynamic";

import { Suggestions } from "@/components/Suggestions";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { APIDisclaimer } from "@/components/APIDisclaimer";
import { headers } from "next/headers";

export default async function Page() {
  return (
    <>
      <meta property="og:image" content="<generated>" />
      <meta property="og:title" content="Hubscout" />
      <meta property="og:description" content="Semantic search for Farcaster" />
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="<generated>" />
      <meta property="fc:frame:button:1" content="SEARCH" />
      <meta
        property="fc:frame:post_url"
        content="https://www.hubscout.xyz/api/frame"
      />
      <meta property="fc:frame:input:text" content="Search" />

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
