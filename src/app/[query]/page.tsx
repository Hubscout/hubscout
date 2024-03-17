import { fetchCastResults } from "@/helpers/fetchCastResults";
import { SearchBar } from "@/components/SearchBar";
import { Title } from "@/components/Title";
import { Cast } from "@/components/Cast";

import TimeFilter from "@/components/TimeFilter";
import ChannelFilter from "@/components/ChannelFilter";

import UsernameFilter from "@/components/UsernameFilter";

import Feedback from "@/components/Feedback";

export const revalidate = 60 * 30; // 5 minutes
export const maxDuration = 60;

export default async function Page({ params, searchParams }: PageProps) {
  let query = params.query;
  const time = searchParams?.time as
    | "day"
    | "week"
    | "month"
    | "year"
    | "three_months"
    | null;
  let channel = searchParams?.channel as string | null;
  let fid = searchParams?.fid as string | null;
  let userFid = searchParams?.userFid as string | null;
  const castsResult = await fetchCastResults(
    encodeURIComponent(query),
    time,
    channel,
    fid,
    userFid
  );
  const requestId = castsResult.requestId;

  const casts = castsResult.casts ?? [];

  query = decodeURIComponent(query).split("?")[0];
  fid = fid ? decodeURIComponent(fid) : null;
  channel = channel ? decodeURIComponent(channel) : null;

  return (
    <div
      className="w-screen min-h-screen p-2 md:p-6 bg-white flex flex-col items-center"
      style={{ paddingTop: "2vw" }}
    >
      <div
        className="w-full flex flex-col gap-2 items-center"
        style={{ maxWidth: 540 }}
      >
        <SearchBar initValue={query} time={time} channel={channel} fid={fid} />
        <div className="flex flex-wrap justify-center gap-1 md:gap-2 md:flex-nowrap">
          <TimeFilter
            query={params.query}
            time={time}
            channel={channel}
            fid={fid}
          />
          <ChannelFilter
            query={params.query}
            channel={channel}
            time={time}
            fid={fid}
          />
          <UsernameFilter
            query={params.query}
            fid={fid}
            time={time}
            channel={channel}
          />
          {/* <Contains query={params.query} contains={contains} time={time} /> */}
        </div>
        <Feedback requestId={requestId} />

        {casts && casts.length ? (
          casts.map((c, i) => <Cast key={i + c.hash} {...c} />)
        ) : (
          <div className="flex-1 flex w-full justify-center items-center">
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
