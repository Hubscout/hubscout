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
      {/* Container for thread and suggested casts */}
      <div className="w-full lg:space-x-4 lg:justify-center  sm:items-center lg:items-start  flex sm:flex-col lg:flex-row">
        <Thread casts={thread} currentHash={hash} />
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
