"use client";

import { useEffect, useState } from "react";
import { formatTimeLeft } from "@/lib/utils";

interface CountdownTimerProps {
  expiresAt: string;
  onExpired?: () => void;
}

export default function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    new Date(expiresAt).getTime() - Date.now()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(expiresAt).getTime() - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const isUrgent = timeLeft < 5 * 60 * 1000 && timeLeft > 0;
  const isExpired = timeLeft <= 0;

  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <span className="text-[10px] sm:text-xs uppercase tracking-wider text-primary/50">
        {isExpired ? "Expired" : "Time Left"}
      </span>
      <span
        className={`text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-wider sm:tracking-widest ${
          isExpired
            ? "text-red-400"
            : isUrgent
              ? "text-yellow-400 animate-pulse"
              : "text-brand"
        }`}
      >
        {formatTimeLeft(timeLeft)}
      </span>
    </div>
  );
}
