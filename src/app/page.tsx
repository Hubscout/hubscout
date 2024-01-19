import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";

export default async function Page() {
  return (
    <div className="w-screen h-screen p-4 col-c-c bg-white">
      <div className="w-full col gap-2" style={{ maxWidth: 640 }}>
        <Title />
        <SearchBar initValue="" />
      </div>
    </div>
  );
}
