import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { Cast } from "@/components/Cast";
import { fetchCastResults } from "@/helpers/fetchCastResults";

export const revalidate = 60 * 5; // 5 minutes

export default async function Page({ params }: PageProps) {
  const casts = await fetchCastResults(params.query);

  return (
    <div className="w-screen p-4 col-fs-c bg-white">
      <div className="w-full col gap-2" style={{ maxWidth: 720 }}>
        <Title />
        <SearchBar initValue={params.query} />
        {casts
          .filter((cast) => cast.hash)
          .map((c, i) => (
            <Cast key={i + c.hash} {...c} />
          ))}
      </div>
    </div>
  );
}

interface PageProps {
  params: {
    query: string;
  };
}
