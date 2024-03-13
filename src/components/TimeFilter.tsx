"use client";
import classNames from "classnames";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { constructHref } from "./UsernameFilter";
import FarcasterProfileInfo from "@/app/FarcasterProfileInfo";

interface TimeOption {
  label: string;
  value: string | null;
}

const timeOptions: TimeOption[] = [
  { label: "Any Time", value: null },
  { label: "Past Day", value: "day" },
  { label: "Past Week", value: "week" },
  { label: "Past Month", value: "month" },
  { label: "Past Three Months", value: "three_months" },
  { label: "Past Year", value: "year" },
];

interface FilterProps {
  query: string;
  time?: string | null;
  channel?: string | null;
  fid?: string | null;
}

const TimeFilter: React.FC<FilterProps> = ({ query, time, channel, fid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
          {timeOptions.find((option) => option.value === time)?.label ??
            "Any Time"}
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
        </button>
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-64 border-2 border-slate-100  cursor-pointer hover:border-slate-200  p-3 rounded-xl z-50 bg-slate-50 ">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {timeOptions.map((option) => (
              <Link
                key={option.value ?? "any"}
                onClick={() => setIsOpen(false)}
                className="block px-1 py-2 text-sm text-left font-medium font-slate-700 opacity-75 break-words w-full hover:bg-slate-200 rounded-md"
                href={constructHref(
                  query,
                  option.value,
                  channel as any,
                  fid,
                  userFid
                )}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
