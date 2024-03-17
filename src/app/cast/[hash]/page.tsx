import { fetchThreadResults } from "@/helpers/fetchThreadResults";
import Thread from "@/components/Thread";
import RecommendedCasts from "@/components/RecommendedCasts";

export const revalidate = 60 * 30; // 5 minutes
export const maxDuration = 60;

export default async function Page({ params }: PageProps) {
  let hash = params.hash;

  const threadResult = await fetchThreadResults(hash);
  let { thread } = threadResult;
  return (
    <div className="w-screen min-h-screen p-2 bg-white">
      {/* Title above both thread and suggested casts */}

      {/* Container for thread and suggested casts */}
      <div className="w-full flex flex-row space-x-4 justify-center gap-2">
        {/* Thread container */}
        <div className="flex flex-col gap-2" style={{ maxWidth: 540 }}>
          <Thread casts={thread} currentHash={hash} />
        </div>
        {/* Suggested Casts container, check for existence and render if not empty */}
        <RecommendedCasts hash={hash} />
      </div>
    </div>
  );
}

interface PageProps {
  params: {
    hash: string;
  };
}
