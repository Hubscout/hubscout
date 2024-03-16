"use client";

import supabase from "@/lib/supabase";
import { useState } from "react";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PBM4209pap5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Feedback({ requestId }: { requestId: string }) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const giveFeedback = async (feedback: number) => {
    try {
      await supabase.from("requests").update({ feedback }).eq("id", requestId);
      setFeedbackGiven(true);
    } catch (error) {
      console.error("Feedback submission error:", error);
    }
  };

  // Content of the first snippet...

  // Place for the feedback form based on your design choices
  if (!feedbackGiven) {
    return (
      <div className="fixed right-4">
        <div className="w-full max-w-sm rounded-lg border-2 border-slate-100 p-6 hover:border-slate-200">
          <h2 className="text-sm font-semibold">Was this search helpful?</h2>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => giveFeedback(1)} // Assuming 1 for positive feedback
              className="flex items-center gap-2 text-sm font-medium opacity-60 hover:opacity-100 transition-colors"
            >
              <ThumbsUpIcon className="w-4 h-4" />
              Yes
            </button>
            <button
              onClick={() => giveFeedback(0)} // Assuming 0 for negative feedback
              className="flex items-center gap-2 text-sm font-medium opacity-60 hover:opacity-100 transition-colors"
            >
              <ThumbsDownIcon className="w-4 h-4" />
              No
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="fixed right-4">
        <div className="w-full max-w-sm rounded-lg border-2 border-slate-100 justify-center flex p-6">
          {" "}
          <p className="text-md font-semibold">
            Thank you for your feedback!
          </p>{" "}
        </div>
      </div>
    );
  }
}

function ThumbsDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}
