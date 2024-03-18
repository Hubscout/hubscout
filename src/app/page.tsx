export const dynamic = "force-dynamic";

import { Suggestions } from "@/components/Suggestions";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { APIDisclaimer } from "@/components/APIDisclaimer";
import { headers } from "next/headers";

export default async function Page() {
  return (
    <>
      <div className="w-screen h-screen p-2 col-fs-c bg-white">
        <div className="w-full col gap-2" style={{ maxWidth: 540 }}>
          <SearchBar initValue="" />
          <Suggestions />
          <APIDisclaimer />
        </div>
      </div>
    </>
  );
}
