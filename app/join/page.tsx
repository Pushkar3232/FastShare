"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6dd07d]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <Card glow className="relative w-full max-w-md text-center space-y-6 p-8">
        <div className="space-y-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#6dd07d]/10 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#6dd07d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#fefeff]">Join a Room</h1>
          <p className="text-[#fefeff]/50 text-sm">
            Enter the 6-character room code to join
          </p>
        </div>

        {/* Code input grid */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((char, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-2xl font-bold font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg text-[#6dd07d] focus:outline-none focus:ring-2 focus:ring-[#6dd07d] focus:border-transparent transition-all duration-200 uppercase"
            />
          ))}
        </div>

        <Button
          onClick={handleJoin}
          loading={loading}
          disabled={fullCode.length !== 6}
          size="lg"
          className="w-full"
        >
          Join Room
        </Button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </Card>
    </div>
  );
}
