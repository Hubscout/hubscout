import { fetchCastResults } from "@/helpers/fetchCastResults";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { Cast } from "@/components/Cast";
import Filter from "@/components/Filter";
import Contains from "@/components/Contains";
import posthog from "posthog-js";

export const revalidate = 60 * 5; // 5 minutes

export default async function Page({ params, searchParams }: PageProps) {
  let query = params.query;

  const time = searchParams?.time as "day" | "week" | "month" | "year" | null;
  const contains = searchParams?.contains as string | null;
  posthog.capture("query", {
    query,
    time,
    contains,
  });
  const casts = await fetchCastResults(
    encodeURIComponent(query),
    time,
    contains
  );
  query = decodeURIComponent(query).split("?")[0];

  return (
    <div
      className="w-screen p-2 col-fs-c bg-white"
      style={{ paddingTop: "5vw" }}
    >
      <div className="w-full col gap-2" style={{ maxWidth: 540 }}>
        <Title />
        <SearchBar initValue={query} time={time} contains={contains} />
        <div className="flex w-full space-x-3">
          <Filter query={params.query} time={time} contains={contains} />
          {/* <Contains query={params.query} contains={contains} time={time} /> */}
        </div>

        {casts ? casts.map((c, i) => <Cast key={i + c.hash} {...c} />) : null}
      </div>
    </div>
  );
}

interface PageProps {
  params: {
    query: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Remove the 'generateMetadata' function if it's not needed
