"use client";
import { useState } from "react";
import useSWR from "swr";

export default function Home() {
  const fetcher = (url: any) => fetch(url).then((res) => res.json());
  const [query, setQuery] = useState("");
  const { data, error } = useSWR(
    query ? `/api/search?query=${query}` : null,
    fetcher
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen flex-1">
      <input
        className="p-2 m-2 border border-gray-300 rounded-md text-black"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col">
          {data
            ? data.casts.map((result: any) => (
                // eslint-disable-next-line react/jsx-key
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.warpcast.com/${
                    result.username
                  }/0x${result.hash.substring(0, 8)}`}
                  className="flex flex-col p-2 m-2 bg-gray-700 hover:bg-gray-800 w-144 min-w-lg"
                >
                  <div className="flex flex-row">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={result.pfp.url}
                      alt="avatar"
                    />
                    <h1 className="text-sm font-bold text-white">
                      {result.displayName}
                    </h1>
                  </div>
                  <div className="flex flex-row">
                    <p className="text-md">{result.cast}</p>
                  </div>
                </a>
              ))
            : null}
        </div>
        <div className="flex flex-col">
          {data
            ? data.profiles.map((result: any) => (
                // eslint-disable-next-line react/jsx-key
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.warpcast.com/${result.fname}`}
                  className="flex flex-col p-2 m-2 bg-gray-700 hover:bg-gray-800 w-144 min-w-lg"
                >
                  <div className="flex flex-row">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={result.avatar_url}
                      alt="avatar"
                    />
                    <h1 className="text-sm font-bold text-white">
                      {result.fname}
                    </h1>
                  </div>
                  <div className="flex flex-row">
                    <p className="text-xs">{result.bio}</p>
                  </div>
                </a>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
