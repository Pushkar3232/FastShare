"use client";

import { useState } from "react";

interface RoomCodeDisplayProps {
  code: string;
}

export default function RoomCodeDisplay({ code }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#fefeff]/50">
        Room Code
      </span>
      <button
        onClick={handleCopy}
        className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition-all duration-200 cursor-pointer touch-manipulation"
      >
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[#6dd07d] font-mono">
          {code}
        </span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
            copied ? "text-[#6dd07d]" : "text-[#fefeff]/40 group-hover:text-[#fefeff]/70"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {copied ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          )}
        </svg>
      </button>
      <span className="text-[10px] sm:text-xs text-[#fefeff]/30">
        {copied ? "Copied!" : "Click to copy"}
      </span>
    </div>
  );
}
