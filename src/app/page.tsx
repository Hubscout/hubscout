import { Suggestions } from "@/components/Suggestions";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { APIDisclaimer } from "@/components/APIDisclaimer";

export default async function Page() {
  return (
    <div className="w-screen h-screen p-2 col-fs-c bg-white" style={{ paddingTop: "5vw" }}>
      <div className="w-full col gap-2" style={{ maxWidth: 540 }}>
        <Title />
        <SearchBar initValue="" />
        <Suggestions />
        <APIDisclaimer />
      </div>
    </div>
  );
}
