"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IconLogin, IconInfoCircle } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function JoinRoomPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, value: string) => {
    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!char) return;

    const newCode = [...code];
    newCode[index] = char[0];
    setCode(newCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const fullCode = code.join("");

  const handleJoin = async () => {
    if (fullCode.length !== 6) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/rooms/${fullCode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Room not found");
      router.push(`/room/${fullCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Room not found");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 sm:px-4 pt-6 sm:pt-8">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-65 h-65 rounded-full bg-brand/3 blur-[100px] pointer-events-none" />

      <Card glow className="relative w-full max-w-lg space-y-6 sm:space-y-8 p-6 sm:p-10 md:p-12">
        <div className="space-y-3 sm:space-y-4 text-center">
          <span className="inline-flex rounded-full border border-brand/25 bg-brand/10 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-brand">
            Enter access code
          </span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-linear-to-br from-brand/20 to-brand/5 flex items-center justify-center shadow-lg shadow-brand/10">
            <IconLogin className="w-7 h-7 sm:w-8 sm:h-8 text-brand" stroke={2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Join a Room</h1>
          <p className="text-primary/50 text-sm sm:text-base">
            Enter the 6-character room code to join
          </p>
        </div>

        {/* Code input grid */}
        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {code.map((char, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={char}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              autoFocus={i === 0}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-14 w-12 sm:h-16 sm:w-14 text-center text-xl sm:text-2xl font-bold font-mono bg-white/3 border-2 border-white/8 rounded-xl text-brand focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent hover:bg-white/5 transition-all duration-200 uppercase touch-manipulation"
            />
          ))}
        </div>

        <Button
          onClick={handleJoin}
          loading={loading}
          disabled={fullCode.length !== 6}
          size="lg"
          className="w-full text-base py-4 touch-manipulation"
        >
          Join Room
        </Button>

        <p className="text-center text-xs sm:text-sm text-primary/45">
          Tip: You can paste the full code and we will fill it automatically.
        </p>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-400 text-sm">
            <IconInfoCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </Card>
    </div>
  );
}
