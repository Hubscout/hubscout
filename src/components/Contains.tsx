"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { constructHref } from "./Filter";
import Link from "next/link";

interface ContainsProps {
  query: string;
  time?: string | null;
  contains?: string | null;
}

const Contains: React.FC<ContainsProps> = ({ query, time, contains }) => {
  const phraseOptions: any[] = [
    { label: "Select an option", value: null }, // Default option
    { label: "@dwr", value: "@dwr" },
    { label: "farcon", value: "farcon" },
    { label: "farcaster", value: "farcaster" },
  ];

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [phrase, setPhrase] = useState<string>(phraseOptions[0].value || "");
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

  const updateURL = (finalPhrase: string) => {
    const href = constructHref(query, time as any, finalPhrase);
    router.push(href);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateURL(phrase);
    setIsOpen(false);
  };

  const handleSelectPhrase = (selectedValue: string) => {
    setPhrase(selectedValue);
    setIsOpen(false);

    updateURL(selectedValue);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        {contains ? contains : "Select a phrase"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {phraseOptions.map((predefinedPhrase, index) => (
              <Link
                key={index}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => {
                  handleSelectPhrase(predefinedPhrase.value);
                }}
                href={`${constructHref(
                  query,
                  time as any,
                  predefinedPhrase.value
                )}`}
              >
                {predefinedPhrase.label}
              </Link>
            ))}
            <form onSubmit={handleSubmit} className="px-4 py-2">
              <input
                type="text"
                value={phrase}
                onChange={(e: any) => {
                  setPhrase(e.target.value);
                  if (e.key === "Enter") {
                    handleSubmit(e);

                    setPhrase("");
                  }
                }}
                placeholder="Enter custom phrase or select above"
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contains;
