"use client";
import { getUserId } from "@/helpers/utils";
import { CastSnippet } from "./CastSnippet";
import { sendEventToAmplitude } from "@/lib/amplitude";
import { fetchRecommendedCasts } from "@/helpers/fetchThreadResults";
import { useEffect, useState } from "react";
import Link from "next/link";

const RecommendedCasts = ({ hash }: { hash: string }) => {
  const [casts, setCasts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!hash) return;
      setLoading(true); // Start loading
      try {
        const data = await fetchRecommendedCasts(hash.slice(2), 5);
        setCasts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchData();
  }, [hash]);

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded-md"></div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="h-4 bg-slate-200 rounded-md"></div>
          <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-4 p-4 rounded-lg border border-slate-200 md:w-1/3">
      <h2 className="text-lg font-semibold mb-2">Similar casts</h2>
      <div>
        {loading ? (
          <SkeletonLoader />
        ) : (
          casts.map((cast, index) => (
            <Link
              onClick={async () => {
                try {
                  const userId = getUserId();
                  await sendEventToAmplitude(userId, "click_suggested", {
                    clicked_hash: cast.hash,
                    hash: hash,
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
              href={`/cast/${cast.hash}`}
              key={index + cast.hash} // Key is correctly placed here for list rendering
            >
              <div className="border-2 border-slate-200 cursor-pointer hover:border-slate-300 rounded-lg p-2 my-4">
                <CastSnippet {...cast} />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedCasts;
