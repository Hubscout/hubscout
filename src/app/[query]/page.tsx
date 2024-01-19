import { fetchCastResults } from "@/helpers/fetchCastResults";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { Cast } from "@/components/Cast";
import { Metadata } from "next";

export const revalidate = 60 * 5; // 5 minutes

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const query = (params.query as string) ?? "Farcaster Semantic Search Engine";
  const title = decodeURIComponent(query);

  return {
    title,
  };
}

export default async function Page({ params }: PageProps) {
  const casts = await fetchCastResults(params.query);

  return (
    <div className="w-screen p-4 col-fs-c bg-white">
      <div className="w-full col gap-2" style={{ maxWidth: 720 }}>
        <Title />
        <SearchBar initValue={params.query} />
        {casts ? casts.map((c, i) => <Cast key={i + c.hash} {...c} />) : null}
      </div>
    </div>
  );
}

interface PageProps {
  params: {
    query: string;
  };
}

type MetadataProps = { params: { query: string } };
