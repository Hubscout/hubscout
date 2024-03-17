"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CastSnippet } from "./CastSnippet";
import { sendEventToAmplitude } from "@/lib/amplitude";
import { getUserId } from "@/helpers/utils";

export default function Thread({ casts, currentHash }: any): JSX.Element {
  const rootCasts = [] as any;
  const responseMap = new Map();

  casts.forEach((cast: any) => {
    if (!cast.parentHash) {
      // This cast is a root cast, not a response to another cast
      rootCasts.push(cast);
    } else {
      // This cast is a response to another cast
      if (!responseMap.has(cast.parentHash)) {
        responseMap.set(cast.parentHash, []);
      }
      responseMap.get(cast.parentHash).push(cast);
    }
  });

  // Step 2: Recursively build the nested response structure
  function buildResponseTree(cast: any): any {
    const responses = responseMap.get(cast.hash) || [];
    return {
      ...cast,
      responses: responses.map(buildResponseTree), // Recursive step
    };
  }

  // Transform each root cast into a tree structure including its responses
  const castsWithResponses = rootCasts.map(buildResponseTree);

  function renderCasts(casts: any[], isStart = false): JSX.Element[] {
    return casts.map((cast: any, index: number) => (
      <Link
        onClick={async () => {
          try {
            const userId = getUserId();
            await sendEventToAmplitude(userId, "click_thread_cast", {
              clicked_hash: cast.hash,
              hash: currentHash,
            });
          } catch (e) {
            console.error(e);
          }
        }}
        key={cast.hash}
        href={`/cast/${cast.hash}`}
      >
        <div
          // Conditionally apply a different style if the cast.hash matches currentHash
          className={`p-2 my-4 rounded-lg w-full ${cast.hash.toLowerCase() === currentHash.toLowerCase() ? "border-2 border-slate-500 hover:border-slate-600" : "border-2 border-slate-100 hover:border-slate-200"}`}
          key={index + cast.hash}
        >
          {isStart ? (
            <h2 className="text-lg font-semibold mb-2">Thread</h2>
          ) : null}
          <CastSnippet {...cast} />
          {cast.responses && cast.responses.length > 0 && (
            <div className="ml-4">{renderCasts(cast.responses, false)}</div>
          )}
        </div>
      </Link>
    ));
  }

  return <div>{renderCasts(castsWithResponses, true)}</div>;
}
