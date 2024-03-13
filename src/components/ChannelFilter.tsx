"use client";

import supabase from "@/lib/supabase";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { constructHref } from "./UsernameFilter";
import FarcasterProfileInfo from "@/app/FarcasterProfileInfo";
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TimeOption {
  id: string;
  parent_url: string | null;
  image_url: string | null;
}

const defaultChannelOptions: TimeOption[] = [
  { id: "Any Channel", parent_url: null, image_url: null },
  {
    id: "farcon",
    parent_url:
      "chain://eip155:1/erc721:0x2A9EA02E4c2dcd56Ba20628Fe1bd46bAe2C62746",
    image_url: "https://i.imgur.com/mtH8eq1.jpg",
  },
  {
    id: "bounties",
    parent_url: "https://www.bountycaster.xyz",
    image_url: "https://warpcast.com/~/channel-images/bounties.png",
  },
  {
    id: "degen",
    parent_url:
      "chain://eip155:7777777/erc721:0x5d6a07d07354f8793d1ca06280c4adf04767ad7e",
    image_url:
      "https://ipfs.decentralized-content.com/ipfs/bafkreieudzvadtjy36j7x2i73isqw2jmgbwtum3p3eaahn4mnztuzl7y7e",
  },
  {
    id: "founders",
    parent_url: "https://farcaster.group/founders",
    image_url: "https://warpcast.com/~/channel-images/founders.png",
  },
  {
    id: "degendao",
    parent_url: "https://warpcast.com/~/channel/degendao",
    image_url: "https://i.imgur.com/33J39Sf.png",
  },
];

interface FilterProps {
  query: string;
  time?: string | null;
  channel?: string | null;
  fid?: string | null;
}

const ChannelFilter: React.FC<FilterProps> = ({
  query,
  time,
  channel,
  fid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: channelOptions, error } = useSWR("/api/get_channels", fetcher);
  const {
    isAuthenticated,
    profile: { username, fid: userFid, bio, displayName, pfpUrl },
  } = FarcasterProfileInfo();
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

  let channelsMap = new Map<string, TimeOption>(
    defaultChannelOptions.map((option) => [option.id, option])
  );

  if (Array.isArray(channelOptions)) {
    channelOptions.forEach((option) => {
      if (!channelsMap.has(option.id)) {
        // Prevent duplicates
        channelsMap.set(option.id, option);
      }
    });
  }

  const channels = Array.from(channelsMap.values());

  // Filter channels based on the filterText, but keep "Any Channel" always at the top
  const filteredChannels = [
    defaultChannelOptions[0],
    ...channels.filter(
      (channel) =>
        channel.id !== "Any Channel" &&
        channel.id.toLowerCase().includes(filterText.toLowerCase())
    ),
  ];

  const currentChannel =
    channels &&
    Array.isArray(channels) && // Ensure channels is an array before calling .find
    channels.find((option: any) => option.parent_url === channel);

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
            {currentChannel && currentChannel.image_url ? (
              <img
                src={currentChannel.image_url}
                className="w-5 h-5 rounded-full"
              />
            ) : null}
            <p>{currentChannel ? currentChannel.id : "Any Channel"}</p>
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
            placeholder="Filter channels..."
            className="mb-2 w-full px-2 py-1 border-2 border-slate-300 rounded-md"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {Array.isArray(channels) && // Ensure channels is an array before mapping
              filteredChannels.map((option: any) => (
                <Link
                  key={option.parent_url ?? "any"}
                  onClick={async () => {
                    setIsOpen(false);
                    setFilterText("");
                  }}
                  className="block px-1 py-2 text-sm text-left font-medium font-slate-700 opacity-75 break-words w-full hover:bg-slate-200 rounded-md"
                  href={constructHref(
                    query,
                    time,
                    option.parent_url,
                    fid,
                    userFid ?? null
                  )}
                >
                  <div className="flex flex-row items-center space-x-3">
                    {option.image_url ? (
                      <img
                        src={option.image_url}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover" // Ensure the image covers the area without distortion
                      />
                    ) : (
                      <div className="w-6 h-6"></div>
                    )}
                    <p className="truncate flex-grow">{option.id}</p>{" "}
                    {/* Ensure text doesn't overflow and pushes layout */}
                  </div>
                  {/* Ensure you use option.label instead of option.id if you want to display the label */}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelFilter;
