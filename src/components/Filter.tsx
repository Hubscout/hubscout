"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface TimeOption {
  label: string;
  value: string | null;
}

const timeOptions: TimeOption[] = [
  { label: "Any Time", value: null },
  { label: "Past Day", value: "day" },
  { label: "Past Week", value: "week" },
  { label: "Past Month", value: "month" },
  { label: "Past Year", value: "year" },
];
export const constructHref = (
  query: string,
  time: string | null | undefined,
  contains: string | null | undefined
) => {
  // Check if the query string already has query parameters
  const hasQueryParams = query.includes("?");

  // Determine the correct separator based on whether the query string already has parameters
  let separator = hasQueryParams ? "&" : "?";

  // Construct the URL with the appropriate query parameters
  let url = `/${query}`;

  if (time) {
    url += `${separator}time=${time}`;
    // If using '&' as a separator, update the separator for subsequent parameters
    separator = "&";
  }

  if (contains) {
    url += `${separator}contains=${contains}`;
  }

  return url;
};

interface FilterProps {
  query: string;
  time?: string | null;
  contains?: string | null;
}

const Filter: React.FC<FilterProps> = ({ query, time, contains }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
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
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                href={constructHref(query, option.value, contains as any)}
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

export default Filter;
