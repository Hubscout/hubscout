import { fetchCastResults } from "@/helpers/fetchCastResults";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { Cast } from "@/components/Cast";
import Filter from "@/components/TimeFilter";
import TimeFilter from "@/components/TimeFilter";
import ChannelFilter from "@/components/ChannelFilter";
import useSWR from "swr";
import UsernameFilter from "@/components/UsernameFilter";

export const revalidate = 60 * 30; // 5 minutes
export const maxDuration = 10;

export default async function Page({ params, searchParams }: PageProps) {
  let query = params.query;
  const time = searchParams?.time as "day" | "week" | "month" | "year" | null;
  let channel = searchParams?.channel as string | null;
  let username = searchParams?.username as string | null;
  const casts = await fetchCastResults(
    encodeURIComponent(query),
    time,
    channel,
    username
  );
  query = decodeURIComponent(query).split("?")[0];
  username = username ? decodeURIComponent(username) : null;
  channel = channel ? decodeURIComponent(channel) : null;

  return (
    <div
      className="w-screen p-2 col-fs-c bg-white"
      style={{ paddingTop: "5vw" }}
    >
      <div className="w-full col gap-2" style={{ maxWidth: 540 }}>
        <Title />
        <SearchBar
          initValue={query}
          time={time}
          channel={channel}
          username={username}
        />
        <div className="flex w-full space-x-3">
          <TimeFilter
            query={params.query}
            time={time}
            channel={channel}
            username={username}
          />
          <ChannelFilter
            query={params.query}
            channel={channel}
            time={time}
            username={username}
          />
          <UsernameFilter
            query={params.query}
            username={username}
            time={time}
            channel={channel}
          />
          {/* <Contains query={params.query} contains={contains} time={time} /> */}
        </div>

        {casts && casts.length ? (
          casts.map((c, i) => <Cast key={i + c.hash} {...c} />)
        ) : (
          <div className="h-screen flex-1 flex w-full justify-center items-center">
            <p className="text-sm text-center">
              No casts found, try reducing the filters or trying something
              different!
            </p>
          </div>
        )}
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
