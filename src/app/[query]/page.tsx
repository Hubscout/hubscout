import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { Cast } from "@/components/Cast";
import { fetchCastResults } from "@/helpers/fetchCastResults";

export const revalidate = 60 * 5; // 5 minutes

export default async function Page({ params }: PageProps) {
  const casts = await fetchCastResults(params.query);

  return (
    <div className="w-screen p-2 col-fs-c bg-white" style={{ paddingTop: "5vw" }}>
      <div className="w-full col gap-2" style={{ maxWidth: 540 }}>
        <Title />
        <SearchBar initValue={params.query} />
        {casts ? casts.filter((cast) => cast && cast.hash).map((c, i) => <Cast key={i + c.hash} {...c} />) : null}
      </div>
    </div>
  );
}

interface PageProps {
  params: {
    query: string;
  };
}
