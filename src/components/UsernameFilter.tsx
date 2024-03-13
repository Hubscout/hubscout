"use client";

import FarcasterProfileInfo from "@/app/FarcasterProfileInfo";
import { fetcher } from "@/lib/neynar";
import supabase from "@/lib/supabase";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import useSWR from "swr";

export const constructHref = (
  query: string,
  time: string | null | undefined,
  channel: string | null | undefined,
  fid: string | null | undefined
) => {
  const {
    isAuthenticated,
    profile: { username, fid: userFid, bio, displayName, pfpUrl },
  } = FarcasterProfileInfo();
  // Encode the query part of the URL to handle special characters
  // Start constructing the URL with the encoded query
  let url = `/${query}`;

  // Initialize an array to hold query parameters
  let queryParams = [];

  // Add time, channel, and username to the queryParams array if they exist
  if (time) queryParams.push(`time=${encodeURIComponent(time)}`);
  if (channel) queryParams.push(`channel=${encodeURIComponent(channel)}`);
  if (fid) queryParams.push(`fid=${encodeURIComponent(fid)}`);
  if (userFid) queryParams.push(`userFid=${encodeURIComponent(userFid)}`);
  // Join all query parameters with '&' and prepend with '?' if there are any parameters
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  return url;
};

interface FilterProps {
  query: string;
  time?: string | null;
  channel?: string | null;
  fid?: string | null;
}

const UsernameFilter: React.FC<FilterProps> = ({
  query,
  time,
  channel,
  fid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usernameText, setUsernameText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [usernameData, setUsernameData] = useState<any>([]);
  const { data: usernames, error } = useSWR(
    `/api/get_usernames/${usernameText}`,
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  const getUser = async (fid: string) => {
    const usernameInfo = await axios.get(`/api/get_username/${fid}`);

    if (usernameInfo.data) setUsernameData(usernameInfo.data);
  };

  useEffect(() => {
    if (fid) {
      getUser(fid);
    } else {
      setUsernameData("");
    }
  }, [fid]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const defaultUser = { fid: null, username: null, pfp_url: null };

  let usernameOptions =
    Array.isArray(usernames) && usernameText
      ? [defaultUser, ...usernames]
      : [defaultUser];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-full border-2 border-slate-100 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={toggleDropdown}
        >
          <div className="flex flex-row items-center space-x-4">
            {usernameData && usernameData.pfp_url && usernameData.pfp_url ? (
              <img
                src={usernameData.pfp_url}
                className="w-5 h-5 rounded-full"
              />
            ) : null}
            <p>
              {usernameData && usernameData.username
                ? usernameData.username
                : "Any User"}
            </p>
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-64 max-h-48 border-2 border-slate-100 cursor-pointer hover:border-slate-200 p-3 rounded-xl z-50 bg-slate-50 overflow-y-auto">
          <input
            type="text"
            placeholder="Filter users..."
            className="mb-2 w-full px-2 py-1 border-2 border-slate-300 rounded-md"
            value={usernameText}
            onChange={(e) => setUsernameText(e.target.value)}
          />
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {usernameOptions.map((user: any) => (
              <Link
                key={user.fid ?? "any"}
                onClick={async () => {
                  setIsOpen(false);
                  setUsernameText("");
                }}
                className="block px-1 py-2 text-sm text-left font-medium font-slate-700 opacity-75 break-words w-full hover:bg-slate-200 rounded-md"
                href={constructHref(query, time, channel, user.fid)}
              >
                <div
                  key={user.fid}
                  className="flex flex-row items-center space-x-3"
                >
                  {user.pfp_url ? (
                    <img
                      src={user.pfp_url}
                      alt=""
                      key={user.fid}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6" />
                  )}
                  <p key={user.fid} className="truncate flex-grow">
                    {user.username ?? "Any User"}
                  </p>{" "}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsernameFilter;
